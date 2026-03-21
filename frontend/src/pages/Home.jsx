import { useState, useEffect } from 'react'
import DukeWorldMap from '../components/map/DukeWorldMap'
import PointsToast from '../components/game/PointsToast'
import api from '../lib/api'

export default function Home({ user, onUserUpdate }) {
  const [pointsToast, setPointsToast] = useState(null)
  const [memoryCounts, setMemoryCounts] = useState({})

  useEffect(() => {
    // Load overall memory counts by landmark for direct map entry points
    api.get('/memories/').then(res => {
      const counts = {}
      for (const m of res.data) {
        const key = m.landmark_id || m.region
        if (!key) continue
        counts[key] = (counts[key] || 0) + 1
      }
      setMemoryCounts(counts)
    }).catch(() => {})
  }, [])

  function handlePointsEarned(pts) {
    setPointsToast(pts)
    if (onUserUpdate) onUserUpdate()
  }

  return (
    <div style={{ width: '100%', height: '100%', paddingTop: '52px', position: 'relative' }}>
      <DukeWorldMap
        user={user}
        onPointsEarned={handlePointsEarned}
        memoryCounts={memoryCounts}
      />

      {pointsToast && (
        <PointsToast
          points={pointsToast}
          onDone={() => setPointsToast(null)}
        />
      )}
    </div>
  )
}
