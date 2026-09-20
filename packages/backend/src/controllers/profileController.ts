import type { FastifyReply, FastifyRequest } from "fastify";
import {
  EmailAlreadyInUseError,
  InvalidPhotoError,
  InvalidProfileDataError,
  ProfilePhotoNotFoundError,
  ProfileServiceError,
  UserNotFoundError,
} from "../errors/profile.js";
import { userRepository } from "../repositories/userRepository.js";
import {
  getProfilePhoto as getProfilePhotoService,
  getProfile as getProfileService,
  type ProfileServiceDependencies,
  type UpdateProfilePhotoInput,
  updateProfile as updateProfileService,
} from "../services/profileService.js";

const FILE_TOO_LARGE_CODE = "FST_REQ_FILE_TOO_LARGE";

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const profile = await getProfileService(currentUserId(request), createDeps(request));
    return reply.status(200).send(profile);
  } catch (error) {
    return handleProfileError(reply, error);
  }
}

export async function updateProfile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { name, email, photo } = await parseProfileMultipart(request);
    const profile = await updateProfileService(
      currentUserId(request),
      { name, email, photo },
      createDeps(request),
    );
    return reply.status(200).send(profile);
  } catch (error) {
    if (isFileTooLargeError(error)) {
      return reply.status(413).send({
        statusCode: 413,
        error: "Payload Too Large",
        message: "O arquivo enviado excede o limite permitido.",
      });
    }
    return handleProfileError(reply, error);
  }
}

export async function getProfilePhoto(request: FastifyRequest, reply: FastifyReply) {
  try {
    const download = await getProfilePhotoService(currentUserId(request), createDeps(request));
    return reply
      .type(download.contentType ?? "application/octet-stream")
      .header("Content-Disposition", "inline")
      .header("Cache-Control", "private, max-age=60")
      .send(download.body);
  } catch (error) {
    return handleProfileError(reply, error);
  }
}

function createDeps(request: FastifyRequest): ProfileServiceDependencies {
  return {
    userRepository,
    storage: request.server.storage,
  };
}

function currentUserId(request: FastifyRequest): string {
  return request.user.sub;
}

/** Lê os campos do multipart (name, email) e o arquivo opcional (photo). */
async function parseProfileMultipart(
  request: FastifyRequest,
): Promise<{ name: string; email: string; photo?: UpdateProfilePhotoInput }> {
  const parts = request.parts();

  let name = "";
  let email = "";
  let photo: UpdateProfilePhotoInput | undefined;

  for await (const part of parts) {
    if (part.type === "field") {
      if (part.fieldname === "name") {
        name = String(part.value);
      } else if (part.fieldname === "email") {
        email = String(part.value);
      }
    } else if (part.type === "file" && part.fieldname === "photo") {
      photo = { buffer: await part.toBuffer() };
    }
  }

  return { name, email, photo };
}

function isFileTooLargeError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === FILE_TOO_LARGE_CODE
  );
}

function handleProfileError(reply: FastifyReply, error: unknown): FastifyReply {
  if (error instanceof UserNotFoundError || error instanceof ProfilePhotoNotFoundError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: "Not Found",
      message: error.message,
    });
  }

  if (error instanceof EmailAlreadyInUseError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: "Conflict",
      message: error.message,
    });
  }

  if (error instanceof InvalidProfileDataError || error instanceof InvalidPhotoError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: "Bad Request",
      message: error.message,
    });
  }

  if (error instanceof ProfileServiceError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: "Service Unavailable",
      message: error.message,
    });
  }

  throw error;
}
