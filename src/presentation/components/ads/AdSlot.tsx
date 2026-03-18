import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

interface AdSlotProps {
  adSlot: string
  adFormat: string
  className?: string
  style?: CSSProperties
}

export function AdSlot({ adSlot, adFormat, className, style }: AdSlotProps) {
  const pubId = import.meta.env.VITE_ADSENSE_PUB_ID
  if (!pubId) return null

  const containerRef = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    pushed.current = true

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // Ad blocker or AdSense unavailable — fail silently
    }
  }, [])

  return (
    <div ref={containerRef} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={pubId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-test={import.meta.env.DEV ? 'on' : undefined}
      />
    </div>
  )
}
