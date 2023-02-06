import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth, db } from "@/utils/firebase";
import useAuth from "@/hooks/useAuth";
import { registerOrLogin } from "@/lib/auth";

export default function Header() {
  const { user } = useAuth();

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
      <div className=" tracking-wider text-zinc-500">
        <Link href="/">Background Removal App</Link>
      </div>
      <div className="flex-1 ">
        <ul className="flex justify-end gap-5 text-zinc-500">
          {!user && (
            <>
              <li>
                <button
                  className="cursor-pointer rounded-sm py-2 px-3 active:bg-zinc-200"
                  onClick={registerOrLogin}
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  className="cursor-pointer rounded-sm bg-black py-2 px-3 text-white hover:text-zinc-300"
                  onClick={registerOrLogin}
                >
                  Get Started
                </button>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <button
                  className="cursor-pointer rounded-sm py-2 px-3 active:bg-zinc-200"
                  onClick={logout}
                >
                  Sign Out
                </button>
              </li>
              <li>
                <button className="cursor-pointer rounded-sm bg-black py-2 px-3 text-white hover:text-zinc-300">
                  Dashboard
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
