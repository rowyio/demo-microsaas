import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { getPackage } from "@/lib/packages";
import { useCookies } from "react-cookie";
import { COOKIE_ID, MAX_FREE_CREDITS } from "@/utils/const";
import { AnonymousData } from "@/pages/_app";

export default function useCredits() {
  const [cookies, setCookie] = useCookies([COOKIE_ID]);

  const [usedCredits, setUsedCredits] = useState<number>(0);
  const [limit, setLimit] = useState<number>();
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
    } else {
      const anonymousData = cookies.anonymous_data as AnonymousData;
      setLimit(MAX_FREE_CREDITS);
      setUsedCredits(anonymousData.used);
    }
  }, [user]);

  return {
    limit,
    usedCredits,
  };
}
