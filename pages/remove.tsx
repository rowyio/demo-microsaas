import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import Upload, { CustomFile } from "@/components/Upload";
import Modal from "@/components/Modal";
import { collection, setDoc, doc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";
import usePackage from "@/hooks/usePackage";
import { registerOrLogin } from "@/lib/auth";
import Link from "next/link";
import UsageBar from "@/components/UsageBar";
import Hero from "@/components/Hero";
import Spinner from "@/components/Spinner";
import downloadPhoto, { appendNewToName } from "@/lib/download";
import { useRouter } from "next/router";
import { ref } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { upload } from "@/lib/storage";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function RemoveBackground() {
  const [localFile, setLocalFile] = useState<CustomFile>();
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removedBgLoaded, setRemovedBgLoaded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [photoName, setPhotoName] = useState<string | null>(null);

  const { user } = useAuth();
  const { used, limit, incrementFreeUsed } = usePackage();
  const router = useRouter();

  const handleUpload = async (file: File) => {
    if (used === limit) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    setPhotoName(file.name);
    setLocalFile(
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    const storageRef = ref(storage, `images/${uuidv4()}/${file.name}`);

    const uploadedImageUrl = await upload(storageRef, file);

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: uploadedImageUrl,
      }),
    });

    let prediction = await response.json();

    if (response.status !== 201) {
      console.log("prediction errror", prediction.detail);
      setError(prediction.detail);
      setLoading(false);
      return;
    }

    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();

      if (response.status !== 200) {
        setError(prediction.detail);
        setLoading(false);
        return;
      }

      setPrediction(prediction);
    }

    setLoading(false);

    if (user) {
      // Save prediction in firestore
      const predictionsRef = collection(db, "predictions");
      await setDoc(doc(predictionsRef), {
        input: uploadedImageUrl,
        output: prediction.output,
        profile: user.id,
        "_createdBy.timestamp": new Date(),
      });
    } else {
      incrementFreeUsed();
    }
  };

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => localFile && URL.revokeObjectURL(localFile.preview);
  }, []);

  return (
    <>
      <Head>
        <title>Remove Background</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-12">
        <Hero
          heading="Remove background"
          subHeading="Upload your photo and watch the magic happen."
        />
      </div>

      <div className="my-16 flex gap-12">
        <div className="flex-1">
          <h1 className="mb-5 text-2xl">Upload</h1>
          {localFile && (
            <Image
              alt="uploaded photo"
              src={localFile.preview}
              className="relative mt-2 mb-4 rounded-2xl  sm:mt-0"
              width={475}
              height={475}
            />
          )}

          {!removedBgLoaded && <Upload onUpload={handleUpload} />}

          {removedBgLoaded && (
            <div className="text-center">
              <button
                className="cursor-pointer rounded-sm bg-black py-2 px-6 text-white hover:text-zinc-300"
                onClick={() => {
                  setLocalFile(undefined);
                  setRemovedBgLoaded(false);
                  setError(null);
                  setPrediction(undefined);
                }}
              >
                Upload New Photo
              </button>
            </div>
          )}

          <div className="mt-5">
            <UsageBar />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="mb-5 text-2xl">Result</h1>

          {error && (
            <p className="text-center text-lg text-red-500">
              An error occurred, please try again later.
            </p>
          )}

          {loading && (
            <div className="flex justify-center">
              <Spinner />
            </div>
          )}

          {prediction && (
            <div>
              {prediction.output && (
                <>
                  {!removedBgLoaded && (
                    <div className="justify-centertext-center flex w-full flex-col items-center">
                      <Spinner />
                      <p className="text-lg text-zinc-700">
                        Adding final touches...
                      </p>
                    </div>
                  )}
                  <Image
                    src={prediction.output}
                    alt="output"
                    className="relative mt-2 mb-4 rounded-2xl sm:mt-0"
                    width={475}
                    height={475}
                    onLoadingComplete={() => setRemovedBgLoaded(true)}
                  />
                </>
              )}
            </div>
          )}
          {removedBgLoaded && (
            <div className="text-center">
              <button
                className="cursor-pointer rounded-sm border border-black py-2 px-6  hover:bg-black hover:text-zinc-300"
                onClick={() => {
                  downloadPhoto(
                    prediction.output!,
                    appendNewToName(photoName!)
                  );
                }}
              >
                Download Photo
              </button>
            </div>
          )}
        </div>
        <Modal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          title={
            user ? "Purchase more credits to continue" : "Sign in to continue"
          }
        >
          <div className="py-4">
            <div className="mb-8 text-center">
              <p className="font-semibold">
                Oh oh, you&apos;ve used up all your credits.
              </p>
              {!user && (
                <p>
                  Good news is by signing up you get an additional 100 free
                  credits!
                </p>
              )}
            </div>

            <div className="text-center">
              {!user && (
                <button
                  className="cursor-pointer rounded-sm bg-black py-2 px-8 text-white hover:text-zinc-300"
                  onClick={async () => {
                    const result = await registerOrLogin();
                    if (result.user) {
                      router.reload();
                    }
                  }}
                >
                  Sign in with Google
                </button>
              )}
              {user && (
                <Link href="/dashboard">
                  <button className="cursor-pointer rounded-sm bg-black py-2 px-8 text-white hover:text-zinc-300">
                    Buy credits
                  </button>
                </Link>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
