import { useEffect, useState } from 'react'

// Pronounces Dutch text with the browser's built-in speech synthesis.
// No API key, no network — works offline once the app has loaded.

// Score a voice for how well it fits Dutch. Non-Dutch voices score -1 and
// are never used, so we don't fall back to an English voice and read Dutch
// text with an English accent.
function scoreDutchVoice(v) {
  const lang = (v.lang || '').toLowerCase().replace('_', '-')
  if (!lang.startsWith('nl')) return -1
  let score = lang === 'nl-nl' ? 100 : 80 // prefer Netherlands Dutch over Flemish
  if (v.localService) score += 10 // installed voices are more reliable
  const name = (v.name || '').toLowerCase()
  // Known-good Dutch voices across platforms.
  if (/(xander|ellen|claire|lotte|google nederlands|nederlands|dutch)/.test(name)) score += 5
  return score
}

function pickDutchVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices() || []
  let best = null
  let bestScore = 0
  for (const v of voices) {
    const s = scoreDutchVoice(v)
    if (s > bestScore) {
      bestScore = s
      best = v
    }
  }
  return best // null if the system has no Dutch voice at all
}

export function useSpeech() {
  const [supported, setSupported] = useState(false)
  const [hasDutchVoice, setHasDutchVoice] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    setSupported(true)

    const refresh = () => setHasDutchVoice(!!pickDutchVoice())
    refresh()
    // Voices load asynchronously in most browsers.
    window.speechSynthesis.onvoiceschanged = refresh
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const speakWith = (text) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'nl-NL' // always request Dutch, even if no named voice is found
    u.rate = 0.9
    u.pitch = 1
    const voice = pickDutchVoice()
    if (voice) u.voice = voice
    window.speechSynthesis.speak(u)
  }

  const speak = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    // If voices aren't ready yet (first click on a cold load), wait for them once.
    const voices = window.speechSynthesis.getVoices()
    if (!voices || voices.length === 0) {
      const once = () => {
        window.speechSynthesis.onvoiceschanged = null
        speakWith(text)
      }
      window.speechSynthesis.onvoiceschanged = once
      // Safety net in case the event never fires.
      setTimeout(() => {
        if (window.speechSynthesis.onvoiceschanged === once) {
          window.speechSynthesis.onvoiceschanged = null
          speakWith(text)
        }
      }, 250)
      return
    }

    speakWith(text)
  }

  return { speak, supported, hasDutchVoice }
}