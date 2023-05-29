import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import Upload, { CustomFile } from "@/components/Upload";
import Modal from "@/components/Modal";
import { db, storage } from "@/lib/firebase";
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
import { doc, onSnapshot } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { creditsAtom, userAuthAtom } from "@/atoms/atoms";
import Container from "@/components/layout/Container";
import { getSchema } from "@/lib/get-schema";
import { START_PREDICTION_ENDPOINT } from "@/lib/const";

export default function RemoveBackground() {
  const [localFile, setLocalFile] = useState<CustomFile>();
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removedBgLoaded, setRemovedBgLoaded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string>();
  const [output, setOutput] = useState<string>();

  const { user, isAuthenticated } = useAtomValue(userAuthAtom);
  const { used, limit } = useAtomValue(creditsAtom);
  const router = useRouter();

  const handleUpload = async (file: File) => {
    if (used >= limit) {
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

    const { tableEnv } = await getSchema();

    const response = await fetch(START_PREDICTION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `${user?.token}`,
      },
      body: JSON.stringify({
        image: uploadedImageUrl,
        profileId: user?.id,
      }),
    });

    const prediction = await response.json();

    if (response.status !== 200) {
      console.log("prediction error", prediction.detail);
      setError(prediction.detail);
      setLoading(false);
      return;
    }

    if (prediction.predictionId) {
      setPredictionId(prediction.predictionId as string);
      return;
    }
  };

  // Listen for when the prediction is completed
  useEffect(() => {
    async function onPredictionComplete() {
      const { tableEnv } = await getSchema();
      if (predictionId) {
        const unsub = onSnapshot(
          doc(
            db,
            `${tableEnv.collectionIds["microSaaSProfiles"]}/${user?.id}/images/${predictionId}`
          ),
          (doc) => {
            const prediction = doc.data();
            if (prediction && prediction.output) {
              setOutput(prediction.output);
              setLoading(false);
            }
          }
        );
        return () => {
          unsub();
        };
      }
    }
    onPredictionComplete();
  }, [predictionId]);

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

      <Container>
        <div className="my-16 block gap-12 space-y-8 md:flex md:space-y-0">
          <div className="flex-1">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black font-bold text-white">
                1
              </div>
              <h1 className="font-display text-2xl font-bold">Upload</h1>
            </div>

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
                  className="cursor-pointer rounded-md bg-black py-2 px-6 text-white hover:text-zinc-300"
                  onClick={() => {
                    setLocalFile(undefined);
                    setRemovedBgLoaded(false);
                    setError(null);
                    setPrediction(undefined);
                    setPredictionId(undefined);
                    setOutput(undefined);
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
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black font-bold text-white">
                2
              </div>
              <h1 className="font-display text-2xl font-bold">Result</h1>
            </div>

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

            {output && (
              <div>
                {!removedBgLoaded && (
                  <div className="justify-centertext-center flex w-full flex-col items-center">
                    <Spinner />
                    <p className="text-lg text-zinc-700">
                      Adding final touches...
                    </p>
                  </div>
                )}
                <Image
                  src={output}
                  alt="output"
                  className="relative mt-2 mb-4 rounded-2xl sm:mt-0"
                  width={475}
                  height={475}
                  onLoadingComplete={() => setRemovedBgLoaded(true)}
                />
              </div>
            )}

            {removedBgLoaded && output && (
              <div className="text-center">
                <button
                  className="cursor-pointer rounded-md border border-black py-2 px-6  hover:bg-black hover:text-zinc-300"
                  onClick={() => {
                    downloadPhoto(output, appendNewToName(photoName!));
                  }}
                >
                  Download Photo
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>

      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title={user ? "Credit limit reached" : "Sign in to continue"}
      >
        <div className="py-4">
          <div className="mb-8 text-center">
            <p>Oh oh, you&apos;ve used up all your credits.</p>
            {!user && (
              <p>
                Good news is by signing up you get an additional 100 free
                credits!
              </p>
            )}
            {user && (
              <p>You will need to purchase additional credits to continue.</p>
            )}
          </div>

          <div className="text-center">
            {!isAuthenticated && (
              <button
                className="cursor-pointer rounded-md bg-black py-2 px-8 text-white hover:text-zinc-300"
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
            {isAuthenticated && (
              <Link href="/dashboard">
                <button className="cursor-pointer rounded-md bg-black py-2 px-8 text-white hover:text-zinc-300">
                  Buy credits
                </button>
              </Link>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
