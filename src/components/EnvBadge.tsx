export default function EnvBadge() {
  // Vite exposes import.meta.env.DEV and import.meta.env.MODE
  const isDev = Boolean(import.meta.env.DEV)
  const mode = import.meta.env.MODE || (isDev ? 'development' : 'production')

  const baseClasses = 'fixed right-3 bottom-3 z-50 px-2.5 py-1.5 rounded-md text-white font-bold text-xs shadow-lg'
  const bgClass = isDev ? 'bg-red-600' : 'bg-emerald-600'

  return (
    <div className={`${baseClasses} ${bgClass}`} title={`Mode: ${mode}`} aria-hidden>
      {isDev ? 'DEV' : 'PROD'}
    </div>
  )
}
