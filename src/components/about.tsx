const About = () => {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light text-gray-900 text-center mb-16 tracking-tight">
            About
          </h2>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <p className="text-gray-600 text-lg leading-relaxed">
                I&apos;m a passionate Full Stack Developer with a love for
                creating innovative web applications. I believe in the power of
                continuous learning and staying curious about new technologies.
              </p>

              <p className="text-gray-600 text-lg leading-relaxed">
                My journey in web development started with curiosity and has
                evolved into a passion for building user-centric applications
                that solve real-world problems. I enjoy working with modern
                technologies and always strive to write clean, maintainable
                code.
              </p>

              <p className="text-gray-600 text-lg leading-relaxed">
                When I&apos;m not coding, you can find me exploring new
                technologies, contributing to open-source projects, or sharing
                knowledge with the developer community.
              </p>
            </div>

            <div className="space-y-8">
              <div className="border border-gray-200 rounded-sm p-8 bg-white">
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Location</span>
                    <span className="text-gray-900 font-medium">India</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Experience</span>
                    <span className="text-gray-900 font-medium">2+ Years</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Focus</span>
                    <span className="text-gray-900 font-medium">
                      Full Stack Development
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Availability</span>
                    <span className="text-green-600 font-medium text-sm">
                      Open to opportunities
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-gray-900 font-medium mb-4 text-sm uppercase tracking-wide">
                  Areas of Interest
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-sm">
                    Web3
                  </span>
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-sm">
                    AI/ML
                  </span>
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-sm">
                    Open Source
                  </span>
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-sm">
                    DevOps
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
