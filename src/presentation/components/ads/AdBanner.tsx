import { AdSlot } from './AdSlot.tsx'

interface AdBannerProps {
  show: boolean
  adSlot: string
}

export function AdBanner({ show, adSlot }: AdBannerProps) {
  const pubId = import.meta.env.VITE_ADSENSE_PUB_ID
  if (!pubId || !show) return null

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 flex justify-center pb-safe z-30 bg-gray-900/80 backdrop-blur-sm py-2">
      <AdSlot
        adSlot={adSlot}
        adFormat="horizontal"
        style={{ width: 320, height: 50 }}
      />
    </div>
  )
}
