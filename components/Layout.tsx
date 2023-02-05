import { ReactNode, useEffect } from "react";
import { Inter } from "@next/font/google";
import { useCookies } from "react-cookie";
import { COOKIE_ID } from "@/utils/const";
import { AnonymousData } from "@/pages/_app";
import Header from "./Header";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: ReactNode }) {
  const [cookies, setCookie] = useCookies([COOKIE_ID]);

  useEffect(() => {
    if (!cookies.anonymous_data) {
      setCookie(COOKIE_ID, JSON.stringify({ used: 0 } as AnonymousData));
    }
  }, [cookies.anonymous_data, setCookie]);

  return (
    <div className={inter.className}>
      <Header />
      <main className="m-auto max-w-5xl">{children}</main>
    </div>
  );
}
