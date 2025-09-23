import React from 'react'

export default function EnvBadge() {
  // Vite exposes import.meta.env.DEV and import.meta.env.MODE
  const isDev = Boolean(import.meta.env.DEV)
  const mode = import.meta.env.MODE || (isDev ? 'development' : 'production')

  const style: React.CSSProperties = {
    position: 'fixed',
    right: 12,
    bottom: 12,
    padding: '6px 10px',
    borderRadius: 6,
    background: isDev ? 'rgba(220, 38, 38, 0.95)' : 'rgba(16, 185, 129, 0.95)',
    color: 'white',
    fontWeight: 700,
    fontSize: 12,
    zIndex: 9999,
    boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
  }

  return (
    <div style={style} title={`Mode: ${mode}`} aria-hidden>
      {isDev ? 'DEV' : 'PROD'}
    </div>
  )
}
