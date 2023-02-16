import { ReactNode, useEffect } from "react";
import { Poppins } from "@next/font/google";
import { useCookies } from "react-cookie";
import { COOKIE_ID } from "@/lib/const";
import { CookieData } from "@/pages/_app";
import Header from "./Header";
import Footer from "./Footer";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export default function Layout({ children }: { children: ReactNode }) {
  const [cookies, setCookie] = useCookies([COOKIE_ID]);

  useEffect(() => {
    if (!cookies.free_credits) {
      setCookie(COOKIE_ID, JSON.stringify({ used: 0 } as CookieData));
    }
  }, [cookies.free_credits, setCookie]);

  return (
    <div
      className={`${poppins.className} m-auto flex min-h-screen max-w-5xl flex-col px-4 text-zinc-700 md:px-0`}
    >
      <Header />
      <main className="flex w-full flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
