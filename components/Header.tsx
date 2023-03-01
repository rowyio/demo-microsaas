import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { registerOrLogin } from "@/lib/auth";
import { useAtomValue } from "jotai";
import { userAuthAtom } from "@/atoms";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Header() {
  const { user, isAuthenticated } = useAtomValue(userAuthAtom);
  const router = useRouter();

  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Signed out successfully");
        // location.replace("/");
        router.push("/");
      })
      .catch((error) => {
        // An error happened.
        console.log("Signed out failed", error);
      });
  };

  return (
    <div
      className={`block items-center gap-12 border-b border-b-zinc-200 py-8 md:flex md:border-b-0`}
    >
      <div className="mb-5 text-center text-lg md:mb-0">
        <Link href="/">
          <span className=" text-zinc-500">background</span> Removal App
        </Link>
      </div>
      <div className="block flex-1">
        <ul className="flex items-center justify-center gap-5 text-zinc-500 md:justify-end">
          {!isAuthenticated && (
            <>
              <li>
                <button
                  className="cursor-pointer rounded-md border border-zinc-200 py-2 px-4 active:bg-zinc-200"
                  onClick={registerOrLogin}
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  className="cursor-pointer rounded-md bg-black py-2 px-4 text-white hover:text-zinc-300"
                  onClick={registerOrLogin}
                >
                  Get Started
                </button>
              </li>
            </>
          )}
          {isAuthenticated && (
            <>
              <li>
                <button
                  className="cursor-pointer rounded-md border border-zinc-200 py-2 px-4 active:bg-zinc-200"
                  onClick={logout}
                >
                  Sign Out
                </button>
              </li>
              <li>
                <Link href="/dashboard">
                  <button className="cursor-pointer rounded-md bg-black py-2 px-4 text-white hover:text-zinc-300">
                    Dashboard
                  </button>
                </Link>
              </li>
            </>
          )}
          {user?.photoUrl && (
            <li>
              <Image
                src={user.photoUrl}
                alt="user photo"
                width={45}
                height={45}
                className="rounded-full"
              />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
