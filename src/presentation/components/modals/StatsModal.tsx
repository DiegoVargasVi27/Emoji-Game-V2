import type { PlayerStats } from '@domain/model/PlayerStats.ts'
import { ModalOverlay } from './ModalOverlay.tsx'

interface StatsModalProps {
  stats: PlayerStats
  onClose: () => void
}

export function StatsModal({ stats, onClose }: StatsModalProps) {
  const winPercent =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0

  const distribution = stats.guessDistribution
  const maxCount = Math.max(
    distribution[1],
    distribution[2],
    distribution[3],
    distribution[4],
    distribution[5],
    distribution[6],
    1,
  )

  return (
    <ModalOverlay isOpen={true} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Estadísticas</h2>

        <div className="grid grid-cols-4 gap-2 mb-6">
          <StatItem value={stats.gamesPlayed} label="Jugadas" />
          <StatItem value={winPercent} label="% Victorias" />
          <StatItem value={stats.currentStreak} label="Racha actual" />
          <StatItem value={stats.bestStreak} label="Mejor racha" />
        </div>

        <h3 className="text-lg font-semibold mb-3 text-left">
          Distribución de intentos
        </h3>
        <div className="space-y-1">
          {([1, 2, 3, 4, 5, 6] as const).map((num) => {
            const count = distribution[num]
            const widthPercent = Math.max((count / maxCount) * 100, 8)
            return (
              <div key={num} className="flex items-center gap-2">
                <span className="text-sm w-3 text-right">{num}</span>
                <div
                  className="bg-gray-600 rounded px-2 py-0.5 text-sm text-right font-medium min-w-[2rem]"
                  style={{ width: `${widthPercent}%` }}
                >
                  {count}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ModalOverlay>
  )
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  )
}
