import Link from "next/link";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "@/utils/firebase";
import { collection, setDoc, doc, query, where } from "firebase/firestore";
import useAuth from "@/hooks/useAuth";
import { getPackages } from "@/lib/packages";
import { getUserProfile } from "@/lib/profiles";

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

        const existingProfile = await getUserProfile(userId);

        // Create profile on first sign in
        if (!existingProfile) {
          const packagesQuery = query(
            collection(db, "credit_packages"),
            where("price", "==", 0)
          );
          const packagesSnapshot = await getPackages(packagesQuery);
          const packageData = packagesSnapshot[0];

          // Assign free package for new users
          const profilesRef = collection(db, "profiles");
          await setDoc(doc(profilesRef), {
            userId,
            package: {
              id: packageData.id,
              price: packageData.data().price,
              limit: packageData.data().limit,
              used: 0,
            },
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
