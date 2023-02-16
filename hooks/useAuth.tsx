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
  isAnonymous: boolean;
};

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Profile>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadProfile = async (user: FormattedUser) => {
    const profile = await getUserProfile(user.uid);

    if (profile) {
      setUser({
        id: profile.id,
        userId: user.uid,
        package: profile.data().package,
        token: user.token,
        expirationTime: user.expirationTime,
        isAnonymous: user.isAnonymous,
      });
      setLoading(false);
      setIsAuthenticated(!user.isAnonymous);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("hshshsjhs", user);
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
    loadProfile,
    isAuthenticated,
  };
}
