import { useState, useEffect } from 'react'
import { signInWithGoogle } from '@/firebase'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [signingUp, setSigningUp] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogle() {
    setSigningUp(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err?.message || 'Sign-up failed')
    } finally {
      setSigningUp(false)
    }
  }

  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/app', { replace: true })
  }, [loading, user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
          <p className="text-gray-600">Sign up with Google to get started</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleGoogle} 
            disabled={signingUp}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {signingUp ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                Processing...
              </div>
            ) : (
              'Sign up with Google'
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
