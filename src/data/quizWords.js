// The onboarding quiz seeds a user's known words objectively:
// show a Dutch word, four English options. A correct pick marks it known.
// Ordered roughly easy -> harder.

export const quizWords = [
  { nl: 'Bedankt', correct: 'Thanks', options: ['Thanks', 'Sorry', 'Please', 'Goodbye'] },
  { nl: 'het water', correct: 'the water', options: ['the water', 'the milk', 'the bread', 'the wine'] },
  { nl: 'links', correct: 'left', options: ['left', 'right', 'straight', 'behind'] },
  { nl: 'de bus', correct: 'the bus', options: ['the bus', 'the bike', 'the boat', 'the car'] },
  { nl: 'het brood', correct: 'the bread', options: ['the bread', 'the cheese', 'the fruit', 'the egg'] },
  { nl: 'ziek', correct: 'sick', options: ['sick', 'tired', 'happy', 'hungry'] },
  { nl: 'de rekening', correct: 'the bill', options: ['the bill', 'the menu', 'the tip', 'the table'] },
  { nl: 'vers', correct: 'fresh', options: ['fresh', 'frozen', 'cheap', 'sweet'] },
  { nl: 'overstappen', correct: 'to transfer', options: ['to transfer', 'to depart', 'to wait', 'to board'] },
  { nl: 'de korting', correct: 'the discount', options: ['the discount', 'the receipt', 'the basket', 'the queue'] },
  { nl: 'de vergadering', correct: 'the meeting', options: ['the meeting', 'the break', 'the office', 'the deadline'] },
  { nl: 'bewolkt', correct: 'cloudy', options: ['cloudy', 'sunny', 'windy', 'foggy'] },
  { nl: 'de verwijzing', correct: 'the referral', options: ['the referral', 'the prescription', 'the diagnosis', 'the appointment'] },
  { nl: 'gezellig', correct: 'cosy / sociable', options: ['cosy / sociable', 'boring', 'crowded', 'quiet'] },
  { nl: 'de houdbaarheidsdatum', correct: 'the expiry date', options: ['the expiry date', 'the price tag', 'the barcode', 'the receipt'] },
]
