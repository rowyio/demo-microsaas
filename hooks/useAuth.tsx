import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/utils/firebase";

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("uid", uid);
        setUser(user);
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
