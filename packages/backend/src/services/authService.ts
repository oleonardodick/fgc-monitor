import {
  type CreateAccountInput,
  isPasswordValid,
  type LoginDTO,
  type LoginResponse,
  type UserPublic,
} from "@fgc-monitor/shared";
import {
  AuthenticationServiceError,
  CreateAccountServiceError,
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  InvalidPasswordError,
} from "../errors/auth.js";
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

    const isValid = await deps.bcrypt.compare(credentials.password, user.passwordHash);

    if (!isValid) {
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

export interface CreateAccountServiceDependencies {
  userRepository: IUserRepository;
  bcrypt: IBcryptPlugin;
}

export async function createAccount(
  input: CreateAccountInput,
  deps: CreateAccountServiceDependencies,
): Promise<UserPublic> {
  try {
    const email = input.email.trim().toLowerCase();
    const existingUser = await deps.userRepository.findByEmail(email);

    if (existingUser) {
      throw new EmailAlreadyRegisteredError();
    }

    if (!isPasswordValid(input.password)) {
      throw new InvalidPasswordError();
    }

    const passwordHash = await deps.bcrypt.hash(input.password);

    const user = await deps.userRepository.create({
      name: input.name.trim(),
      email,
      passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    if (error instanceof EmailAlreadyRegisteredError || error instanceof InvalidPasswordError) {
      throw error;
    }
    throw new CreateAccountServiceError();
  }
}
