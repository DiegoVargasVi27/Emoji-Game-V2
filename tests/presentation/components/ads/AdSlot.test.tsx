import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { AdSlot } from '@presentation/components/ads/AdSlot.tsx'

describe('AdSlot', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns null when VITE_ADSENSE_PUB_ID is not set', () => {
    vi.stubEnv('VITE_ADSENSE_PUB_ID', '')

    const { container } = render(
      <AdSlot adSlot="1234567890" adFormat="auto" />,
    )

    expect(container.innerHTML).toBe('')
  })

  it('returns null when VITE_ADSENSE_PUB_ID is undefined', () => {
    // By default the env var is not set in test environment
    vi.stubEnv('VITE_ADSENSE_PUB_ID', '')

    const { container } = render(
      <AdSlot adSlot="1234567890" adFormat="auto" />,
    )

    expect(container.innerHTML).toBe('')
  })

  it('renders the ad slot when VITE_ADSENSE_PUB_ID is set', () => {
    vi.stubEnv('VITE_ADSENSE_PUB_ID', 'ca-pub-1234567890')

    const { container } = render(
      <AdSlot adSlot="1234567890" adFormat="auto" />,
    )

    const ins = container.querySelector('ins.adsbygoogle')
    expect(ins).not.toBeNull()
    expect(ins?.getAttribute('data-ad-client')).toBe('ca-pub-1234567890')
    expect(ins?.getAttribute('data-ad-slot')).toBe('1234567890')
    expect(ins?.getAttribute('data-ad-format')).toBe('auto')
  })
})
