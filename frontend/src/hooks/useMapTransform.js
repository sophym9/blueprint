import { useState, useRef, useCallback } from 'react'

export function useMapTransform({ minScale = 0.5, maxScale = 4, initialScale = 1 } = {}) {
  const [transform, setTransform] = useState({ scale: initialScale, x: 0, y: 0 })
  const dragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    setTransform(prev => {
      const newScale = Math.min(maxScale, Math.max(minScale, prev.scale - e.deltaY * 0.001))
      return { ...prev, scale: newScale }
    })
  }, [minScale, maxScale])

  const handlePointerDown = useCallback((e) => {
    dragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
  }, [])

  const handlePointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  function zoomTo(scale, cx = 0, cy = 0) {
    setTransform({ scale, x: cx, y: cy })
  }

  function reset() {
    setTransform({ scale: initialScale, x: 0, y: 0 })
  }

  const cssTransform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`

  return {
    transform,
    cssTransform,
    handlers: {
      onWheel: handleWheel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
    zoomTo,
    reset,
  }
}
