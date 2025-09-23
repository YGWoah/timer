export default function Notice({ notice }: { notice: { type: 'success' | 'error'; text: string } | null }) {
  if (!notice) return null
  return (
    <div className={`p-3 rounded ${notice.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
      {notice.text}
    </div>
  )
}
