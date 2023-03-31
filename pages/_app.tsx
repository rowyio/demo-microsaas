import Layout from "@/components/layout/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { Inter } from "@next/font/google";
import localFont from "next/font/local";
import cx from "classnames";
import AuthIsLoaded from "@/components/AuthIsLoaded";

const satoshi = localFont({
  src: "../styles/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
  style: "normal",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthIsLoaded>
      <main className={cx(satoshi.variable, inter.variable)}>
        <Layout>
          <Component {...pageProps} />
          <Toaster />
          <div id="modal"></div>
        </Layout>
      </main>
    </AuthIsLoaded>
  );
}
