import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { situations, LEVELS } from '../data/situations'
import ProgressTrack from '../components/ProgressTrack'

export default function Dashboard() {
  const { data } = useApp()
  const progress = data?.progress || {}

  const totalLevels = situations.length * LEVELS.length
  const doneLevels = situations.reduce(
    (sum, s) => sum + LEVELS.filter((l) => progress[s.id]?.[l.key]).length,
    0
  )
  const knownCount = data?.known?.length || 0

  return (
    <div className="dash">
      <section className="dash__hero">
        <div>
          <p className="eyebrow">Vertrekstaat · Departures</p>
          <h1>Where are you headed today?</h1>
          <p className="dash__lede">
            Each situation is a line with three stops. Clear a stop to open the next one.
          </p>
        </div>
        <div className="dash__stats">
          <div className="stat">
            <span className="stat__num">{doneLevels}<span className="stat__den">/{totalLevels}</span></span>
            <span className="stat__label">levels cleared</span>
          </div>
          <div className="stat">
            <span className="stat__num">{knownCount}</span>
            <span className="stat__label">words known</span>
          </div>
        </div>
      </section>

      <div className="board">
        {situations.map((s) => {
          const prog = progress[s.id] || {}
          const done = LEVELS.filter((l) => prog[l.key]).length
          const complete = done === LEVELS.length
          return (
            <Link key={s.id} to={`/app/situation/${s.id}`} className="board__row">
              <div className="board__icon" aria-hidden="true">{s.icon}</div>
              <div className="board__body">
                <div className="board__titles">
                  <h2>{s.title}</h2>
                  <span className="board__en">{s.titleEn}</span>
                  {complete && <span className="badge badge--done">Compleet</span>}
                </div>
                <p className="board__blurb">{s.blurb}</p>
                <ProgressTrack progress={prog} />
              </div>
              <div className="board__go" aria-hidden="true">→</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
