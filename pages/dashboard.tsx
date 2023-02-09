import Packages from "@/components/Packages";
import UsageBar from "@/components/UsageBar";
import useAuth from "@/hooks/useAuth";
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

  if (loading) return null;

  if (!user) router.push("/");

  return (
    <div className="mb-16">
      <div className="mt-12 border-b border-zinc-800 pb-6">
        <h1 className="text-5xl">Your account</h1>
        <p className="pt-2 text-lg text-zinc-500">
          View your history, usage, or purchase credits.
        </p>
      </div>
      <div className="my-12">
        <h2 className="mb-3 text-xl tracking-wide">Credit usage</h2>
        <UsageBar />
      </div>
      <div>
        <h2 className="mb-3 text-xl tracking-wide">Credit packages</h2>
        <Packages />
      </div>
    </div>
  );
}
