export interface UserProfile {
  id: string;
  name: string;
  email: string;
  /** Se o usuário possui foto de perfil armazenada. */
  hasPhoto: boolean;
}
