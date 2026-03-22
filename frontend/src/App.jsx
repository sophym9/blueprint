import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import NavBar from './components/ui/NavBar'
import LoadingScreen from './components/ui/LoadingScreen'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Soundtrack from './pages/Soundtrack'

export default function App() {
  const { user, setUser, loading, login, register, logout, refreshUser, auth0Login } = useAuth()
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowLoader(false), 1800)
    return () => clearTimeout(t)
  }, [])

  if (showLoader || loading) return <LoadingScreen />

  return (
    <BrowserRouter>
      {user && <NavBar user={user} onLogout={logout} />}
      <div style={{ height: '100%', position: 'relative' }}>
        <Routes>
          <Route
            path="/"
            element={
              user
                ? <Home user={user} onUserUpdate={refreshUser} />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/login"
            element={
              user
                ? <Navigate to="/" replace />
                : <Login onLogin={login} onRegister={register} onAuth0Login={auth0Login} />
            }
          />
          <Route
            path="/profile"
            element={
              user
                ? <Profile user={user} onUserUpdate={u => setUser && setUser(u)} />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/soundtrack"
            element={
              user
                ? <Soundtrack user={user} />
                : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
