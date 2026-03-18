import { PageLayout } from '@presentation/components/layout/PageLayout.tsx'

const projectTech = ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand', 'Vitest', 'React Router']

const architecture = ['Clean Architecture', 'Domain-Driven Design', 'SOLID']

const personalStack = ['.NET', 'C#', 'Java', 'SQL', 'React', 'TypeScript', 'REST APIs']

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/DiegoVargasVi27',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/diego-pastor-vargas-vidaurre/',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

export default function AboutMePage() {
  return (
    <PageLayout title="Sobre Mí">
      <div className="prose prose-invert max-w-none">
        {/* 1. Introduction */}
        <section className="mb-10 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl mx-auto mb-4">
            D
          </div>
          <h2 className="text-2xl font-bold mb-1">Diego Vargas Vidaurre</h2>
          <p className="text-lg text-gray-400">
            Analista Programador · Software Developer Junior
          </p>
        </section>

        {/* 2. Philosophy */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Filosofía</h2>
          <p className="text-gray-300 mb-3">
            La tecnología avanza a un ritmo que no para, y cada avance trae
            nuevos desafíos. Creo que lo más importante no es dominar una
            herramienta específica, sino desarrollar la capacidad de adaptarse:
            entender los fundamentos, cuestionar las decisiones y estar
            dispuesto a aprender formas nuevas de trabajar.
          </p>
          <p className="text-gray-300">
            Este proyecto refleja esa mentalidad: explorar arquitecturas,
            patrones y tecnologías modernas como una forma de seguir creciendo
            como desarrollador. No se trata de tener todas las respuestas,
            sino de hacer las preguntas correctas.
          </p>
        </section>

        {/* 3. Skills & Expertise */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Skills &amp; Expertise</h2>

          <h3 className="text-lg font-semibold mb-2">Tecnologías del Proyecto</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {projectTech.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-900/50 text-blue-300 border border-blue-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-2">Arquitectura</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {architecture.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-purple-900/50 text-purple-300 border border-purple-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-2">Stack Personal</h3>
          <div className="flex flex-wrap gap-2">
            {personalStack.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-gray-700/50 text-gray-300 border border-gray-600 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* 4. Social Links */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Links</h2>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] min-w-[44px] px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors no-underline"
              >
                {link.icon}
                {link.name}
              </a>
            ))}
          </div>
        </section>

        {/* 5. Contact CTA */}
        <section className="text-center bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-2">¿Querés contactarme?</h2>
          <p className="text-gray-300 mb-4">
            Si te interesa colaborar en un proyecto, discutir arquitectura
            frontend o simplemente charlar sobre desarrollo, no dudes en
            escribirme.
          </p>
          <a
            href="https://www.linkedin.com/in/diego-pastor-vargas-vidaurre/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 min-h-[44px] min-w-[44px] px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors no-underline"
          >
            Contactar por LinkedIn
          </a>
        </section>
      </div>
    </PageLayout>
  )
}
