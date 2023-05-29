import {
  creditsAtom,
  initialAuthState,
  initialCreditsState,
  userAuthAtom,
} from "@/atoms/atoms";
import { anonymouslySignIn, formatUser } from "@/lib/auth";
import { auth, db } from "@/lib/firebase";
import { getSchema } from "@/lib/get-schema";
import { getOrCreateProfile } from "@/lib/profiles";
import { Auth, ProfilePackage } from "@/lib/types";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useAtom, useSetAtom } from "jotai";
import { ReactNode, useEffect, useState } from "react";

export default function AuthIsLoaded({ children }: { children: ReactNode }) {
  const [userAuth, setUserAuth] = useAtom(userAuthAtom);
  const setCredits = useSetAtom(creditsAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
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
    async function onProfileChange() {
      if (userAuth.user) {
        const { tableEnv } = await getSchema();
        const unsub = onSnapshot(
          doc(
            db,
            tableEnv.collectionIds["microSaaSProfiles"],
            userAuth.user.id
          ),
          (doc) => {
            const profile = doc.data();
            if (profile) {
              const { used, limit } = profile.package as ProfilePackage;
              setCredits({ used, limit });
            }
          }
        );

        return () => {
          unsub();
        };
      }
    }
    onProfileChange();
  }, [userAuth.user, setCredits]);

  // useEffect(() => {
  //   signOut(auth);
  // }, []);

  return <>{children}</>;
}
