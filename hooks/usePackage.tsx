import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Package } from "@/lib/packages";

export type ProfilePackage = Package & { used: number };

export default function usePackage() {
  const { user, loading } = useAuth();

  const [used, setUsed] = useState<number>(0);
  const [limit, setLimit] = useState<number>(0);

  const hasCredit = () => {
    return used < limit;
  };

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "profiles", user.id), (doc) => {
        const profile = doc.data();
        if (profile) {
          const profilePackage = profile.package as ProfilePackage;
          setUsed(profilePackage.used);
          setLimit(profilePackage.limit);
        }
      });

      return () => {
        unsub();
      };
    }
  }, [user]);

  return {
    limit,
    used,
    hasCredit,
  };
}
