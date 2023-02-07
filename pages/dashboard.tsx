import Packages from "@/components/Packages";
import useAuth from "@/hooks/useAuth";
import usePackage from "@/hooks/usePackage";

export default function Dashboard() {
  const { used, limit } = usePackage();
  return (
    <div>
      <div className="mb-8 mt-4">
        <h2 className="mb-2 text-xl">Credit used</h2>
        <div className="flex items-center gap-4">
          <div className="h-2.5 w-full rounded-full bg-zinc-300">
            <div
              className="h-2.5 rounded-full bg-black"
              style={{ width: "45%" }}
            ></div>
          </div>
          <div>
            <p>
              {used}/{limit}
            </p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="mb-5 text-xl">Credit Packs</h2>
        <Packages />
      </div>
    </div>
  );
}
