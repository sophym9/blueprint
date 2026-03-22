import { useState, useEffect } from 'react'
import api from '../lib/api'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      setLoading(false)
      return
    }
    // Validate token and fetch current user
    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('authToken')
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('authToken', res.data.access_token)
    setUser(res.data.user)
    return res.data.user
  }

  async function register(name, email, password, graduationYear) {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
      graduation_year: graduationYear,
    })
    localStorage.setItem('authToken', res.data.access_token)
    setUser(res.data.user)
    return res.data.user
  }

  function logout() {
    localStorage.removeItem('authToken')
    setUser(null)
  }

  function refreshUser() {
    api.get('/auth/me').then(res => setUser(res.data)).catch(() => {})
  }

  async function auth0Login({ code, verifier, redirect_uri }) {
    const res = await api.post('/auth/auth0', { code, verifier, redirect_uri })
    localStorage.setItem('authToken', res.data.access_token)
    setUser(res.data.user)
    return res.data.user
  }

  return { user, setUser, loading, login, register, logout, refreshUser, auth0Login }
}
