import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { situations, LEVELS, levelItems, allVocabulary } from '../data/situations'
import WordCard from '../components/WordCard'
import SpeakButton from '../components/SpeakButton'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Build a short multiple-choice check from a level's single words.
function buildCheck(levelWords) {
  const pool = allVocabulary().map((v) => v.en)
  const source = levelWords.length ? levelWords : []
  const picked = shuffle(source).slice(0, Math.min(5, source.length))
  return picked.map((w) => {
    const distractors = shuffle(pool.filter((en) => en !== w.en)).slice(0, 3)
    return { nl: w.nl, correct: w.en, options: shuffle([w.en, ...distractors]) }
  })
}

export default function SituationDetail() {
  const { id } = useParams()
  const { data, completeLevel } = useApp()
  const situation = situations.find((s) => s.id === id)

  const [view, setView] = useState('levels') // levels | study | check | result
  const [activeLevel, setActiveLevel] = useState(null)
  const [check, setCheck] = useState([])
  const [qi, setQi] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)

  if (!situation) {
    return (
      <div className="detail">
        <p>That situation doesn't exist. <Link to="/app">Back to situations</Link></p>
      </div>
    )
  }

  const progress = data?.progress?.[situation.id] || {}
  const isUnlocked = (idx) => idx === 0 || progress[LEVELS[idx - 1].key]

  const openLevel = (levelKey) => {
    setActiveLevel(levelKey)
    setView('study')
  }

  const startCheck = () => {
    const words = situation.levels[activeLevel].words
    setCheck(buildCheck(words))
    setQi(0)
    setPicked(null)
    setScore(0)
    setView('check')
  }

  const q = check[qi]
  const choose = (opt) => {
    if (picked) return
    setPicked(opt)
    if (opt === q.correct) setScore((s) => s + 1)
  }

  const nextQuestion = () => {
    if (qi + 1 >= check.length) {
      const pass = score >= Math.ceil(check.length * 0.7)
      if (pass) {
        const words = levelItems(situation, activeLevel).map((it) => it.nl)
        completeLevel(situation.id, activeLevel, words)
      }
      setView('result')
      return
    }
    setQi((n) => n + 1)
    setPicked(null)
  }

  const activeIdx = LEVELS.findIndex((l) => l.key === activeLevel)
  const passed = view === 'result' && score >= Math.ceil(check.length * 0.7)

  return (
    <div className="detail">
      <div className="detail__crumb">
        <Link to="/app">← Situations</Link>
      </div>

      <header className="detail__head">
        <span className="detail__icon" aria-hidden="true">{situation.icon}</span>
        <div>
          <h1>{situation.title}</h1>
          <p className="detail__en">{situation.titleEn} · {situation.blurb}</p>
        </div>
      </header>

      {/* LEVEL PICKER */}
      {view === 'levels' && (
        <div className="levels">
          {LEVELS.map((l, idx) => {
            const unlocked = isUnlocked(idx)
            const done = progress[l.key]
            const count = levelItems(situation, l.key).length
            return (
              <div key={l.key} className={`levelcard ${unlocked ? '' : 'is-locked'} ${done ? 'is-done' : ''}`}>
                <div className="levelcard__top">
                  <span className="levelcard__step">Stop {idx + 1}</span>
                  {done && <span className="badge badge--done">Gehaald</span>}
                  {!unlocked && <span className="badge badge--lock">Vergrendeld</span>}
                </div>
                <h3>{l.label}</h3>
                <p className="levelcard__meta">{l.en} · {count} items</p>
                <p className="levelcard__desc">
                  {idx === 0 && 'The most common things said here.'}
                  {idx === 1 && 'Go beyond the basics.'}
                  {idx === 2 && 'Handle the tricky, real conversations.'}
                </p>
                <button
                  className="btn btn--primary btn--block"
                  disabled={!unlocked}
                  onClick={() => openLevel(l.key)}
                >
                  {done ? 'Review' : unlocked ? 'Start' : 'Clear previous stop first'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* STUDY */}
      {view === 'study' && (
        <div className="study">
          <div className="study__head">
            <h2>{LEVELS[activeIdx].label} <span>· {LEVELS[activeIdx].en}</span></h2>
            <p>Tap the speaker on any card to hear it. When you're ready, take the check to clear this stop.</p>
          </div>

          <h4 className="study__group">Words</h4>
          <div className="cardlist">
            {situation.levels[activeLevel].words.map((w) => (
              <WordCard key={w.nl} nl={w.nl} en={w.en} />
            ))}
          </div>

          <h4 className="study__group">Phrases</h4>
          <div className="cardlist">
            {situation.levels[activeLevel].phrases.map((p) => (
              <WordCard key={p.nl} nl={p.nl} en={p.en} />
            ))}
          </div>

          <div className="study__foot">
            <button className="btn btn--ghost" onClick={() => setView('levels')}>Back</button>
            <button className="btn btn--primary" onClick={startCheck}>Take the check</button>
          </div>
        </div>
      )}

      {/* CHECK */}
      {view === 'check' && q && (
        <div className="checkq">
          <div className="checkq__progress">Question {qi + 1} of {check.length}</div>
          <div className="checkq__word">
            <span>{q.nl}</span>
            <SpeakButton text={q.nl} size="lg" />
          </div>
          <p className="checkq__ask">What does this mean?</p>
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
          <div className="checkq__foot">
            <button className="btn btn--primary" onClick={nextQuestion} disabled={!picked}>
              {qi + 1 >= check.length ? 'See result' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* RESULT */}
      {view === 'result' && (
        <div className={`result ${passed ? 'is-pass' : 'is-fail'}`}>
          <div className="result__mark" aria-hidden="true">{passed ? '✓' : '↻'}</div>
          <h2>{passed ? 'Stop cleared!' : 'Almost there'}</h2>
          <p className="result__score">You scored {score} / {check.length}.</p>
          <p className="result__msg">
            {passed
              ? `Nice — these words are now in your vocabulary${activeIdx < LEVELS.length - 1 ? ', and the next stop is open.' : '. You\'ve finished this line!'}`
              : 'You need 70% to clear the stop. Review the cards and try again — no penalty.'}
          </p>
          <div className="result__actions">
            <button className="btn btn--ghost" onClick={() => setView('study')}>Review cards</button>
            {passed ? (
              <button className="btn btn--primary" onClick={() => setView('levels')}>Back to stops</button>
            ) : (
              <button className="btn btn--primary" onClick={startCheck}>Try again</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
