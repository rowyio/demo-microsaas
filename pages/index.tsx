import { userAuthAtom } from "@/atoms/atoms";
import Hero from "@/components/Hero";
import Container from "@/components/layout/Container";
import { useAtomValue } from "jotai";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated } = useAtomValue(userAuthAtom);
  return (
    <>
      <Head>
        <title>Background Removal App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-12 mb-4">
        <div className="mt-12 flex justify-center">
          <Link href="https://www.rowy.io?ref=microsaas" target="_blank">
            <div className="flex gap-2 rounded-md  border bg-zinc-100 px-5 py-1">
              <div>
                <p className="text-base">Powered by</p>
              </div>
              <div style={{ width: 60, height: "auto", position: "relative" }}>
                <Image
                  fill
                  src="/rowy.png"
                  alt="rowy logo"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          </Link>
        </div>
        <Hero
          className="pt-1"
          showSeparator={false}
          heading="Get rid of those annoying backgrounds."
          subHeading={
            isAuthenticated
              ? "Take control of your photos - give it a try today!"
              : "Remove backgrounds from up to 10 images, on the house."
          }
          link={{ title: "Remove Background", to: "/remove" }}
          alignment="center"
        />
      </div>

      <div className="mb-11 flex w-full flex-col items-center justify-between text-center sm:mb-28 sm:mt-10">
        <div className="mt-4flex flex-col space-y-10 space-x-5">
          <div className="flex flex-col sm:flex-row sm:space-x-10">
            <div>
              <h2 className="mb-4 font-display text-2xl font-bold">
                Original photo
              </h2>
              <Image
                alt="Original photo of me"
                src="/input.jpeg"
                className="h-[520px] w-96 rounded-2xl"
                width={400}
                height={400}
              />
            </div>
            <div className="mt-8 sm:mt-0">
              <h2 className="mb-4 font-display text-2xl font-bold">
                Background removed
              </h2>
              <Image
                alt="Restored photo of me"
                width={400}
                height={400}
                src="/output.jpeg"
                className="mt-2  h-[520px] w-96 rounded-2xl sm:mt-0"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
