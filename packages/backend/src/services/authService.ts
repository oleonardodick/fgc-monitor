import type { LoginDTO, LoginResponse, UserPublic } from "@fgc-monitor/shared";
import { AuthenticationServiceError, InvalidCredentialsError } from "../errors/auth.js";
import type { IBcryptPlugin } from "../plugins/bcrypt.js";
import type { IUserRepository } from "../repositories/userRepository.js";

export interface IJwtPlugin {
  sign(payload: object): string;
}

export interface AuthServiceDependencies {
  userRepository: IUserRepository;
  bcrypt: IBcryptPlugin;
  jwt: IJwtPlugin;
}

export async function login(
  credentials: LoginDTO,
  deps: AuthServiceDependencies,
): Promise<LoginResponse> {
  try {
    const user = await deps.userRepository.findActiveByEmail(credentials.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await deps.bcrypt.compare(credentials.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const token = deps.jwt.sign({
      sub: user.id,
      email: user.email,
    });

    const userPublic: UserPublic = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return { token, user: userPublic };
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      throw error;
    }
    throw new AuthenticationServiceError();
  }
}
