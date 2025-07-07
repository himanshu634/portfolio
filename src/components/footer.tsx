"use client";

import Link from "next/link";
import { Mail, Linkedin, Github, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bg-foreground/10 backdrop-blur-xs bottom-6 right-6 z-50 p-2 rounded-xl hover:rounded-full border shadow-lg floating transition-all transform duration-300 ${
        visible ? "scale-100" : "scale-0 pointer-events-none"
      }`}
      aria-label="Go to top"
    >
      <ArrowUp className="size-6" />
    </button>
  );
}

export function Footer() {
  return (
    <>
      <footer className="w-full py-8 pb-0 px-4 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-6">
            <Link
              href="mailto:himanshumendapra@gmail.com"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <Mail className="size-5 stroke-[1.5px]" />
              <span>Email</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/himanshu-mendapara-a732051aa/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <Linkedin className="size-5 stroke-[1.5px]" />
              <span>LinkedIn</span>
            </Link>
            <Link
              href="https://github.com/himanshu634"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <Github className="size-5 stroke-[1.5px]" />
              <span>GitHub</span>
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Made with ❤️ by Himanshu Mendapara.
          </p>
        </div>
      </footer>
      <ScrollToTopButton />
    </>
  );
}

export default Footer;
