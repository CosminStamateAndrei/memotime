import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { normalize, parseBulk } from '../lib/answers'
import SpeakButton from '../components/SpeakButton'

const pairKey = (nl, en) => `${normalize(nl, 'nl')}|${normalize(en, 'en')}`

export default function Words() {
  const { words, addWords, deleteWord, error } = useApp()
  const [text, setText] = useState('')
  const [status, setStatus] = useState(null) // { kind: 'good' | 'bad', msg }
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')

  const existing = useMemo(() => new Set(words.map((w) => pairKey(w.nl, w.en))), [words])
  const { pairs, bad } = useMemo(() => parseBulk(text), [text])
  const fresh = useMemo(() => {
    const seen = new Set(existing)
    return pairs.filter((p) => {
      const k = pairKey(p.nl, p.en)
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
  }, [pairs, existing])
  const dupes = pairs.length - fresh.length

  const save = async () => {
    if (!fresh.length) return
    setSaving(true)
    const res = await addWords(fresh)
    setSaving(false)
    if (res.ok) {
      setStatus({ kind: 'good', msg: `Added ${fresh.length} word${fresh.length === 1 ? '' : 's'}.` })
      setText('')
    } else {
      setStatus({ kind: 'bad', msg: res.error })
    }
  }

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return words
    return words.filter((w) => w.nl.toLowerCase().includes(q) || w.en.toLowerCase().includes(q))
  }, [words, query])

  return (
    <div className="words">
      <section className="panel">
        <p className="eyebrow">Toevoegen</p>
        <h1>Add words</h1>
        <p className="muted">
          One pair per line, Dutch first. Separate with a tab, <code> - </code>, <code>=</code>, <code>:</code> or{' '}
          <code>;</code>. Use <code>/</code> for several accepted answers.
        </p>
        <textarea
          className="input bulk"
          rows={8}
          value={text}
          onChange={(e) => { setText(e.target.value); setStatus(null) }}
          placeholder={'de hond - the dog\nlopen = to walk\nhuis - house / home'}
        />
        <div className="bulk__foot">
          <span className="muted small">
            {pairs.length > 0 && <>{fresh.length} new</>}
            {dupes > 0 && <> · {dupes} already in the list</>}
            {bad.length > 0 && <span className="bad"> · {bad.length} line{bad.length === 1 ? '' : 's'} not understood</span>}
          </span>
          <button className="btn btn--primary" onClick={save} disabled={!fresh.length || saving}>
            {saving ? 'Saving…' : `Add ${fresh.length || ''} word${fresh.length === 1 ? '' : 's'}`}
          </button>
        </div>
        {bad.length > 0 && (
          <p className="bad small">Not understood: {bad.slice(0, 5).map((b) => `“${b}”`).join(', ')}{bad.length > 5 ? '…' : ''}</p>
        )}
        {status && <p className={status.kind === 'good' ? 'good small' : 'bad small'}>{status.msg}</p>}
        {error && <p className="bad small">Database: {error}</p>}
      </section>

      <header className="words__head">
        <div>
          <h2>All words <span className="count">{words.length}</span></h2>
          <p className="muted">Shared — everyone who logs in sees and practises this list.</p>
        </div>
        <input
          className="input search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Dutch or English…"
        />
      </header>

      {shown.length === 0 ? (
        <p className="empty">{words.length ? `Nothing matches “${query}”.` : 'No words yet — add some above.'}</p>
      ) : (
        <ul className="wordlist">
          {shown.map((w) => (
            <li key={w.id} className="wordrow">
              <SpeakButton text={w.nl} size="sm" />
              <span className="wordrow__nl">{w.nl}</span>
              <span className="wordrow__en">{w.en}</span>
              {w.isDefault ? (
                <span className="badge">default</span>
              ) : (
                <button
                  className="iconbtn"
                  title={w.added_by ? `Added by ${w.added_by} — delete` : 'Delete'}
                  onClick={() => window.confirm(`Delete “${w.nl}”?`) && deleteWord(w.id)}
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
