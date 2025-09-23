import React, { useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { saveFocusSession } from '@/services/focusSessions'

function randChoice<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const DEFAULT_TOPICS = [
  'Write blog post',
  'Study algorithms',
  'Email triage',
  'Refactor payments',
  'Design landing page',
  'Prepare slides',
  'Read PRs',
  'Code katas',
  'Customer support',
  'Weekly review',
]

function generateSessionsForDay(date: Date, count: number, topics: string[]) {
  const sessions: Array<{ topic: string; startTime: Date; endTime: Date; durationSeconds: number }> = []
  // create sessions across the day between 8:00 and 21:00
  for (let i = 0; i < count; i++) {
    const hourMinutes = randInt(8 * 60, 21 * 60) // minutes from midnight
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    start.setMinutes(hourMinutes + randInt(0, 15))

    const p = Math.random()
    let duration: number
    if (p < 0.3) duration = randInt(5, 15) * 60
    else if (p < 0.8) duration = randInt(25, 50) * 60
    else duration = randInt(50, 120) * 60

    const end = new Date(start.getTime() + duration * 1000)
    sessions.push({ topic: randChoice(topics), startTime: start, endTime: end, durationSeconds: duration })
  }

  sessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

  // ensure no overlaps by nudging later sessions forward
  for (let i = 1; i < sessions.length; i++) {
    const prev = sessions[i - 1]
    if (sessions[i].startTime < prev.endTime) {
      const breakMinutes = randInt(1, 30)
      const newStart = new Date(prev.endTime.getTime() + breakMinutes * 60 * 1000)
      const dur = sessions[i].durationSeconds
      sessions[i].startTime = newStart
      sessions[i].endTime = new Date(newStart.getTime() + dur * 1000)
    }
  }

  return sessions
}

export default function SeedDataPage() {
  const { user } = useAuth()
  const [days, setDays] = useState<number>(14)
  const [avgPerDay, setAvgPerDay] = useState<number>(3)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 })
  const [log, setLog] = useState<string[]>([])
  const topicsRef = useRef<string | null>(null)
  const abortRef = useRef(false)

  async function runSeed() {
    if (!user) return setLog((l) => [...l, 'You must be signed in to seed data.'])
    setRunning(true)
    setLog([])
    abortRef.current = false

    const topics = topicsRef.current ? topicsRef.current.split('\n').map(t => t.trim()).filter(Boolean) : DEFAULT_TOPICS

    const now = new Date()
    const allSessions: Array<ReturnType<typeof generateSessionsForDay>[0]> = [] as any

    for (let d = 0; d < days; d++) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - d)
      const count = Math.max(0, Math.round(avgPerDay + (Math.random() * 2 - 1)))
      const sessions = generateSessionsForDay(day, count, topics)
      allSessions.push(...sessions)
    }

    setProgress({ done: 0, total: allSessions.length })

    for (let i = 0; i < allSessions.length; i++) {
      if (abortRef.current) break
      const s = allSessions[i]
      try {
        await saveFocusSession({
          userId: user.uid,
          topic: s.topic,
          startTime: s.startTime,
          endTime: s.endTime,
          durationSeconds: s.durationSeconds,
          seededBy: 'client-seed',
        } as any)
        setLog((l) => [...l, `ok: ${s.topic} @ ${s.startTime.toISOString()}`])
      } catch (err: any) {
        setLog((l) => [...l, `err: ${err?.message ?? String(err)}`])
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }))
      // small delay to avoid hitting rate limits
      await new Promise((r) => setTimeout(r, 120))
    }

    setRunning(false)
    setLog((l) => [...l, 'Seeding finished'])
  }

  function cancel() {
    abortRef.current = true
    setRunning(false)
    setLog((l) => [...l, 'Aborted by user'])
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Dev Seeder (client-side)</h2>
      <p>This page writes seeded focus sessions using the currently signed-in user. Only use in dev.</p>
      {!user && <div style={{ color: 'red' }}>Sign in first to seed data.</div>}

      <div style={{ marginTop: 12 }}>
        <label>Days (backwards): </label>
        <input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} min={1} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Avg sessions / day: </label>
        <input type="number" value={avgPerDay} onChange={(e) => setAvgPerDay(Number(e.target.value))} min={0} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Custom topics (one per line, optional):</label>
        <br />
        <textarea onChange={(e) => (topicsRef.current = e.target.value)} rows={4} cols={40} placeholder="Optional topics..." />
      </div>

      <div style={{ marginTop: 12 }}>
        {!running ? (
          <button onClick={runSeed} disabled={!user}>Start seeding</button>
        ) : (
          <button onClick={cancel}>Cancel</button>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        Progress: {progress.done} / {progress.total}
      </div>

      <div style={{ marginTop: 12, maxHeight: 300, overflow: 'auto', background: '#111', color: '#fff', padding: 8 }}>
        {log.map((l, i) => (
          <div key={i} style={{ fontSize: 12 }}>{l}</div>
        ))}
      </div>
    </div>
  )
}
