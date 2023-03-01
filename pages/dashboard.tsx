import { creditsAtom, userAuthAtom } from "@/atoms";
import Hero from "@/components/Hero";
import Packages from "@/components/Packages";
import UsageBar from "@/components/UsageBar";
import { useAtomValue } from "jotai";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const { isAuthenticated, user } = useAtomValue(userAuthAtom);
  const { used, limit } = useAtomValue(creditsAtom);
  const router = useRouter();

  const { payment_status: paymentStatus } = router.query;

  useEffect(() => {
    if (paymentStatus && paymentStatus === "success") {
      toast.success("Purchase successful");
    }
  }, [paymentStatus]);

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
            subHeading="View your usage, or buy more credits."
          />
        </div>
        <div className="my-16 ">
          <div className="mb-3 flex items-baseline justify-between">
            <div>
              <h2 className="text-2xl tracking-wide">Your usage</h2>
            </div>
            {used != undefined && limit != undefined && (
              <div>
                <p className="text-lg">
                  Used: {used}/{limit}
                </p>
              </div>
            )}
          </div>
          <UsageBar showRatio={false} />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="mb-3 text-2xl tracking-wide">Packages</h2>
            <div>Note: 1 credit = 1 photo</div>
          </div>
          <Packages />
        </div>
      </div>
    </>
  );
}
