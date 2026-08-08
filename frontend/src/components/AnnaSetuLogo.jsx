import React from 'react'

export default function AnnaSetuLogo({ size = 42, showText = true, subtitle = "Bridging Surplus. Ending Hunger." }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #7c3aed 0%, #f97316 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(124, 58, 237, 0.35)',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bridge / Arch curves */}
          <path d="M3 17C6 11 18 11 21 17" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M6 14C8.5 10 15.5 10 18 14" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" />
          {/* Wheat / Sprout icon center */}
          <path d="M12 20V8M12 8L9 11M12 8L15 11M12 12L8.5 14.5M12 12L15.5 14.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="5" r="1.5" fill="#fed7aa" />
        </svg>
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: size * 0.48, fontWeight: 900, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #7c3aed 0%, #f97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
            AnnaSetu
          </span>
          {subtitle && (
            <span style={{ fontSize: size * 0.22, color: '#f97316', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '0.2rem' }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
