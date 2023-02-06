import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { useCookies } from "react-cookie";
import { COOKIE_ID, MAX_FREE_CREDITS } from "@/utils/const";
import { AnonymousData } from "@/pages/_app";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/firebase";

export default function usePackage() {
  const { user, loading } = useAuth();
  const [cookies, setCookie] = useCookies([COOKIE_ID]);

  const [used, setUsed] = useState<number>(0);
  const [limit, setLimit] = useState<number>(0);

  useEffect(() => {
    if (!loading && !user) {
      const anonymousData = cookies.anonymous_data as AnonymousData;
      setLimit(MAX_FREE_CREDITS);
      setUsed(anonymousData.used);
    }
  }, [loading, cookies.anonymous_data, user]);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "profiles", user.id), (doc) => {
        console.log("Current data: ", doc.data());
        const profile = doc.data();
        if (profile) {
          setUsed(profile.package.used);
          setLimit(profile.package.limit);
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
  };
}
