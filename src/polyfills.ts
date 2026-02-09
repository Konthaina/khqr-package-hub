import { Buffer } from "./shims/buffer";

const globalAny = globalThis as typeof globalThis & { Buffer?: typeof Buffer };

if (!globalAny.Buffer) {
  globalAny.Buffer = Buffer;
}
