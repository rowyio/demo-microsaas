import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/lib/profiles";

export type Profile = {
  id: string;
  userId: string;
  package: { id: string; limit: number; price: number; used: number };
};

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Profile>();

  useEffect(() => {
    async function loadProfile(user: User) {
      const profile = await getUserProfile(user.uid);

      if (profile) {
        setUser({
          id: profile.id,
          userId: user.uid,
          package: profile.data().package,
        });
        setLoading(false);
      }
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        loadProfile(user);
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
