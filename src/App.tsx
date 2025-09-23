import { Routes, Route } from 'react-router-dom'
import React from 'react'
import './App.css'
import Navigator from '@/components/Navigator'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Dashboard from '@/pages/Dashboard'
import SessionsPage from '@/pages/Sessions'
import SeedDataPage from '@/pages/SeedData'
import EnvBadge from '@/components/EnvBadge'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { TimerProvider } from '@/context/TimerContext'
import { Navigate } from 'react-router-dom'
import { useTimer } from '@/context/TimerContext'
import { formatSeconds } from '@/utils/generators'
import { useEffect } from 'react'

function DocumentTitleUpdater() {
  const { user } = useAuth()
  const { elapsedSeconds } = useTimer()

  useEffect(() => {
    if (user) {
      document.title = `Timer — ${formatSeconds(elapsedSeconds)}`
    } else {
      document.title = 'timer'
    }
  }, [user, elapsedSeconds])

  return null
}

function App() {
  return (
    <AuthProvider>
      <TimerProvider>
        <DocumentTitleUpdater />
        <div className="App">
          <Navigator />
          <EnvBadge />
          <main>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* dev-only seeder (only mounted during development) */}
              {import.meta.env.DEV && <Route path="/__seed" element={<SeedDataPage />} />}
              <Route
                path="/app"
                element={<RequireAuth><Dashboard /></RequireAuth>}
              />
              <Route
                path="/sessions"
                element={<RequireAuth><SessionsPage /></RequireAuth>}
              />
            </Routes>
          </main>
        </div>
      </TimerProvider>
    </AuthProvider>
  )
}

export default App

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: 24 }}>Loading...</div>
  if (!user) return <Navigate to="/" replace />
  return children
}
