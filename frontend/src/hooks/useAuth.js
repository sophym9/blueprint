import { useState, useEffect } from 'react'
import api from '../lib/api'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      setLoading(false)
      return
    }
    api.get(`/users/${userId}`)
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('userId')
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(name, graduationYear) {
    const res = await api.post('/users/', { name, graduation_year: graduationYear })
    localStorage.setItem('userId', res.data.id)
    setUser(res.data)
    return res.data
  }

  function logout() {
    localStorage.removeItem('userId')
    setUser(null)
  }

  function refreshUser() {
    const userId = localStorage.getItem('userId')
    if (!userId) return
    api.get(`/users/${userId}`).then(res => setUser(res.data))
  }

  return { user, loading, login, logout, refreshUser }
}
