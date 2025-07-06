import { FloatingNav } from "./ui/floating-navbar";

export function Header() {
  return (
    <FloatingNav
      navItems={[
        { name: "Home", link: "/" },
        { name: "About", link: "/about" },
        { name: "Contact", link: "/contact" },
      ]}
    />
  );
}
