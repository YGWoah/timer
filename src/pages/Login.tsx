import { useState, useEffect } from 'react'
import { signInWithGoogle } from '@/firebase'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogle() {
    setSigningIn(true)
    setError(null)
    try {
      await signInWithGoogle()
      // on success the popup will close and Firebase maintains user state
    } catch (err: any) {
      setError(err?.message || 'Sign-in failed')
    } finally {
      setSigningIn(false)
    }
  }

  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate('/app', { replace: true })
    }
  }, [loading, user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleGoogle} 
            disabled={signingIn}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {signingIn ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign in with Google'
            )}
          </button>
          
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
