import {
  creditsAtom,
  initialAuthState,
  initialCreditsState,
  userAuthAtom,
} from "@/atoms";
import { anonymouslySignIn, formatUser } from "@/lib/auth";
import { auth, db } from "@/lib/firebase";
import { getOrCreateProfile } from "@/lib/profiles";
import { Auth, ProfilePackage } from "@/lib/types";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useAtom, useSetAtom } from "jotai";
import { ReactNode, useEffect, useState } from "react";
import Spinner from "./Spinner";

export default function AuthIsLoaded({ children }: { children: ReactNode }) {
  const [userAuth, setUserAuth] = useAtom(userAuthAtom);
  const setCredits = useSetAtom(creditsAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("user is logged in");
        const formattedUser = await formatUser(user);
        const profile = await getOrCreateProfile(
          user.uid,
          formattedUser.isAnonymous
        );

        if (profile) {
          const authState: Auth = {
            user: {
              id: profile.id,
              userId: formattedUser.uid,
              token: formattedUser.token,
              expirationTime: formattedUser.expirationTime,
              isAnonymous: formattedUser.isAnonymous,
              photoUrl: formattedUser.photoUrl,
            },
            isAuthenticated: !user.isAnonymous,
          };
          setUserAuth(authState);
          setCredits(profile.data().package);
          setLoading(false);
        }
      } else {
        anonymouslySignIn();

        // User is signed out, sign in anonymous user
        console.log("user is logged out");
        setUserAuth(initialAuthState);
        setCredits(initialCreditsState);
        setLoading(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [setCredits, setUserAuth]);

  useEffect(() => {
    if (userAuth.user) {
      const unsub = onSnapshot(doc(db, "profiles", userAuth.user.id), (doc) => {
        const profile = doc.data();
        if (profile) {
          const { used, limit } = profile.package as ProfilePackage;
          setCredits({ used, limit });
        }
      });

      return () => {
        unsub();
      };
    }
  }, [userAuth.user, setCredits]);

  // useEffect(() => {
  //   signOut(auth);
  // }, []);

  // if (!userAuth.user)
  //   return (
  //     <div className="bg-grey-lighter flex h-screen min-h-screen items-center justify-center bg-white">
  //       <Spinner />
  //     </div>
  //   );

  return <>{children}</>;
}
