import { auth } from "@/lib/firebase-admin";
import { firestore } from "@/lib/firebase-admin";

function daysPast(date: Date): number {
  const today = new Date();
  const diff = today.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days;
}

export async function purgeAnonymousData() {
  const profilesSnap = await firestore
    .collection("profiles")
    .where("isAnonymous", "==", true)
    .get();

  for (const profileDoc of profilesSnap.docs) {
    const profile = profileDoc.data();
    const userId = profile.userId;
    const user = await auth.getUser(userId);

    // Purge anonymous profiles after 1 day
    if (daysPast(new Date(user.metadata.creationTime)) === 1) {
      // Delete profile document
      await profileDoc.ref.delete();
      // Delete auth user
      await auth.deleteUser(userId);
    }
  }
}
