export interface UserPublic {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: UserPublic;
}

export interface CreateAccountInput {
  name: string;
  email: string;
  password: string;
}
