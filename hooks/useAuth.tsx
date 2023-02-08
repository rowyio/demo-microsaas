import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/lib/profiles";
import { ProfilePackage } from "./usePackage";
import { FormattedUser, formatUser } from "@/lib/auth";

export type Profile = {
  id: string;
  userId: string;
  package: ProfilePackage;
  token: string;
  expirationTime: string;
};

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Profile>();

  useEffect(() => {
    async function loadProfile(user: FormattedUser) {
      console.log("FormattedUser", user);

      const profile = await getUserProfile(user.uid);

      if (profile) {
        setUser({
          id: profile.id,
          userId: user.uid,
          package: profile.data().package,
          token: user.token,
          expirationTime: user.expirationTime,
        });
        setLoading(false);
      }
    }

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const formattedUser = await formatUser(user);
        loadProfile(formattedUser);
      } else {
        // User is signed out
        console.log("user is logged out");
        setUser(undefined);
        setLoading(false);
      }
    });
  }, []);

  return {
    user,
    loading,
  };
}
