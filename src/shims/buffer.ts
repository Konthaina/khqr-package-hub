const stringToUtf8Bytes = (input: string) => {
  const bytes: number[] = [];
  for (let i = 0; i < input.length; i += 1) {
    const codePoint = input.charCodeAt(i);
    if (codePoint < 0x80) {
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      bytes.push(0xc0 | (codePoint >> 6));
      bytes.push(0x80 | (codePoint & 0x3f));
    } else if (codePoint < 0xd800 || codePoint >= 0xe000) {
      bytes.push(0xe0 | (codePoint >> 12));
      bytes.push(0x80 | ((codePoint >> 6) & 0x3f));
      bytes.push(0x80 | (codePoint & 0x3f));
    } else {
      i += 1;
      const next = input.charCodeAt(i);
      const surrogate = 0x10000 + (((codePoint & 0x3ff) << 10) | (next & 0x3ff));
      bytes.push(0xf0 | (surrogate >> 18));
      bytes.push(0x80 | ((surrogate >> 12) & 0x3f));
      bytes.push(0x80 | ((surrogate >> 6) & 0x3f));
      bytes.push(0x80 | (surrogate & 0x3f));
    }
  }
  return bytes;
};

const ensureUtf8 = (encoding?: string) => {
  if (!encoding) return;
  const normalized = encoding.toLowerCase();
  if (normalized !== "utf8" && normalized !== "utf-8") {
    throw new Error(`Unsupported encoding: ${encoding}`);
  }
};

export const Buffer = {
  from(input: string | Uint8Array | number[], encoding?: string) {
    if (typeof input === "string") {
      ensureUtf8(encoding);
      return Uint8Array.from(stringToUtf8Bytes(input));
    }
    if (input instanceof Uint8Array) {
      return input;
    }
    if (Array.isArray(input)) {
      return Uint8Array.from(input);
    }
    return Uint8Array.from(input as ArrayLike<number>);
  },
  byteLength(input: string, encoding?: string) {
    ensureUtf8(encoding);
    return stringToUtf8Bytes(input).length;
  },
};

export default Buffer;
