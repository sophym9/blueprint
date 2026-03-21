import { Navigate } from 'react-router-dom'

export default function AuthGate({ user, loading, children }) {
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}
