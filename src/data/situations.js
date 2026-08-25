// Every entry: { nl, en }. Levels are attained in order: makkelijk -> gemiddeld -> moeilijk.
// "Makkelijk" covers what is most commonly said in that situation.

export const LEVELS = [
  { key: 'makkelijk', label: 'Makkelijk', en: 'Easy' },
  { key: 'gemiddeld', label: 'Gemiddeld', en: 'Medium' },
  { key: 'moeilijk', label: 'Moeilijk', en: 'Hard' },
]

export const situations = [
    {
    id: 'kapper',
    title: 'Bij de kapper',
    titleEn: 'At the hairdresser',
    icon: '\u{1F487}',
    blurb: 'Booking a cut and explaining exactly what you want done.',
    levels: {
      makkelijk: {
        words: [
          { nl: 'de kapper', en: 'the hairdresser' },
          { nl: 'het haar', en: 'the hair' },
          { nl: 'kort', en: 'short' },
          { nl: 'lang', en: 'long' },
          { nl: 'knippen', en: 'to cut' },
          { nl: 'wassen', en: 'to wash' },
        ],
        phrases: [
          { nl: 'Ik wil mijn haar laten knippen.', en: 'I want to get my hair cut.' },
          { nl: 'Niet te kort, alstublieft.', en: 'Not too short, please.' },
          { nl: 'Heeft u vandaag tijd?', en: 'Do you have time today?' },
        ],
      },
      gemiddeld: {
        words: [
          { nl: 'de afspraak', en: 'the appointment' },
          { nl: 'de pony', en: 'the fringe / bangs' },
          { nl: 'de kleur', en: 'the colour' },
          { nl: 'föhnen', en: 'to blow-dry' },
          { nl: 'de zijkant', en: 'the side' },
          { nl: 'bijwerken', en: 'to trim / touch up' },
        ],
        phrases: [
          { nl: 'Kunt u de zijkanten korter maken?', en: 'Can you make the sides shorter?' },
          { nl: 'Ik wil alleen de punten eraf.', en: 'I just want the ends off.' },
          { nl: 'Mag het een beetje in model?', en: 'Can you shape it a bit?' },
          { nl: 'Wilt u het föhnen?', en: 'Would you like it blow-dried?' },
        ],
      },
      moeilijk: {
        words: [
          { nl: 'de lagen', en: 'the layers' },
          { nl: 'de uitgroei', en: 'the regrowth / roots' },
          { nl: 'de coupe', en: 'the haircut / style' },
          { nl: 'de highlights', en: 'the highlights' },
          { nl: 'verven', en: 'to dye' },
          { nl: 'het volume', en: 'the volume' },
        ],
        phrases: [
          { nl: 'Ik wil graag highlights die natuurlijk ogen.', en: "I'd like highlights that look natural." },
          { nl: 'Kunt u er wat meer volume in brengen?', en: 'Can you add a bit more volume?' },
          { nl: 'De vorige keer was het net iets te donker.', en: 'Last time it was just a touch too dark.' },
        ],
      },
    },
  },

  {
    id: 'vliegveld',
    title: 'Op het vliegveld',
    titleEn: 'At the airport',
    icon: '\u{2708}\u{FE0F}',
    blurb: 'Check-in, security, gates and dealing with delays.',
    levels: {
      makkelijk: {
        words: [
          { nl: 'het vliegveld', en: 'the airport' },
          { nl: 'het vliegtuig', en: 'the airplane' },
          { nl: 'de koffer', en: 'the suitcase' },
          { nl: 'het paspoort', en: 'the passport' },
          { nl: 'de gate', en: 'the gate' },
          { nl: 'het vertrek', en: 'the departure' },
        ],
        phrases: [
          { nl: 'Waar is de incheckbalie?', en: 'Where is the check-in desk?' },
          { nl: 'Hoe laat vertrekt de vlucht?', en: 'What time does the flight leave?' },
          { nl: 'Ik heb één koffer.', en: 'I have one suitcase.' },
        ],
      },
      gemiddeld: {
        words: [
          { nl: 'inchecken', en: 'to check in' },
          { nl: 'de bagage', en: 'the luggage' },
          { nl: 'de instapkaart', en: 'the boarding pass' },
          { nl: 'de douane', en: 'customs' },
          { nl: 'de veiligheidscontrole', en: 'the security check' },
          { nl: 'de aankomst', en: 'the arrival' },
        ],
        phrases: [
          { nl: 'Moet ik mijn koffer afgeven?', en: 'Do I have to check my suitcase?' },
          { nl: 'Bij welke gate is de vlucht naar Berlijn?', en: 'Which gate is the flight to Berlin?' },
          { nl: 'Ik heb alleen handbagage.', en: 'I only have hand luggage.' },
          { nl: 'Waar kan ik mijn bagage ophalen?', en: 'Where can I collect my luggage?' },
        ],
      },
      moeilijk: {
        words: [
          { nl: 'de overstap', en: 'the layover / connection' },
          { nl: 'vertraagd', en: 'delayed' },
          { nl: 'geannuleerd', en: 'cancelled' },
          { nl: 'de instaptijd', en: 'the boarding time' },
          { nl: 'omboeken', en: 'to rebook' },
          { nl: 'de vlucht', en: 'the flight' },
        ],
        phrases: [
          { nl: 'Mijn vlucht is vertraagd; haal ik mijn overstap nog?', en: 'My flight is delayed; will I still make my connection?' },
          { nl: 'Kan ik mijn ticket omboeken naar een latere vlucht?', en: 'Can I rebook my ticket to a later flight?' },
          { nl: 'De vlucht is geannuleerd wegens het weer.', en: 'The flight is cancelled due to the weather.' },
        ],
      },
    },
  },

  {
    id: 'wonen',
    title: 'Een huis huren',
    titleEn: 'Renting & housing',
    icon: '\u{1F3E0}',
    blurb: 'Viewing a place, the contract, deposit and moving in.',
    levels: {
      makkelijk: {
        words: [
          { nl: 'het huis', en: 'the house' },
          { nl: 'de kamer', en: 'the room' },
          { nl: 'de huur', en: 'the rent' },
          { nl: 'de sleutel', en: 'the key' },
          { nl: 'de buurman', en: 'the neighbour' },
          { nl: 'huren', en: 'to rent' },
        ],
        phrases: [
          { nl: 'Ik zoek een kamer.', en: "I'm looking for a room." },
          { nl: 'Hoeveel is de huur?', en: 'How much is the rent?' },
          { nl: 'Is het nog beschikbaar?', en: 'Is it still available?' },
        ],
      },
      gemiddeld: {
        words: [
          { nl: 'de huurder', en: 'the tenant' },
          { nl: 'de verhuurder', en: 'the landlord' },
          { nl: 'het contract', en: 'the contract' },
          { nl: 'de borg', en: 'the deposit' },
          { nl: 'gemeubileerd', en: 'furnished' },
          { nl: 'de servicekosten', en: 'the service costs' },
        ],
        phrases: [
          { nl: 'Zijn de servicekosten inbegrepen?', en: 'Are the service costs included?' },
          { nl: 'Kan ik de woning bezichtigen?', en: 'Can I view the property?' },
          { nl: 'Hoe hoog is de borg?', en: 'How high is the deposit?' },
          { nl: 'Wanneer kan ik erin?', en: 'When can I move in?' },
        ],
      },
      moeilijk: {
        words: [
          { nl: 'de huurovereenkomst', en: 'the tenancy agreement' },
          { nl: 'de opzegtermijn', en: 'the notice period' },
          { nl: 'de inschrijving', en: 'the registration' },
          { nl: 'de energierekening', en: 'the energy bill' },
          { nl: 'de oplevering', en: 'the handover' },
          { nl: 'het gebrek', en: 'the defect' },
        ],
        phrases: [
          { nl: 'Wat is de opzegtermijn van dit contract?', en: 'What is the notice period of this contract?' },
          { nl: 'Ik wil me op dit adres inschrijven.', en: 'I want to register at this address.' },
          { nl: 'Er is een gebrek dat de verhuurder moet verhelpen.', en: "There's a defect the landlord must fix." },
        ],
      },
    },
  },

  {
    id: 'bank',
    title: 'Bij de bank',
    titleEn: 'At the bank',
    icon: '\u{1F3E6}',
    blurb: 'Accounts, cards, transfers and sorting out money matters.',
    levels: {
      makkelijk: {
        words: [
          { nl: 'de bank', en: 'the bank' },
          { nl: 'de rekening', en: 'the account' },
          { nl: 'het geld', en: 'the money' },
          { nl: 'de bankpas', en: 'the bank card' },
          { nl: 'de pincode', en: 'the PIN' },
          { nl: 'pinnen', en: 'to pay / withdraw by card' },
        ],
        phrases: [
          { nl: 'Ik wil een rekening openen.', en: 'I want to open an account.' },
          { nl: 'Waar is een geldautomaat?', en: 'Where is a cash machine?' },
          { nl: 'Mijn pas werkt niet.', en: "My card doesn't work." },
        ],
      },
      gemiddeld: {
        words: [
          { nl: 'de overschrijving', en: 'the transfer' },
          { nl: 'het saldo', en: 'the balance' },
          { nl: 'het afschrift', en: 'the statement' },
          { nl: 'storten', en: 'to deposit' },
          { nl: 'opnemen', en: 'to withdraw' },
          { nl: 'de rente', en: 'the interest' },
        ],
        phrases: [
          { nl: 'Ik wil geld overmaken.', en: 'I want to transfer money.' },
          { nl: 'Wat is mijn saldo?', en: 'What is my balance?' },
          { nl: 'Kan ik hier contant opnemen?', en: 'Can I withdraw cash here?' },
          { nl: 'Ik wil dit bedrag storten.', en: 'I want to deposit this amount.' },
        ],
      },
      moeilijk: {
        words: [
          { nl: 'de hypotheek', en: 'the mortgage' },
          { nl: 'de lening', en: 'the loan' },
          { nl: 'de fraude', en: 'the fraud' },
          { nl: 'de afschrijving', en: 'the debit / charge' },
          { nl: 'het incasso', en: 'the direct debit' },
          { nl: 'blokkeren', en: 'to block' },
        ],
        phrases: [
          { nl: 'Ik wil mijn pas laten blokkeren; hij is gestolen.', en: 'I want to block my card; it was stolen.' },
          { nl: 'Kan ik advies krijgen over een hypotheek?', en: 'Can I get advice about a mortgage?' },
          { nl: 'Er staat een onbekende afschrijving op mijn rekening.', en: "There's an unknown charge on my account." },
        ],
      },
    },
  },

  {
    id: 'bellen',
    title: 'Telefoneren',
    titleEn: 'Phone calls',
    icon: '\u{1F4DE}',
    blurb: 'Making calls, being put through, and handling customer service.',
    levels: {
      makkelijk: {
        words: [
          { nl: 'de telefoon', en: 'the phone' },
          { nl: 'bellen', en: 'to call' },
          { nl: 'het nummer', en: 'the number' },
          { nl: 'de naam', en: 'the name' },
          { nl: 'wachten', en: 'to wait' },
          { nl: 'terugbellen', en: 'to call back' },
        ],
        phrases: [
          { nl: 'Met wie spreek ik?', en: 'Who am I speaking to?' },
          { nl: 'Kunt u dat herhalen?', en: 'Can you repeat that?' },
          { nl: 'Ik bel u terug.', en: "I'll call you back." },
        ],
      },
      gemiddeld: {
        words: [
          { nl: 'doorverbinden', en: 'to put through' },
          { nl: 'de voicemail', en: 'the voicemail' },
          { nl: 'de afspraak', en: 'the appointment' },
          { nl: 'de boodschap', en: 'the message' },
          { nl: 'bereikbaar', en: 'reachable' },
          { nl: 'ophangen', en: 'to hang up' },
        ],
        phrases: [
          { nl: 'Kunt u mij doorverbinden met de administratie?', en: 'Can you put me through to the office?' },
          { nl: 'Kan ik een boodschap achterlaten?', en: 'Can I leave a message?' },
          { nl: 'Ik wil een afspraak maken.', en: "I'd like to make an appointment." },
          { nl: 'Wanneer bent u bereikbaar?', en: 'When are you reachable?' },
        ],
      },
      moeilijk: {
        words: [
          { nl: 'de klantenservice', en: 'customer service' },
          { nl: 'de wachtrij', en: 'the queue (on hold)' },
          { nl: 'het toestelnummer', en: 'the extension number' },
          { nl: 'de storing', en: 'the outage / fault' },
          { nl: 'de klacht', en: 'the complaint' },
          { nl: 'afhandelen', en: 'to handle / resolve' },
        ],
        phrases: [
          { nl: 'Ik bel over een storing in mijn verbinding.', en: "I'm calling about an outage in my connection." },
          { nl: 'U staat momenteel in de wacht.', en: "You're currently on hold." },
          { nl: 'Kunt u mijn klacht verder afhandelen?', en: 'Can you handle my complaint further?' },
        ],
      },
    },
  },

  {
    id: 'nood',
    title: 'Noodgevallen',
    titleEn: 'Emergencies',
    icon: '\u{1F691}',
    blurb: 'The words you hope never to need — but should know cold.',
    levels: {
      makkelijk: {
        words: [
          { nl: 'de hulp', en: 'the help' },
          { nl: 'het alarmnummer', en: 'the emergency number' },
          { nl: 'de politie', en: 'the police' },
          { nl: 'de ambulance', en: 'the ambulance' },
          { nl: 'de brand', en: 'the fire' },
          { nl: 'het ongeluk', en: 'the accident' },
        ],
        phrases: [
          { nl: 'Help!', en: 'Help!' },
          { nl: 'Bel 112!', en: 'Call 112!' },
          { nl: 'Er is een ongeluk gebeurd.', en: 'There has been an accident.' },
        ],
      },
      gemiddeld: {
        words: [
          { nl: 'gewond', en: 'injured' },
          { nl: 'de brandweer', en: 'the fire brigade' },
          { nl: 'bewusteloos', en: 'unconscious' },
          { nl: 'de EHBO', en: 'first aid' },
          { nl: 'gevaarlijk', en: 'dangerous' },
          { nl: 'het slachtoffer', en: 'the victim' },
        ],
        phrases: [
          { nl: 'Er is iemand gewond.', en: 'Someone is injured.' },
          { nl: 'Kom snel, het is dringend!', en: "Come quickly, it's urgent!" },
          { nl: 'Iemand is bewusteloos.', en: 'Someone is unconscious.' },
          { nl: 'Waar doet het pijn?', en: 'Where does it hurt?' },
        ],
      },
      moeilijk: {
        words: [
          { nl: 'de spoedeisende hulp', en: 'the emergency room' },
          { nl: 'reanimeren', en: 'to resuscitate' },
          { nl: 'de verwonding', en: 'the injury' },
          { nl: 'de aangifte', en: 'the (police) report' },
          { nl: 'ademen', en: 'to breathe' },
          { nl: 'de inbraak', en: 'the burglary' },
        ],
        phrases: [
          { nl: 'Het slachtoffer ademt niet meer.', en: 'The victim is no longer breathing.' },
          { nl: 'Ik wil aangifte doen van een inbraak.', en: 'I want to report a burglary.' },
          { nl: 'Waar is de dichtstbijzijnde spoedeisende hulp?', en: 'Where is the nearest emergency room?' },
        ],
      },
    },
  },

  {
    id: 'kleding',
    title: 'Kleding kopen',
    titleEn: 'Clothes shopping',
    icon: '\u{1F455}',
    blurb: 'Sizes, fitting rooms, returns and finding the right fit.',
    levels: {
      makkelijk: {
        words: [
          { nl: 'de kleding', en: 'the clothes' },
          { nl: 'de broek', en: 'the trousers' },
          { nl: 'het shirt', en: 'the shirt' },
          { nl: 'de schoenen', en: 'the shoes' },
          { nl: 'de maat', en: 'the size' },
          { nl: 'passen', en: 'to try on / fit' },
        ],
        phrases: [
          { nl: 'Welke maat heeft u?', en: 'What size do you have?' },
          { nl: 'Mag ik dit passen?', en: 'Can I try this on?' },
          { nl: 'Heeft u dit in het blauw?', en: 'Do you have this in blue?' },
        ],
      },
      gemiddeld: {
        words: [
          { nl: 'de paskamer', en: 'the fitting room' },
          { nl: 'de korting', en: 'the discount' },
          { nl: 'ruilen', en: 'to exchange' },
          { nl: 'de kassa', en: 'the checkout' },
          { nl: 'te klein', en: 'too small' },
          { nl: 'te groot', en: 'too big' },
        ],
        phrases: [
          { nl: 'Waar is de paskamer?', en: 'Where is the fitting room?' },
          { nl: 'Deze is te klein; heeft u een maat groter?', en: 'This is too small; do you have a size bigger?' },
          { nl: 'Kan ik dit ruilen?', en: 'Can I exchange this?' },
          { nl: 'Zit er korting op?', en: 'Is there a discount on it?' },
        ],
      },
      moeilijk: {
        words: [
          { nl: 'retourneren', en: 'to return' },
          { nl: 'de kassabon', en: 'the receipt' },
          { nl: 'de stof', en: 'the fabric' },
          { nl: 'krimpen', en: 'to shrink' },
          { nl: 'de pasvorm', en: 'the fit' },
          { nl: 'afgeprijsd', en: 'marked down' },
        ],
        phrases: [
          { nl: 'Kan ik dit retourneren met de kassabon?', en: 'Can I return this with the receipt?' },
          { nl: 'Krimpt deze stof in de was?', en: 'Does this fabric shrink in the wash?' },
          { nl: 'De pasvorm zit niet lekker rond de schouders.', en: "The fit isn't comfortable around the shoulders." },
        ],
      },
    },
  },

  {
    id: 'uitgaan',
    title: 'Uitgaan',
    titleEn: 'Going out',
    icon: '\u{1F389}',
    blurb: 'Making plans, invitations and the social side of Dutch.',
    levels: {
      makkelijk: {
        words: [
          { nl: 'het feest', en: 'the party' },
          { nl: 'de vriend', en: 'the friend' },
          { nl: 'dansen', en: 'to dance' },
          { nl: 'het drankje', en: 'the drink' },
          { nl: 'leuk', en: 'fun / nice' },
          { nl: 'samen', en: 'together' },
        ],
        phrases: [
          { nl: 'Zullen we iets drinken?', en: 'Shall we get a drink?' },
          { nl: 'Wat wil je doen?', en: 'What do you want to do?' },
          { nl: 'Ik vind het hier leuk.', en: 'I like it here.' },
        ],
      },
      gemiddeld: {
        words: [
          { nl: 'afspreken', en: 'to arrange to meet' },
          { nl: 'uitnodigen', en: 'to invite' },
          { nl: 'het café', en: 'the bar / pub' },
          { nl: 'ophalen', en: 'to pick up' },
          { nl: 'gezellig', en: 'cosy / fun (social)' },
          { nl: 'laat', en: 'late' },
        ],
        phrases: [
          { nl: 'Zullen we vanavond afspreken?', en: 'Shall we meet up tonight?' },
          { nl: 'Ik nodig je uit voor mijn verjaardag.', en: "I'm inviting you to my birthday." },
          { nl: 'Hoe laat spreken we af?', en: 'What time shall we meet?' },
          { nl: 'Kom je ook?', en: 'Are you coming too?' },
        ],
      },
      moeilijk: {
        words: [
          { nl: 'de gelegenheid', en: 'the occasion / venue' },
          { nl: 'de borrel', en: 'the (after-work) drinks' },
          { nl: 'de gastheer', en: 'the host' },
          { nl: 'proosten', en: 'to toast' },
          { nl: 'de gastvrouw', en: 'the hostess' },
          { nl: 'geslaagd', en: 'successful' },
        ],
        phrases: [
          { nl: 'Zullen we proosten op de gastvrouw?', en: 'Shall we toast to the hostess?' },
          { nl: 'Het was een geslaagde avond.', en: 'It was a successful evening.' },
          { nl: 'Ik moet er zo vandoor, maar het was gezellig.', en: 'I have to head off soon, but it was lovely.' },
        ],
      },
    },
  },
]

// Flatten helper: every item in a level, tagged.
export function levelItems(situation, levelKey) {
  const lvl = situation.levels[levelKey]
  if (!lvl) return []
  return [...lvl.words, ...lvl.phrases]
}

// All unique vocabulary across the whole app (for the dictionary tab).
export function allVocabulary() {
  const seen = new Map()
  for (const s of situations) {
    for (const lk of Object.keys(s.levels)) {
      for (const item of levelItems(s, lk)) {
        if (!seen.has(item.nl)) {
          seen.set(item.nl, { ...item, situation: s.title, level: lk })
        }
      }
    }
  }
  return [...seen.values()].sort((a, b) =>
    a.nl.localeCompare(b.nl, 'nl', { sensitivity: 'base' })
  )
}
