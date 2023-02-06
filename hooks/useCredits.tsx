import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { useCookies } from "react-cookie";
import { COOKIE_ID, MAX_FREE_CREDITS } from "@/utils/const";
import { AnonymousData } from "@/pages/_app";

export default function useCredits() {
  const { user, loading } = useAuth();
  const [cookies, setCookie] = useCookies([COOKIE_ID]);

  const [used, setUsed] = useState<number>(0);
  const [limit, setLimit] = useState<number>(0);

  useEffect(() => {
    if (!loading && user) {
      setUsed(user.package.used);
      setLimit(user.package.limit);
    }
    if (!loading && !user) {
      const anonymousData = cookies.anonymous_data as AnonymousData;
      setLimit(MAX_FREE_CREDITS);
      setUsed(anonymousData.used);
    }
  }, [user, cookies.anonymous_data, loading]);

  return {
    limit,
    used,
  };
}
