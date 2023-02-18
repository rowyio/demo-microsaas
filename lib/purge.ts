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

  const batch = firestore.batch();

  for (const profileDoc of profilesSnap.docs) {
    const profile = profileDoc.data();
    const userId = profile.userId;
    const user = await auth.getUser(userId);

    // Purge all anonymous data after 5 days
    if (daysPast(new Date(user.metadata.creationTime)) === 5) {
      // Delete predictions
      const predictionsSnap = await firestore
        .collection("predictions")
        .where("profile", "==", profileDoc.id)
        .get();
      predictionsSnap.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      // Delete profile
      await profileDoc.ref.delete();
      // Delete auth user
      await auth.deleteUser(userId);
    }
  }
}
