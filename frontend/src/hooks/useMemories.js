import { useState, useCallback } from 'react'
import api from '../lib/api'

export function useMemories() {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchMemories = useCallback(async ({ landmarkId, region } = {}) => {
    setLoading(true)
    try {
      const params = {}
      if (landmarkId) params.landmark_id = landmarkId
      if (region) params.region = region
      const res = await api.get('/memories/', { params })
      setMemories(res.data)
      return res.data
    } finally {
      setLoading(false)
    }
  }, [])

  async function createMemory(data) {
    const res = await api.post('/memories/', data)
    setMemories(prev => [res.data, ...prev])
    return res.data
  }

  async function deleteMemory(id) {
    await api.delete(`/memories/${id}`)
    setMemories(prev => prev.filter(m => m.id !== id))
  }

  async function addReaction(memoryId, emoji) {
    const res = await api.post('/reactions/', { memory_id: memoryId, emoji })
    setMemories(prev => prev.map(m =>
      m.id === memoryId
        ? { ...m, reactions: [...m.reactions, res.data] }
        : m
    ))
    return res.data
  }

  async function removeReaction(reactionId, memoryId) {
    await api.delete(`/reactions/${reactionId}`)
    setMemories(prev => prev.map(m =>
      m.id === memoryId
        ? { ...m, reactions: m.reactions.filter(r => r.id !== reactionId) }
        : m
    ))
  }

  return { memories, loading, fetchMemories, createMemory, deleteMemory, addReaction, removeReaction }
}
