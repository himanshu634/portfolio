const Experience = () => {
  const experiences = [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Solutions Inc.",
      period: "2023 - Present",
      description: [
        "Led development of scalable web applications using React and Node.js",
        "Implemented microservices architecture reducing system response time by 40%",
        "Mentored junior developers and conducted code reviews",
        "Collaborated with cross-functional teams to deliver high-quality products",
      ],
      technologies: ["React", "Node.js", "AWS", "MongoDB", "Docker"],
      type: "Full-time",
    },
    {
      title: "Full Stack Developer",
      company: "Digital Innovations",
      period: "2022 - 2023",
      description: [
        "Developed and maintained multiple client-facing web applications",
        "Optimized database queries resulting in 30% performance improvement",
        "Integrated third-party APIs and payment gateways",
        "Participated in agile development processes and sprint planning",
      ],
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
      type: "Full-time",
    },
    {
      title: "Frontend Developer",
      company: "Creative Web Studio",
      period: "2021 - 2022",
      description: [
        "Built responsive and interactive user interfaces using React",
        "Collaborated with designers to implement pixel-perfect designs",
        "Implemented state management solutions using Redux",
        "Conducted user testing and implemented feedback improvements",
      ],
      technologies: ["React", "Redux", "Sass", "JavaScript", "Figma"],
      type: "Full-time",
    },
    {
      title: "Web Development Intern",
      company: "StartupXYZ",
      period: "2021",
      description: [
        "Assisted in developing company&apos;s main web application",
        "Fixed bugs and implemented minor features",
        "Learned version control and collaborative development practices",
        "Participated in daily standups and team meetings",
      ],
      technologies: ["HTML", "CSS", "JavaScript", "Git"],
      type: "Internship",
    },
  ];

  const education = [
    {
      degree: "Bachelor of Technology in Computer Science",
      institution: "University of Technology",
      period: "2018 - 2022",
      description:
        "Graduated with honors. Specialized in software engineering and web technologies.",
      achievements: [
        "CGPA: 8.5/10",
        "Best Project Award for Final Year Project",
        "Active member of Coding Club",
      ],
    },
  ];

  return (
    <section id="experience" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            My <span className="text-purple-400">Journey</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            A timeline of my professional growth and learning experiences
          </p>

          {/* Experience Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-white mb-8 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0h2a2 2 0 012 2v6.5l-8 2-8-2V8a2 2 0 012-2h2"
                />
              </svg>
              Professional Experience
            </h3>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-500/30"></div>

              {experiences.map((exp, index) => (
                <div key={index} className="relative mb-8 pl-12">
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 w-3 h-3 bg-purple-500 rounded-full border-2 border-slate-900"></div>

                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-colors duration-300">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-1">
                          {exp.title}
                        </h4>
                        <div className="text-purple-400 font-medium mb-1">
                          {exp.company}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{exp.period}</span>
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                            {exp.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ul className="text-gray-300 mb-4 space-y-2">
                      {exp.description.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <span className="text-purple-400 mr-2 mt-1.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded-full border border-slate-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-8 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
              Education
            </h3>

            {education.map((edu, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
              >
                <h4 className="text-xl font-semibold text-white mb-2">
                  {edu.degree}
                </h4>
                <div className="text-purple-400 font-medium mb-1">
                  {edu.institution}
                </div>
                <div className="text-gray-400 text-sm mb-3">{edu.period}</div>
                <p className="text-gray-300 mb-4">{edu.description}</p>

                <div className="space-y-2">
                  <h5 className="text-white font-medium">Key Achievements:</h5>
                  <ul className="text-gray-300">
                    {edu.achievements.map((achievement, achieveIndex) => (
                      <li key={achieveIndex} className="flex items-start">
                        <span className="text-purple-400 mr-2 mt-1.5">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
