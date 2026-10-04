import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { checkAnswer, shuffle } from '../lib/answers'
import SpeakButton from '../components/SpeakButton'

// Your personal pile of words you swiped left on in Cards. A word leaves the
// pile when you translate it correctly in the review test.
export default function Review() {
  const { reviewWords, passReview, wordsLoaded, progressError } = useApp()
  const navigate = useNavigate()
  const [deck, setDeck] = useState(null) // null = not testing
  const [i, setI] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [passed, setPassed] = useState(0)
  const inputRef = useRef(null)
  const nextRef = useRef(null)

  const start = () => {
    // Snapshot the pile: passing a word removes it from reviewWords mid-test.
    setDeck(shuffle(reviewWords).map((w) => ({ ...w, nlFirst: Math.random() < 0.5 })))
    setI(0)
    setInput('')
    setResult(null)
    setPassed(0)
  }

  const card = deck?.[i]
  const finished = deck && i >= deck.length

  useEffect(() => {
    if (!deck) return
    if (result) nextRef.current?.focus()
    else inputRef.current?.focus()
  }, [deck, result, i])

  if (!wordsLoaded) return <p className="empty">Loading words…</p>

  const to = card && (card.nlFirst ? 'en' : 'nl')
  const prompt = card && (card.nlFirst ? card.nl : card.en)
  const answer = card && (card.nlFirst ? card.en : card.nl)

  const pass = () => {
    passReview(card)
    setPassed((n) => n + 1)
  }

  const submit = (e) => {
    e.preventDefault()
    if (result || !input.trim()) return
    const r = checkAnswer(input, [answer], to)
    setResult(r)
    if (r !== 'wrong') pass()
  }

  const overrule = () => {
    setResult('correct')
    pass()
  }

  const next = () => {
    setI((n) => n + 1)
    setInput('')
    setResult(null)
  }

  // ---- the test ----
  if (deck) {
    return (
      <div className="quiz">
        <header className="quiz__head">
          <div>
            <p className="eyebrow">Herhalen</p>
            <h1>Review test</h1>
          </div>
          <div className="quiz__score">
            <span><b className="good">{passed}</b> out of the pile · {Math.min(i + 1, deck.length)} of {deck.length}</span>
            <button className="btn btn--ghost btn--sm" onClick={() => setDeck(null)}>Stop</button>
          </div>
        </header>

        {finished ? (
          <section className="panel center">
            <h2>Test done</h2>
            <p className="big">{passed} / {deck.length}</p>
            <p className="muted">
              {reviewWords.length === 0
                ? 'Your review pile is empty. Goed gedaan!'
                : `${reviewWords.length} word${reviewWords.length === 1 ? '' : 's'} still to review.`}
            </p>
            <div className="row">
              {reviewWords.length > 0 && <button className="btn btn--primary" onClick={start}>Test the rest again</button>}
              <button className="btn btn--ghost" onClick={() => setDeck(null)}>Back to pile</button>
              <button className="btn btn--ghost" onClick={() => navigate('/cards')}>Cards</button>
            </div>
          </section>
        ) : (
          <section className="panel">
            <p className="flash__lang center-text">{card.nlFirst ? 'Nederlands → English' : 'English → Nederlands'}</p>
            <div className="quiz__prompt">
              {card.nlFirst && <SpeakButton text={card.nl} size="lg" />}
              <span>{prompt}</span>
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
                    setResult('wrong')
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
                  <button type="button" className="btn btn--ghost" onClick={() => setResult('wrong')}>Don't know</button>
                  <button type="submit" className="btn btn--primary" disabled={!input.trim()}>Check</button>
                </div>
              )}
            </form>

            {result && (
              <div className={`feedback feedback--${result}`}>
                <p className="feedback__verdict">
                  {result === 'correct' && 'Goed! ✓ Out of your review pile.'}
                  {result === 'typo' && 'Almost — counted as right (out of the pile), but check the spelling:'}
                  {result === 'wrong' && 'Not quite — it stays in your pile. The answer is:'}
                </p>
                <p className="feedback__answer">
                  {to === 'nl' && <SpeakButton text={answer} size="sm" />}
                  {answer}
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
        )}
      </div>
    )
  }

  // ---- the pile ----
  return (
    <div className="words">
      <header className="words__head" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Herhalen</p>
          <h1 className="page-title">Review <span className="count">{reviewWords.length}</span></h1>
          <p className="muted">
            Words you swiped left on in Cards. Translate one correctly in the test and it leaves the pile.
          </p>
        </div>
        {reviewWords.length > 0 && (
          <button className="btn btn--primary" onClick={start}>Start review test</button>
        )}
      </header>

      {progressError && <p className="bad small">Progress isn't saving: {progressError}</p>}

      {reviewWords.length === 0 ? (
        <div className="empty">
          <p>Nothing to review right now.</p>
          <p className="small">In Cards, swipe left on words you don't know and they'll show up here.</p>
          <button className="btn btn--primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/cards')}>Go to Cards</button>
        </div>
      ) : (
        <ul className="wordlist">
          {reviewWords.map((w) => (
            <li key={w.id} className="wordrow">
              <SpeakButton text={w.nl} size="sm" />
              <span className="wordrow__nl">{w.nl}</span>
              <span className="wordrow__en">{w.en}</span>
              <span />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
