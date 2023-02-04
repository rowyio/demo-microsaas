import Layout from "@/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CookiesProvider } from "react-cookie";

export type AnonymousData = {
  used: 0;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CookiesProvider>
  );
}
