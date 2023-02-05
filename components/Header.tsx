import Link from "next/link";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";
import useAuth from "@/hooks/useAuth";

const provider = new GoogleAuthProvider();

export default function Header() {
  const { user } = useAuth();

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

  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
        console.log("Signed out failed", error);
      });
  };

  return (
    <div className="m-auto flex max-w-5xl items-center gap-12 py-8">
      <div className="rounded-sm  bg-zinc-200 py-1 px-2 text-zinc-800">
        <Link href="/">Background Removal App</Link>
      </div>
      <div className="flex-1 ">
        <ul className="flex justify-end gap-8 text-zinc-500">
          {!user && (
            <>
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
            </>
          )}
          {user && (
            <>
              <li>
                <p className="cursor-pointer" onClick={logout}>
                  Sign Out
                </p>
              </li>
              <li>
                <p className="cursor-pointer">Settings</p>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
