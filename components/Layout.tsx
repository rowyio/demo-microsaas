import Link from "next/link";
import { ReactNode, useEffect } from "react";
import { Inter } from "@next/font/google";
import { CookiesProvider, useCookies } from "react-cookie";
import { COOKIE_ID } from "@/utils/const";
import { AnonymousData } from "@/pages/_app";

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
      <div className="max-w-5xl m-auto py-8 flex gap-12 items-center">
        <div className="text-zinc-800  bg-zinc-200 rounded-sm py-1 px-2">
          <Link href="/">Background Removal App</Link>
        </div>
        <div className="flex-1 ">
          <ul className="flex gap-8 justify-end text-zinc-500">
            <li>
              <Link href="">Sign In</Link>
            </li>
            <li>
              <Link href="">Get Started</Link>
            </li>
          </ul>
        </div>
      </div>
      <main className="max-w-5xl m-auto">{children}</main>
    </div>
  );
}
