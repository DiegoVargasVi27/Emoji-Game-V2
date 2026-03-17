# Emoji Wordle

Un juego de acertijos diario donde los jugadores deben adivinar una secuencia oculta de 5 emojis pertenecientes a una categoria tematica. Inspirado en Wordle, cada intento revela que emojis son correctos, estan en otra posicion o estan ausentes, usando fichas de colores como guia para encontrar la respuesta en 6 intentos o menos.

## Funcionalidades

- Desafio diario generado a partir de la fecha, de modo que todos los jugadores reciben el mismo puzzle
- Feedback estilo Wordle: correcto (verde), posicion incorrecta (amarillo), ausente (gris)
- Teclado de emojis filtrado por la categoria del dia
- Revelacion de fichas con animaciones en cascada
- Estadisticas de rachas de victorias/derrotas y distribucion de intentos
- Resultados compartibles como grilla de colores en texto
- Estado del juego persistido en localStorage entre sesiones

## Stack Tecnologico

| Tecnologia | Rol |
|---|---|
| React 19 | Renderizado de UI |
| TypeScript 5.9 | Modo estricto con `noUncheckedIndexedAccess` |
| Zustand 5 | Manejo de estado liviano (vanilla store) |
| Vite 7 | Servidor de desarrollo y bundler |
| Vitest 4 | Testing unitario con entorno jsdom |
| Tailwind CSS 3 | Estilos basados en utilidades |
| ESLint 9 | Configuracion flat con enforcement de limites arquitectonicos |

## Arquitectura

El proyecto sigue Domain-Driven Design (DDD) con una arquitectura de capas estricta. Cada capa tiene una unica direccion de dependencia, enforceada a nivel de linting:

```
dominio  -->  aplicacion  -->  infraestructura
                               presentacion
```

- **Dominio** contiene la logica central del juego como clases puras de TypeScript: Value Objects (`Emoji`, `EmojiSequence`, `GameDate`, `CategoryId`, `GuessResult`), agregados (`Game`, `PlayerStats`), servicios de dominio (`GuessEvaluator`, `ShareTextGenerator`) e interfaces de puertos (`IGameRepository`, `IChallengeGenerator`, `IStatsRepository`). No tiene dependencias externas.
- **Aplicacion** implementa los casos de uso (`StartDailyGame`, `SubmitGuess`, `GetPlayerStats`) que orquestan los objetos de dominio a traves de interfaces de puertos.
- **Infraestructura** provee los adaptadores concretos: `LocalStorageGameRepository`, `LocalStorageStatsRepository` para persistencia, `SeededChallengeGenerator` para puzzles diarios deterministicos usando un PRNG con semilla (djb2 + Mulberry32).
- **Presentacion** contiene los componentes React, un store de Zustand, view models y mappers que traducen el estado de dominio a datos listos para la UI.

Una regla de ESLint `no-restricted-imports` previene que la capa de dominio importe codigo de infraestructura o presentacion, manteniendo la direccion de dependencias limpia en tiempo de CI.

## Estructura del Proyecto

```
src/
  domain/
    model/          # Value Objects y agregados (Game, Emoji, PlayerStats, ...)
    services/       # Servicios de dominio (GuessEvaluator, ShareTextGenerator)
    ports/          # Interfaces para dependencias externas
  application/      # Casos de uso (StartDailyGame, SubmitGuess, GetPlayerStats)
  infrastructure/
    catalog/        # Datos de categorias de emojis
    challenge/      # Generador de desafios diarios con semilla
    persistence/    # Adaptadores de localStorage
  presentation/
    components/     # Componentes React (Board, Keyboard, modales, layout)
    hooks/          # Hooks personalizados de React
    mappers/        # Transformaciones de dominio a ViewModel
    pages/          # Componentes a nivel de pagina
    store/          # Store de Zustand
    viewmodels/     # Definiciones de tipos de ViewModel
tests/
  domain/           # Tests de Value Objects y agregados
  application/      # Tests de casos de uso
  infrastructure/   # Tests de adaptadores
  presentation/     # Tests de mappers
```

## Primeros Pasos

```bash
# Clonar el repositorio
git clone https://github.com/diegovargas/emoji-game-v2.git
cd emoji-game-v2

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev

# Ejecutar tests
npm test

# Build para produccion
npm run build
```

## Testing

La suite de tests contiene **92 tests** distribuidos en 16 archivos, organizados por capa arquitectonica:

- **Tests de dominio** (10 archivos): Cobertura exhaustiva de invariantes de Value Objects, transiciones de estado del juego, logica de evaluacion de intentos (incluyendo manejo de emojis duplicados), estadisticas del jugador con seguimiento de rachas, y generacion de texto para compartir.
- **Tests de aplicacion** (3 archivos): Tests de casos de uso con stubs de repositorios en memoria, verificando el comportamiento de orquestacion incluyendo actualizacion de estadisticas al completar una partida.
- **Tests de infraestructura** (3 archivos): Tests de adaptadores para round-trips de persistencia en localStorage y determinismo del generador con semilla.
- **Tests de presentacion** (1 archivo): Tests de GameStateMapper asegurando la traduccion correcta de dominio a viewmodel.

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con UI interactiva
npm run test:ui
```

## Decisiones de Diseno

**Value Objects inmutables con constructores privados** -- Los tipos de dominio como `Emoji`, `EmojiSequence`, `GameDate` y `GuessResult` enforzan sus invariantes a traves de metodos factory (`create`, `restore`) y exponen unicamente propiedades de solo lectura. Esto hace que los estados invalidos sean irrepresentables.

**Game como agregado inmutable** -- `Game.submitGuess()` retorna una nueva instancia de `Game` en lugar de mutar el estado. Esto elimina toda una clase de bugs relacionados con estado mutable compartido y hace que la logica del juego sea trivialmente testeable.

**Puertos y adaptadores** -- El dominio define interfaces (`IGameRepository`, `IChallengeGenerator`, `IStatsRepository`) que la infraestructura implementa. Los casos de uso dependen unicamente de estas abstracciones, lo que facilita reemplazar localStorage por un backend con API o testear con stubs en memoria.

**Desafios diarios deterministicos** -- El `SeededChallengeGenerator` usa un hash djb2 del string de la fecha como semilla para un PRNG Mulberry32. Esto garantiza que todos los jugadores vean el mismo puzzle en un dia dado sin necesidad de un servidor.

**Evaluacion de intentos en dos pasadas** -- `GuessEvaluator` usa un enfoque de mapa de frecuencias con dos pasadas (primero correctos, luego en posicion incorrecta) para manejar correctamente emojis duplicados en los intentos, el mismo algoritmo que Wordle usa para letras duplicadas.

**Path aliases para limites entre capas** -- Los path aliases de TypeScript (`@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*`) hacen que los imports sean legibles y refuerzan las capas arquitectonicas a nivel de codigo.
