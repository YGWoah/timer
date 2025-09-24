import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { saveFocusSession } from '@/services/focusSessions'
import { useTimer } from '@/context/TimerContext'
import { generateRandomTopic, formatSeconds } from '@/utils/generators'
import Notice from './FocusSession/Notice'
import TopicInput from './FocusSession/TopicInput'
import TimerDisplay from './FocusSession/TimerDisplay'
import Controls from './FocusSession/Controls'

export default function FocusSession() {
  const { user } = useAuth()
  const [startTime, setStartTime] = useState<Date | null>(null)

  const { elapsedSeconds: elapsed, isRunning: running, start: timerStart, stop: timerStop, reset: timerReset , topic, setTopic } = useTimer()
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])


  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!notice) return
    const id = window.setTimeout(() => setNotice(null), 4000)
    return () => clearTimeout(id)
  }, [notice])

  async function handleStart() {
    if (!user) return
    if (startTime) {
      timerStart()
      return
    }
    if (!topic) {
      const generated = generateRandomTopic()
      setTopic(generated)
    }
    const now = new Date()
    setStartTime(now)
    timerStart()
  }

  async function finishSession(finalElapsed?: number) {
    if (!user || !startTime) return

    let durationSeconds = typeof finalElapsed === 'number' ? finalElapsed : undefined
    if (durationSeconds === undefined) {
      durationSeconds = running ? timerStop() : elapsed
    }

    const end = new Date(startTime.getTime() + durationSeconds * 1000)

    try {
      const payload = {
        userId: user.uid,
        topic,
        startTime,
        endTime: end,
        durationSeconds,
      }
      await saveFocusSession(payload)
      setStartTime(null)
      timerReset()
      setTopic('')
      setNotice({ type: 'success', text: 'Focus session saved' })
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to save session', { uid: user.uid, topic, startTime, end, durationSeconds, err })
      const message = err?.code === 'permission-denied' || /permission/i.test(err?.message || '')
        ? 'Permission denied saving session — check your Firestore security rules (ensure authenticated users can write their own sessions).'
        : 'Failed to save session. See console for details.'
      setNotice({ type: 'error', text: message })
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Focus Session</h3>
      <div className="space-y-4">
        <Notice notice={notice} />
        <TopicInput topic={topic} onChange={setTopic} />
        <TimerDisplay elapsed={formatSeconds(elapsed)} running={running} />
        <Controls
          running={running}
          onStart={handleStart}
          onPause={() => timerStop()}
          onFinish={async () => {
            const final = timerStop()
            await finishSession(final)
          }}
          disabledFinish={!startTime}
          disabledStart={!user}
        />
      </div>
    </div>
  )
}
