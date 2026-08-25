import { LEVELS } from '../data/situations'

// Progress rendered as a three-stop transit line: Makkelijk -> Gemiddeld -> Moeilijk.
export default function ProgressTrack({ progress = {}, compact = false }) {
  const done = LEVELS.filter((l) => progress[l.key]).length
  const pct = (done / LEVELS.length) * 100

  return (
    <div className={`track ${compact ? 'track--compact' : ''}`}>
      <div className="track__line">
        <div className="track__fill" style={{ width: `${pct}%` }} />
        {LEVELS.map((l, i) => {
          const reached = progress[l.key]
          const left = (i / (LEVELS.length - 1)) * 100
          return (
            <span
              key={l.key}
              className={`track__stop ${reached ? 'is-done' : ''}`}
              style={{ left: `${left}%` }}
              title={`${l.label} (${l.en})`}
            />
          )
        })}
      </div>
      {!compact && (
        <div className="track__labels">
          {LEVELS.map((l) => (
            <span key={l.key} className={progress[l.key] ? 'is-done' : ''}>
              {l.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
