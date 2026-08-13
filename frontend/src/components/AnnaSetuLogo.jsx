import React from 'react'
import { useTranslation } from 'react-i18next'

export default function AnnaSetuLogo({ size = 40, showText = true, subtitle = null, textColor = null }) {
  const { t } = useTranslation()
  const displaySubtitle = subtitle !== null ? subtitle : t('tagline')

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
      {/* Lotus/Sprout Icon with Vibrant High-Contrast Colors */}
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          flexShrink: 0,
          position: 'relative'
        }}
      >
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Hand base curve */}
          <path d="M6 24C10 27 20 27 28 22C30 20.8 30.5 19 29 18.5C27 18 24 20 18 21.5C14 22.5 10 22 6 24Z" fill="#22c55e" opacity="0.95" />
          {/* Center Lotus / Sprout Petals */}
          <path d="M18 6C15 11 14 16 18 21C22 16 21 11 18 6Z" fill="#FF6B52" />
          <path d="M12 11C11 15 12 18 15 21C14 17 14 14 12 11Z" fill="#FF875F" />
          <path d="M24 11C25 15 24 18 21 21C22 17 22 14 24 11Z" fill="#FFD166" />
        </svg>
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Vibrant Warm Saffron-Coral Brand Gradient Text: 100% Visible on ALL Pages (Landing, Login, Register, Dashboards) */}
          <span
            style={{
              fontSize: Math.max(14, size * 0.48),
              fontWeight: 900,
              background: textColor ? undefined : 'linear-gradient(135deg, #FF6B52 0%, #FF875F 50%, #FFD166 100%)',
              color: textColor || undefined,
              WebkitBackgroundClip: textColor ? undefined : 'text',
              WebkitTextFillColor: textColor ? undefined : 'transparent',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.35))'
            }}
          >
            AnnaSetu
          </span>
          {displaySubtitle && (
            <span style={{ fontSize: Math.max(9, size * 0.22), color: '#FF875F', fontWeight: 700, letterSpacing: '0.01em', marginTop: '0.2rem', whiteSpace: 'nowrap' }}>
              {displaySubtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
