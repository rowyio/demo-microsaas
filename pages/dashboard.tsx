import useAuth from "@/hooks/useAuth";
import usePackage from "@/hooks/usePackage";
import { creditPacks } from "@/lib/packages";

export default function Dashboard() {
  return (
    <div>
      <div>
        <h2 className="mb-2 text-xl">Credit Packs</h2>
        <div className="flex gap-8">
          {creditPacks.map((pack, index) => (
            <div
              key={index}
              className="flex-1 rounded-sm border border-zinc-300 p-4"
            >
              <div className="flex gap-2">
                <h1 className="mb-1 text-2xl">${pack.price}</h1>
                <div className="text-sm">Free</div>
              </div>
              <p className="mb-4 text-lg">{pack.credits} Credits</p>
              <button className="hover:text-zinc-white w-full cursor-pointer rounded-sm border border-black py-2 px-3 text-sm hover:bg-black hover:text-white">
                Purchase
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
