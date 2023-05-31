import { db } from "@/lib/firebase";
import { doc, DocumentData, getDoc, getDocs, Query } from "firebase/firestore";
import { getSchema } from "./get-schema";

export async function getPackage(id: string) {
  const { tableEnv } = await getSchema();

  const packagesRef = doc(db, tableEnv.collectionIds["microSaaSPackages"], id);
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
