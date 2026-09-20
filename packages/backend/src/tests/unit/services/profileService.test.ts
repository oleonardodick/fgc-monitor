import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { mock, test } from "node:test";
import {
  EmailAlreadyInUseError,
  InvalidPhotoError,
  InvalidProfileDataError,
  ProfilePhotoNotFoundError,
  ProfileServiceError,
  UserNotFoundError,
} from "../../../errors/profile.js";
import type { IUserDocument } from "../../../models/user.js";
import type { IUserRepository } from "../../../repositories/userRepository.js";
import { getProfile, getProfilePhoto, updateProfile } from "../../../services/profileService.js";
import type { IStorageProvider } from "../../../storage/types.js";
import type { ImageFormat, ImageInfo } from "../../../utils/image.js";

function createUser(overrides?: Partial<IUserDocument>): IUserDocument {
  return {
    id: "661c8a1b2e5f3a1d4c3b2a1a",
    email: "user@example.com",
    name: "Test User",
    passwordHash: "$2a$10$hashedpassword",
    active: true,
    createdAt: new Date(),
    photoKey: undefined,
    ...overrides,
  } as IUserDocument;
}

function createStorage(overrides?: Partial<IStorageProvider>): IStorageProvider {
  return {
    driver: "minio",
    upload: mock.fn(async () => ({ key: "users/id/photo.png" })),
    delete: mock.fn(async () => undefined),
    getSignedUrl: mock.fn(async () => "https://signed-url"),
    download: mock.fn(async () => ({
      body: Readable.from(["content"]),
      contentType: "image/png",
    })),
    ...overrides,
  };
}

function createDeps(overrides?: {
  findById?: IUserRepository["findById"];
  findByEmailExcluding?: IUserRepository["findByEmailExcluding"];
  updateProfile?: IUserRepository["updateProfile"];
  storage?: IStorageProvider;
  getImageInfo?: (buffer: Buffer) => ImageInfo | null;
  generatePhotoKey?: (userId: string, format: ImageFormat) => string;
}) {
  return {
    userRepository: {
      findActiveByEmail: mock.fn(async () => null),
      findByEmail: mock.fn(async () => null),
      create: mock.fn(async () => createUser()),
      findById: overrides?.findById ?? mock.fn(() => Promise.resolve(createUser())),
      findByEmailExcluding: overrides?.findByEmailExcluding ?? mock.fn(() => Promise.resolve(null)),
      updateProfile: overrides?.updateProfile ?? mock.fn(() => Promise.resolve(createUser())),
    } as IUserRepository,
    storage: overrides?.storage ?? createStorage(),
    getImageInfo: overrides?.getImageInfo,
    generatePhotoKey: overrides?.generatePhotoKey,
  };
}

const VALID_PHOTO_INFO: ImageInfo = { format: "png", width: 200, height: 150 };

test("getProfile: retorna o perfil do usuário", async () => {
  const user = createUser({ photoKey: "users/id/photo.png" });
  const deps = createDeps({
    findById: mock.fn(() => Promise.resolve(user)),
  });

  const profile = await getProfile(user.id, deps);

  assert.equal(profile.id, user.id);
  assert.equal(profile.name, "Test User");
  assert.equal(profile.email, "user@example.com");
  assert.equal(profile.hasPhoto, true);
});

test("getProfile: hasPhoto é false quando não há foto", async () => {
  const deps = createDeps({
    findById: mock.fn(() => Promise.resolve(createUser({ photoKey: undefined }))),
  });

  const profile = await getProfile("user-id", deps);

  assert.equal(profile.hasPhoto, false);
});

test("getProfile: lança UserNotFoundError quando o usuário não existe", async () => {
  const deps = createDeps({
    findById: mock.fn(() => Promise.resolve(null)),
  });

  await assert.rejects(
    () => getProfile("missing-id", deps),
    (error: unknown) => {
      assert.ok(error instanceof UserNotFoundError);
      assert.equal((error as Error).message, "Usuário não encontrado");
      return true;
    },
  );
});

test("getProfile: lança ProfileServiceError quando o repositório falha", async () => {
  const deps = createDeps({
    findById: mock.fn(() => Promise.reject(new Error("DB error"))),
  });

  await assert.rejects(
    () => getProfile("user-id", deps),
    (error: unknown) => {
      assert.ok(error instanceof ProfileServiceError);
      return true;
    },
  );
});

test("updateProfile: atualiza nome e e-mail sem foto", async () => {
  const updatedUser = createUser({ name: "Novo Nome", email: "novo@example.com" });
  let capturedUpdate: Parameters<IUserRepository["updateProfile"]>[1] | undefined;
  const updateProfileSpy = mock.fn(
    (_id: string, data: Parameters<IUserRepository["updateProfile"]>[1]) => {
      capturedUpdate = data;
      return Promise.resolve(updatedUser);
    },
  );
  const uploadSpy = mock.fn(async () => ({ key: "users/id/photo.png" }));
  const storage = createStorage({ upload: uploadSpy });
  const deps = createDeps({ updateProfile: updateProfileSpy, storage });

  const profile = await updateProfile(
    "user-id",
    { name: "Novo Nome", email: " novo@example.com " },
    deps,
  );

  assert.equal(profile.name, "Novo Nome");
  assert.equal(profile.email, "novo@example.com");
  assert.equal(profile.hasPhoto, false);
  assert.equal(capturedUpdate?.name, "Novo Nome");
  assert.equal(capturedUpdate?.email, "novo@example.com");
  assert.equal(capturedUpdate?.photoKey, undefined);
  assert.equal(uploadSpy.mock.callCount(), 0);
});

test("updateProfile: envia a foto ao storage e persiste a photoKey", async () => {
  const buffer = Buffer.from("png-bytes");
  const updatedUser = createUser({ photoKey: "users/id/photo-1.png" });
  let capturedUpdate: Parameters<IUserRepository["updateProfile"]>[1] | undefined;
  const updateProfileSpy = mock.fn(
    (_id: string, data: Parameters<IUserRepository["updateProfile"]>[1]) => {
      capturedUpdate = data;
      return Promise.resolve(updatedUser);
    },
  );
  const uploadSpy = mock.fn(async (file: { key: string }) => ({ key: file.key }));
  const storage = createStorage({ upload: uploadSpy });
  const deps = createDeps({
    updateProfile: updateProfileSpy,
    storage,
    getImageInfo: () => VALID_PHOTO_INFO,
    generatePhotoKey: () => "users/id/photo-1.png",
  });

  const profile = await updateProfile(
    "user-id",
    { name: "Test User", email: "user@example.com", photo: { buffer } },
    deps,
  );

  assert.equal(profile.hasPhoto, true);
  assert.equal(uploadSpy.mock.callCount(), 1);
  assert.deepEqual(uploadSpy.mock.calls[0]?.arguments[0], {
    key: "users/id/photo-1.png",
    body: buffer,
    contentType: "image/png",
  });
  assert.equal(capturedUpdate?.photoKey, "users/id/photo-1.png");
});

test("updateProfile: remove a foto antiga após substituir a nova", async () => {
  const buffer = Buffer.from("png-bytes");
  const currentUser = createUser({ photoKey: "users/id/photo-old.png" });
  const updatedUser = createUser({ photoKey: "users/id/photo-new.png" });
  const deleteSpy = mock.fn(async () => undefined);
  const storage = createStorage({ delete: deleteSpy });
  const deps = createDeps({
    findById: mock.fn(() => Promise.resolve(currentUser)),
    updateProfile: mock.fn(() => Promise.resolve(updatedUser)),
    storage,
    getImageInfo: () => VALID_PHOTO_INFO,
    generatePhotoKey: () => "users/id/photo-new.png",
  });

  await updateProfile(
    "user-id",
    { name: "Test User", email: "user@example.com", photo: { buffer } },
    deps,
  );

  assert.equal(deleteSpy.mock.callCount(), 1);
  assert.deepEqual(deleteSpy.mock.calls[0]?.arguments, ["users/id/photo-old.png"]);
});

test("updateProfile: não remove foto quando a chave é a mesma", async () => {
  const buffer = Buffer.from("png-bytes");
  const currentUser = createUser({ photoKey: "users/id/photo.png" });
  const deleteSpy = mock.fn(async () => undefined);
  const storage = createStorage({ delete: deleteSpy });
  const deps = createDeps({
    findById: mock.fn(() => Promise.resolve(currentUser)),
    updateProfile: mock.fn(() => Promise.resolve(currentUser)),
    storage,
    getImageInfo: () => VALID_PHOTO_INFO,
    generatePhotoKey: () => "users/id/photo.png",
  });

  await updateProfile(
    "user-id",
    { name: "Test User", email: "user@example.com", photo: { buffer } },
    deps,
  );

  assert.equal(deleteSpy.mock.callCount(), 0);
});

test("updateProfile: lança InvalidProfileDataError para dados inválidos", async () => {
  const deps = createDeps();

  await assert.rejects(
    () => updateProfile("user-id", { name: " ", email: "invalido" }, deps),
    (error: unknown) => {
      assert.ok(error instanceof InvalidProfileDataError);
      assert.equal((error as Error).message, "Nome é obrigatório");
      return true;
    },
  );
});

test("updateProfile: lança EmailAlreadyInUseError quando o e-mail pertence a outro usuário", async () => {
  const deps = createDeps({
    findByEmailExcluding: mock.fn(() => Promise.resolve(createUser())),
  });

  await assert.rejects(
    () => updateProfile("user-id", { name: "Test User", email: "other@example.com" }, deps),
    (error: unknown) => {
      assert.ok(error instanceof EmailAlreadyInUseError);
      assert.equal((error as Error).message, "E-mail já está em uso");
      return true;
    },
  );
});

test("updateProfile: lança UserNotFoundError quando o usuário não existe", async () => {
  const deps = createDeps({
    findById: mock.fn(() => Promise.resolve(null)),
  });

  await assert.rejects(
    () => updateProfile("missing-id", { name: "Test User", email: "user@example.com" }, deps),
    (error: unknown) => {
      assert.ok(error instanceof UserNotFoundError);
      return true;
    },
  );
});

test("updateProfile: lança InvalidPhotoError para formato não suportado", async () => {
  const deps = createDeps({ getImageInfo: () => null });

  await assert.rejects(
    () =>
      updateProfile(
        "user-id",
        {
          name: "Test User",
          email: "user@example.com",
          photo: { buffer: Buffer.from("gif") },
        },
        deps,
      ),
    (error: unknown) => {
      assert.ok(error instanceof InvalidPhotoError);
      assert.match((error as Error).message, /PNG ou JPG/);
      return true;
    },
  );
});

test("updateProfile: lança InvalidPhotoError quando a foto excede 400x400", async () => {
  const deps = createDeps({
    getImageInfo: () => ({ format: "png", width: 401, height: 200 }),
  });

  await assert.rejects(
    () =>
      updateProfile(
        "user-id",
        {
          name: "Test User",
          email: "user@example.com",
          photo: { buffer: Buffer.from("png") },
        },
        deps,
      ),
    (error: unknown) => {
      assert.ok(error instanceof InvalidPhotoError);
      assert.match((error as Error).message, /400x400/);
      return true;
    },
  );
});

test("updateProfile: remove a foto recém-enviada quando o banco falha e retorna ProfileServiceError", async () => {
  const buffer = Buffer.from("png-bytes");
  const deleteSpy = mock.fn(async () => undefined);
  const storage = createStorage({ delete: deleteSpy });
  const deps = createDeps({
    updateProfile: mock.fn(() => Promise.reject(new Error("DB error"))),
    storage,
    getImageInfo: () => VALID_PHOTO_INFO,
    generatePhotoKey: () => "users/id/photo-orphan.png",
  });

  await assert.rejects(
    () =>
      updateProfile(
        "user-id",
        { name: "Test User", email: "user@example.com", photo: { buffer } },
        deps,
      ),
    (error: unknown) => {
      assert.ok(error instanceof ProfileServiceError);
      return true;
    },
  );

  assert.equal(deleteSpy.mock.callCount(), 1);
  assert.deepEqual(deleteSpy.mock.calls[0]?.arguments, ["users/id/photo-orphan.png"]);
});

test("updateProfile: mapeia erro de chave duplicada do MongoDB para EmailAlreadyInUseError", async () => {
  const deps = createDeps({
    findById: mock.fn(() => Promise.resolve(createUser())),
    findByEmailExcluding: mock.fn(() => Promise.resolve(null)),
    updateProfile: mock.fn(() => Promise.reject({ code: 11000 })),
  });

  await assert.rejects(
    () => updateProfile("user-id", { name: "Test User", email: "duplicate@example.com" }, deps),
    (error: unknown) => {
      assert.ok(error instanceof EmailAlreadyInUseError);
      return true;
    },
  );
});

test("getProfilePhoto: retorna o download do storage quando existe foto", async () => {
  let capturedKey: string | undefined;
  const download = mock.fn(async (key: string) => {
    capturedKey = key;
    return {
      body: Readable.from(["content"]),
      contentType: "image/png",
    };
  });
  const storage = createStorage({ download });
  const deps = createDeps({
    findById: mock.fn(() => Promise.resolve(createUser({ photoKey: "users/id/photo.png" }))),
    storage,
  });

  const result = await getProfilePhoto("user-id", deps);

  assert.equal(result.contentType, "image/png");
  assert.equal(capturedKey, "users/id/photo.png");
});

test("getProfilePhoto: lança ProfilePhotoNotFoundError quando não há foto", async () => {
  const deps = createDeps({
    findById: mock.fn(() => Promise.resolve(createUser({ photoKey: undefined }))),
  });

  await assert.rejects(
    () => getProfilePhoto("user-id", deps),
    (error: unknown) => {
      assert.ok(error instanceof ProfilePhotoNotFoundError);
      return true;
    },
  );
});

test("getProfilePhoto: lança UserNotFoundError quando o usuário não existe", async () => {
  const deps = createDeps({
    findById: mock.fn(() => Promise.resolve(null)),
  });

  await assert.rejects(
    () => getProfilePhoto("missing-id", deps),
    (error: unknown) => {
      assert.ok(error instanceof UserNotFoundError);
      return true;
    },
  );
});

test("getProfilePhoto: lança ProfileServiceError quando o storage falha", async () => {
  const storage = createStorage({
    download: mock.fn(() => Promise.reject(new Error("S3 error"))),
  });
  const deps = createDeps({
    findById: mock.fn(() => Promise.resolve(createUser({ photoKey: "users/id/photo.png" }))),
    storage,
  });

  await assert.rejects(
    () => getProfilePhoto("user-id", deps),
    (error: unknown) => {
      assert.ok(error instanceof ProfileServiceError);
      return true;
    },
  );
});
