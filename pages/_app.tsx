import Layout from "@/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "react-hot-toast";

export type CookieData = {
  used: 0;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <Layout>
        <Component {...pageProps} />
        <Toaster />
      </Layout>
      <div id="modal"></div>
    </CookiesProvider>
  );
}
