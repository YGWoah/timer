import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { signOutCurrentUser } from '@/firebase'

export default function Navigator() {
  const { user } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {!user && (
            <>
              <NavLink to="/" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'} hover:text-gray-900 transition-colors`}>Login</NavLink>
              <NavLink to="/signup" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'} hover:text-gray-900 transition-colors`}>Sign Up</NavLink>
            </>
          )}
          {user && (
            <>
              <NavLink to="/app" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-900 transition-colors`}>Dashboard</NavLink>
              <NavLink to="/sessions" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-900 transition-colors`}>Sessions</NavLink>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {user.photoURL ? (
                // show avatar if available
                <img src={user.photoURL} alt={user.displayName ?? 'avatar'} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <span className="inline-block h-8 w-8 rounded-full bg-gray-200" />
              )}
              <span className="text-sm text-gray-700">{user.displayName ?? 'User'}</span>
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
