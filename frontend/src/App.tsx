import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { CampusMap } from './components/CampusMap'
import { createNote, getNotes, getRegions } from './lib/api'
import type { CreateMapNoteInput, MapNote, MapPoint, MapRegionSummary } from './types/map'

function App() {
  const [regions, setRegions] = useState<MapRegionSummary[]>([])
  const [notes, setNotes] = useState<MapNote[]>([])
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null)
  const [draftPin, setDraftPin] = useState<MapPoint | null>(null)
  const [draftMessage, setDraftMessage] = useState('')
  const [isSubmittingNote, setIsSubmittingNote] = useState(false)
  const [backendError, setBackendError] = useState<string | null>(null)
  const [noteSubmitError, setNoteSubmitError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadInitialData() {
      try {
        setBackendError(null)
        const [nextRegions, nextNotes] = await Promise.all([getRegions(), getNotes()])

        if (!active) {
          return
        }

        setRegions(nextRegions)
        setNotes(nextNotes)
      } catch {
        if (active) {
          setBackendError('Map data is unavailable until the FastAPI backend is running.')
        }
      }
    }

    void loadInitialData()

    return () => {
      active = false
    }
  }, [])

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? null,
    [notes, selectedNoteId],
  )

  const handleDropPin = (point: MapPoint) => {
    setSelectedNoteId(null)
    setSelectedRegionId(null)
    setDraftPin(point)
    setDraftMessage('')
    setNoteSubmitError(null)
  }

  const handleSelectNote = (noteId: string) => {
    setDraftPin(null)
    setDraftMessage('')
    setSelectedRegionId(null)
    setSelectedNoteId(noteId)
    setNoteSubmitError(null)
  }

  const handleSubmitNote = async () => {
    const trimmedMessage = draftMessage.trim()

    if (!draftPin || !trimmedMessage) {
      setNoteSubmitError('Enter a note before posting a pin.')
      return
    }

    try {
      setIsSubmittingNote(true)
      setNoteSubmitError(null)
      const payload: CreateMapNoteInput = {
        x: draftPin.x,
        y: draftPin.y,
        message: trimmedMessage,
      }
      const createdNote = await createNote(payload)
      setNotes((current) => [...current, createdNote])
      setSelectedNoteId(createdNote.id)
      setDraftPin(null)
      setDraftMessage('')
    } catch {
      setNoteSubmitError('Unable to post the note right now.')
    } finally {
      setIsSubmittingNote(false)
    }
  }

  return (
    <main className="app-shell">
      <CampusMap
        regions={regions}
        notes={notes}
        selectedNote={selectedNote}
        draftPin={draftPin}
        draftMessage={draftMessage}
        isSubmittingNote={isSubmittingNote}
        backendError={backendError}
        noteSubmitError={noteSubmitError}
        selectedRegionId={selectedRegionId}
        hoveredRegionId={hoveredRegionId}
        selectedNoteId={selectedNoteId}
        onHover={setHoveredRegionId}
        onSelect={(regionId) => {
          setDraftPin(null)
          setDraftMessage('')
          setSelectedNoteId(null)
          setSelectedRegionId(regionId)
        }}
        onSelectNote={handleSelectNote}
        onDropPin={handleDropPin}
        onDraftMessageChange={setDraftMessage}
        onSubmitDraft={handleSubmitNote}
        onCancelDraft={() => {
          setDraftPin(null)
          setDraftMessage('')
          setNoteSubmitError(null)
        }}
      />
    </main>
  )
}

export default App
