import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import useAuth from "./useAuth";

export default function useCredits() {
  const [usedCredits, setUsedCredits] = useState();
  const [limit, setLimit] = useState();
  const { user } = useAuth();

  useEffect(() => {
    async function loadPackage() {
      const packagesRef = doc(db, "credit_packages", user?.packageId as string);
      const packagesSnap = await getDoc(packagesRef);

      if (packagesSnap.exists()) {
        const data = packagesSnap.data();
        console.log("packagesSnap", data);
        setLimit(data.limit);
      }
    }

    if (user) {
      loadPackage();
    }
  }, [user]);

  return {
    limit,
    usedCredits,
  };
}
