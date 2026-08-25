import { useMemo, useState } from 'react'
import { respondPrompts } from '../data/respondPrompts'
import SpeakButton from '../components/SpeakButton'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Respond() {
  const deck = useMemo(() => shuffle(respondPrompts), [])
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState('')
  const [revealed, setRevealed] = useState(false)

  const p = deck[i]

  // Forgiving, offline feedback: did they use any of the expected building blocks?
  const feedback = useMemo(() => {
    if (!revealed) return null
    const a = answer.toLowerCase()
    if (!a.trim()) return { tone: 'neutral', text: 'No answer typed — compare with the model below.' }
    const hit = p.keywords.some((k) => a.includes(k.toLowerCase()))
    return hit
      ? { tone: 'good', text: 'On the right track — your reply uses the kind of phrasing a Dutch speaker would expect here.' }
      : { tone: 'try', text: 'That could work, but compare it with the model answer for a natural phrasing.' }
  }, [revealed, answer, p])

  const reveal = () => setRevealed(true)
  const next = () => {
    setI((n) => (n + 1) % deck.length)
    setAnswer('')
    setRevealed(false)
  }

  return (
    <div className="respond">
      <header className="respond__head">
        <p className="eyebrow">Zeg het zelf · Respond mode</p>
        <h1>Someone speaks. You reply.</h1>
        <p className="respond__sub">
          Read (and hear) the line, type how you'd respond in Dutch, then reveal a model answer to check yourself.
        </p>
      </header>

      <div className="respond__card">
        <span className="respond__ctx">{p.context}</span>

        <div className="respond__prompt">
          <div className="respond__nl">
            <span>{p.prompt}</span>
            <SpeakButton text={p.prompt} size="lg" />
          </div>
          <span className="respond__promptEn">{p.promptEn}</span>
        </div>

        <label className="respond__label" htmlFor="reply">Your reply in Dutch</label>
        <textarea
          id="reply"
          className="respond__input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Typ je antwoord…"
          rows={3}
        />

        {!revealed ? (
          <div className="respond__actions">
            <button className="btn btn--ghost" onClick={next}>Skip</button>
            <button className="btn btn--primary" onClick={reveal}>Reveal model answer</button>
          </div>
        ) : (
          <>
            {feedback && <p className={`respond__fb respond__fb--${feedback.tone}`}>{feedback.text}</p>}

            <div className="respond__model">
              <div className="respond__modelHead">
                <span>Model answer</span>
                <SpeakButton text={p.model} />
              </div>
              <p className="respond__modelNl">{p.model}</p>
              <p className="respond__modelEn">{p.modelEn}</p>
            </div>

            <div className="respond__actions">
              <button className="btn btn--primary btn--block" onClick={next}>Next prompt →</button>
            </div>
          </>
        )}
      </div>

      <p className="respond__counter">{i + 1} / {deck.length}</p>
    </div>
  )
}
