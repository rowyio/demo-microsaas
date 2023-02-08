import usePackage from "@/hooks/usePackage";

export default function UsageBar() {
  const { used, limit } = usePackage();

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-full rounded-full bg-zinc-300">
        <div
          className="h-2 rounded-full bg-black"
          style={{ width: `${(used / limit) * 100}%` }}
        ></div>
      </div>
      <div>
        <p>
          {used}/{limit}
        </p>
      </div>
    </div>
  );
}
