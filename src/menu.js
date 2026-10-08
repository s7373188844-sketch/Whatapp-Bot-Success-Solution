const config = require('./config');

// Welcome menu sent for greetings; customers reply with a number to get that service's details.
const WELCOME_MENU = [
  '🙏 *Welcome to Success Computech & Gift Shop!*',
  '',
  'வணக்கம்! 😊 எங்கள் சேவைகளைப் பெற கீழே உள்ள எண்ணை *Reply* செய்யவும்.',
  '',
  '1️⃣ *Aadhaar*',
  '2️⃣ *Smart Card*',
  '3️⃣ *Voter ID*',
  '4️⃣ *PAN Card*',
  '5️⃣ *Passport Services*',
  '6️⃣ *Nalavariyam*',
  '7️⃣ *FASTag*',
  '8️⃣ *FSSAI*',
  '9️⃣ *Employment*',
  '🔟 *UDYAM / MSME*',
  '1️⃣1️⃣ *Temple Darshan & Room Booking* (TTD, Sabarimala, Shirdi, Tiruchendur, Palani, etc.)',
  '1️⃣2️⃣ *Insurance* (2 Wheeler, 4 Wheeler, Star Health & SBI Life Insurance)',
  '1️⃣3️⃣ *PF Claim*',
  '',
  '📌 *Example:* PAN Card-க்கு `4` என Reply செய்யவும்.',
  '',
  '🙏 Thank you for contacting us!',
].join('\n');

// Details per menu number, taken from WHATSAPP_BOT_GUIDE.md. Never include prices here.
const MENU_ITEMS = {
  1: {
    service: 'Aadhaar',
    title: '🪪 *Aadhaar Services | ஆதார் சேவைகள்*',
    body: `✅ *எங்கள் சேவைகள்:*
• Address Update (முகவரி மாற்றம்) – Online
• PVC Aadhaar Card Order (பிளாஸ்டிக் கார்டு)
• Document Update (POI / POA)
• e-Aadhaar Download & Print
• Mobile Link Status Check
• Biometric Lock / Unlock

📄 *தேவையான ஆவணங்கள் (Address Update):*
• Aadhaar Card
• Aadhaar-ல் link ஆன mobile number (OTP வரும்)
• புதிய முகவரி proof – கீழே உள்ளதில் ஏதாவது ஒன்று:
   ▫️ Voter ID
   ▫️ Latest Gas Bill
   ▫️ Bank Passbook (கடைசி statement page உடன்)

🙋 *முகவரி proof இல்லையா?* கவலை வேண்டாம், proof இல்லாமலும் முகவரி மாற்றலாம்! மேலும் விவரங்களுக்கு 📞 ${config.BUSINESS_PHONE}-க்கு call செய்யவும்.

💡 OTP mobile இருந்தால் கடைக்கு வர தேவையில்லை. இங்கேயே WhatsApp-ல் முடித்துவிடலாம்!`,
  },
  2: {
    service: 'Smart Card',
    title: '🍚 *Smart Card Services | ஸ்மார்ட் கார்டு (ரேஷன் கார்டு) சேவைகள்*',
    body: `🆕 *புதிய Smart Card*
⚠️ முதலில் மாப்பிள்ளை வீட்டு கார்டு, பொண்ணு வீட்டு கார்டு இரண்டிலும் உங்கள் பெயரை நீக்க வேண்டும்.
📄 தேவை:
• Gas Bill அல்லது Rental Agreement
• குடும்பத்தில் உள்ள அனைவரின் Aadhaar Card
⚠️ அனைவரின் Aadhaar-லும் ஒரே முகவரி இருக்க வேண்டும்.

➕ *பெயர் சேர்த்தல் (திருமணம் / குழந்தை பிறப்பு)*
• Smart Card number அல்லது register ஆன mobile number
• குடும்பத்தில் உள்ள அனைவரின் Aadhaar Card
• குழந்தைக்கு: Birth Certificate
• திருமணம் ஆனவருக்கு: Marriage Certificate
📲 Smart Card mobile number-க்கும், Aadhaar-ல் register ஆன mobile number-க்கும் OTP வரும். இரண்டு phone-ம் கையில் வைத்திருக்கவும்.

➖ *பெயர் நீக்குதல்*
• திருமணம்: Marriage Certificate
• இறப்பு: Death Certificate

🏠 *முகவரி மாற்றம்*
• Recent Gas Bill

👤 *குடும்பத் தலைவர் Photo & பெயர் மாற்றம்*
• குடும்பத் தலைவர் Photo
• Aadhaar Card

🖨️ e-Card Printout & Status Check-ம் செய்து தருகிறோம்.`,
  },
  3: {
    service: 'Voter ID',
    title: '🗳️ *Voter ID Services | வாக்காளர் அடையாள அட்டை சேவைகள்*',
    body: `🆕 *புதிய Voter ID (18 வயது நிரம்பியவர்கள்)*
• Aadhaar Card
• Passport size photo
• வயது proof: 10th Marksheet அல்லது Birth Certificate
• குடும்பத்தில் ஒருவரின் Voter ID (reference-க்கு)

🏠 *முகவரி / தொகுதி மாற்றம்*
• Aadhaar Card
• புதிய முகவரி proof

✏️ *பெயர் / விவரங்கள் திருத்தம்* & 📥 *e-EPIC (Digital Voter ID) Download*-ம் செய்து தருகிறோம்.`,
  },
  4: {
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
  5: {
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
  6: {
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
  7: {
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
  8: {
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
  9: {
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
  10: {
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
  11: {
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
  12: {
    service: 'Insurance',
    title: '🛡️ *Insurance Services*',
    body: `• Two Wheeler (Comprehensive & Third Party)
• Four Wheeler & Commercial Vehicles
• Star Health Insurance (Health / Medical, family plans)
• SBI Life Insurance

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
