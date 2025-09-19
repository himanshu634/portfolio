import { FloatingNav } from "./ui/floating-navbar";
import { Mail, Linkedin, Github } from "lucide-react";

export function Header() {
  return (
    <FloatingNav
      navItems={[
        {
          name: "Email",
          link: "mailto:himanshumendapra@gmail.com",
          icon: <Mail className="size-6 stroke-[1.5px]" />,
        },
        {
          name: "LinkedIn",
          link: "https://www.linkedin.com/in/himanshu-mendapara-a732051aa/",
          icon: <Linkedin className="size-6 stroke-[1.5px]" />,
        },
        {
          name: "GitHub",
          link: "https://github.com/himanshu634",
          icon: <Github className="size-6 stroke-[1.5px]" />,
        },
        {
          name: "X",
          link: "https://x.com/himanshu_942",
          icon: <X />,
        },
      ]}
    />
  );
}

function X() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
    </svg>
  );
}
