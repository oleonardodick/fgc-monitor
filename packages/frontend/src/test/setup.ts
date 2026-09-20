import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom não implementa URL.createObjectURL/revokeObjectURL.
// Os testes de foto de perfil precisam dessas APIs (stub global).
if (typeof URL.createObjectURL !== "function") {
  Object.defineProperty(URL, "createObjectURL", {
    value: () => "blob:mock",
    configurable: true,
    writable: true,
  });
}
if (typeof URL.revokeObjectURL !== "function") {
  Object.defineProperty(URL, "revokeObjectURL", {
    value: () => undefined,
    configurable: true,
    writable: true,
  });
}

afterEach(() => {
  cleanup();
});
