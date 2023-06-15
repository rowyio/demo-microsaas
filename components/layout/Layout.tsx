import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={`flex min-h-screen flex-col text-zinc-700 `}>
      <Header />
      <div className="flex w-full flex-1 flex-col px-4 md:px-0">{children}</div>
      <Footer />
    </div>
  );
}
