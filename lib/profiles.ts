import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getSchema } from "./get-schema";

export async function getUserProfile(userId: string) {
  const { tableEnv } = await getSchema();
  const profilesQuery = query(
    collection(db, tableEnv.collectionIds["microSaaSProfiles"]),
    where("userId", "==", userId)
  );
  const profilesSnapshot = await getDocs(profilesQuery);

  if (!profilesSnapshot.empty) {
    const profile = profilesSnapshot.docs[0];
    return profile;
  }
}

export async function getOrCreateProfile(userId: string, isAnonymous: boolean) {
  const { tableEnv } = await getSchema();
  const existingProfile = await getUserProfile(userId);
  if (!existingProfile) {
    const profilesRef = collection(
      db,
      tableEnv.collectionIds["microSaaSProfiles"]
    );
    if (!isAnonymous) {
      // Assign free package for new users
      await setDoc(doc(profilesRef), {
        userId,
        isAnonymous: false,
        package: {
          limit: 100,
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
