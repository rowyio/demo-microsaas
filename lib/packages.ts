import { db } from "@/lib/firebase";
import { doc, DocumentData, getDoc, getDocs, Query } from "firebase/firestore";

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

export const creditPacks = [
  {
    price: 0,
    credits: 100,
  },
  {
    price: 5,
    credits: 100,
  },
  {
    price: 7,
    credits: 200,
  },
  {
    price: 14,
    credits: 500,
  },
  {
    price: 25,
    credits: 1000,
  },
] as const;
