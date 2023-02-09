import { db } from "@/lib/firebase";
import { doc, DocumentData, getDoc, getDocs, Query } from "firebase/firestore";

export type Package = {
  id: string;
  limit: number;
  price: number;
};

export async function getPackage(id: string) {
  const packagesRef = doc(db, "credit_packages", id);
  const packagesSnap = await getDoc(packagesRef);

  if (packagesSnap.exists()) {
    const data = packagesSnap.data();
    return data;
  }
}

export async function getPackages(q: Query<DocumentData>) {
  const packagesSnapshot = await getDocs(q);
  return packagesSnapshot.docs;
}
