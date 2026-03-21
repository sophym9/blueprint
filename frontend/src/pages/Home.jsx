import { useState, useEffect } from 'react'
import DukeWorldMap from '../components/map/DukeWorldMap'
import ZoneProgress from '../components/game/ZoneProgress'
import PointsToast from '../components/game/PointsToast'
import api from '../lib/api'

export default function Home({ user, onUserUpdate }) {
  const [pointsToast, setPointsToast] = useState(null)
  const [memoryCounts, setMemoryCounts] = useState({})

  useEffect(() => {
    // Load overall memory counts by region for zone progress
    api.get('/memories/').then(res => {
      const counts = {}
      for (const m of res.data) {
        counts[m.region] = (counts[m.region] || 0) + 1
      }
      setMemoryCounts(counts)
    }).catch(() => {})
  }, [])

  function handlePointsEarned(pts) {
    setPointsToast(pts)
    if (onUserUpdate) onUserUpdate()
  }

  return (
    <div style={{ width: '100%', height: '100%', paddingTop: '52px', paddingBottom: '48px', position: 'relative' }}>
      <DukeWorldMap
        user={user}
        onPointsEarned={handlePointsEarned}
        memoryCounts={memoryCounts}
      />

      <ZoneProgress
        memoryCounts={memoryCounts}
        unlockedZones={user?.zones_unlocked || []}
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
