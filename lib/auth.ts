import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  User,
  signInAnonymously,
} from "firebase/auth";

const provider = new GoogleAuthProvider();

export type FormattedUser = {
  uid: string;
  email: string | null;
  name: string | null;
  // provider: string;
  photoUrl: string | null;
  token: string;
  expirationTime: string;
  isAnonymous: boolean;
};

export async function registerOrLogin(): Promise<{
  errorCode?: string;
  errorMessage?: string;
  user?: FormattedUser;
}> {
  try {
    const result = await signInWithPopup(auth, provider);

    // The signed-in user info.
    const user = result.user;

    const formattedUser = await formatUser(user);

    return { user: formattedUser };
  } catch (error: any) {
    console.log("Failed to sign in", error);
    const errorCode = error.code;
    const errorMessage = error.message;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    return { errorCode, errorMessage };
  }
}

export async function anonymouslySignIn() {
  try {
    const result = await signInAnonymously(auth);

    // The signed-in user info.
    const user = result.user;

    const formattedUser = await formatUser(user);

    return { user: formattedUser };
  } catch (error: any) {
    console.log("Anonymous sign in error:", error);
    const errorCode = error.code;
    const errorMessage = error.message;
    return { errorCode, errorMessage };
  }
}

export const formatUser = async (user: User) => {
  const decodedToken = await user.getIdTokenResult(/*forceRefresh*/ true);
  const { token, expirationTime } = decodedToken;
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    // provider: user.providerData.length
    //   ? user.providerData[0].providerId
    //   : user.providerId,
    photoUrl: user.photoURL,
    token,
    expirationTime,
    isAnonymous: user.isAnonymous,
  };
};
