import SpeakButton from './SpeakButton'

// The one consistent way a Dutch word/phrase is shown across the whole app:
// Dutch text, English translation, and a pronunciation key.
export default function WordCard({ nl, en, tag }) {
  return (
    <div className="wordcard">
      <div className="wordcard__main">
        <span className="wordcard__nl">{nl}</span>
        <span className="wordcard__en">{en}</span>
        {tag && <span className="wordcard__tag">{tag}</span>}
      </div>
      <SpeakButton text={nl} />
    </div>
  )
}
