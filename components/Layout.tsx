import Link from "next/link";
import { ReactNode, useEffect } from "react";
import { Inter } from "@next/font/google";
import { useCookies } from "react-cookie";
import { COOKIE_ID } from "@/utils/const";
import { AnonymousData } from "@/pages/_app";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/utils/firebase";

const inter = Inter({ subsets: ["latin"] });

const provider = new GoogleAuthProvider();

export default function Layout({ children }: { children: ReactNode }) {
  const [cookies, setCookie] = useCookies([COOKIE_ID]);

  useEffect(() => {
    if (!cookies.anonymous_data) {
      setCookie(COOKIE_ID, JSON.stringify({ used: 0 } as AnonymousData));
    }
  }, [cookies.anonymous_data, setCookie]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        console.log("uid", uid);
      } else {
        // User is signed out
        // ...
        console.log("user is logged out");
      }
    });
  }, []);

  const registerOrLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("user signed in", user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className={inter.className}>
      <div className="m-auto flex max-w-5xl items-center gap-12 py-8">
        <div className="rounded-sm  bg-zinc-200 py-1 px-2 text-zinc-800">
          <Link href="/">Background Removal App</Link>
        </div>
        <div className="flex-1 ">
          <ul className="flex justify-end gap-8 text-zinc-500">
            <li>
              <p className="cursor-pointer" onClick={registerOrLogin}>
                Sign In
              </p>
            </li>
            <li>
              <p className="cursor-pointer" onClick={registerOrLogin}>
                Get Started
              </p>
            </li>
          </ul>
        </div>
      </div>
      <main className="m-auto max-w-5xl">{children}</main>
    </div>
  );
}
