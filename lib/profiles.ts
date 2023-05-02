import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getPackages } from "./packages";

export async function getUserProfile(userId: string) {
  const profilesQuery = query(
    collection(db, process.env.NEXT_PUBLIC_PROFILES_COLLECTION || "profiles"),
    where("userId", "==", userId)
  );
  const profilesSnapshot = await getDocs(profilesQuery);

  if (!profilesSnapshot.empty) {
    const profile = profilesSnapshot.docs[0];
    return profile;
  }
}

export async function getOrCreateProfile(userId: string, isAnonymous: boolean) {
  const existingProfile = await getUserProfile(userId);

  if (!existingProfile) {
    const profilesRef = collection(
      db,
      process.env.NEXT_PUBLIC_PROFILES_COLLECTION || "profiles"
    );
    if (!isAnonymous) {
      const packagesQuery = query(
        collection(
          db,
          process.env.NEXT_PUBLIC_PROFILES_COLLECTION || "credit_packages"
        ),
        where("price", "==", 0)
      );
      const packagesSnapshot = await getPackages(packagesQuery);
      const packageData = packagesSnapshot[0];
      // Assign free package for new users
      await setDoc(doc(profilesRef), {
        userId,
        package: {
          limit: packageData.data().limit,
          used: 0,
        },
        "_createdBy.timestamp": new Date(),
      });
    } else {
      await setDoc(doc(profilesRef), {
        userId,
        isAnonymous: true,
        package: {
          limit: 10,
          used: 0,
        },
        "_createdBy.timestamp": new Date(),
      });
    }
  }

  return await getUserProfile(userId);
}
