import { useState, useRef, useCallback } from 'react'

const DRAG_THRESHOLD = 6

export function useMapTransform({ maxScale = 4, initialScale = 1, mapW = null, mapH = null } = {}) {
  const [transform, setTransform] = useState({ scale: initialScale, x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const containerRefStore = useRef(null)
  const mapSizeRef = useRef({ w: mapW, h: mapH })
  mapSizeRef.current = { w: mapW, h: mapH }

  const drag = useRef({ active: false, moved: false, startX: 0, startY: 0, lastX: 0, lastY: 0 })

  // Minimum scale so map always fills the container (no black edges)
  function minScaleFor(rect) {
    const { w, h } = mapSizeRef.current
    if (!w || !h || !rect) return 0.5
    return Math.max(rect.width / w, rect.height / h)
  }

  // Clamp scale + translation so map always fills the container
  function clamp(scale, x, y, rect) {
    const { w, h } = mapSizeRef.current
    if (!w || !h || !rect) return { scale, x, y }
    const maxX = Math.max(0, (w * scale - rect.width) / 2)
    const maxY = Math.max(0, (h * scale - rect.height) / 2)
    return {
      scale,
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    }
  }

  function getRect() {
    return containerRefStore.current?.current?.getBoundingClientRect() ?? null
  }

  const makeWheelHandler = useCallback((containerRef) => {
    containerRefStore.current = containerRef
    return (e) => {
      e.preventDefault()
      const rect = containerRef.current?.getBoundingClientRect()
      setTransform(prev => {
        const minS = minScaleFor(rect)
        const factor = e.deltaY < 0 ? 1.1 : 0.92
        const newScale = Math.min(maxScale, Math.max(minS, prev.scale * factor))
        if (rect) {
          const cx = e.clientX - rect.left - rect.width / 2
          const cy = e.clientY - rect.top - rect.height / 2
          const ratio = newScale / prev.scale
          return clamp(newScale, cx - (cx - prev.x) * ratio, cy - (cy - prev.y) * ratio, rect)
        }
        return clamp(newScale, prev.x, prev.y, rect)
      })
    }
  }, [maxScale]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointerDown = useCallback((e) => {
    if (e.button !== 0) return
    drag.current = { active: true, moved: false, startX: e.clientX, startY: e.clientY, lastX: e.clientX, lastY: e.clientY }
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.lastX
    const dy = e.clientY - drag.current.lastY
    if (!drag.current.moved && Math.hypot(e.clientX - drag.current.startX, e.clientY - drag.current.startY) > DRAG_THRESHOLD) {
      drag.current.moved = true
      setIsDragging(true)
    }
    if (drag.current.moved) {
      drag.current.lastX = e.clientX
      drag.current.lastY = e.clientY
      setTransform(prev => clamp(prev.scale, prev.x + dx, prev.y + dy, getRect()))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointerUp = useCallback(() => {
    drag.current.active = false
    drag.current.moved = false
    setIsDragging(false)
  }, [])

  function zoomTo(scale, x = 0, y = 0) {
    const rect = getRect()
    const minS = minScaleFor(rect)
    const s = Math.min(maxScale, Math.max(minS, scale))
    setTransform(clamp(s, x, y, rect))
  }

  function reset() {
    const rect = getRect()
    const minS = minScaleFor(rect)
    setTransform(clamp(minS, 0, 0, rect))
  }

  return {
    transform,
    cssTransform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
    isDragging,
    makeWheelHandler,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerUp,
    },
    zoomTo,
    reset,
  }
}
