import { creditsAtom, userAuthAtom } from "@/atoms/atoms";
import Hero from "@/components/Hero";
import Packages from "@/components/Packages";
import UsageBar from "@/components/UsageBar";
import Container from "@/components/layout/Container";
import { useAtomValue } from "jotai";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import Confetti from "react-dom-confetti";

export default function BuyCredits() {
  const { isAuthenticated, user } = useAtomValue(userAuthAtom);
  const { used, limit } = useAtomValue(creditsAtom);
  const router = useRouter();

  const { payment_status: paymentStatus } = router.query;

  useEffect(() => {
    if (user && !isAuthenticated) router.push("/");
  }, [router, isAuthenticated, user]);

  useEffect(() => {
    if (paymentStatus && paymentStatus === "success") {
      toast.success("Purchase successful");
    }
    if (paymentStatus && paymentStatus === "cancel") {
      toast.error("Purchase cancelled");
    }
  }, [paymentStatus]);

  return (
    <>
      <Head>
        <title>Packages</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mb-20">
        <div className="mt-12">
          <Hero
            heading="Purchase credits"
            subHeading="Buy packages, and increase your account credits."
          />
        </div>
        <Container>
          <div className="my-16 ">
            <div className="relative mx-auto flex max-w-fit items-center space-x-2">
              <Confetti
                active={paymentStatus ? paymentStatus === "success" : false}
                config={{ elementCount: 200, spread: 90 }}
              />
            </div>

            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-wide">
                  Your usage
                </h2>
              </div>
              {used != undefined && limit != undefined && (
                <div>
                  <p className="font-display text-xl font-bold">
                    Used: {used}/{limit}
                  </p>
                </div>
              )}
            </div>
            <UsageBar showRatio={false} />
          </div>
          <div>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-3xl font-bold tracking-wide">
                Simple,{" "}
                <span className="bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800 bg-clip-text text-transparent">
                  credit-based
                </span>{" "}
                packages
              </h2>
              <div>
                <p className="text-base md:text-lg">Note: 1 credit = 1 photo</p>
              </div>
            </div>
            <Packages />
          </div>
        </Container>
      </div>
    </>
  );
}
