import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { getPackage } from "@/lib/packages";

export default function useCredits() {
  const [usedCredits, setUsedCredits] = useState();
  const [limit, setLimit] = useState();
  const { user } = useAuth();

  useEffect(() => {
    async function loadPackage() {
      const data = await getPackage(user?.packageId as string);

      if (data) {
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
