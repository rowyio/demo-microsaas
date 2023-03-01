import { userAuthAtom } from "@/atoms";
import Hero from "@/components/Hero";
import downloadPhoto, { appendNewToName } from "@/lib/download";
import { db } from "@/lib/firebase";
import { Prediction, Profile } from "@/lib/types";
import { collection, getDocs, query } from "firebase/firestore";
import { useAtomValue } from "jotai";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { isAuthenticated, user } = useAtomValue(userAuthAtom);
  const [images, setImages] = useState<Prediction[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (user && !isAuthenticated) router.push("/");
  }, [router, isAuthenticated, user]);

  useEffect(() => {
    const loadImages = async (user: Profile) => {
      const imagesQuery = query(collection(db, "profiles", user.id, "images"));
      const imagesSnap = await getDocs(imagesQuery);

      if (!imagesSnap.empty) {
        const images: Prediction[] = imagesSnap.docs.map((doc) => ({
          id: doc.id,
          input: doc.data().input,
          output: doc.data().output,
        }));
        setImages(images);
      }
    };
    if (user) loadImages(user);
  }, [user]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mb-16">
        <div className="mt-12">
          <Hero
            heading="Your account"
            subHeading="Take a look at your images history"
          />
        </div>
      </div>
      <div className="mb-16">
        {images.length > 0 && (
          <ul className="space-y-10">
            {images.map((image, index) => (
              <li
                key={index}
                className="flex gap-5 border-b pb-8 last:border-b-0 md:gap-24"
              >
                <div className="space-y-6 text-center">
                  <Image
                    src={image.input}
                    alt="input"
                    width={250}
                    height={250}
                    className="rounded-lg"
                  />
                  <button
                    className="cursor-pointer underline hover:text-black"
                    onClick={() => {
                      downloadPhoto(image.input, appendNewToName(image.id));
                    }}
                  >
                    Download Photo
                  </button>
                </div>
                <div className="space-y-6 text-center">
                  <Image
                    src={image.output}
                    alt="output"
                    width={250}
                    height={250}
                    className="rounded-lg"
                  />
                  <button
                    className="cursor-pointer underline hover:text-black"
                    onClick={() => {
                      downloadPhoto(image.output, appendNewToName(image.id));
                    }}
                  >
                    Download Photo
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
