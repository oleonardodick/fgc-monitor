export interface NavigationItem {
  label: string;
  to: string;
}

/** Links principais, compartilhados entre o Header e o MobileDrawer. */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Meus Investimentos", to: "/investimentos" },
];

export interface FooterLink {
  label: string;
  href: string;
}

/** Links do rodapé, alinhados horizontalmente. */
export const FOOTER_LINKS: FooterLink[] = [
  { label: "Legal", href: "/legal" },
  { label: "Privacy", href: "/privacidade" },
  { label: "Terms", href: "/termos" },
  { label: "Contact", href: "/contato" },
];
