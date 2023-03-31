import { userAuthAtom } from "@/atoms";
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
      <div className="mt-12 mb-7">
        <Hero
          heading="Get rid of those annoying backgrounds."
          subHeading={
            isAuthenticated
              ? "Go ahead and start removing those backgrounds."
              : "Remove backgrounds from up to 10 images, no charge."
          }
          link={{ title: "Remove Background", to: "/remove" }}
          alignment="center"
        />
      </div>

      <div className="flex w-full flex-col items-center justify-between text-center sm:mt-10">
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
      <Container className="my-20 text-center md:my-28">
        <h2 className=" font-display text-4xl font-bold md:text-5xl">
          <span className="bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800  bg-clip-text  text-transparent">
            Say goodbye to distracting backgrounds.
          </span>
          <br />
          Try it out today.
        </h2>
        <Link href="remove">
          <button className="mt-10 cursor-pointer rounded-md bg-black py-3 px-8 text-white hover:text-zinc-300">
            Lets get started
          </button>
        </Link>
      </Container>
    </>
  );
}
