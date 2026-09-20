/*
 * Pacotes npm necessários:
 * - Nenhum pacote de terceiros — parser puro de PNG/JPEG (sem dependência externa).
 */
export type ImageFormat = "png" | "jpeg";

export interface ImageInfo {
  format: ImageFormat;
  width: number;
  height: number;
}

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Detecta o formato da imagem pelos "magic bytes" (assinatura do arquivo). */
export function detectImageFormat(buffer: Buffer): ImageFormat | null {
  if (
    buffer.length >= PNG_SIGNATURE.length &&
    buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)
  ) {
    return "png";
  }

  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpeg";
  }

  return null;
}

/**
 * Lê as dimensões (largura × altura) de uma imagem PNG ou JPEG.
 * Retorna `null` quando o buffer não é uma imagem PNG/JPEG válida.
 */
export function getImageDimensions(buffer: Buffer): ImageInfo | null {
  const format = detectImageFormat(buffer);
  if (!format) {
    return null;
  }

  return format === "png" ? readPngDimensions(buffer) : readJpegDimensions(buffer);
}

/**
 * PNG: assinatura (8 bytes) + chunk IHDR (length 4 bytes + "IHDR" 4 bytes)
 * seguido de width (4 bytes BE) e height (4 bytes BE). Posições fixas.
 */
function readPngDimensions(buffer: Buffer): ImageInfo | null {
  if (buffer.length < 24 || buffer.toString("ascii", 12, 16) !== "IHDR") {
    return null;
  }

  return {
    format: "png",
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

/**
 * JPEG: percorre os segmentos (APPn, COM, DQT etc.) até encontrar um marcador
 * SOF (Start of Frame: C0-C3, C5-C7, C9-CB, CD-CF), que contém altura e largura.
 */
function readJpegDimensions(buffer: Buffer): ImageInfo | null {
  let offset = 2; // após o SOI (FF D8)

  while (offset + 4 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    // Marcadores podem ter 0xFF de preenchimento repetido.
    while (offset < buffer.length && buffer[offset] === 0xff) {
      offset += 1;
    }
    if (offset >= buffer.length) {
      break;
    }

    const marker = buffer[offset];
    offset += 1;

    // Marcadores standalone (sem comprimento): TEM e RSTn/SOI/EOI.
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      continue;
    }

    const isSof =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isSof) {
      if (offset + 6 > buffer.length) {
        return null;
      }
      return {
        format: "jpeg",
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      };
    }

    // Demais segmentos: pula pelo comprimento declarado (inclui os 2 bytes dele mesmo).
    if (offset + 2 > buffer.length) {
      return null;
    }
    offset += buffer.readUInt16BE(offset);
  }

  return null;
}
