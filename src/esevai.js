const config = require('./config');

// e-Sevai certificates and the documents customers must bring. Used for the automatic
// document-list replies and fed to the AI so follow-up questions get the same answer.
const CERTIFICATES = [
  {
    en: 'Income Certificate', ta: 'வருமானச் சான்றிதழ்',
    match: /income\s*cert|வருமான|varumana/,
    docs: [
      ['Aadhaar Card', 'ஆதார் அட்டை'],
      ['Family Card (Ration Card)', 'குடும்ப அட்டை (ரேஷன் கார்டு)'],
      ['Income Proof (Salary Slip / Self Declaration)', 'வருமானச் சான்று (சம்பளச் சீட்டு / சுய உறுதிமொழி)'],
      ['Mobile Number', 'கைபேசி எண்'],
    ],
  },
  {
    en: 'Community Certificate', ta: 'சமூகச் சான்றிதழ்',
    match: /community\s*cert|caste\s*cert|சமூகச்?\s*சான்|சாதிச்?\s*சான்|jathi\s*(cert|sandru|chandru)/,
    docs: [
      ['Aadhaar Card', 'ஆதார் அட்டை'],
      ['Family Card', 'குடும்ப அட்டை'],
      ['Parent / Sibling Community Certificate (if available)', 'பெற்றோர் / உடன்பிறந்தோர் சமூகச் சான்றிதழ் (இருந்தால்)'],
      ['Mobile Number', 'கைபேசி எண்'],
    ],
  },
  {
    en: 'Residence Certificate', ta: 'இருப்பிடச் சான்றிதழ்',
    match: /residen(ce|tial)\s*cert|இருப்பிட|iruppida/,
    docs: [
      ['Aadhaar Card', 'ஆதார் அட்டை'],
      ['Voter ID', 'வாக்காளர் அடையாள அட்டை'],
      ['Address Proof', 'முகவரிச் சான்று'],
      ['Mobile Number', 'கைபேசி எண்'],
    ],
  },
  {
    en: 'Nativity Certificate', ta: 'பிறப்பிடச் சான்றிதழ்',
    match: /nativity|பிறப்பிட|pirappida/,
    docs: [
      ['Aadhaar Card', 'ஆதார் அட்டை'],
      ['Family Card', 'குடும்ப அட்டை'],
      ['School Transfer Certificate / Birth Certificate', 'பள்ளி மாற்றுச் சான்றிதழ் (TC) / பிறப்புச் சான்றிதழ்'],
      ['Mobile Number', 'கைபேசி எண்'],
    ],
  },
  {
    en: 'OBC Certificate', ta: 'OBC சான்றிதழ்',
    match: /\bobc\b/,
    docs: [
      ['Aadhaar Card', 'ஆதார் அட்டை'],
      ['Family Card', 'குடும்ப அட்டை'],
      ['Community Certificate', 'சமூகச் சான்றிதழ்'],
      ['Mobile Number', 'கைபேசி எண்'],
    ],
  },
  {
    en: 'Unmarried Certificate', ta: 'திருமணம் ஆகாதவர் சான்றிதழ்',
    match: /unmarried|திருமணம்\s*ஆகாத|thirumanam\s*aa?ga?tha/,
    docs: [
      ['Aadhaar Card', 'ஆதார் அட்டை'],
      ['Family Card', 'குடும்ப அட்டை'],
      ['Self Declaration', 'சுய உறுதிமொழி'],
      ['Mobile Number', 'கைபேசி எண்'],
    ],
  },
  {
    en: 'First Graduate Certificate', ta: 'முதலாம் பட்டதாரி சான்றிதழ்',
    match: /first\s*graduat|பட்டதாரி|pattathari/,
    docs: [
      ['Aadhaar Card', 'ஆதார் அட்டை'],
      ['Family Card', 'குடும்ப அட்டை'],
      ['Degree Certificate', 'பட்டச் சான்றிதழ்'],
      ['Family Members Education Details', 'குடும்ப உறுப்பினர்களின் கல்வி விவரங்கள்'],
    ],
  },
  {
    en: 'Legal Heir Certificate', ta: 'சட்ட வாரிசு சான்றிதழ்',
    match: /legal\s*heir|வாரிசு|varisu/,
    docs: [
      ['Death Certificate', 'இறப்புச் சான்றிதழ்'],
      ['Aadhaar Card', 'ஆதார் அட்டை'],
      ['Family Card', 'குடும்ப அட்டை'],
      ['Legal Heir Details', 'வாரிசுதாரர்களின் விவரங்கள்'],
    ],
  },
  {
    en: 'Widow Certificate', ta: 'விதவைச் சான்றிதழ்',
    match: /widow|விதவை|vidhavai|vithavai/,
    docs: [
      ['Aadhaar Card', 'ஆதார் அட்டை'],
      ['Husband Death Certificate', 'கணவரின் இறப்புச் சான்றிதழ்'],
      ['Family Card', 'குடும்ப அட்டை'],
      ['Mobile Number', 'கைபேசி எண்'],
    ],
  },
  {
    en: 'Deserted Woman Certificate', ta: 'கணவரால் கைவிடப்பட்ட பெண் சான்றிதழ்',
    match: /deserted|கைவிடப்பட்ட|kaividapatta/,
    docs: [
      ['Aadhaar Card', 'ஆதார் அட்டை'],
      ['Family Card', 'குடும்ப அட்டை'],
      ['Supporting Documents / Self Declaration', 'ஆதார ஆவணங்கள் / சுய உறுதிமொழி'],
      ['Mobile Number', 'கைபேசி எண்'],
    ],
  },
];

// Asking about e-Sevai in general (no specific certificate) gets the full list.
const GENERAL_MATCH = /e[\s-]?sevai|இ[\s-]?சேவை/;

const CTA = {
  en: `📸 Send clear photos of these documents here on WhatsApp and we'll apply for you. For help, call ${config.BUSINESS_PHONE}.`,
  ta: `📸 இந்த ஆவணங்களின் தெளிவான புகைப்படங்களை இங்கே WhatsApp-ல் அனுப்புங்கள், நாங்கள் உங்களுக்காக விண்ணப்பிக்கிறோம். உதவிக்கு ${config.BUSINESS_PHONE} அழைக்கவும்.`,
};

function matchCertificates(text) {
  const lower = text.toLowerCase();
  return CERTIFICATES.filter((c) => c.match.test(lower));
}

// Returns { reply, service } for an e-Sevai question, or null if the message isn't about e-Sevai.
function getEsevaiReply(text, lang) {
  const i = lang === 'ta' ? 1 : 0;
  const certs = matchCertificates(text);

  if (certs.length) {
    const title = lang === 'ta' ? 'தேவையான ஆவணங்கள்' : 'Required Documents';
    const blocks = certs.slice(0, 3).map((c) =>
      `📄 *${lang === 'ta' ? c.ta : `${c.en} (${c.ta})`}* – ${title}:\n` + c.docs.map((d) => `• ${d[i]}`).join('\n')
    );
    return { reply: `${blocks.join('\n\n')}\n\n${CTA[lang]}`, service: certs[0].en };
  }

  if (GENERAL_MATCH.test(text.toLowerCase())) {
    const header = lang === 'ta' ? '📋 *இ-சேவை சேவைகள் – தேவையான ஆவணங்கள்*' : '📋 *e-Sevai Services – Required Documents*';
    const list = CERTIFICATES.map((c, n) =>
      `*${n + 1}. ${lang === 'ta' ? c.ta : `${c.en} (${c.ta})`}*\n${c.docs.map((d) => d[i]).join(', ')}`
    ).join('\n\n');
    const ask = lang === 'ta'
      ? 'உங்களுக்கு எந்த சான்றிதழ் வேண்டும் என்று பதில் அனுப்புங்கள்.'
      : 'Reply with the certificate you need.';
    return { reply: `${header}\n\n${list}\n\n${ask}\n${CTA[lang]}`, service: 'e-Sevai' };
  }

  return null;
}

// Plain-text version for the AI system prompt.
function esevaiPromptText() {
  return CERTIFICATES.map((c, n) => `${n + 1}. ${c.en} (${c.ta}): ${c.docs.map((d) => d[0]).join(', ')}`).join('\n');
}

module.exports = { getEsevaiReply, esevaiPromptText };
