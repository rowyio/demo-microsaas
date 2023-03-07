import { NextApiRequest, NextApiResponse } from "next";
import { purgeAnonymousData } from "@/lib/purge";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Http method not allowed" });

  try {
    const { authorization } = req.headers;

    if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {
      purgeAnonymousData();
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
