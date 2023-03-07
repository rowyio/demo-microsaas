export type Profile = {
  id: string;
  userId: string;
  token: string;
  expirationTime: string;
  isAnonymous: boolean;
  photoUrl?: string | null;
};

export type Package = {
  id: string;
  limit: number;
  price: number;
};

export type Prediction = {
  id: string;
  input: string;
  output: string;
};

export type ProfilePackage = {
  used: number;
  limit: number;
};

export type Credits = {
  used: number;
  limit: number;
};

export type Auth = {
  user?: Profile;
  isAuthenticated: boolean;
};
