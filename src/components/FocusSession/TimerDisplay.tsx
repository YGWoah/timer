export default function TimerDisplay({ elapsed, running }: { elapsed: string; running: boolean }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-mono font-bold text-gray-900 mb-1">{elapsed}</div>
      <div className="text-sm text-gray-500">{running ? 'Session in progress' : 'Ready to start'}</div>
    </div>
  )
}
