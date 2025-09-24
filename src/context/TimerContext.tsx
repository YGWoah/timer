import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

type TimerContextValue = {
  elapsedSeconds: number
  isRunning: boolean
  topic: string
  setTopic: (topic: string) => void
  start: () => void
  stop: () => number
  reset: () => void
}

const TimerContext = createContext<TimerContextValue | undefined>(undefined)

const STORAGE_ELAPSED = 'timer:elapsedSeconds'
const STORAGE_STARTED_AT = 'timer:startedAt'
const STORAGE_TOPIC = 'timer:lastTopic'

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    const v = localStorage.getItem(STORAGE_ELAPSED)
    return v ? parseInt(v, 10) : 0
  })

  const [topic, setTopic] = useState<string>(() => {
    const t = localStorage.getItem(STORAGE_TOPIC)
    return t ? t : ''
  })
  // If startedAt exists in storage it means the timer was running before reload/route change
  const startedAtStorage = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_STARTED_AT) : null
  const [isRunning, setIsRunning] = useState<boolean>(() => !!startedAtStorage)

  const startedAtRef = useRef<number | null>(startedAtStorage ? Number(startedAtStorage) : null)
  const intervalRef = useRef<number | null>(null)
  // base elapsed seconds at the moment the current running period started
  const baseAtStartRef = useRef<number>(0)

  // Helper to start the ticking interval
  const startInterval = () => {
    if (intervalRef.current != null) return
    intervalRef.current = window.setInterval(() => {
      const started = startedAtRef.current
      if (started == null) return
      const extra = Math.floor((Date.now() - started) / 1000)
      setElapsedSeconds(baseAtStartRef.current + extra)
    }, 250)
  }

  useEffect(() => {
    // If there was a startedAt in storage, prepare base and start ticking
    if (startedAtRef.current) {
      // elapsedSeconds read from storage is the base accumulated before this running period
      baseAtStartRef.current = elapsedSeconds
      const topic = localStorage.getItem(STORAGE_TOPIC)
      if (topic) setTopic(topic)
      startInterval()
      setIsRunning(true)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    // we intentionally run this effect only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // persist elapsed every time it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_ELAPSED, String(elapsedSeconds))
  }, [elapsedSeconds])

  const start = () => {
    if (isRunning) return
    const now = Date.now()
    // when starting a running period, use the current elapsed as the base
    baseAtStartRef.current = elapsedSeconds
    startedAtRef.current = now
    localStorage.setItem(STORAGE_STARTED_AT, String(now))
    localStorage.setItem(STORAGE_TOPIC, topic)
    setIsRunning(true)
    startInterval()
  }

  const stop = () => {
    if (!isRunning) return elapsedSeconds
    let final = elapsedSeconds
    if (startedAtRef.current != null) {
      const extra = Math.floor((Date.now() - startedAtRef.current) / 1000)
      final = baseAtStartRef.current + extra
      setElapsedSeconds(final)
      localStorage.setItem(STORAGE_ELAPSED, String(final))
    }
    startedAtRef.current = null
    baseAtStartRef.current = 0
    localStorage.removeItem(STORAGE_STARTED_AT)
    localStorage.removeItem(STORAGE_TOPIC)
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return final
  }

  const reset = () => {
    setElapsedSeconds(0)
    localStorage.removeItem(STORAGE_ELAPSED)
    startedAtRef.current = null
    localStorage.removeItem(STORAGE_STARTED_AT)
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    if (!isRunning) return
    localStorage.setItem(STORAGE_TOPIC, topic)
  }, [isRunning, topic])

  return (
    <TimerContext.Provider value={{ elapsedSeconds, isRunning, topic, setTopic, start, stop, reset }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimer must be used within TimerProvider')
  return ctx
}

export default TimerContext
