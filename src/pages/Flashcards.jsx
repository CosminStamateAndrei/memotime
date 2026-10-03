import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { shuffle } from '../lib/answers'
import SpeakButton from '../components/SpeakButton'

const MODES = [
  { key: 'nl', label: 'Dutch first' },
  { key: 'en', label: 'English first' },
  { key: 'mix', label: 'Mixed' },
]

// Random flashcards: every word comes up once per round, in a new random order.
export default function Flashcards() {
  const { words, wordsLoaded } = useApp()
  const [mode, setMode] = useState('nl')
  const [deck, setDeck] = useState([])
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const deal = () => {
    setDeck(shuffle(words).map((w) => ({ ...w, nlFirst: Math.random() < 0.5 })))
    setI(0)
    setFlipped(false)
  }

  useEffect(() => {
    if (wordsLoaded) deal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordsLoaded])

  const card = deck[i]
  const finished = deck.length > 0 && i >= deck.length

  const next = () => {
    setI((n) => n + 1)
    setFlipped(false)
  }
  const prev = () => {
    setI((n) => Math.max(0, n - 1))
    setFlipped(false)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest('input, textarea')) return
      if (e.key === ' ') {
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!wordsLoaded) return <p className="empty">Loading words…</p>
  if (words.length === 0) return <p className="empty">No words yet. <Link to="/">Add some first.</Link></p>

  const nlFirst = card && (mode === 'mix' ? card.nlFirst : mode === 'nl')
  const front = card && (nlFirst ? card.nl : card.en)
  const back = card && (nlFirst ? card.en : card.nl)

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

      {finished ? (
        <section className="panel center">
          <h2>You went through all {deck.length} words</h2>
          <button className="btn btn--primary" onClick={deal}>Shuffle again</button>
        </section>
      ) : card ? (
        <>
          <div className="quiz__score">
            <span>{i + 1} of {deck.length}</span>
            <button className="btn btn--ghost btn--sm" onClick={deal}>Reshuffle</button>
          </div>
          <div
            className="flash"
            role="button"
            tabIndex={0}
            onClick={() => setFlipped((f) => !f)}
            style={{ marginTop: '0.8rem' }}
          >
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
              <p className="flash__hint">Tap to see the translation</p>
            )}
          </div>
          <div className="flash__nav">
            <button className="btn btn--ghost" onClick={prev} disabled={i === 0}>← Back</button>
            <button className="btn btn--primary" onClick={next}>Next →</button>
          </div>
        </>
      ) : null}
    </div>
  )
}
