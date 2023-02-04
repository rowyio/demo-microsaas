import Link from "next/link";
import { ReactNode } from "react";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={inter.className}>
      <div className="max-w-5xl m-auto py-8 flex gap-12 items-center">
        <div className="text-zinc-500">
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
