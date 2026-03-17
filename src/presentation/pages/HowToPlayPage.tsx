import { Link } from 'react-router-dom'
import { PageLayout } from '@presentation/components/layout/PageLayout.tsx'

export default function HowToPlayPage() {
  return (
    <PageLayout title="Cómo Jugar">
      <div className="prose prose-invert max-w-none">
        {/* 1. Objetivo */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Objetivo</h2>
          <p className="text-gray-300">
            Adiviná la secuencia secreta de 5 emojis en 6 intentos o menos.
            Cada día hay un nuevo desafío con una combinación única de emojis
            para descifrar.
          </p>
        </section>

        {/* 2. Cómo Funciona */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Cómo Funciona</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Seleccioná 5 emojis del teclado para formar tu intento.</li>
            <li>Presioná el botón de enviar para confirmar tu combinación.</li>
            <li>Revisá las pistas de colores para cada emoji.</li>
            <li>Usá las pistas para mejorar tu próximo intento.</li>
            <li>Tenés 6 intentos para adivinar la secuencia correcta.</li>
          </ol>
        </section>

        {/* 3. Código de Colores */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Código de Colores</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center text-2xl shrink-0">
                ✓
              </div>
              <div>
                <p className="font-semibold text-green-400">Verde</p>
                <p className="text-gray-300 text-sm">
                  El emoji es correcto y está en la posición correcta.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center text-2xl shrink-0">
                ~
              </div>
              <div>
                <p className="font-semibold text-yellow-400">Amarillo</p>
                <p className="text-gray-300 text-sm">
                  El emoji es correcto pero está en la posición equivocada.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center text-2xl shrink-0">
                ✗
              </div>
              <div>
                <p className="font-semibold text-gray-400">Gris</p>
                <p className="text-gray-300 text-sm">
                  El emoji no está en la secuencia secreta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Categorías de Emojis */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Categorías de Emojis</h2>
          <p className="text-gray-300 mb-3">
            Los emojis están organizados por categorías para facilitar la
            búsqueda:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Caritas y Emociones</li>
            <li>Animales y Naturaleza</li>
            <li>Comida y Bebida</li>
            <li>Actividades y Deportes</li>
            <li>Viajes y Lugares</li>
            <li>Objetos</li>
          </ul>
        </section>

        {/* 5. Desafío Diario */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Desafío Diario</h2>
          <p className="text-gray-300">
            Cada día a medianoche se genera un nuevo puzzle. Todos los jugadores
            reciben la misma secuencia, así que podés comparar tus resultados
            con amigos. Tu progreso y estadísticas se guardan localmente en tu
            navegador.
          </p>
        </section>

        {/* 6. Compartir Resultados */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Compartir Resultados</h2>
          <p className="text-gray-300">
            Al terminar una partida, podés compartir tu resultado con un patrón
            de colores que muestra tu camino hacia la solución, sin revelar los
            emojis. Copiá el resultado y compartilo en redes sociales o con tus
            amigos.
          </p>
        </section>

        {/* 7. Tips y Estrategias */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Tips y Estrategias</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>
              Empezá con emojis variados de distintas categorías para maximizar
              las pistas.
            </li>
            <li>
              Prestá atención a los amarillos: sabés que el emoji está, solo
              tenés que reubicarlo.
            </li>
            <li>
              Descartá categorías enteras si varios emojis salen grises.
            </li>
            <li>
              Usá los primeros intentos para explorar y los últimos para
              confirmar.
            </li>
          </ul>
        </section>

        {/* 8. CTA Jugar Ahora */}
        <section className="text-center">
          <Link
            to="/"
            className="inline-block min-h-[44px] min-w-[44px] px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-colors no-underline"
          >
            Jugar Ahora
          </Link>
        </section>
      </div>
    </PageLayout>
  )
}
