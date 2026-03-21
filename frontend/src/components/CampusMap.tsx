import { useMemo, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, PointerEvent, WheelEvent } from 'react'
import dukeMapImage from '../assets/duke_pixel_interactive_map_clean.png'
import type { MapNote, MapPoint, MapRegionSummary } from '../types/map'

interface CampusMapProps {
  regions: MapRegionSummary[]
  notes: MapNote[]
  selectedNote: MapNote | null
  draftPin: MapPoint | null
  draftMessage: string
  isSubmittingNote: boolean
  backendError: string | null
  noteSubmitError: string | null
  selectedRegionId: string | null
  hoveredRegionId: string | null
  selectedNoteId: string | null
  onHover: (regionId: string | null) => void
  onSelect: (regionId: string) => void
  onSelectNote: (noteId: string) => void
  onDropPin: (point: MapPoint) => void
  onDraftMessageChange: (value: string) => void
  onSubmitDraft: () => void
  onCancelDraft: () => void
}

interface PanPosition {
  x: number
  y: number
}

const MIN_ZOOM = 1
const MAX_ZOOM = 3

export function CampusMap({
  regions,
  notes,
  selectedNote,
  draftPin,
  draftMessage,
  isSubmittingNote,
  backendError,
  noteSubmitError,
  selectedRegionId,
  hoveredRegionId,
  selectedNoteId,
  onHover,
  onSelect,
  onSelectNote,
  onDropPin,
  onDraftMessageChange,
  onSubmitDraft,
  onCancelDraft,
}: CampusMapProps) {
  const [zoom, setZoom] = useState(1.15)
  const [pan, setPan] = useState<PanPosition>({ x: 0, y: 0 })
  const overlayRef = useRef<SVGSVGElement | null>(null)
  const suppressClickRef = useRef(false)
  const dragRef = useRef<{
    pointerId: number
    origin: PanPosition
    startX: number
    startY: number
    moved: boolean
  } | null>(null)

  const polygonPoints = useMemo(
    () =>
      Object.fromEntries(
        regions.map((region) => [
          region.id,
          region.polygon.points.map((point) => `${point.x},${point.y}`).join(' '),
        ]),
      ),
    [regions],
  )

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      pointerId: event.pointerId,
      origin: pan,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    }

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) {
      return
    }

    const nextX = dragRef.current.origin.x + event.clientX - dragRef.current.startX
    const nextY = dragRef.current.origin.y + event.clientY - dragRef.current.startY

    if (
      Math.abs(event.clientX - dragRef.current.startX) > 3 ||
      Math.abs(event.clientY - dragRef.current.startY) > 3
    ) {
      dragRef.current.moved = true
      suppressClickRef.current = true
    }

    setPan({ x: nextX, y: nextY })
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault()

    if (event.ctrlKey) {
      setZoom((current) => {
        const nextZoom = current * (event.deltaY < 0 ? 1.08 : 0.92)
        return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom))
      })
      return
    }

    setPan((current) => ({
      x: current.x - event.deltaX,
      y: current.y - event.deltaY,
    }))
  }

  const consumeSuppressedClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return true
    }

    return false
  }

  const getNormalizedPoint = (event: MouseEvent<SVGSVGElement>) => {
    if (!overlayRef.current) {
      return null
    }

    const rect = overlayRef.current.getBoundingClientRect()

    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    }
  }

  const handleOverlayClick = (event: MouseEvent<SVGSVGElement>) => {
    if (consumeSuppressedClick()) {
      return
    }

    const point = getNormalizedPoint(event)

    if (!point) {
      return
    }

    onDropPin(point)
  }

  return (
    <section className="map-card">
      <div
        className="map-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => onHover(null)}
        onWheel={handleWheel}
      >
        <div
          className="map-surface"
          style={{
            transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
          }}
        >
          <img className="map-image" src={dukeMapImage} alt="Interactive Duke campus map" />

          <svg
            ref={overlayRef}
            className="map-overlay"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            onClick={handleOverlayClick}
          >
            {regions.map((region) => {
              const isSelected = region.id === selectedRegionId
              const isHovered = region.id === hoveredRegionId

              return (
                <polygon
                  key={region.id}
                  points={polygonPoints[region.id]}
                  className={[
                    'map-region',
                    isSelected ? 'selected' : '',
                    isHovered ? 'hovered' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ '--region-color': region.color } as CSSProperties}
                  onMouseEnter={() => onHover(region.id)}
                  onMouseLeave={() => onHover(null)}
                  onClick={(event) => {
                    event.stopPropagation()

                    if (consumeSuppressedClick()) {
                      return
                    }

                    onSelect(region.id)
                  }}
                />
              )
            })}

            {notes.map((note) => {
              const isSelected = note.id === selectedNoteId

              return (
                <g
                  key={note.id}
                  className={isSelected ? 'note-pin selected' : 'note-pin'}
                  transform={`translate(${note.x} ${note.y})`}
                  onClick={(event) => {
                    event.stopPropagation()

                    if (consumeSuppressedClick()) {
                      return
                    }

                    onSelectNote(note.id)
                  }}
                >
                  <circle r="1.2" />
                  <circle className="note-pin-center" r="0.42" />
                </g>
              )
            })}

            {draftPin ? (
              <g className="note-pin draft" transform={`translate(${draftPin.x} ${draftPin.y})`}>
                <circle r="1.2" />
                <circle className="note-pin-center" r="0.42" />
              </g>
            ) : null}
          </svg>

          <div className="map-html-overlay">
            {selectedNote ? (
              <div
                className="note-popover"
                style={{ left: `${selectedNote.x}%`, top: `${selectedNote.y}%` }}
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
                onWheel={(event) => event.stopPropagation()}
              >
                <p>{selectedNote.message}</p>
              </div>
            ) : null}

            {draftPin ? (
              <div
                className="note-popover draft"
                style={{ left: `${draftPin.x}%`, top: `${draftPin.y}%` }}
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
                onWheel={(event) => event.stopPropagation()}
              >
                <textarea
                  value={draftMessage}
                  maxLength={280}
                  placeholder="Leave a note on the map"
                  onChange={(event) => onDraftMessageChange(event.target.value)}
                />
                <div className="note-popover-actions">
                  <button type="button" onClick={onSubmitDraft}>
                    {isSubmittingNote ? 'Posting...' : 'Post'}
                  </button>
                  <button type="button" className="ghost" onClick={onCancelDraft}>
                    Cancel
                  </button>
                </div>
                {noteSubmitError ? <p className="note-inline-error">{noteSubmitError}</p> : null}
              </div>
            ) : null}

            {backendError ? (
              <div
                className="map-toast"
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
              >
                {backendError}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
