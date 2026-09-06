export interface UserPublic {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: UserPublic;
}
