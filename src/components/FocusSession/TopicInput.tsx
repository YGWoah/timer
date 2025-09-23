export default function TopicInput({ topic, onChange }: { topic: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
      <input
        value={topic}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What will you focus on?"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  )
}
