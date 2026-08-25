import { useMemo, useState } from 'react'
import { allVocabulary } from '../data/situations'
import WordCard from '../components/WordCard'

export default function Dictionary() {
  const vocab = useMemo(() => allVocabulary(), [])
  const [query, setQuery] = useState('')

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return vocab
    return vocab.filter(
      (v) => v.nl.toLowerCase().includes(q) || v.en.toLowerCase().includes(q)
    )
  }, [vocab, query])

  return (
    <div className="words">
      <header className="words__head">
        <div>
          <p className="eyebrow">Woordenboek</p>
          <h1>Dictionary</h1>
          <p className="words__sub">
            Every word and phrase in memotime — Dutch, English, and a pronounce key on each.
          </p>
        </div>
        <input
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Dutch or English…"
          aria-label="Search the dictionary"
        />
      </header>

      {items.length === 0 ? (
        <div className="empty"><p>Nothing matches “{query}”.</p></div>
      ) : (
        <div className="cardlist cardlist--dense">
          {items.map((v) => (
            <WordCard key={v.nl} nl={v.nl} en={v.en} tag={v.situation} />
          ))}
        </div>
      )}
    </div>
  )
}
