import Packages from "@/components/Packages";
import UsageBar from "@/components/UsageBar";
import usePackage from "@/hooks/usePackage";

export default function Dashboard() {
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
