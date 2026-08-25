import { useSpeech } from '../hooks/useSpeech'

export default function SpeakButton({ text, size = 'md', label }) {
  const { speak, supported } = useSpeech()
  if (!supported) return null
  return (
    <button
      type="button"
      className={`speak speak--${size}`}
      onClick={(e) => {
        e.stopPropagation()
        speak(text)
      }}
      aria-label={label || `Pronounce ${text}`}
      title="Hear it"
    >
      <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
        />
      </svg>
    </button>
  )
}
