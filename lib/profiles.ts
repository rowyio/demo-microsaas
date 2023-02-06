import { db } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function getUserProfile(userId: string) {
  const profilesQuery = query(
    collection(db, "profiles"),
    where("profileId", "==", userId)
  );
  const profilesSnapshot = await getDocs(profilesQuery);

  if (!profilesSnapshot.empty) {
    const profile = profilesSnapshot.docs[0].data();
    return profile;
  }
}
