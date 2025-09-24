export default function Controls({
  running,
  onStart,
  onPause,
  onFinish,
  disabledFinish,
  disabledStart,
}: {
  running: boolean
  onStart: () => void
  onPause: () => void
  onFinish: () => void
  disabledFinish?: boolean
  disabledStart?: boolean
}) {
  return (
    <div className="flex justify-center space-x-3">
      {!running ? (
        <>
          <button onClick={onStart} disabled={disabledStart} className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Start</button>
          <button onClick={onFinish} disabled={disabledFinish} className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors">Finish</button>
        </>
      ) : (
        <>
          <button onClick={onPause} className="px-5 py-2 bg-yellow-500 text-white font-medium rounded-md cursor-pointer hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors">Pause</button>
          <button onClick={onFinish} className="px-4 py-2 bg-green-600 text-white font-medium rounded-md cursor-pointer hover:bg-green-700 transition-colors">Finish</button>
        </>
      )}
    </div>
  )
}
