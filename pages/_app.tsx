import Layout from "@/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { Roboto_Slab } from "@next/font/google";

const robotoSlab = Roboto_Slab({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <style jsx global>{`
        body {
          font-family: ${robotoSlab.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      <Toaster />
      <div id="modal"></div>
    </Layout>
  );
}
