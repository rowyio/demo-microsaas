import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { registerOrLogin } from "@/lib/auth";
import { useAtomValue } from "jotai";
import { userAuthAtom } from "@/atoms";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAtomValue(userAuthAtom);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    event.target;
    if (
      dropdownRef.current &&
      event.target instanceof HTMLElement &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

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

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

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
        <ul className="flex items-center justify-center gap-5 text-zinc-600 md:justify-end">
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
              <li className="hidden md:block">
                <Link href="/">
                  <button className="cursor-pointer py-2 px-2 hover:text-black active:bg-zinc-200">
                    Home
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/remove">
                  <button className="cursor-pointer py-2 px-2 hover:text-black active:bg-zinc-200">
                    Remove Background
                  </button>
                </Link>
              </li>
            </>
          )}
          {isAuthenticated && (
            <li>
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center text-white focus:outline-none"
                  onClick={toggleDropdown}
                >
                  {user?.photoUrl && (
                    <Image
                      src={user.photoUrl}
                      alt="user photo"
                      width={45}
                      height={45}
                      className="rounded-full"
                    />
                  )}
                  <svg
                    className="ml-1 h-4 w-4 fill-black"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 12l-5.79-5.79a1 1 0 0 1 1.41-1.41L10 9.17l4.38-4.38a1 1 0 0 1 1.41 1.41L10 12z" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-36 rounded-lg bg-white py-2 shadow-xl md:left-0">
                    <Link
                      href="dashboard"
                      className="block px-4 py-2 text-gray-800 hover:bg-black hover:text-white"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="packages"
                      className="block px-4 py-2 text-gray-800 hover:bg-black hover:text-white"
                    >
                      Packages
                    </Link>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-800 hover:bg-black hover:text-white"
                      onClick={logout}
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
