import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { signOutCurrentUser } from '@/firebase'

export default function Navigator() {
  const { user } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Login
          </Link>
          <Link to="/signup" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Sign Up
          </Link>
          {user && (
            <>
              <Link to="/app" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Dashboard
              </Link>
              <Link to="/sessions" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Sessions
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-700">Hi {user.displayName ?? 'User'}</span>
              <button 
                onClick={() => signOutCurrentUser()}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
