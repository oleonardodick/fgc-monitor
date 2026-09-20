import {
  PROFILE_PHOTO_MAX_DIMENSION_PX,
  type UserProfile,
  updateProfileSchema,
} from "@fgc-monitor/shared";
import {
  EmailAlreadyInUseError,
  InvalidPhotoError,
  InvalidProfileDataError,
  ProfilePhotoNotFoundError,
  ProfileServiceError,
  UserNotFoundError,
} from "../errors/profile.js";
import type { IUserDocument } from "../models/user.js";
import type { IUserRepository, UpdateProfileData } from "../repositories/userRepository.js";
import type { IStorageProvider, StorageDownload } from "../storage/types.js";
import { getImageDimensions, type ImageFormat, type ImageInfo } from "../utils/image.js";

const IMAGE_EXTENSION: Record<ImageFormat, string> = {
  png: "png",
  jpeg: "jpg",
};

const IMAGE_CONTENT_TYPE: Record<ImageFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
};

export interface ProfileServiceDependencies {
  userRepository: IUserRepository;
  storage: IStorageProvider;
  /** Geração da chave da foto (injetável para testes). */
  generatePhotoKey?: (userId: string, format: ImageFormat) => string;
  /** Leitura de dimensões da imagem (injetável para testes). */
  getImageInfo?: (buffer: Buffer) => ImageInfo | null;
}

export interface UpdateProfilePhotoInput {
  buffer: Buffer;
}

export interface UpdateProfileInput {
  name: string;
  email: string;
  photo?: UpdateProfilePhotoInput;
}

export async function getProfile(
  userId: string,
  deps: ProfileServiceDependencies,
): Promise<UserProfile> {
  try {
    const user = await deps.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    return toUserProfile(user);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      throw error;
    }
    throw new ProfileServiceError();
  }
}

export async function getProfilePhoto(
  userId: string,
  deps: ProfileServiceDependencies,
): Promise<StorageDownload> {
  try {
    const user = await deps.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    if (!user.photoKey) {
      throw new ProfilePhotoNotFoundError();
    }
    return await deps.storage.download(user.photoKey);
  } catch (error) {
    if (error instanceof UserNotFoundError || error instanceof ProfilePhotoNotFoundError) {
      throw error;
    }
    throw new ProfileServiceError();
  }
}

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
  deps: ProfileServiceDependencies,
): Promise<UserProfile> {
  try {
    const parsed = updateProfileSchema.safeParse({
      name: input.name,
      email: input.email,
    });
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Dados de perfil inválidos";
      throw new InvalidProfileDataError(message);
    }

    const currentUser = await deps.userRepository.findById(userId);
    if (!currentUser) {
      throw new UserNotFoundError();
    }

    const emailInUse = await deps.userRepository.findByEmailExcluding(parsed.data.email, userId);
    if (emailInUse) {
      throw new EmailAlreadyInUseError();
    }

    let newPhotoKey: string | undefined;
    if (input.photo) {
      const imageInfo = validatePhoto(input.photo.buffer, deps);
      newPhotoKey =
        deps.generatePhotoKey?.(userId, imageInfo.format) ??
        defaultPhotoKey(userId, imageInfo.format);

      await deps.storage.upload({
        key: newPhotoKey,
        body: input.photo.buffer,
        contentType: IMAGE_CONTENT_TYPE[imageInfo.format],
      });
    }

    const updateData: UpdateProfileData = {
      name: parsed.data.name,
      email: parsed.data.email,
    };
    if (newPhotoKey !== undefined) {
      updateData.photoKey = newPhotoKey;
    }

    let updatedUser: IUserDocument | null;
    try {
      updatedUser = await deps.userRepository.updateProfile(userId, updateData);
    } catch (error) {
      // Falha ao persistir → remove a foto recém-enviada (best-effort) para não deixar órfã no storage.
      await cleanupKey(deps.storage, newPhotoKey);
      throw error;
    }

    if (!updatedUser) {
      await cleanupKey(deps.storage, newPhotoKey);
      throw new UserNotFoundError();
    }

    // Substituição de foto: remove a foto antiga após gravar no banco (best-effort).
    if (newPhotoKey && currentUser.photoKey && currentUser.photoKey !== newPhotoKey) {
      await cleanupKey(deps.storage, currentUser.photoKey);
    }

    return toUserProfile(updatedUser);
  } catch (error) {
    if (
      error instanceof UserNotFoundError ||
      error instanceof EmailAlreadyInUseError ||
      error instanceof InvalidProfileDataError ||
      error instanceof InvalidPhotoError
    ) {
      throw error;
    }
    // Corrida de unicidade do e-mail (índice único do MongoDB) → 409.
    if (isDuplicateKeyError(error)) {
      throw new EmailAlreadyInUseError();
    }
    throw new ProfileServiceError();
  }
}

function validatePhoto(buffer: Buffer, deps: ProfileServiceDependencies): ImageInfo {
  const imageInfo = (deps.getImageInfo ?? getImageDimensions)(buffer);
  if (!imageInfo) {
    throw new InvalidPhotoError("A foto deve estar no formato PNG ou JPG");
  }

  if (
    imageInfo.width > PROFILE_PHOTO_MAX_DIMENSION_PX ||
    imageInfo.height > PROFILE_PHOTO_MAX_DIMENSION_PX
  ) {
    throw new InvalidPhotoError(
      `A foto deve ter no máximo ${PROFILE_PHOTO_MAX_DIMENSION_PX}x${PROFILE_PHOTO_MAX_DIMENSION_PX} pixels`,
    );
  }

  return imageInfo;
}

function toUserProfile(user: IUserDocument): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    hasPhoto: Boolean(user.photoKey),
  };
}

function defaultPhotoKey(userId: string, format: ImageFormat): string {
  return `users/${userId}/photo-${Date.now()}.${IMAGE_EXTENSION[format]}`;
}

async function cleanupKey(storage: IStorageProvider, key: string | undefined): Promise<void> {
  if (!key) {
    return;
  }
  try {
    await storage.delete(key);
  } catch {
    // Best-effort: falha na limpeza não deve derrubar o fluxo principal.
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: number }).code === 11000;
}
