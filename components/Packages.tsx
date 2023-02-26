import useAuth from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { getPackages, Package } from "@/lib/packages";
import { collection, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Packages() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
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
    // Filter out free package
    const filteredPackages = allPackages.filter((item) => item.price !== 0);
    setPackages(filteredPackages);
  };

  const purchase = async (creditPackage: Package) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://rowy-hooks-7tdcrfawba-uc.a.run.app/wh/profiles/jGcQyirsJjdy7CbbTBL2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: `${user?.token}`,
          },
          body: JSON.stringify({ creditPackage, profileId: user?.id }),
        }
      );

      if (response.ok) {
        const data = (await response.json()) as { url: string };
        const win: Window = window;
        win.location = data.url;
      }
    } catch (error) {
      console.log("checkout error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  return (
    <div className="gap-8 space-y-10 sm:block md:flex md:space-y-0">
      {packages &&
        packages.map((pack) => (
          <div
            key={pack.id}
            className="flex-1 rounded-xl bg-white shadow-xl shadow-slate-900/10"
          >
            {/* {hasCredit() && packageId === pack.id && (
              <div className="relative">
                <div className="absolute right-0 -top-3 rounded-md bg-black px-2 text-center text-sm text-white">
                  Active
                </div>
              </div>
            )} */}
            <div className="px-4 py-8">
              <div className="flex justify-center gap-2">
                <h1 className="mb-1 text-2xl">${pack.price}</h1>
                {pack.price === 0 && (
                  <div className="text-sm">
                    <span className="rounded-md bg-zinc-200 px-1">Free</span>
                  </div>
                )}
              </div>
              <p className="mb-4 text-center text-lg">{pack.limit} Credits</p>
              <button
                className="hover:text-zinc-white w-full cursor-pointer rounded-md bg-black py-2  px-3 text-sm text-white hover:bg-black hover:text-zinc-300 disabled:cursor-not-allowed  disabled:border-zinc-300 disabled:text-zinc-300 disabled:hover:bg-white disabled:hover:text-zinc-300"
                disabled={loading}
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
