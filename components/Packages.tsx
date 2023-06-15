import { userAuthAtom } from "@/atoms/atoms";
import { db } from "@/lib/firebase";
import { getPackages } from "@/lib/packages";
import { Package } from "@/lib/types";
import { collection, orderBy, query } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { getSchema } from "@/lib/get-schema";
import { CREATE_STRIPE_CHECKOUT_ENDPOINT } from "@/lib/const";
import Spinner from "./Spinner";

export default function Packages() {
  const [loading, setLoading] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const { user } = useAtomValue(userAuthAtom);
  const [packages, setPackages] = useState<Package[]>();

  const purchase = async (creditPackage: Package) => {
    setLoading(true);
    try {
      const response = await fetch(CREATE_STRIPE_CHECKOUT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${user?.token}`,
        },
        body: JSON.stringify({ creditPackage, profileId: user?.id }),
      });

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
    const loadPackages = async () => {
      setLoadingPackages(true);
      const { tableEnv } = await getSchema();

      const packagesQuery = query(
        collection(db, tableEnv.collectionIds["microSaaSPackages"]),
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
      setLoadingPackages(false);
    };
    loadPackages();
  }, []);

  if (loadingPackages)
    return (
      <div className="mt-10 flex justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="gap-8 space-y-10 sm:block md:flex md:space-y-0">
      {packages &&
        packages.map((pack) => (
          <div
            key={pack.id}
            className="flex-1 rounded-md border border-gray-200 "
          >
            <div className="px-4 py-9">
              <div className="flex justify-center gap-2">
                <h1 className="mb-1 text-2xl font-bold">${pack.price}</h1>
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
