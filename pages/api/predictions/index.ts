import type { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "@/lib/firebase-admin";
import { auth } from "@/lib/firebase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body as { image: string };
  let userId: string | undefined;

  if (req.headers.token) {
    try {
      const { uid } = await auth.verifyIdToken(req.headers.token as string);
      userId = uid;
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version:
        "dff637aacf67b4f8ec0860f8b9af7d0911cb54f21b6d0b0ca891d06f277127de",

      input: { image: data.image },
      ...(userId && {
        webhook:
          "https://rowy-hooks-7tdcrfawba-uc.a.run.app/wh/profiles/fEL3bYffUHlPwkoTkJ1g",
      }),
    }),
  });

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const replicateResponse = await response.json();

  if (userId) {
    const profileSnap = await firestore
      .collection("profiles")
      .where("userId", "==", userId)
      .get();

    if (!profileSnap.empty) {
      const profile = profileSnap.docs[0];

      profile.ref.update({ replicateResponse });

      const imagesRef = firestore
        .collection("profiles")
        .doc(profile.id)
        .collection("images");

      const document = await imagesRef.add({
        replicateResponse,
        input: data.image,
      });

      return res.status(201).json({ predictionId: document.id });
    }
  }

  res.statusCode = 201;
  res.end(JSON.stringify(replicateResponse));
}
