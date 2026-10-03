// Answer checking for the quizzes. Deliberately forgiving: case, accents,
// punctuation and leading articles ("de", "het", "the", "to", …) don't count.

const ARTICLES = {
  nl: ['de', 'het', 'een', "'t"],
  en: ['the', 'a', 'an', 'to'],
}

export function normalize(text, lang) {
  let s = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents: één → een
    .replace(/[.!?¿¡"“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  for (const a of ARTICLES[lang] || []) {
    if (s.startsWith(a + ' ')) {
      s = s.slice(a.length + 1)
      break
    }
  }
  return s
}

// "house / home (building)" → ["house", "home (building)", "home building", "home"]
export function variants(text) {
  const parts = text.split(/[\/,;|]/).map((p) => p.trim()).filter(Boolean)
  const out = new Set()
  for (const p of parts) {
    out.add(p)
    out.add(p.replace(/[()]/g, ''))
    out.add(p.replace(/\s*\([^)]*\)\s*/g, ' ').trim())
  }
  return [...out].filter(Boolean)
}

function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return row[b.length]
}

// Returns 'correct' | 'typo' | 'wrong'.
export function checkAnswer(input, acceptedTexts, lang) {
  const guess = normalize(input, lang)
  if (!guess) return 'wrong'
  const targets = acceptedTexts.flatMap(variants).map((t) => normalize(t, lang))
  if (targets.includes(guess)) return 'correct'
  const close = targets.some((t) => {
    const allowed = t.length >= 8 ? 2 : t.length >= 4 ? 1 : 0
    return allowed > 0 && distance(guess, t) <= allowed
  })
  return close ? 'typo' : 'wrong'
}

// Parse pasted text into pairs. One pair per line, Dutch first, separated by
// a tab, " - ", " – ", "=", ":" or ";". Returns { pairs, bad } (bad = unparsable lines).
export function parseBulk(text) {
  const pairs = []
  const bad = []
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    const m =
      line.match(/^(.+?)\t+(.+)$/) ||
      line.match(/^(.+?)\s+[-–—]\s+(.+)$/) ||
      line.match(/^(.+?)\s*[=:;]\s*(.+)$/)
    if (m && m[1].trim() && m[2].trim()) pairs.push({ nl: m[1].trim(), en: m[2].trim() })
    else bad.push(line)
  }
  return { pairs, bad }
}

export function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
