const Experience = () => {
  const experiences = [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Solutions Inc.",
      period: "2023 - Present",
      description: "Led development of scalable web applications using React and Node.js. Implemented microservices architecture and mentored junior developers.",
      technologies: ["React", "Node.js", "AWS", "MongoDB"],
    },
    {
      title: "Full Stack Developer", 
      company: "Digital Innovations",
      period: "2022 - 2023",
      description: "Developed and maintained multiple client-facing web applications. Optimized database queries and integrated third-party APIs.",
      technologies: ["Next.js", "TypeScript", "PostgreSQL"],
    },
    {
      title: "Frontend Developer",
      company: "Creative Web Studio", 
      period: "2021 - 2022",
      description: "Built responsive and interactive user interfaces using React. Collaborated with designers to implement pixel-perfect designs.",
      technologies: ["React", "Redux", "Sass", "JavaScript"],
    },
  ];

  const education = {
    degree: "Bachelor of Technology in Computer Science",
    institution: "University of Technology",
    period: "2018 - 2022",
    description: "Graduated with honors. Specialized in software engineering and web technologies."
  };

  return (
    <section id="experience" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light text-gray-900 text-center mb-4 tracking-tight">
            Experience
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Professional journey and educational background
          </p>

          <div className="space-y-12">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-8">Work Experience</h3>
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-6 relative">
                    <div className="absolute w-2 h-2 bg-gray-400 rounded-full -left-1.5 top-2"></div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {exp.title}
                        </h4>
                        <div className="text-gray-600 text-sm">
                          {exp.company} • {exp.period}
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-sm"
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

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-8">Education</h3>
              <div className="border-l-2 border-gray-200 pl-6 relative">
                <div className="absolute w-2 h-2 bg-gray-400 rounded-full -left-1.5 top-2"></div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {education.degree}
                    </h4>
                    <div className="text-gray-600 text-sm">
                      {education.institution} • {education.period}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {education.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
