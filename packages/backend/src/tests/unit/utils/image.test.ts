import assert from "node:assert/strict";
import { test } from "node:test";
import { detectImageFormat, getImageDimensions } from "../../../utils/image.js";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** PNG mínimo com header IHDR válido nas posições fixas (apenas para o parser). */
function createPngBuffer(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(24);
  PNG_SIGNATURE.copy(buffer, 0);
  buffer.writeUInt32BE(13, 8); // tamanho do chunk IHDR
  buffer.write("IHDR", 12, "ascii");
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return buffer;
}

/** JPEG mínimo: SOI (FFD8) + SOF0 (FFC0) com dimensões. */
function createJpegBuffer(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(11);
  buffer[0] = 0xff;
  buffer[1] = 0xd8;
  buffer[2] = 0xff;
  buffer[3] = 0xc0;
  buffer.writeUInt16BE(17, 4); // comprimento do segmento SOF0
  buffer[6] = 0x08; // precisão
  buffer.writeUInt16BE(height, 7);
  buffer.writeUInt16BE(width, 9);
  return buffer;
}

/** JPEG com segmento APP0 antes do SOF0 — testa o avanço por segmento. */
function createJpegWithApp0(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(2 + 2 + 16 + 2 + 9);
  buffer[0] = 0xff;
  buffer[1] = 0xd8;
  buffer[2] = 0xff;
  buffer[3] = 0xe0; // APP0
  buffer.writeUInt16BE(16, 4); // comprimento (2 bytes de comprimento + 14 de payload)
  buffer.write("JFIF\0", 6, "ascii");
  buffer.writeUInt16BE(0x0101, 11); // versão
  buffer[13] = 0x00; // unidades
  buffer[20] = 0xff;
  buffer[21] = 0xc0; // SOF0
  buffer.writeUInt16BE(17, 22);
  buffer[24] = 0x08;
  buffer.writeUInt16BE(height, 25);
  buffer.writeUInt16BE(width, 27);
  return buffer;
}

test("detectImageFormat: reconhece PNG pela assinatura", () => {
  assert.equal(detectImageFormat(createPngBuffer(1, 1)), "png");
});

test("detectImageFormat: reconhece JPEG pela assinatura", () => {
  assert.equal(detectImageFormat(createJpegBuffer(1, 1)), "jpeg");
});

test("detectImageFormat: retorna null para formatos desconhecidos", () => {
  assert.equal(detectImageFormat(Buffer.from("GIF89a...")), null);
  assert.equal(detectImageFormat(Buffer.from("aleatório")), null);
  assert.equal(detectImageFormat(Buffer.alloc(0)), null);
});

test("getImageDimensions: lê dimensões de um PNG real (1x1)", () => {
  // 1x1 PNG válido (base64 conhecido).
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );

  const info = getImageDimensions(png);

  assert.deepEqual(info, { format: "png", width: 1, height: 1 });
});

test("getImageDimensions: lê dimensões de PNG sintético", () => {
  const info = getImageDimensions(createPngBuffer(200, 300));

  assert.deepEqual(info, { format: "png", width: 200, height: 300 });
});

test("getImageDimensions: lê dimensões de JPEG sintético", () => {
  const info = getImageDimensions(createJpegBuffer(400, 100));

  assert.deepEqual(info, { format: "jpeg", width: 400, height: 100 });
});

test("getImageDimensions: percorre segmentos até encontrar o SOF0 (com APP0)", () => {
  const info = getImageDimensions(createJpegWithApp0(350, 250));

  assert.deepEqual(info, { format: "jpeg", width: 350, height: 250 });
});

test("getImageDimensions: retorna null para PNG truncado ou sem IHDR", () => {
  assert.equal(getImageDimensions(createPngBuffer(1, 1).subarray(0, 12)), null);

  const withoutIhdr = Buffer.from(PNG_SIGNATURE);
  assert.equal(getImageDimensions(withoutIhdr), null);
});

test("getImageDimensions: retorna null para buffer que não é imagem", () => {
  assert.equal(getImageDimensions(Buffer.from("não é imagem")), null);
});
