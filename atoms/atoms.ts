import { atom } from "jotai";
import { Auth, Credits } from "../lib/types";

export const initialAuthState: Auth = {
  isAuthenticated: false,
};

export const initialCreditsState: Credits = {
  used: 0,
  limit: 0,
};

export const userAuthAtom = atom(initialAuthState);

export const creditsAtom = atom(initialCreditsState);
