import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { shuffle } from '../lib/answers'
import SpeakButton from '../components/SpeakButton'

const MODES = [
  { key: 'nl', label: 'Dutch first' },
  { key: 'en', label: 'English first' },
  { key: 'mix', label: 'Mixed' },
]

const SWIPE = 90 // px of drag that counts as a swipe

// Words you've said you know come up less often each time (halving, never below 12%).
// New words and words in your review pile are always in the round.
const chance = (known) => Math.max(0.12, 0.5 ** known)

export default function Flashcards() {
  const { words, wordsLoaded, getProgress, markCard, reviewWords, progressError } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState('nl')
  const [deck, setDeck] = useState([])
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [tally, setTally] = useState({ knew: 0, review: 0 })
  const [dx, setDx] = useState(0)
  const [leaving, setLeaving] = useState(null) // 'left' | 'right'
  const drag = useRef(null)

  const deal = () => {
    let picked = words.filter((w) => {
      const p = getProgress(w)
      return p.review || p.known === 0 || Math.random() < chance(p.known)
    })
    if (picked.length === 0) picked = words
    setDeck(shuffle(picked).map((w) => ({ ...w, nlFirst: Math.random() < 0.5 })))
    setI(0)
    setFlipped(false)
    setTally({ knew: 0, review: 0 })
  }

  useEffect(() => {
    if (wordsLoaded) deal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordsLoaded])

  const card = deck[i]
  const finished = deck.length > 0 && i >= deck.length

  const decide = (knew) => {
    if (!card || leaving) return
    setLeaving(knew ? 'right' : 'left')
    setTimeout(() => {
      markCard(card, knew)
      setTally((t) => (knew ? { ...t, knew: t.knew + 1 } : { ...t, review: t.review + 1 }))
      setI((n) => n + 1)
      setFlipped(false)
      setDx(0)
      setLeaving(null)
    }, 200)
  }

  // Keyboard on laptop: → knew it, ← review, space flips.
  const keys = useRef()
  keys.current = (e) => {
    if (e.target.closest('input, textarea') || finished) return
    if (e.key === 'ArrowRight') decide(true)
    else if (e.key === 'ArrowLeft') decide(false)
    else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      setFlipped((f) => !f)
    }
  }
  useEffect(() => {
    const onKey = (e) => keys.current(e)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Drag with finger or mouse.
  const onPointerDown = (e) => {
    if (leaving || e.target.closest('.speak')) return
    drag.current = { x: e.clientX, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!drag.current) return
    const d = e.clientX - drag.current.x
    if (Math.abs(d) > 6) drag.current.moved = true
    setDx(d)
  }
  const onPointerUp = () => {
    if (!drag.current) return
    const { moved } = drag.current
    drag.current = null
    if (dx > SWIPE) decide(true)
    else if (dx < -SWIPE) decide(false)
    else {
      setDx(0)
      if (!moved) setFlipped((f) => !f)
    }
  }

  if (!wordsLoaded) return <p className="empty">Loading words…</p>

  const nlFirst = card && (mode === 'mix' ? card.nlFirst : mode === 'nl')
  const front = card && (nlFirst ? card.nl : card.en)
  const back = card && (nlFirst ? card.en : card.nl)

  const offset = leaving === 'right' ? 600 : leaving === 'left' ? -600 : dx
  const strength = Math.min(1, Math.abs(offset) / SWIPE)

  return (
    <div className="quiz">
      <header className="quiz__head">
        <div>
          <p className="eyebrow">Flitskaarten</p>
          <h1>Flashcards</h1>
        </div>
        <div className="modes" role="group" aria-label="Which side first">
          {MODES.map((m) => (
            <button key={m.key} className={mode === m.key ? 'is-active' : ''} onClick={() => { setMode(m.key); setFlipped(false) }}>
              {m.label}
            </button>
          ))}
        </div>
      </header>

      {progressError && <p className="bad small">Progress isn't saving: {progressError}</p>}

      {finished ? (
        <section className="panel center">
          <h2>Round done</h2>
          <p className="muted">
            You knew <b className="good">{tally.knew}</b> · <b className="bad">{tally.review}</b> went to Review
          </p>
          <div className="row">
            {reviewWords.length > 0 && (
              <button className="btn btn--ghost" onClick={() => navigate('/review')}>
                Review ({reviewWords.length})
              </button>
            )}
            <button className="btn btn--primary" onClick={deal}>New round</button>
          </div>
        </section>
      ) : card ? (
        <>
          <div className="quiz__score">
            <span>{i + 1} of {deck.length}</span>
            <span><b className="good">{tally.knew}</b> knew · <b className="bad">{tally.review}</b> review</span>
          </div>

          <div className="swipe">
            <div
              className={`flash ${drag.current ? 'is-dragging' : ''}`}
              role="button"
              tabIndex={0}
              aria-label="Flashcard. Tap to flip, swipe right if you knew it, left if not."
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{
                transform: `translateX(${offset}px) rotate(${offset / 22}deg)`,
                opacity: leaving ? 0 : 1,
                borderColor: offset > 20 ? 'var(--good)' : offset < -20 ? 'var(--bad)' : undefined,
              }}
            >
              <span className="flash__stamp flash__stamp--good" style={{ opacity: offset > 0 ? strength : 0 }}>Knew it</span>
              <span className="flash__stamp flash__stamp--bad" style={{ opacity: offset < 0 ? strength : 0 }}>Review</span>
              <div>
                <p className="flash__lang">{nlFirst ? 'Nederlands' : 'English'}</p>
                <div className="flash__line">
                  <span className="flash__front">{front}</span>
                  {nlFirst && <SpeakButton text={card.nl} size="md" />}
                </div>
              </div>
              {flipped ? (
                <div className="flash__line">
                  <span className="flash__back">{back}</span>
                  {!nlFirst && <SpeakButton text={card.nl} size="sm" />}
                </div>
              ) : (
                <p className="flash__hint">Tap to flip</p>
              )}
            </div>
          </div>

          <div className="flash__nav">
            <button className="btn btn--bad" onClick={() => decide(false)}>← Didn't know</button>
            <button className="btn btn--good" onClick={() => decide(true)}>Knew it →</button>
          </div>
          <p className="flash__help">Swipe or drag the card · on a keyboard use ← → and space to flip</p>
        </>
      ) : null}
    </div>
  )
}
