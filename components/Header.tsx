import Link from "next/link";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "@/utils/firebase";
import {
  collection,
  setDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import useAuth from "@/hooks/useAuth";

const provider = new GoogleAuthProvider();

export default function Header() {
  const { user } = useAuth();

  const registerOrLogin = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        const userId = user.uid;

        const q = query(collection(db, "profiles"), where("id", "==", userId));
        const querySnapshot = await getDocs(q);

        // Create profile on first sign in
        if (querySnapshot.empty) {
          const packagesQuery = query(
            collection(db, "credit_packages"),
            where("price", "==", 0)
          );
          const packagesSnapshot = await getDocs(packagesQuery);
          const packageId = packagesSnapshot.docs[0].id;

          // Assign free package for new users
          const profilesRef = collection(db, "profiles");
          await setDoc(doc(profilesRef), {
            profileId: userId,
            package: packageId,
            "_createdBy.timestamp": new Date(),
          });
        }
      })
      .catch((error) => {
        // Handle Errors here.
        console.log("Failed to sign in", error);
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
