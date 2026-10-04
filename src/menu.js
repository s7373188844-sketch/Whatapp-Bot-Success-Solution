const config = require('./config');

// Welcome menu sent for greetings; customers reply with a number to get that service's details.
const WELCOME_MENU = [
  '🙏 *Welcome to Success Computech & Gift Shop!*',
  '',
  'வணக்கம்! 😊 எங்கள் சேவைகளைப் பெற கீழே உள்ள எண்ணை *Reply* செய்யவும்.',
  '',
  '1️⃣ *Aadhaar / Smart Card*',
  '2️⃣ *Voter ID*',
  '3️⃣ *PAN Card*',
  '4️⃣ *Passport Services*',
  '5️⃣ *Nalavariyam*',
  '6️⃣ *FASTag*',
  '7️⃣ *FSSAI*',
  '8️⃣ *Employment*',
  '9️⃣ *UDYAM / MSME*',
  '🔟 *Temple Darshan & Room Booking*',
  '1️⃣1️⃣ *GST Services*',
  '1️⃣2️⃣ *Insurance*',
  '1️⃣3️⃣ *PF Claim*',
  '',
  '📌 *Example:* PAN Card-க்கு `3` என Reply செய்யவும்.',
  '',
  '🙏 Thank you for contacting us!',
].join('\n');

// Details per menu number, taken from WHATSAPP_BOT_GUIDE.md. Never include prices here.
const MENU_ITEMS = {
  1: {
    service: 'Aadhaar',
    title: '🪪 *Aadhaar / Smart Card Services*',
    body: `*Aadhaar:*
• Address Update (Online)
• PVC Aadhaar Card Order
• Document (POI / POA) Update
• e-Aadhaar Download & Print
• Mobile Link Status Check
• Biometric Lock / Unlock

*Smart Card (Ration Card):*
• New Smart Card Application
• Member Add (Marriage / Child Birth)
• Member Delete (Marriage / Death)
• Address / Ration Shop Change
• Family Head Photo & Name Change
• e-Card Printout & Status

📄 *Documents needed:*
• Aadhaar Card (mobile linked for OTP)
• Address proof (Voter ID / EB Bill / Bank Passbook)
• For adding a member: Aadhaar of all members + Birth / Marriage certificate

⏱️ Aadhaar address update: 3-7 working days. Smart Card approval: 15-30 days.`,
  },
  2: {
    service: 'Voter ID',
    title: '🗳️ *Voter ID Services*',
    body: `• New Voter ID (18+ years) – Form 6
• Address / Constituency Change – Form 8
• Corrections & e-EPIC Download

📄 *Documents needed (New Voter ID):*
• Aadhaar Card
• Passport size photo
• Age proof (10th marksheet / Birth certificate)
• Family member's Voter ID (for reference)

📄 *For address change:* Aadhaar Card + new address proof`,
  },
  3: {
    service: 'PAN Card',
    title: '💳 *PAN Card Services*',
    body: `• New PAN Card
• Correction (Name / DOB)
• Lost PAN – Reprint
• Minor PAN (below 18) & Minor to Major

📄 *Documents needed:*
• Aadhaar Card (mobile linked for OTP)
• 2 Passport size photos
• Signature on white paper
• For correction: existing PAN copy + Aadhaar

⏱️ e-PAN in 2-3 days, physical card in 7-10 days.`,
  },
  4: {
    service: 'Passport',
    title: '🛂 *Passport Services*',
    body: `• New Passport / Renewal
• Normal & Tatkal
• Online form filling & appointment booking (POPSK Tiruppur / PSK Coimbatore)

📄 *Documents needed:*
• Aadhaar Card (name, DOB & address must match)
• 10th / 12th marksheet
• PAN Card or Voter ID
• Bank Passbook with photo
• Old passport (for renewal)

⏱️ Appointment within 24 hours. Passport: 15-30 days (Normal), 7-10 days (Tatkal) after verification.`,
  },
  5: {
    service: 'Welfare Board',
    title: '👷 *Nalavariyam (Welfare Board) Services*',
    body: `• New Construction Workers registration
• Unorganized / Manual Workers registration
• Annual card renewal
• Pension claim (60+ years)
• Marriage & Education assistance
• Accident / Death assistance claim

📄 *Documents needed:*
• Aadhaar Card
• Bank Passbook
• Work certificate / VAO certificate
• Nominee Aadhaar & photo
• Ration Card / Smart Card copy`,
  },
  6: {
    service: 'FASTag',
    title: '🚗 *FASTag Services*',
    body: `• New FASTag – Instant Activation
• FASTag Recharge
• KYC Update

📄 *Documents needed:*
• RC Book (Vehicle Registration Certificate)
• Vehicle owner's Aadhaar / PAN Card
• Passport size photo of owner
• Vehicle photo (number plate clearly visible)`,
  },
  7: {
    service: 'FSSAI',
    title: '🍽️ *FSSAI Food Licence*',
    body: `Mandatory for hotels, bakeries, tea stalls, grocery shops & food traders.
• Basic FSSAI Registration (small vendors)
• State FSSAI Licence
• Annual Renewal
• Address Change / Modification

📄 *Documents needed:*
• Owner photo & Aadhaar Card
• Business address proof (EB bill / rent deed)
• List of food items / category

⏱️ Processing: 3-7 working days.`,
  },
  8: {
    service: 'Employment Exchange',
    title: '💼 *Employment Exchange*',
    body: `• New Registration (10th, 12th, ITI, Diploma, Degree)
• 3-Year Renewal
• Add New Qualifications

📄 *Documents needed:*
• Aadhaar Card
• Educational marksheets
• Community certificate

⏱️ Registration is instant – ID card generated immediately!`,
  },
  9: {
    service: 'MSME',
    title: '🏭 *UDYAM / MSME Registration*',
    body: `Government certificate for small businesses – useful for bank loans, subsidies & tenders.

📄 *Documents needed:*
• Aadhaar Card (mobile linked for OTP)
• PAN Card
• Business name & start date
• Bank account number & IFSC code

⏱️ Certificate generated within 24 hours!`,
  },
  10: {
    service: 'Temple Booking',
    title: '🛕 *Temple Darshan & Room Booking*',
    body: `• Sabarimala Virtual Queue
• TTD Tirupati Special Entry Darshan
• TTD Accommodation / Room Booking
• Shirdi Sai Baba Darshan & Aarti Pass
• Tiruchendur & Palani Murugan Temple (incl. Rope Car)

📄 *Details needed:*
• Aadhaar copies of all pilgrims
• Devotee photo (for Sabarimala)
• Contact mobile number
• Preferred dates & time`,
  },
  11: {
    service: 'GST',
    title: '🧾 *GST Services*',
    body: `• New GST Registration
• Monthly Returns – GSTR-1, GSTR-3B, CMP-08
• Annual Return – GSTR-9
• Cancelled GST Revocation

📄 *Documents needed (Registration):*
• PAN & Aadhaar of owner / partners
• Business address proof (rent agreement + EB bill / tax receipt)
• Bank details (cancelled cheque / statement)
• Owner passport size photo
• Nature of business details

⏱️ Registration: 3-5 working days. Returns filed same day.`,
  },
  12: {
    service: 'Insurance',
    title: '🛡️ *Insurance Services*',
    body: `• Two Wheeler (Comprehensive & Third Party)
• Four Wheeler & Commercial Vehicles
• Health / Medical Insurance for families

📄 *Documents needed:*
• RC Book
• Previous policy copy (for renewal)
• Owner Aadhaar Card

⏱️ Vehicle policy issued in 5 minutes!`,
  },
  13: {
    service: 'PF/EPFO',
    title: '🏦 *PF Claim Services*',
    body: `• PF Withdrawal – Form 19 & Form 10C (pension)
• PF Advance – Form 31 (medical, house, etc.)
• UAN Retrieval, Activation & Password Reset
• KYC Update & E-Nomination

📄 *Documents needed:*
• UAN number or Member ID
• Aadhaar Card (mobile linked for OTP)
• Bank Passbook or cancelled cheque
• PAN Card

⏱️ Online filing in 30 minutes. EPFO credits in 7-15 days.`,
  },
};

const FOOTER = `📸 Send clear photos of your documents here on WhatsApp. For help, call ${config.BUSINESS_PHONE}.
📋 அனைத்து சேவைகளையும் பார்க்க *menu* என Reply செய்யவும்.`;

const HONORIFICS = new Set(['anna', 'sir', 'madam', 'mam', 'maam', 'bro', 'akka', 'ji', 'da', 'team', 'there', 'all']);

// True for messages that are only a greeting ("Hi", "hello sir", "வணக்கம்", "menu"), not "hi, need PAN card".
function isGreeting(text) {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ') // \p{M} keeps Tamil vowel signs
    .split(/\s+/)
    .filter((w) => w && !HONORIFICS.has(w));
  if (!words.length) return false;
  const phrase = words.join(' ');
  return config.GREETING_WORDS.includes(phrase) || /^(hi+|he+y+|hel+o+|hl+o+)$/.test(phrase);
}

// "3", " 11 ", "3️⃣", "1️⃣1️⃣", "🔟" -> menu number, or null.
function parseMenuChoice(text) {
  const t = text.trim().replace(/🔟/g, '10').replace(/[️⃣\s]/g, '');
  if (!/^\d{1,2}$/.test(t)) return null;
  return MENU_ITEMS[Number(t)] ? Number(t) : null;
}

function getMenuItemReply(n) {
  const item = MENU_ITEMS[n];
  return { reply: `${item.title}\n\n${item.body}\n\n${FOOTER}`, service: item.service };
}

// Plain list for the AI system prompt, so its menu numbers match ours.
function menuPromptText() {
  return Object.entries(MENU_ITEMS).map(([n, item]) => `${n}. ${item.service}`).join(', ');
}

module.exports = { WELCOME_MENU, isGreeting, parseMenuChoice, getMenuItemReply, menuPromptText };
