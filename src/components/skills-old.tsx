const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      skills: [
        { name: "React", level: 90, color: "from-blue-400 to-blue-600" },
        { name: "Next.js", level: 85, color: "from-gray-400 to-gray-600" },
        { name: "TypeScript", level: 80, color: "from-blue-500 to-blue-700" },
        { name: "Tailwind CSS", level: 90, color: "from-cyan-400 to-cyan-600" },
        {
          name: "JavaScript",
          level: 90,
          color: "from-yellow-400 to-yellow-600",
        },
      ],
    },
    {
      title: "Backend",
      skills: [
        { name: "Node.js", level: 85, color: "from-green-400 to-green-600" },
        { name: "Express.js", level: 80, color: "from-gray-400 to-gray-600" },
        { name: "Python", level: 75, color: "from-blue-400 to-yellow-500" },
        { name: "MongoDB", level: 80, color: "from-green-500 to-green-700" },
        { name: "PostgreSQL", level: 75, color: "from-blue-500 to-blue-700" },
      ],
    },
    {
      title: "Tools & Others",
      skills: [
        { name: "Git", level: 85, color: "from-orange-400 to-red-500" },
        { name: "Docker", level: 70, color: "from-blue-400 to-blue-600" },
        { name: "AWS", level: 65, color: "from-orange-400 to-orange-600" },
        { name: "Figma", level: 75, color: "from-purple-400 to-pink-500" },
        { name: "Linux", level: 80, color: "from-gray-400 to-gray-600" },
      ],
    },
  ];

  return (
    <section id="skills" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            My <span className="text-purple-400">Skills</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Here are the technologies and tools I work with to bring ideas to
            life
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-colors duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-6 text-center">
                  {category.title}
                </h3>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 font-medium">
                          {skill.name}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {skill.level}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${skill.color} h-2 rounded-full transition-all duration-1000 ease-out group-hover:scale-105`}
                          style={{
                            width: `${skill.level}%`,
                            animation: `slideIn 2s ease-out ${
                              skillIndex * 0.1
                            }s both`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional skills or certifications */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold text-white mb-8">
              Currently Learning
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Rust",
                "GraphQL",
                "Three.js",
                "Kubernetes",
                "Blockchain",
                "Machine Learning",
              ].map((skill, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full text-sm hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 cursor-default"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
