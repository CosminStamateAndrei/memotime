import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { quizWords } from '../data/quizWords'
import SpeakButton from '../components/SpeakButton'

// Shuffle once per mount so option order isn't predictable.
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Onboarding() {
  const { finishOnboarding } = useApp()
  const navigate = useNavigate()

  const deck = useMemo(
    () => quizWords.map((q) => ({ ...q, options: shuffle(q.options) })),
    []
  )
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [known, setKnown] = useState([]) // Dutch words answered correctly

  const q = deck[i]
  const total = deck.length
  const isLast = i === total - 1

  const choose = (opt) => {
    if (picked) return
    setPicked(opt)
    if (opt === q.correct) setKnown((k) => [...k, q.nl])
  }

  const next = () => {
    if (isLast) {
      finishOnboarding(known)
      navigate('/app', { replace: true })
      return
    }
    setI((n) => n + 1)
    setPicked(null)
  }

  const skipAll = () => {
    finishOnboarding(known)
    navigate('/app', { replace: true })
  }

  return (
    <div className="onboard">
      <div className="onboard__head">
        <p className="eyebrow">Welkom — first, a quick check</p>
        <h1>Which of these do you already know?</h1>
        <p className="onboard__sub">
          Pick the English meaning. Every word you get right goes straight into your vocabulary.
          Not sure? Just guess or skip — nothing is marked wrong against you.
        </p>
      </div>

      <div className="onboard__progress">
        <div className="onboard__bar">
          <span style={{ width: `${((i) / total) * 100}%` }} />
        </div>
        <span className="onboard__count">{i + 1} / {total}</span>
      </div>

      <div className="quizcard">
        <div className="quizcard__word">
          <span>{q.nl}</span>
          <SpeakButton text={q.nl} size="lg" />
        </div>

        <div className="quizcard__options">
          {q.options.map((opt) => {
            let cls = 'opt'
            if (picked) {
              if (opt === q.correct) cls += ' is-correct'
              else if (opt === picked) cls += ' is-wrong'
              else cls += ' is-dim'
            }
            return (
              <button key={opt} className={cls} onClick={() => choose(opt)} disabled={!!picked}>
                {opt}
              </button>
            )
          })}
        </div>

        <div className="quizcard__foot">
          <button className="btn btn--ghost btn--sm" onClick={skipAll}>Skip the rest</button>
          <button className="btn btn--primary" onClick={next} disabled={!picked}>
            {isLast ? 'Finish & enter' : 'Next'}
          </button>
        </div>
      </div>

      <p className="onboard__tally">
        Known so far: <b>{known.length}</b> {known.length === 1 ? 'word' : 'words'}
      </p>
    </div>
  )
}
