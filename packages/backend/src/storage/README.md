# Storage

Sistema de **storage plugável** implementado com o padrão **Strategy / Adapter**.
As regras de negócio dependem apenas do contrato `IStorageProvider`
(`src/storage/types.ts`) — trocar de provider **não exige alterar nenhuma regra de negócio**.

O driver ativo é definido por `STORAGE_DRIVER` (ex.: `minio`).

## Estrutura

```
src/storage/
├── types.ts                 # IStorageProvider, StorageFile, StorageUploadResult, StorageConfig
├── storageFactory.ts        # seleciona e instancia o provider ativo (Strategy)
└── providers/
    ├── index.ts             # "registro" de providers disponíveis
    └── s3StorageProvider.ts # adaptador S3-compatível (MinIO / AWS S3)
```

## Como adicionar um novo provider (ex.: Cloudinary)

1. Adicione o driver ao tipo `StorageDriver` em `src/storage/types.ts`
   (ex.: `"cloudinary"`) e à lista `SUPPORTED_DRIVERS` em
   `src/config/storage.ts`.
2. Implemente `IStorageProvider` em um novo arquivo em
   `src/storage/providers/` (ex.: `cloudinaryStorageProvider.ts`).
3. Exporte a classe no barrel `src/storage/providers/index.ts`.
4. Adicione um `case` no switch de `src/storage/storageFactory.ts`.
5. Se o driver precisar de variáveis de ambiente próprias, carregue-as em
   `src/config/storage.ts`.
6. Registre os pacotes npm necessários no `package.json` e neste README
   (novos pacotes de terceiros exigem decisão do desenvolvedor — ver
   `docs/ai/AGENT_GUIDE.md`).

## Driver MinIO (padrão)

Usa `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`.

- **Upload**: `PutObjectCommand`
- **Delete**: `DeleteObjectCommand`
- **URL assinada (download temporário)**: `getSignedUrl` + `GetObjectCommand`
- **Leitura (proxy/download)**: `download` + `GetObjectCommand` (retorna stream + content type)
- **Bucket**: criado automaticamente no startup (best-effort) via
  `ensureBucket()` — MinIO não cria buckets por padrão.

Variáveis de ambiente (ver `packages/backend/.env.example`):

```
STORAGE_DRIVER=minio
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=fgc-monitor
S3_USE_SSL=false
```

## Uso no Fastify

O plugin `src/plugins/storage.ts` decora a instância com `fastify.storage`
(o provider ativo):

```ts
// dentro de um controller/service:
await request.server.storage.upload({
  key: "users/123/avatar.png",
  body: buffer,
  contentType: "image/png",
});

const url = await request.server.storage.getSignedUrl("users/123/avatar.png", 3600);
```
