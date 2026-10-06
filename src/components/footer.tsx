import { ScrollToTop } from "@/components/scroll-to-top";

export const CONTACT_LINKS = [
  { label: "Email", href: "mailto:himanshumendapra@gmail.com" },
  { label: "GitHub", href: "https://github.com/himanshu634" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/himanshu-mendapara-a732051aa/",
  },
  { label: "X", href: "https://x.com/himanshu_btw" },
];

export function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 font-semibold ${className}`}>
      {CONTACT_LINKS.map(({ label, href }) => (
        <li key={label}>
          <a
            href={href}
            {...(href.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-block py-3 underline decoration-2 underline-offset-[3px] hover:bg-now"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** `showContact={false}` on the home page, whose lede row already lists the links. */
export function Footer({ showContact = true }: { showContact?: boolean }) {
  return (
    <footer
      id={showContact ? "contact" : undefined}
      className="mt-16 flex flex-wrap items-center justify-between gap-x-8 border-t-2 border-border py-6 text-[15px]"
    >
      <p className="font-semibold">
        © {new Date().getFullYear()} Himanshu Mendapara, Ahmedabad
      </p>
      <div className="flex flex-wrap items-center gap-x-8">
        {showContact && <ContactLinks />}
        <ScrollToTop />
      </div>
    </footer>
  );
}
