import { AdSlot } from './AdSlot.tsx'

interface AdSidePanelProps {
  adSlot: string
  side: 'left' | 'right'
}

export function AdSidePanel({ adSlot, side }: AdSidePanelProps) {
  const pubId = import.meta.env.VITE_ADSENSE_PUB_ID
  if (!pubId) return null

  return (
    <aside
      className={`hidden lg:block sticky top-24 flex-shrink-0 self-start ${
        side === 'left' ? 'ml-4' : 'mr-4'
      }`}
      aria-label="Advertisement"
    >
      <AdSlot
        adSlot={adSlot}
        adFormat="vertical"
        style={{ width: 160, height: 600 }}
      />
    </aside>
  )
}
