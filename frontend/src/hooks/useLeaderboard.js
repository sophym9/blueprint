import { useState, useEffect } from 'react'
import api from '../lib/api'

export function useLeaderboard() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get('/leaderboard/')
      .then(res => setLeaders(res.data))
      .finally(() => setLoading(false))
  }, [])

  return { leaders, loading }
}
