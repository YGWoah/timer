import { Routes, Route } from 'react-router-dom'
import React from 'react'
import './App.css'
import Navigator from '@/components/Navigator'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Dashboard from '@/pages/Dashboard'
import SessionsPage from '@/pages/Sessions'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { Navigate } from 'react-router-dom'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navigator />
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
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
