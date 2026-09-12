import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { MobileDrawer } from "../components/layout/MobileDrawer";
import { useUIStore } from "../store/useUIStore";

function renderDrawer() {
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route element={<MobileDrawer />}>
          <Route path="/dashboard" element={<p>Dashboard</p>} />
          <Route path="/investimentos" element={<p>Investimentos</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("MobileDrawer", () => {
  beforeEach(() => {
    useUIStore.setState({ isMobileMenuOpen: false });
  });

  it("fecha o menu lateral ao clicar no botão fechar", () => {
    useUIStore.setState({ isMobileMenuOpen: true });
    renderDrawer();

    fireEvent.click(screen.getByRole("button", { name: "Fechar menu de navegação" }));
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("fecha o menu lateral ao clicar num link de navegação", () => {
    useUIStore.setState({ isMobileMenuOpen: true });
    renderDrawer();

    fireEvent.click(screen.getByRole("link", { name: "Meus Investimentos" }));
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("fecha o menu lateral ao pressionar Escape", () => {
    useUIStore.setState({ isMobileMenuOpen: true });
    renderDrawer();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });
});
