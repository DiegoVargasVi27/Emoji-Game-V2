import { PageLayout } from '@presentation/components/layout/PageLayout.tsx'

const techStack = [
  'React 19',
  'TypeScript',
  'Vite',
  'Tailwind CSS',
  'Vitest',
  'React Router',
  'Domain-Driven Design',
  'Clean Architecture',
]

const layers = [
  {
    name: 'Domain',
    description: 'Entidades, value objects y reglas de negocio del juego.',
    color: 'bg-purple-600',
  },
  {
    name: 'Application',
    description: 'Casos de uso que orquestan la lógica del dominio.',
    color: 'bg-blue-600',
  },
  {
    name: 'Infrastructure',
    description: 'Repositorios, almacenamiento local y servicios externos.',
    color: 'bg-amber-600',
  },
  {
    name: 'Presentation',
    description: 'Componentes React, hooks y estado de la UI.',
    color: 'bg-green-600',
  },
]

export default function AboutProjectPage() {
  return (
    <PageLayout title="Sobre el Proyecto">
      <div className="prose prose-invert max-w-none">
        {/* 1. Hero con tagline */}
        <section className="mb-10 text-center">
          <p className="text-4xl mb-4">🎯</p>
          <h2 className="text-2xl font-bold mb-2">Emoji Wordle</h2>
          <p className="text-lg text-gray-300">
            Un juego de adivinanza de emojis construido con arquitectura limpia,
            TypeScript estricto y las mejores prácticas de desarrollo frontend.
          </p>
        </section>

        {/* 2. Tech Stack */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* 3. Architecture Overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Arquitectura</h2>
          <p className="text-gray-300 mb-4">
            El proyecto sigue una arquitectura por capas inspirada en
            Clean Architecture y Domain-Driven Design, con una separación
            estricta de responsabilidades:
          </p>
          <div className="space-y-3">
            {layers.map((layer, index) => (
              <div key={layer.name} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-lg ${layer.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                  >
                    {index + 1}
                  </div>
                  {index < layers.length - 1 && (
                    <div className="w-0.5 h-4 bg-gray-600 mt-1" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-white">{layer.name}</p>
                  <p className="text-gray-400 text-sm">{layer.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-4 italic">
            La regla de dependencia fluye hacia adentro: Presentation →
            Infrastructure → Application → Domain.
          </p>
        </section>

        {/* 4. Why DDD */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">¿Por qué DDD?</h2>
          <p className="text-gray-300 mb-3">
            Aunque un juego de emojis podría resolverse con un simple script,
            este proyecto es una demostración deliberada de cómo aplicar
            Domain-Driven Design en el frontend:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>
              <strong>Entidades ricas</strong>: los emojis, intentos y el
              tablero son objetos de dominio con comportamiento propio.
            </li>
            <li>
              <strong>Value Objects inmutables</strong>: garantizan consistencia
              y facilitan el testing.
            </li>
            <li>
              <strong>Casos de uso explícitos</strong>: cada acción del juego
              pasa por un caso de uso que orquesta la lógica.
            </li>
            <li>
              <strong>Inversión de dependencias</strong>: el dominio no conoce
              React, localStorage ni ningún detalle de infraestructura.
            </li>
          </ul>
        </section>

        {/* 5. AI-Assisted Development */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">
            Desarrollo Asistido por IA
          </h2>
          <p className="text-gray-300 mb-3">
            Este proyecto fue desarrollado bajo una premisa clara: la IA es
            una herramienta de precisión, no un sustituto del criterio
            profesional. Al igual que un arquitecto diseña cada plano antes
            de que la maquinaria entre en acción, aquí cada decisión de
            diseño, cada patrón y cada abstracción fue definida
            deliberadamente por el desarrollador. La IA aceleró la
            construcción, pero nunca decidió dónde iban los cimientos.
          </p>
          <p className="text-gray-300">
            Las herramientas evolucionan, pero los fundamentos permanecen.
            Dominar la arquitectura, los patrones de diseño y los principios
            de ingeniería es lo que permite dirigir cualquier herramienta con
            criterio — hoy es IA, mañana será otra cosa. El conocimiento no
            se delega.
          </p>
        </section>

        {/* 6. GitHub Link */}
        <section className="text-center">
          <a
            href="https://github.com/DiegoVargasVi27/Emoji-Game-V2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 min-h-[44px] min-w-[44px] px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors no-underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Ver en GitHub
          </a>
        </section>
      </div>
    </PageLayout>
  )
}