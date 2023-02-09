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
    <div>
      <div className="mb-12 mt-8">
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
