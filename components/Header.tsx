import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";
import { registerOrLogin } from "@/lib/auth";
import { useRouter } from "next/router";

export default function Header() {
  const { user, loadProfile } = useAuth();
  const router = useRouter();

  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Signed out successfully");
        router.push("/");
      })
      .catch((error) => {
        // An error happened.
        console.log("Signed out failed", error);
      });
  };

  return (
    <div className="block items-center gap-12 border-b border-b-zinc-200 py-8 md:flex md:border-b-0">
      <div className="mb-5 text-center tracking-wider text-zinc-500 md:mb-0">
        <Link href={user ? "/remove" : "/"}>Background Removal App</Link>
      </div>
      <div className="block flex-1">
        <ul className="flex justify-center gap-5 text-zinc-500 md:justify-end">
          {!user && (
            <>
              <li>
                <button
                  className="cursor-pointer rounded-sm py-2 px-3 active:bg-zinc-200"
                  onClick={async () => {
                    const result = await registerOrLogin();
                    if (result.user) {
                      loadProfile(result.user);
                    }
                  }}
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  className="cursor-pointer rounded-sm bg-black py-2 px-3 text-white hover:text-zinc-300"
                  onClick={async () => {
                    const result = await registerOrLogin();
                    if (result.user) {
                      loadProfile(result.user);
                    }
                  }}
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
                <Link href="/dashboard">
                  <button className="cursor-pointer rounded-sm bg-black py-2 px-3 text-white hover:text-zinc-300">
                    Dashboard
                  </button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
