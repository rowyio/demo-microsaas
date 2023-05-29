export const FIREBASE_DOMAIN_ERROR = "auth/unauthorized-domain";

export const TABLE_ID =
  process.env.NEXT_PUBLIC_PROFILES_TABLE_ID || "microSaaSProfiles";

export const START_PREDICTION_ENDPOINT = process.env
  .NEXT_PUBLIC_START_PREDICTION_WEBHOOK as string;

export const CREATE_STRIPE_CHECKOUT_ENDPOINT = process.env
  .NEXT_PUBLIC_CREATE_STRIPE_CHECKOUT_WEBHOOK as string;
