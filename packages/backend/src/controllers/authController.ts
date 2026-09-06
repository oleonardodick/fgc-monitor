import type { FastifyReply, FastifyRequest } from "fastify";
import {
  AuthenticationServiceError,
  CreateAccountServiceError,
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  InvalidPasswordError,
} from "../errors/auth.js";
import { userRepository } from "../repositories/userRepository.js";
import {
  createAccount as createAccountService,
  login as loginService,
} from "../services/authService.js";
import type { CreateAccountBody, LoginBody } from "../validators/auth.js";

export async function login(request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
  try {
    const result = await loginService(request.body, {
      userRepository,
      bcrypt: request.server.bcrypt,
      jwt: request.server.jwt,
    });

    return reply.status(200).send(result);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: "Unauthorized",
        message: error.message,
      });
    }

    if (error instanceof AuthenticationServiceError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: "Service Unavailable",
        message: error.message,
      });
    }

    throw error;
  }
}

export async function createAccount(
  request: FastifyRequest<{ Body: CreateAccountBody }>,
  reply: FastifyReply,
) {
  try {
    const user = await createAccountService(request.body, {
      userRepository,
      bcrypt: request.server.bcrypt,
    });

    return reply.status(201).send(user);
  } catch (error) {
    if (error instanceof EmailAlreadyRegisteredError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: "Conflict",
        message: error.message,
      });
    }

    if (error instanceof InvalidPasswordError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: "Bad Request",
        message: error.message,
      });
    }

    if (error instanceof CreateAccountServiceError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: "Service Unavailable",
        message: error.message,
      });
    }

    throw error;
  }
}
