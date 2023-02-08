import Packages from "@/components/Packages";
import UsageBar from "@/components/UsageBar";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { loading, user } = useAuth();
  const router = useRouter();

  if (loading) return null;

  if (!user) router.push("/");

  return (
    <div>
      <div className="mb-8 mt-4">
        <h2 className="mb-2 text-xl">Credit used</h2>
        <UsageBar />
      </div>
      <div>
        <h2 className="mb-5 text-xl">Credit Packages</h2>
        <Packages />
      </div>
    </div>
  );
}
