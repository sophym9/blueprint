import { useState, useRef, useCallback } from 'react'

const DRAG_THRESHOLD = 6 // px before a press becomes a drag

export function useMapTransform({ minScale = 0.4, maxScale = 4, initialScale = 1 } = {}) {
  const [transform, setTransform] = useState({ scale: initialScale, x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  // Use a single ref for all mutable drag state to avoid stale closures
  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  })

  // Wheel zoom — zooms toward the cursor position
  const makeWheelHandler = useCallback((containerRef) => (e) => {
    e.preventDefault()
    setTransform(prev => {
      const factor = e.deltaY < 0 ? 1.12 : 0.9
      const newScale = Math.min(maxScale, Math.max(minScale, prev.scale * factor))

      // Zoom toward cursor
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        const cx = e.clientX - rect.left - rect.width / 2
        const cy = e.clientY - rect.top - rect.height / 2
        const ratio = newScale / prev.scale
        return {
          scale: newScale,
          x: cx - (cx - prev.x) * ratio,
          y: cy - (cy - prev.y) * ratio,
        }
      }
      return { ...prev, scale: newScale }
    })
  }, [minScale, maxScale])

  const handlePointerDown = useCallback((e) => {
    if (e.button !== 0) return
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
    }
    // NO setPointerCapture — that's what was blocking clicks on children
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!drag.current.active) return

    const dx = e.clientX - drag.current.lastX
    const dy = e.clientY - drag.current.lastY
    const distX = e.clientX - drag.current.startX
    const distY = e.clientY - drag.current.startY

    if (!drag.current.moved && Math.hypot(distX, distY) > DRAG_THRESHOLD) {
      drag.current.moved = true
      setIsDragging(true)
    }

    if (drag.current.moved) {
      drag.current.lastX = e.clientX
      drag.current.lastY = e.clientY
      setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
    }
  }, [])

  const handlePointerUp = useCallback(() => {
    drag.current.active = false
    drag.current.moved = false
    setIsDragging(false)
  }, [])

  function zoomTo(scale, x = 0, y = 0) {
    setTransform({ scale, x, y })
  }

  function reset() {
    setTransform({ scale: initialScale, x: 0, y: 0 })
  }

  const cssTransform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`

  return {
    transform,
    cssTransform,
    isDragging,
    makeWheelHandler,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerUp, // stop drag if pointer exits container
    },
    zoomTo,
    reset,
  }
}
