import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { allVocabulary } from '../data/situations'
import WordCard from '../components/WordCard'

export default function KnownWords() {
  const { data } = useApp()
  const known = data?.known || []
  const [query, setQuery] = useState('')

  // Match known Dutch strings back to full entries (for the English translation).
  const vocab = useMemo(() => allVocabulary(), [])
  const byNl = useMemo(() => new Map(vocab.map((v) => [v.nl, v])), [vocab])

  const items = useMemo(() => {
    const list = known.map((nl) => byNl.get(nl) || { nl, en: '—' })
    const q = query.trim().toLowerCase()
    const filtered = q
      ? list.filter((i) => i.nl.toLowerCase().includes(q) || i.en.toLowerCase().includes(q))
      : list
    return filtered.sort((a, b) => a.nl.localeCompare(b.nl, 'nl', { sensitivity: 'base' }))
  }, [known, byNl, query])

  return (
    <div className="words">
      <header className="words__head">
        <div>
          <p className="eyebrow">Jouw woordenschat</p>
          <h1>Words you know</h1>
          <p className="words__sub">
            {known.length} {known.length === 1 ? 'word' : 'words'} collected from the quiz and every stop you've cleared.
          </p>
        </div>
        {known.length > 0 && (
          <input
            className="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your words…"
            aria-label="Search your words"
          />
        )}
      </header>

      {known.length === 0 ? (
        <div className="empty">
          <p>No words yet.</p>
          <p className="empty__hint">Clear a stop in any situation and its words land here.</p>
          <Link className="btn btn--primary" to="/app">Browse situations</Link>
        </div>
      ) : items.length === 0 ? (
        <div className="empty"><p>Nothing matches “{query}”.</p></div>
      ) : (
        <div className="cardlist cardlist--dense">
          {items.map((i) => (
            <WordCard key={i.nl} nl={i.nl} en={i.en} />
          ))}
        </div>
      )}
    </div>
  )
}
