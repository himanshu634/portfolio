"use client";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Himanshu Mendapara
              </h3>
              <p className="text-gray-600 text-sm max-w-md">
                Full Stack Developer passionate about creating thoughtful
                digital experiences.
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex space-x-6">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm"
                >
                  LinkedIn
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm"
                >
                  Twitter
                </a>
              </div>

              <button
                onClick={scrollToTop}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm text-left md:text-right"
              >
                Back to top ↑
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-gray-600 text-sm">
              © {currentYear} Himanshu Mendapara. Built with Next.js & Tailwind
              CSS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
