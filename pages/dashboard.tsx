import Hero from "@/components/Hero";
import Packages from "@/components/Packages";
import UsageBar from "@/components/UsageBar";
import useAuth from "@/hooks/useAuth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const { loading, user } = useAuth();
  const router = useRouter();

  const { payment_status: paymentStatus } = router.query;

  useEffect(() => {
    if (paymentStatus && paymentStatus === "success") {
      toast.success("Purchase successful");
    }
  }, [paymentStatus]);

  if (!loading && !user) router.push("/");

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
        <div className="my-16">
          <h2 className="mb-3 text-xl tracking-wide">Credit usage</h2>
          <UsageBar />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="mb-3 text-xl tracking-wide">Credit packages</h2>
            <div className="rounded-md border border-zinc-100 bg-zinc-50 px-2 text-sm">
              Note: 1 credit = 1 photo
            </div>
          </div>
          <Packages />
        </div>
      </div>
    </>
  );
}
