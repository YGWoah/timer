import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import FocusSession from '@/components/FocusSession'
import SEO from '@/components/SEO'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true })
    }
  }, [loading, user, navigate])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading dashboard">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <>
      <SEO 
        title={`Dashboard - FocusTimer | ${user?.displayName ?? 'User'}`}
        description="Start a new focus session, track your productivity, and monitor your work time with FocusTimer's dashboard."
        keywords="dashboard, focus session, productivity tracker, timer control, work tracking"
      />
      <main className="max-w-4xl mx-auto p-6" role="main">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName ?? 'User'}
          </h1>
          <p className="text-gray-600">Track your focus sessions and stay productive.</p>
        </header>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" aria-label="Focus session controls">
          <FocusSession />
        </section>
      </main>
    </>
  )
}

