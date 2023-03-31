import { userAuthAtom } from "@/atoms/atoms";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function Dropdown() {
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

  const onLinkClick = () => {
    setIsOpen(false);
    toggleDropdown();
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
    <div className="relative z-30" ref={dropdownRef}>
      <button
        className="flex items-center text-white focus:outline-none"
        onClick={toggleDropdown}
      >
        {user && (
          <Image
            src={user.photoUrl ? user.photoUrl : "avatar.png"}
            alt="user photo"
            width={43}
            height={43}
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
            onClick={onLinkClick}
          >
            Dashboard
          </Link>
          <Link
            href="packages"
            className="block px-4 py-2 text-gray-800 hover:bg-black hover:text-white"
            onClick={onLinkClick}
          >
            Packages
          </Link>
          <a
            href="#"
            className="block px-4 py-2 text-gray-800 hover:bg-black hover:text-white"
            onClick={() => {
              logout();
              onLinkClick();
            }}
          >
            Sign out
          </a>
        </div>
      )}
    </div>
  );
}
