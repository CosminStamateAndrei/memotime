import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { checkAnswer, shuffle } from '../lib/answers'
import SpeakButton from '../components/SpeakButton'

// direction: 'nl-en' (see Dutch, type English) or 'en-nl' (see English, type Dutch).
export default function Quiz({ direction }) {
  const { words, wordsLoaded } = useApp()
  const from = direction === 'nl-en' ? 'nl' : 'en'
  const to = direction === 'nl-en' ? 'en' : 'nl'

  // One card per distinct prompt; if a word is in the list twice with different
  // translations, any of them counts.
  const cards = useMemo(() => {
    const byPrompt = new Map()
    for (const w of words) {
      const k = w[from].trim().toLowerCase()
      if (!byPrompt.has(k)) byPrompt.set(k, { prompt: w[from], answers: [], nl: [] })
      const c = byPrompt.get(k)
      c.answers.push(w[to])
      c.nl.push(w.nl)
    }
    return [...byPrompt.values()]
  }, [words, from, to])

  const [deck, setDeck] = useState([])
  const [i, setI] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null) // 'correct' | 'typo' | 'wrong'
  const [score, setScore] = useState({ right: 0, done: 0 })
  const [mistakes, setMistakes] = useState([])
  const inputRef = useRef(null)
  const nextRef = useRef(null)

  const start = (list) => {
    setDeck(shuffle(list))
    setI(0)
    setInput('')
    setResult(null)
    setScore({ right: 0, done: 0 })
    setMistakes([])
  }

  // Start the first round once the shared list has loaded.
  useEffect(() => {
    if (wordsLoaded) start(cards)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordsLoaded])

  const card = deck[i]
  const finished = deck.length > 0 && i >= deck.length

  useEffect(() => {
    if (result) nextRef.current?.focus()
    else inputRef.current?.focus()
  }, [result, i])

  const submit = (e) => {
    e.preventDefault()
    if (result || !input.trim()) return
    const r = checkAnswer(input, card.answers, to)
    setResult(r)
    const ok = r !== 'wrong'
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), done: s.done + 1 }))
    if (!ok) setMistakes((m) => [...m, card])
  }

  const overrule = () => {
    setResult('correct')
    setScore((s) => ({ ...s, right: s.right + 1 }))
    setMistakes((m) => m.filter((c) => c !== card))
  }

  const skip = () => {
    setResult('wrong')
    setScore((s) => ({ ...s, done: s.done + 1 }))
    setMistakes((m) => [...m, card])
  }

  const next = () => {
    setI((n) => n + 1)
    setInput('')
    setResult(null)
  }

  const title = direction === 'nl-en' ? 'Dutch → English' : 'English → Dutch'

  if (!wordsLoaded) return <p className="empty">Loading words…</p>

  if (cards.length === 0) {
    return (
      <div className="quiz">
        <h1>{title}</h1>
        <p className="empty">No words yet. <Link to="/">Add some first.</Link></p>
      </div>
    )
  }

  return (
    <div className="quiz">
      <header className="quiz__head">
        <div>
          <p className="eyebrow">{direction === 'nl-en' ? 'Vertaal naar het Engels' : 'Vertaal naar het Nederlands'}</p>
          <h1>{title}</h1>
        </div>
        <div className="quiz__score">
          <b>{score.right}</b>/{score.done} right · {Math.min(i + 1, deck.length)} of {deck.length}
          <button className="btn btn--ghost btn--sm" onClick={() => start(cards)}>Restart</button>
        </div>
      </header>

      {finished ? (
        <section className="panel center">
          <h2>Round done</h2>
          <p className="big">{score.right} / {score.done}</p>
          {mistakes.length > 0 && (
            <ul className="wordlist">
              {mistakes.map((c) => (
                <li key={c.prompt} className="wordrow">
                  <span className="wordrow__nl">{c.prompt}</span>
                  <span className="wordrow__en">{c.answers.join(' / ')}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="row">
            {mistakes.length > 0 && (
              <button className="btn btn--primary" onClick={() => start(mistakes)}>
                Practise the {mistakes.length} I got wrong
              </button>
            )}
            <button className={mistakes.length ? 'btn btn--ghost' : 'btn btn--primary'} onClick={() => start(cards)}>
              New round (all {cards.length})
            </button>
          </div>
        </section>
      ) : card ? (
        <section className="panel">
          <div className="quiz__prompt">
            {from === 'nl' && <SpeakButton text={card.prompt} size="lg" />}
            <span>{card.prompt}</span>
          </div>

          <form onSubmit={submit} className="quiz__form">
            <input
              ref={inputRef}
              className={`input quiz__input ${result ? `is-${result}` : ''}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // Enter on an empty box = "Don't know"; with text it submits as usual.
                if (e.key === 'Enter' && !result && !input.trim()) {
                  e.preventDefault()
                  skip()
                }
              }}
              placeholder={to === 'en' ? 'Type the English…' : 'Typ het Nederlands…'}
              readOnly={!!result}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {!result && (
              <div className="row">
                <button type="button" className="btn btn--ghost" onClick={skip}>Don't know</button>
                <button type="submit" className="btn btn--primary" disabled={!input.trim()}>Check</button>
              </div>
            )}
          </form>

          {result && (
            <div className={`feedback feedback--${result}`}>
              <p className="feedback__verdict">
                {result === 'correct' && 'Goed! ✓'}
                {result === 'typo' && 'Almost — counted as right, but check the spelling:'}
                {result === 'wrong' && 'Not quite. The answer is:'}
              </p>
              <p className="feedback__answer">
                {to === 'nl' && <SpeakButton text={card.answers[0]} size="sm" />}
                {card.answers.join(' / ')}
              </p>
              <div className="row">
                {result === 'wrong' && input.trim() && (
                  <button className="btn btn--ghost" onClick={overrule}>I was right</button>
                )}
                <button ref={nextRef} className="btn btn--primary" onClick={next}>Next →</button>
              </div>
            </div>
          )}
        </section>
      ) : null}
    </div>
  )
}
