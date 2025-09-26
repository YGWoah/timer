export default function Notice({ notice }: { notice: { type: 'success' | 'error' | 'loading'; text: string } | null }) {
  if (!notice) return null
  if (notice.type === 'loading') {
    return (
      <div className="flex items-center gap-3 p-3 rounded bg-sky-50 border border-sky-200 text-sky-800">
        <svg className="w-4 h-4 animate-spin text-sky-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span>{notice.text}</span>
      </div>
    )
  }

  return (
    <div className={`p-3 rounded ${notice.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
      {notice.text}
    </div>
  )
}
