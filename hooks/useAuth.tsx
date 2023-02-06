import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { getUserProfile } from "@/lib/profiles";

type Profile = {
  profileId: string;
  packageId: string;
};

type UserProfile = User & Profile;

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile>();

  useEffect(() => {
    async function loadProfile(user: User) {
      const profile = await getUserProfile(user.uid);

      if (profile) {
        setUser({
          ...user,
          packageId: profile.package,
          profileId: profile.profileId,
        });
      }
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("uid", uid);
        loadProfile(user);
      } else {
        // User is signed out
        console.log("user is logged out");
        setUser(undefined);
      }
      setLoading(false);
    });
  }, []);

  return {
    user,
    loading,
  };
}
