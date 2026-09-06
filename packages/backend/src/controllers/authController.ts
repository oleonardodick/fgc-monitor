import type { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticationServiceError, InvalidCredentialsError } from "../errors/auth.js";
import { userRepository } from "../repositories/userRepository.js";
import { login as loginService } from "../services/authService.js";
import type { LoginBody } from "../validators/auth.js";

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
