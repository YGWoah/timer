import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { saveFocusSession } from '@/services/focusSessions'

export default function FocusSession() {
  const { user } = useAuth()
  const [running, setRunning] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [topic, setTopic] = useState('')
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (running && startTime) {
      timerRef.current = window.setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [running, startTime])

  function formatSeconds(sec: number) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  async function handleStart() {
    if (!user) return
    if (!topic) {
      const t = window.prompt('Enter topic for this focus session:')
      if (!t) return
      setTopic(t)
    }
    const now = new Date()
    setStartTime(now)
    setRunning(true)
    setElapsed(0)
  }

  async function handleStop() {
    if (!user || !startTime) return
    const end = new Date()
    const durationSeconds = Math.floor((end.getTime() - startTime.getTime()) / 1000)
    setRunning(false)

    // save to Firestore
    try {
      const payload = {
        userId: user.uid,
        topic,
        startTime,
        endTime: end,
        durationSeconds,
      }
      await saveFocusSession(payload)
      // reset
      setStartTime(null)
      setElapsed(0)
      setTopic('')
      alert('Focus session saved')
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to save session', { uid: user.uid, topic, startTime, end, durationSeconds, err })
      const message = err?.code === 'permission-denied' || /permission/i.test(err?.message || '')
        ? 'Permission denied saving session — check your Firestore security rules (ensure authenticated users can write their own sessions).' 
        : 'Failed to save session. See console for details.'
      alert(message)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Focus Session</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic
          </label>
          <input 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            placeholder="What will you focus on?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-mono font-bold text-gray-900 mb-1">
            {formatSeconds(elapsed)}
          </div>
          <div className="text-sm text-gray-500">
            {running ? 'Session in progress' : 'Ready to start'}
          </div>
        </div>
        
        <div className="flex justify-center">
          {!running ? (
            <button 
              onClick={handleStart} 
              disabled={!user}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Start Focus
            </button>
          ) : (
            <button 
              onClick={handleStop}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Stop Focus
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
