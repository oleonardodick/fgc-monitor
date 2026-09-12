import { beforeEach, describe, expect, it } from "vitest";
import { useUIStore } from "../store/useUIStore";

describe("useUIStore", () => {
  beforeEach(() => {
    useUIStore.setState({ isMobileMenuOpen: false });
  });

  it("começa com o menu lateral fechado", () => {
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("toggleMobileMenu alterna entre aberto e fechado", () => {
    useUIStore.getState().toggleMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true);

    useUIStore.getState().toggleMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("closeMobileMenu força o menu lateral a ficar fechado", () => {
    useUIStore.getState().toggleMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true);

    useUIStore.getState().closeMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });
});
