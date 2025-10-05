export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
  };
}

export interface MessageResponse {
  message: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  isVerified: boolean;
}
