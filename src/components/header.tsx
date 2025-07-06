import { FloatingNav } from "./ui/floating-navbar";
import { Mail, Linkedin, Github } from "lucide-react";

export function Header() {
  return (
    <FloatingNav
      navItems={[
        {
          name: "Email",
          link: "mailto:himanshumendapra@gmail.com",
          icon: <Mail className="size-6" />,
        },
        {
          name: "LinkedIn",
          link: "https://www.linkedin.com/in/himanshu-mendapara-a732051aa/",
          icon: <Linkedin className="size-6" />,
        },
        {
          name: "GitHub",
          link: "https://github.com/himanshu634",
          icon: <Github className="size-6" />,
        },
      ]}
    />
  );
}
