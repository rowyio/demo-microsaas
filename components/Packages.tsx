import usePackage from "@/hooks/usePackage";
import { db } from "@/lib/firebase";
import { getPackages, Package } from "@/lib/packages";
import { collection, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Packages() {
  const { packageId, hasCredit } = usePackage();
  const [packages, setPackages] = useState<Package[]>();

  const loadPackages = async () => {
    const packagesQuery = query(
      collection(db, "credit_packages"),
      orderBy("price", "asc")
    );
    const packagesSnapshot = await getPackages(packagesQuery);
    const allPackages = packagesSnapshot.map((item) => ({
      ...item.data(),
      id: item.id,
    })) as Package[];
    setPackages(allPackages);
  };

  const purchase = async (creditPackage: Package) => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creditPackage }),
      });

      if (response.ok) {
        const data = (await response.json()) as { url: string };
        const win: Window = window;
        win.location = data.url;
      }
    } catch (error) {
      console.log("checkout error", error);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  return (
    <div className="flex gap-8">
      {packages &&
        packages.map((pack) => (
          <div
            key={pack.id}
            className="flex-1 rounded-sm border border-zinc-300"
          >
            {packageId === pack.id && (
              <div className="relative">
                <div className="absolute right-0 -top-3 rounded-md bg-black px-2 text-center text-sm text-white">
                  Active
                </div>
              </div>
            )}
            <div className="p-4">
              <div className="flex gap-2">
                <h1 className="mb-1 text-2xl">${pack.price}</h1>
                {pack.price === 0 && (
                  <div className="text-sm">
                    <span className="rounded-md bg-zinc-200 px-1">Free</span>
                  </div>
                )}
              </div>
              <p className="mb-4 text-lg">{pack.limit} Credits</p>
              <button
                className="hover:text-zinc-white w-full cursor-pointer rounded-sm border border-black py-2 px-3 text-sm hover:bg-black hover:text-white disabled:cursor-not-allowed  disabled:border-zinc-300 disabled:text-zinc-300 disabled:hover:bg-white disabled:hover:text-zinc-300"
                disabled={hasCredit()}
                onClick={() => purchase(pack)}
              >
                Purchase
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
