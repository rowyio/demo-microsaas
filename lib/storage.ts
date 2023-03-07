import {
  getDownloadURL,
  StorageReference,
  uploadBytes,
} from "firebase/storage";

export async function upload(storageRef: StorageReference, file: File | Blob) {
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.log("Storage error", error);
    throw error;
  }
}

export function getImageExtension(imageUrl: string) {
  const extension = imageUrl.split(".").pop()?.toLowerCase();
  if (extension === "jpg") {
    return "jpeg";
  }
  return extension || undefined;
}
