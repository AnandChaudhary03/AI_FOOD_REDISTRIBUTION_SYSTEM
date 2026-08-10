import React from 'react'
import { useTranslation } from 'react-i18next'

export default function AnnaSetuLogo({ size = 40, showText = true, subtitle = null }) {
  const { t } = useTranslation()
  const displaySubtitle = subtitle !== null ? subtitle : t('tagline')

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
      {/* Lotus/Sprout Icon */}
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
          <path d="M6 24C10 27 20 27 28 22C30 20.8 30.5 19 29 18.5C27 18 24 20 18 21.5C14 22.5 10 22 6 24Z" fill="#35135F" />
          {/* Center Lotus / Sprout Petals */}
          <path d="M18 6C15 11 14 16 18 21C22 16 21 11 18 6Z" fill="#B42B72" />
          <path d="M12 11C11 15 12 18 15 21C14 17 14 14 12 11Z" fill="#FF6B52" />
          <path d="M24 11C25 15 24 18 21 21C22 17 22 14 24 11Z" fill="#FF875F" />
        </svg>
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: Math.max(14, size * 0.48), fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            AnnaSetu
          </span>
          {displaySubtitle && (
            <span style={{ fontSize: Math.max(9, size * 0.22), color: '#FF6B52', fontWeight: 700, letterSpacing: '0.01em', marginTop: '0.2rem', whiteSpace: 'nowrap' }}>
              {displaySubtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
