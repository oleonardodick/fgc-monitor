import assert from "node:assert/strict";
import type { Readable } from "node:stream";
import { Readable as ReadableImpl } from "node:stream";
import { mock, test } from "node:test";
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  type S3Client,
} from "@aws-sdk/client-s3";
import type { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3StorageProvider } from "../../../storage/providers/s3StorageProvider.js";
import type { S3StorageConfig } from "../../../storage/types.js";

const config: S3StorageConfig = {
  endpoint: "http://localhost:9000",
  region: "us-east-1",
  accessKeyId: "minioadmin",
  secretAccessKey: "minioadmin",
  bucket: "fgc-monitor",
  useSsl: false,
};

interface FakeClientOptions {
  headBucketThrows?: boolean;
  getObjectBody?: Readable;
  getObjectContentType?: string;
}

function createFakeClient(options: FakeClientOptions = {}) {
  const sentCommands: unknown[] = [];
  const send = mock.fn(async (command: unknown) => {
    sentCommands.push(command);
    if (options.headBucketThrows && command instanceof HeadBucketCommand) {
      throw new Error("bucket not found");
    }
    if (command instanceof GetObjectCommand) {
      return {
        Body: options.getObjectBody ?? ReadableImpl.from([Buffer.from("content")]),
        ContentType: options.getObjectContentType ?? "image/png",
      };
    }
    return {};
  });
  const destroy = mock.fn();
  const client = { send, destroy } as unknown as S3Client;
  return { client, sentCommands, destroy };
}

test("upload: envia PutObjectCommand com bucket, chave, corpo, content type e metadados", async () => {
  const { client, sentCommands } = createFakeClient();
  const provider = new S3StorageProvider(config, { client });

  const result = await provider.upload({
    key: "users/123/avatar.png",
    body: Buffer.from("fake-image-bytes"),
    contentType: "image/png",
    metadata: { uploadedBy: "123" },
  });

  assert.equal(result.key, "users/123/avatar.png");
  assert.equal(result.url, undefined);
  assert.equal(sentCommands.length, 1);

  const command = sentCommands[0] as PutObjectCommand;
  assert.ok(command instanceof PutObjectCommand);
  assert.equal(command.input.Bucket, "fgc-monitor");
  assert.equal(command.input.Key, "users/123/avatar.png");
  assert.equal(command.input.ContentType, "image/png");
  assert.deepEqual(command.input.Metadata, { uploadedBy: "123" });
  assert.ok(Buffer.isBuffer(command.input.Body));
});

test("delete: envia DeleteObjectCommand com a chave", async () => {
  const { client, sentCommands } = createFakeClient();
  const provider = new S3StorageProvider(config, { client });

  await provider.delete("users/123/avatar.png");

  assert.equal(sentCommands.length, 1);
  const command = sentCommands[0] as DeleteObjectCommand;
  assert.ok(command instanceof DeleteObjectCommand);
  assert.equal(command.input.Bucket, "fgc-monitor");
  assert.equal(command.input.Key, "users/123/avatar.png");
});

test("getSignedUrl: usa a função de assinatura com GetObjectCommand e tempo de expiração", async () => {
  const { client } = createFakeClient();
  const signCalls: { command: unknown; options?: { expiresIn?: number } }[] = [];
  const signUrl = mock.fn(
    async (_client: unknown, command: unknown, options?: { expiresIn?: number }) => {
      signCalls.push({ command, options });
      return "https://signed-url";
    },
  ) as unknown as typeof getSignedUrl;

  const provider = new S3StorageProvider(config, { client, signUrl });

  const url = await provider.getSignedUrl("users/123/avatar.png", 120);

  assert.equal(url, "https://signed-url");
  assert.equal(signCalls.length, 1);

  const command = signCalls[0].command as GetObjectCommand;
  assert.ok(command instanceof GetObjectCommand);
  assert.equal(command.input.Bucket, "fgc-monitor");
  assert.equal(command.input.Key, "users/123/avatar.png");
  assert.equal(signCalls[0].options?.expiresIn, 120);
});

test("getSignedUrl: usa expiração padrão de 3600s quando não informada", async () => {
  const { client } = createFakeClient();
  const signCalls: { command: unknown; options?: { expiresIn?: number } }[] = [];
  const signUrl = mock.fn(
    async (_client: unknown, command: unknown, options?: { expiresIn?: number }) => {
      signCalls.push({ command, options });
      return "https://signed-url";
    },
  ) as unknown as typeof getSignedUrl;

  const provider = new S3StorageProvider(config, { client, signUrl });

  await provider.getSignedUrl("users/123/avatar.png");

  assert.equal(signCalls[0].options?.expiresIn, 3600);
});

test("download: envia GetObjectCommand e retorna stream e content type", async () => {
  const { client, sentCommands } = createFakeClient({
    getObjectContentType: "image/png",
  });
  const provider = new S3StorageProvider(config, { client });

  const download = await provider.download("users/123/avatar.png");

  assert.equal(sentCommands.length, 1);
  const command = sentCommands[0] as GetObjectCommand;
  assert.ok(command instanceof GetObjectCommand);
  assert.equal(command.input.Bucket, "fgc-monitor");
  assert.equal(command.input.Key, "users/123/avatar.png");
  assert.equal(download.contentType, "image/png");
  assert.ok(download.body instanceof ReadableImpl);
});

test("ensureBucket: cria o bucket quando ele não existe", async () => {
  const { client, sentCommands } = createFakeClient({ headBucketThrows: true });
  const provider = new S3StorageProvider(config, { client });

  await provider.ensureBucket();

  assert.equal(sentCommands.length, 2);
  assert.ok(sentCommands[0] instanceof HeadBucketCommand);
  assert.ok(sentCommands[1] instanceof CreateBucketCommand);
  assert.equal((sentCommands[1] as CreateBucketCommand).input.Bucket, "fgc-monitor");
});

test("ensureBucket: não recria o bucket quando ele já existe", async () => {
  const { client, sentCommands } = createFakeClient();
  const provider = new S3StorageProvider(config, { client });

  await provider.ensureBucket();

  assert.equal(sentCommands.length, 1);
  assert.ok(sentCommands[0] instanceof HeadBucketCommand);
});

test("destroy: libera o client S3", () => {
  const { client, destroy } = createFakeClient();
  const provider = new S3StorageProvider(config, { client });

  provider.destroy();

  assert.equal(destroy.mock.callCount(), 1);
});
