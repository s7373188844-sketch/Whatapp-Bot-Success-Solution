const config = require('./config');

const PRICE_RESPONSE = {
  en: `Thank you for your interest! Our team will get back to you shortly with the exact details. You can also call us directly at ${config.BUSINESS_PHONE} for immediate assistance.`,
  ta: `உங்கள் ஆர்வத்திற்கு நன்றி! எங்கள் குழு விரைவில் துல்லியமான விவரங்களுடன் உங்களை தொடர்பு கொள்ளும். உடனடி உதவிக்கு ${config.BUSINESS_PHONE} என்ற எண்ணில் அழைக்கவும்.`,
};

const WELCOME_MESSAGE = {
  en: `Welcome to *${config.BUSINESS_NAME}!* 🏪

We provide *100+ Digital Services*, Printing Solutions & Personalised Gifts — all from the comfort of your home via WhatsApp!

How can we help you today? Choose a category:

1️⃣ ID & Document Services (Aadhaar, PAN, Voter ID, Smart Card)
2️⃣ Passport & Travel Services
3️⃣ Vehicle & Driving Services (DL, LLR, RC, FASTag)
4️⃣ Business & Tax (GST, MSME, FSSAI)
5️⃣ Employment & PF Services
6️⃣ Property & Certificates (Patta, EC, Birth, Death)
7️⃣ Education & Exam Applications (TNPSC, TET, Bank Exams)
8️⃣ Temple Darshan Booking (Sabarimala, Tirupati, Shirdi)
9️⃣ Travel Tickets (Train, Bus, Flight)
🔟 Insurance, Welfare & Astrology
🎁 Personalised Gifts & Printing
📍 Track My Application Status

Or simply type your requirement and we'll guide you!`,

  ta: `*சக்ஸஸ் கம்ப்யூடெக் & கிஃப்ட் ஷாப்*பிற்கு வரவேற்கிறோம்! 🏪

*100+ டிஜிட்டல் சேவைகள்*, பிரிண்டிங் & பிரத்யேக பரிசுகள் — வாட்ஸ்அப் மூலமே பெறலாம்!

எந்த சேவை தேவை? ஒரு எண்ணை தேர்வு செய்யுங்கள்:

1️⃣ அடையாள அட்டை சேவைகள் (ஆதார், பான், வாக்காளர், ஸ்மார்ட் கார்டு)
2️⃣ பாஸ்போர்ட் சேவைகள்
3️⃣ வாகன & ஓட்டுநர் சேவைகள் (DL, LLR, RC)
4️⃣ வணிக & வரி சேவைகள் (GST, MSME, FSSAI)
5️⃣ வேலைவாய்ப்பு & PF சேவைகள்
6️⃣ சொத்து & சான்றிதழ்கள் (பட்டா, EC, பிறப்பு, இறப்பு)
7️⃣ தேர்வு விண்ணப்பங்கள் (TNPSC, TET, வங்கி)
8️⃣ கோயில் தரிசன முன்பதிவு
9️⃣ பயண டிக்கெட் புக்கிங்
🔟 காப்பீடு, நலவாரியம் & ஜாதகம்
🎁 பரிசுகள் & பிரிண்டிங்
📍 எனது விண்ணப்ப நிலை

அல்லது உங்கள் தேவையை தட்டச்சு செய்யுங்கள்!`,
};

const AFTER_HOURS_MESSAGE = {
  en: `Thank you for messaging *${config.BUSINESS_NAME}!* Our working hours are Mon-Sat 9:30 AM to 9:00 PM and Sunday 9:00 AM to 2:00 PM. We've noted your message and will respond first thing during business hours. For urgent needs, please call ${config.BUSINESS_PHONE}.`,
  ta: `*சக்ஸஸ் கம்ப்யூடெக்*கிற்கு செய்தி அனுப்பியதற்கு நன்றி! எங்கள் பணி நேரம் திங்கள்-சனி காலை 9:30 முதல் இரவு 9:00 வரை, ஞாயிறு காலை 9:00 முதல் மதியம் 2:00 வரை. உங்கள் செய்தி பதிவு செய்யப்பட்டுள்ளது, பணி நேரத்தில் உடனடியாக பதிலளிக்கப்படும். அவசரத்திற்கு ${config.BUSINESS_PHONE} அழைக்கவும்.`,
};

const DOCUMENT_RECEIVED = {
  en: `We've received your documents! ✅ Our team is reviewing them now. We'll verify the eligibility and get back to you shortly with the next steps. Thank you for choosing *Success Computech!*`,
  ta: `உங்கள் ஆவணங்கள் பெறப்பட்டன! ✅ எங்கள் குழு இப்போது சரிபார்த்துக் கொண்டிருக்கிறது. தகுதியை உறுதி செய்து அடுத்த நடவடிக்கை குறித்து விரைவில் தெரிவிப்போம். *சக்ஸஸ் கம்ப்யூடெக்*கை தேர்ந்தெடுத்ததற்கு நன்றி!`,
};

const UNKNOWN_QUERY = {
  en: `Thank you for reaching out! We couldn't match your query to a specific service. Could you please describe what you need, or choose from our service categories?

Reply with *Hi* to see the full menu, or call us at ${config.BUSINESS_PHONE} and our team will assist you right away.`,
  ta: `தொடர்பு கொண்டமைக்கு நன்றி! உங்கள் தேவையை சரியாக புரிந்துகொள்ள இயலவில்லை. தயவுசெய்து மீண்டும் விளக்கமாக கூறுங்கள் அல்லது *Hi* என்று அனுப்பி சேவை பட்டியலை பாருங்கள்.

உடனடி உதவிக்கு ${config.BUSINESS_PHONE} என்ற எண்ணில் அழைக்கவும்.`,
};

const CTA = {
  en: `\n\nWould you like to proceed? Send your documents here or call us at ${config.BUSINESS_PHONE}. 📞`,
  ta: `\n\nதொடர விரும்புகிறீர்களா? உங்கள் ஆவணங்களை இங்கே அனுப்புங்கள் அல்லது ${config.BUSINESS_PHONE} அழைக்கவும். 📞`,
};

const SERVICE_RESPONSES = [
  // --- AADHAAR ---
  {
    keywords: ['aadhaar address', 'aadhaar update', 'aadhar address', 'update aadhaar', 'address change aadhaar', 'aadhaar address update', 'ஆதார் முகவரி'],
    response: {
      en: `You can update your Aadhaar address online without visiting our centre! Just send us:
• Your current Aadhaar number
• A valid address proof (Voter ID, EB Bill, Ration Card, or Bank Passbook)
• Your Aadhaar-registered mobile number must be active for OTP

We'll process it on the official UIDAI portal and send you the acknowledgment receipt. Address update usually takes *3-7 working days*.`,
      ta: `ஆதார் முகவரியை ஆன்லைனில் புதுப்பிக்கலாம்! கீழ்க்கண்டவற்றை அனுப்புங்கள்:
• உங்கள் ஆதார் எண்
• முகவரி ஆதாரம் (வாக்காளர் அட்டை, EB பில், ரேஷன் கார்டு, அல்லது வங்கி பாஸ்புக்)
• OTP-க்கு ஆதாரில் இணைக்கப்பட்ட மொபைல் எண் செயலில் இருக்க வேண்டும்

UIDAI போர்ட்டலில் செயல்படுத்தி ரசீது அனுப்புவோம். *3-7 வேலை நாட்கள்* ஆகும்.`,
    },
  },
  {
    keywords: ['pvc aadhaar', 'pvc aadhar', 'aadhaar pvc', 'plastic aadhaar', 'pvc card aadhaar'],
    response: {
      en: `Yes! We can order the official UIDAI *PVC Aadhaar card* for you. It is waterproof and durable. It typically arrives at your registered address within *7-14 working days* via Speed Post.

Just send your Aadhaar number and we'll place the order.`,
      ta: `ஆம்! அதிகாரப்பூர்வ UIDAI *PVC ஆதார் கார்டு* ஆர்டர் செய்யலாம். இது நீர்ப்புகா மற்றும் நீடித்த உழைக்கும். *7-14 வேலை நாட்களில்* ஸ்பீட் போஸ்ட் மூலம் வரும்.

உங்கள் ஆதார் எண்ணை அனுப்புங்கள்.`,
    },
  },
  {
    keywords: ['aadhaar without visit', 'aadhaar remote', 'aadhaar online', 'aadhaar from home', 'aadhaar without coming'],
    response: {
      en: `Absolutely! If your mobile number is linked to your Aadhaar for OTP, you can send photos of your address proof documents to this WhatsApp number (${config.BUSINESS_PHONE}). We'll handle everything remotely and send you the receipt.`,
      ta: `நிச்சயமாக! OTP-க்கு உங்கள் மொபைல் ஆதாரில் இணைக்கப்பட்டிருந்தால், ஆவண புகைப்படங்களை இந்த வாட்ஸ்அப் எண்ணுக்கு (${config.BUSINESS_PHONE}) அனுப்புங்கள். நாங்கள் எல்லாவற்றையும் தொலைநிலையில் செய்து ரசீது அனுப்புவோம்.`,
    },
  },
  {
    keywords: ['aadhaar services', 'aadhaar service list', 'what aadhaar', 'aadhaar help', 'ஆதார் சேவை'],
    response: {
      en: `We provide the following *Aadhaar services*:
• Aadhaar Address Update (Online)
• Aadhaar PVC Card Order
• Document (POI / POA) Update
• Aadhaar Masked / e-Aadhaar Download & Print
• Aadhaar-Mobile Link Status Verification
• Biometric Lock / Unlock Support

Which one do you need help with?`,
      ta: `நாங்கள் வழங்கும் *ஆதார் சேவைகள்*:
• ஆதார் முகவரி புதுப்பிப்பு
• PVC ஆதார் கார்டு ஆர்டர்
• ஆவண (POI / POA) புதுப்பிப்பு
• மாஸ்க்ட் / e-ஆதார் டவுன்லோடு & பிரிண்ட்
• ஆதார்-மொபைல் இணைப்பு சரிபார்ப்பு
• பயோமெட்ரிக் லாக் / அன்லாக்

எந்த சேவை தேவை?`,
    },
  },

  // --- PAN CARD ---
  {
    keywords: ['new pan', 'pan card apply', 'apply pan', 'pan card new', 'புதிய பான்', 'pan application'],
    response: {
      en: `For a new PAN card, you need:
• Aadhaar Card (mandatory)
• 2 Passport size photos
• Signature on white paper

If your Aadhaar is linked to your mobile for OTP, the entire process can be done online in just *15 minutes!* You'll receive your e-PAN in *2-3 days* and the physical card in *7-10 days*.

Send your Aadhaar photo here and we'll get started.`,
      ta: `புதிய PAN கார்டுக்கு தேவை:
• ஆதார் கார்டு (கட்டாயம்)
• 2 பாஸ்போர்ட் சைஸ் புகைப்படங்கள்
• வெள்ளை தாளில் கையொப்பம்

OTP மொபைல் இணைக்கப்பட்டிருந்தால், *15 நிமிடத்தில்* ஆன்லைனில் செய்யலாம்! e-PAN *2-3 நாட்களில்*, கார்டு *7-10 நாட்களில்* வரும்.

ஆதார் புகைப்படத்தை இங்கே அனுப்புங்கள்.`,
    },
  },
  {
    keywords: ['lost pan', 'pan lost', 'pan card lost', 'missing pan', 'pan card missing'],
    response: {
      en: `Don't worry! Using your Aadhaar details and date of birth, we can retrieve your existing PAN number and apply for a genuine reprint. Just send your Aadhaar card copy to this WhatsApp.`,
      ta: `கவலைப்பட வேண்டாம்! உங்கள் ஆதார் மற்றும் பிறந்த தேதி மூலம் PAN எண்ணை மீட்டெடுத்து புதிய பிரதி விண்ணப்பிக்கலாம். ஆதார் நகலை இங்கே அனுப்புங்கள்.`,
    },
  },
  {
    keywords: ['pan correction', 'pan name change', 'pan dob change', 'correct pan', 'pan card correction', 'pan update'],
    response: {
      en: `We can help with PAN corrections. You'll need:
• Your existing PAN number or card copy
• Aadhaar card (with correct details)

The correction is filed online and you'll receive the updated e-PAN in *2-3 days*.`,
      ta: `PAN திருத்தத்திற்கு உதவுவோம். தேவை:
• தற்போதைய PAN எண் அல்லது கார்டு நகல்
• ஆதார் கார்டு (சரியான விவரங்களுடன்)

ஆன்லைனில் திருத்தி *2-3 நாட்களில்* புதுப்பிக்கப்பட்ட e-PAN கிடைக்கும்.`,
    },
  },
  {
    keywords: ['minor pan', 'child pan', 'pan below 18', 'pan for kid'],
    response: {
      en: `Yes! Minor PAN card can be applied using the parent's Aadhaar card. Once the child turns 18, we can also help convert the minor PAN to a major PAN card.`,
      ta: `ஆம்! பெற்றோரின் ஆதார் மூலம் மைனர் PAN கார்டு விண்ணப்பிக்கலாம். 18 வயதானதும் மேஜர் PAN ஆக மாற்றவும் உதவுவோம்.`,
    },
  },

  // --- SMART CARD / RATION CARD ---
  {
    keywords: ['ration card', 'smart card add', 'add name ration', 'smart card', 'ration card child', 'ரேஷன் கார்டு', 'ஸ்மார்ட் கார்டு'],
    response: {
      en: `For adding a family member (child birth / marriage) to your ration card, you'll need:
• Smart Card number or registered mobile number
• Aadhaar cards of all family members
• Birth certificate (for child) or Marriage certificate

Send these documents here and we'll file the application. Government approval usually takes *15-30 days*.`,
      ta: `ரேஷன் கார்டில் குடும்ப உறுப்பினர் சேர்க்க தேவை:
• ஸ்மார்ட் கார்டு எண் அல்லது பதிவு மொபைல் எண்
• அனைத்து குடும்ப உறுப்பினர்களின் ஆதார்
• பிறப்பு சான்றிதழ் / திருமண சான்றிதழ்

ஆவணங்களை அனுப்புங்கள். அரசு ஒப்புதல் *15-30 நாட்கள்* ஆகும்.`,
    },
  },
  {
    keywords: ['smart card services', 'smart card service list', 'ration card services'],
    response: {
      en: `We help with:
• New Smart Card Application
• Member Name Addition (Marriage / Child Birth)
• Member Name Deletion (Marriage / Death)
• Address / Fair Price Shop Change
• Family Head Photo & Name Modification
• Smart Card Status & e-Card Printout

Which service do you need?`,
      ta: `நாங்கள் வழங்கும் சேவைகள்:
• புதிய ஸ்மார்ட் கார்டு விண்ணப்பம்
• உறுப்பினர் பெயர் சேர்ப்பு / நீக்கம்
• முகவரி / நியாய விலை கடை மாற்றம்
• குடும்ப தலைவர் புகைப்படம் & பெயர் மாற்றம்
• ஸ்மார்ட் கார்டு நிலை & e-கார்டு பிரிண்ட்

எந்த சேவை தேவை?`,
    },
  },

  // --- VOTER ID ---
  {
    keywords: ['voter id', 'voter card', 'new voter', 'voter registration', 'வாக்காளர்', 'voter id apply'],
    response: {
      en: `For new voter registration (18+ years), you need:
• Aadhaar Card
• Passport size photo
• Age proof (10th marksheet or birth certificate)
• Family member's Voter ID for reference

We'll fill Form 6 on the official ECI portal. Send your documents to start!`,
      ta: `புதிய வாக்காளர் பதிவுக்கு (18+ வயது) தேவை:
• ஆதார் கார்டு
• பாஸ்போர்ட் சைஸ் புகைப்படம்
• வயது ஆதாரம் (10ம் வகுப்பு மதிப்பெண் அல்லது பிறப்பு சான்றிதழ்)
• குடும்ப உறுப்பினரின் வாக்காளர் அட்டை

ECI போர்ட்டலில் Form 6 நிரப்புவோம். ஆவணங்களை அனுப்புங்கள்!`,
    },
  },
  {
    keywords: ['voter address change', 'voter id address', 'change address voter'],
    response: {
      en: `We can file Form 8 for constituency/address change on your Voter ID. You'll need your Aadhaar card and new address proof. The online submission is immediate, followed by ECI verification.`,
      ta: `வாக்காளர் அட்டையில் முகவரி மாற்ற Form 8 தாக்கல் செய்வோம். ஆதார் மற்றும் புதிய முகவரி ஆதாரம் தேவை. ஆன்லைன் சமர்ப்பிப்பு உடனடி, ECI சரிபார்ப்பு தொடரும்.`,
    },
  },

  // --- PVC PRINTING ---
  {
    keywords: ['pvc card', 'pvc print', 'plastic card', 'id card print', 'pvc lamination'],
    response: {
      en: `Yes! We produce high-definition, waterproof, non-tearable PVC plastic cards for:
• Aadhaar Card
• PAN Card
• Driving Licence
• Voter ID
• Student / Staff / Corporate ID Cards
• Ayushman Bharat Health Card

Ready in just *5-15 minutes!* Send the document PDF or clear photo via WhatsApp. Courier delivery is also available.`,
      ta: `ஆம்! உயர் தெளிவு, நீர்ப்புகா PVC பிளாஸ்டிக் கார்டுகள்:
• ஆதார், PAN, DL, வாக்காளர் அட்டை
• மாணவர் / ஊழியர் / கார்ப்பரேட் ID
• ஆயுஷ்மான் பாரத் ஹெல்த் கார்டு

*5-15 நிமிடங்களில்* ரெடி! ஆவண PDF அல்லது புகைப்படம் வாட்ஸ்அப்பில் அனுப்புங்கள்.`,
    },
  },

  // --- PASSPORT ---
  {
    keywords: ['passport', 'new passport', 'passport apply', 'பாஸ்போர்ட்', 'passport service'],
    response: {
      en: `We provide end-to-end *passport assistance*:
• Online form filling on the official Passport Seva portal
• Document eligibility check
• Government fee payment
• Appointment slot booking at POPSK Tiruppur or PSK Coimbatore
• Printed checklist of documents to carry

*Documents needed:*
• Aadhaar Card (name, DOB & address must match)
• 10th/12th marksheet (for ECNR proof)
• PAN Card or Voter ID
• Bank Passbook with photo (nationalized bank)
• Old passport (for renewal)

Send your Aadhaar and marksheet photos here to begin.`,
      ta: `முழுமையான *பாஸ்போர்ட் உதவி*:
• Passport Seva போர்ட்டலில் ஆன்லைன் படிவம்
• ஆவண தகுதி சரிபார்ப்பு
• அரசு கட்டணம் செலுத்தல்
• POPSK திருப்பூர் / PSK கோயம்புத்தூர் நேர முன்பதிவு

*தேவையான ஆவணங்கள்:*
• ஆதார், 10/12 மதிப்பெண், PAN / வாக்காளர், வங்கி பாஸ்புக்

ஆதார் & மதிப்பெண் புகைப்படம் அனுப்புங்கள்.`,
    },
  },
  {
    keywords: ['tatkal passport', 'urgent passport', 'passport tatkal'],
    response: {
      en: `Yes! We assist with both *Normal and Tatkal* passport applications. We'll book the earliest available appointment slot at the nearest Passport Seva Kendra.`,
      ta: `ஆம்! *சாதாரண மற்றும் தட்கல்* பாஸ்போர்ட் விண்ணப்பங்களுக்கு உதவுவோம். அருகிலுள்ள PSK-யில் ஆரம்ப நேர முன்பதிவு செய்வோம்.`,
    },
  },
  {
    keywords: ['passport time', 'how long passport', 'passport duration', 'passport how many days'],
    response: {
      en: `Appointment booking is done within *24 hours*. After your PSK visit and police verification, the passport is typically issued within *15-30 days* (Normal) or *7-10 days* (Tatkal).`,
      ta: `நேர முன்பதிவு *24 மணி நேரத்தில்* செய்யப்படும். PSK விஜயம் & போலீஸ் சரிபார்ப்புக்குப் பிறகு, பாஸ்போர்ட் *15-30 நாட்கள்* (சாதாரண) அல்லது *7-10 நாட்கள்* (தட்கல்) ஆகும்.`,
    },
  },

  // --- DRIVING LICENCE & VEHICLE ---
  {
    keywords: ['llr', 'learner licence', 'learner license', 'learning licence', 'llr apply'],
    response: {
      en: `For *LLR application*, you need:
• Aadhaar Card with active mobile for OTP
• Blood group report
• Passport size photo & signature

We'll register on the Parivahan Sarathi portal and help with online exam support. Processing takes *3-7 days* after RTO approval.`,
      ta: `*LLR விண்ணப்பத்திற்கு* தேவை:
• OTP மொபைலுடன் ஆதார்
• இரத்த வகை அறிக்கை
• பாஸ்போர்ட் புகைப்படம் & கையொப்பம்

Parivahan Sarathi போர்ட்டலில் பதிவு செய்வோம். RTO ஒப்புதலுக்குப் பிறகு *3-7 நாட்கள்*.`,
    },
  },
  {
    keywords: ['dl renewal', 'driving licence renewal', 'renew dl', 'expired dl', 'dl expired', 'driving license renew'],
    response: {
      en: `Yes! DL renewal can be done online. You need:
• Your expired DL copy
• Aadhaar Card with mobile OTP
• Medical certificate Form 1A (if age > 40)

The renewed DL smart card will be dispatched to your home.`,
      ta: `ஆம்! DL புதுப்பிப்பு ஆன்லைனில் செய்யலாம். தேவை:
• காலாவதியான DL நகல்
• OTP மொபைலுடன் ஆதார்
• மருத்துவ சான்றிதழ் Form 1A (40 வயதுக்கு மேல்)

புதுப்பிக்கப்பட்ட DL ஸ்மார்ட் கார்டு வீட்டிற்கு அனுப்பப்படும்.`,
    },
  },
  {
    keywords: ['duplicate dl', 'dl lost', 'lost driving licence', 'dl missing'],
    response: {
      en: `We can help apply for a *replacement driving licence*. Send your Aadhaar card photo and any details you remember about your old DL (number, RTO office, etc.).`,
      ta: `*மாற்று ஓட்டுநர் உரிமம்* விண்ணப்பிக்க உதவுவோம். உங்கள் ஆதார் புகைப்படம் மற்றும் பழைய DL பற்றிய விவரங்களை அனுப்புங்கள்.`,
    },
  },
  {
    keywords: ['vehicle services', 'driving services', 'dl services', 'rc', 'fastag', 'vehicle insurance', 'fitness certificate'],
    response: {
      en: `We provide:
• LLR (Learner Licence) Application
• DL Renewal & Address Change
• Duplicate DL for lost/damaged
• RC Missing / Duplicate Registration Certificate
• Finance (HP) Cancellation / NOC
• Ownership Transfer
• Fitness Certificate (FC) Renewal
• FASTag Instant Activation & Recharge
• Vehicle Insurance (Two & Four Wheeler)

Which service do you need?`,
      ta: `நாங்கள் வழங்கும் வாகன சேவைகள்:
• LLR விண்ணப்பம்
• DL புதுப்பிப்பு & முகவரி மாற்றம்
• நகல் DL
• RC நகல் / காணவில்லை
• ஃபைனான்ஸ் (HP) ரத்து / NOC
• உரிமை மாற்றம்
• FC புதுப்பிப்பு
• FASTag செயல்படுத்தல்
• வாகன காப்பீடு

எந்த சேவை தேவை?`,
    },
  },

  // --- GST ---
  {
    keywords: ['gst registration', 'gst register', 'new gst', 'gst apply', 'gst number'],
    response: {
      en: `For new *GST registration*, you need:
• PAN Card & Aadhaar of business owner/partners
• Business address proof (rental agreement + EB bill or tax receipt)
• Bank account details (cancelled cheque or bank statement)
• Passport size photo of owner
• Nature of business / goods & services details

Registration is typically completed in *3-5 working days*. Send your documents here to begin!`,
      ta: `புதிய *GST பதிவுக்கு* தேவை:
• வணிக உரிமையாளரின் PAN & ஆதார்
• வணிக முகவரி ஆதாரம் (வாடகை ஒப்பந்தம் + EB பில்)
• வங்கி கணக்கு விவரங்கள்
• உரிமையாளர் புகைப்படம்

*3-5 வேலை நாட்களில்* பதிவு முடியும். ஆவணங்களை அனுப்புங்கள்!`,
    },
  },
  {
    keywords: ['gst return', 'gst filing', 'gstr', 'gst monthly', 'gst returns'],
    response: {
      en: `Yes! We handle:
• GSTR-1 (sales return)
• GSTR-3B (summary return)
• CMP-08 (composition scheme)
• Annual Return GSTR-9

Returns are filed on the same day. Share your invoice details and we'll take care of it.`,
      ta: `ஆம்! நாங்கள் செய்வது:
• GSTR-1 (விற்பனை ரிட்டர்ன்)
• GSTR-3B (சுருக்க ரிட்டர்ன்)
• CMP-08 (composition scheme)
• வருடாந்திர GSTR-9

அதே நாளில் தாக்கல். இன்வாய்ஸ் விவரங்களை பகிருங்கள்.`,
    },
  },
  {
    keywords: ['gst cancelled', 'gst revocation', 'gst cancel', 'gst revoke'],
    response: {
      en: `Yes! We can file a *GST Revocation application* to restore your cancelled registration. The sooner you act, the better. Contact us immediately.`,
      ta: `ஆம்! ரத்தான GST பதிவை மீட்க *GST Revocation விண்ணப்பம்* தாக்கல் செய்வோம். விரைவாக செயல்படுங்கள். உடனே தொடர்பு கொள்ளுங்கள்.`,
    },
  },

  // --- UDYAM / MSME ---
  {
    keywords: ['udyam', 'msme', 'msme registration', 'udyam registration', 'micro enterprise'],
    response: {
      en: `*Udyam (MSME) registration* is a free government certificate for micro, small and medium businesses. It's essential for:
• Bank loan approvals at lower interest rates
• Government subsidies and schemes
• Tender eligibility

*Documents needed:*
• Aadhaar Card linked to mobile (OTP)
• PAN Card
• Business name and commencement date
• Bank account number and IFSC code

Registration is instant — certificate generated within *24 hours!*`,
      ta: `*உத்யம் (MSME) பதிவு* — சிறு, நுண், நடுத்தர தொழில்களுக்கான இலவச அரசு சான்றிதழ்.

*தேவை:*
• OTP மொபைலுடன் ஆதார்
• PAN கார்டு
• வணிக பெயர் & தொடக்க தேதி
• வங்கி கணக்கு & IFSC

*24 மணி நேரத்தில்* சான்றிதழ் கிடைக்கும்!`,
    },
  },

  // --- FSSAI ---
  {
    keywords: ['fssai', 'food licence', 'food license', 'hotel licence', 'fssai registration', 'food business'],
    response: {
      en: `FSSAI registration is mandatory for all food businesses — hotels, bakeries, tea stalls, grocery shops, and food traders. We help with:
• Basic FSSAI Registration (small vendors)
• State FSSAI Food Licence (mid-level businesses)
• Annual Renewal
• Address Change/Modification

*Documents needed:*
• Owner photo & Aadhaar
• Business address proof (EB bill / rent deed)
• Food category list

Processing takes *3-7 working days*.`,
      ta: `FSSAI பதிவு அனைத்து உணவு வணிகங்களுக்கும் கட்டாயம். நாங்கள் உதவுவது:
• அடிப்படை FSSAI பதிவு
• மாநில FSSAI உணவு உரிமம்
• வருடாந்திர புதுப்பிப்பு

*தேவை:*
• உரிமையாளர் புகைப்படம் & ஆதார்
• வணிக முகவரி ஆதாரம்
• உணவு வகை பட்டியல்

*3-7 வேலை நாட்கள்* ஆகும்.`,
    },
  },

  // --- PF / EPFO ---
  {
    keywords: ['uan', 'uan number', 'uan missing', 'find uan', 'uan lost'],
    response: {
      en: `Yes! We can retrieve your missing *UAN number* using your Aadhaar, PAN or member ID details. We also help with UAN activation and password reset.`,
      ta: `ஆம்! ஆதார், PAN அல்லது உறுப்பினர் ID மூலம் உங்கள் *UAN எண்*ணை மீட்டெடுக்க உதவுவோம். UAN செயல்படுத்தல் & கடவுச்சொல் மீட்டமைப்பும் செய்வோம்.`,
    },
  },
  {
    keywords: ['pf withdrawal', 'pf withdraw', 'pf claim', 'epf withdraw', 'pf money', 'pf settlement'],
    response: {
      en: `We'll help you file:
• Form 19 (PF settlement) & Form 10C (pension withdrawal)
• KYC update if needed (bank account, PAN, Aadhaar linking)
• E-Nomination filing (mandatory for claims)

*Documents needed:*
• UAN number or Member ID
• Aadhaar Card (with OTP mobile)
• Bank passbook or cancelled cheque
• PAN Card

Online filing takes 30 minutes. EPFO credits the money in *7-15 days*.`,
      ta: `நாங்கள் தாக்கல் செய்வோம்:
• Form 19 (PF தீர்வு) & Form 10C (ஓய்வூதியம்)
• KYC புதுப்பிப்பு
• E-Nomination தாக்கல்

*தேவை:*
• UAN / உறுப்பினர் ID
• ஆதார் (OTP மொபைல்)
• வங்கி பாஸ்புக் / ரத்து செய்யப்பட்ட காசோலை
• PAN கார்டு

EPFO *7-15 நாட்களில்* பணம் வரவு வைக்கும்.`,
    },
  },
  {
    keywords: ['pf advance', 'pf medical', 'pf emergency', 'pf loan'],
    response: {
      en: `We can file *Form 31* for PF advance withdrawal (medical, house construction, etc.). Send your UAN and Aadhaar details to get started.`,
      ta: `மருத்துவம், வீடு கட்டுமானம் போன்றவற்றிற்கு *Form 31* PF முன்பணம் பெற உதவுவோம். UAN & ஆதார் விவரங்களை அனுப்புங்கள்.`,
    },
  },

  // --- EMPLOYMENT EXCHANGE ---
  {
    keywords: ['employment exchange', 'employment registration', 'velaivaippu', 'வேலைவாய்ப்பு'],
    response: {
      en: `We help with:
• New registration (10th, 12th, ITI, Diploma, Degree holders)
• 3-year renewal
• Adding new educational qualifications

*Documents:* Aadhaar, educational marksheets, community certificate.
Registration is instant and your ID card is generated immediately!`,
      ta: `நாங்கள் உதவுவது:
• புதிய பதிவு (10, 12, ITI, டிப்ளமோ, பட்டதாரி)
• 3 வருட புதுப்பிப்பு
• புதிய கல்வி தகுதி சேர்ப்பு

*ஆவணங்கள்:* ஆதார், மதிப்பெண், சமூக சான்றிதழ்.
உடனடி பதிவு & ID கார்டு!`,
    },
  },

  // --- PROPERTY ---
  {
    keywords: ['patta', 'chitta', 'பட்டா', 'சிட்டா', 'patta download'],
    response: {
      en: `We can download your verified *Patta/Chitta* with government QR code instantly! You need:
• District, Taluk, Village name
• Survey number & sub-division number (or Patta number)

Ready in *10 minutes*. Send us the details.`,
      ta: `அரசு QR குறியீட்டுடன் *பட்டா/சிட்டா* உடனடியாக பதிவிறக்கலாம்! தேவை:
• மாவட்டம், தாலுகா, கிராமம்
• சர்வே எண் & உட்பிரிவு எண்

*10 நிமிடங்களில்* ரெடி. விவரங்களை அனுப்புங்கள்.`,
    },
  },
  {
    keywords: ['ec', 'encumbrance', 'encumbrance certificate', 'ec certificate'],
    response: {
      en: `We provide *EC search* from 1975 to the present date via TNREGINET. You need:
• Document number
• SRO (Sub-Registrar Office) name
• Year of registration

Instant download available. Certified copies take *2-4 days*.`,
      ta: `TNREGINET மூலம் 1975 முதல் தற்போது வரை *EC தேடல்* செய்வோம். தேவை:
• ஆவண எண்
• SRO பெயர்
• பதிவு ஆண்டு

உடனடி பதிவிறக்கம். சான்றிதழ் நகல் *2-4 நாட்கள்*.`,
    },
  },
  {
    keywords: ['property services', 'property document', 'fmb', 'tslr', 'sale deed'],
    response: {
      en: `Our property services:
• Patta / Chitta Download (with QR verification)
• Encumbrance Certificate (EC)
• FMB Map (Field Measurement Book) Download
• TSLR Extract (Town Survey Land Register)
• Certified Document Copy (Sale Deed via TNREGINET)
• Sub-Division Application Guidance

Which one do you need?`,
      ta: `சொத்து சேவைகள்:
• பட்டா / சிட்டா பதிவிறக்கம்
• EC சான்றிதழ்
• FMB வரைபடம்
• TSLR சாரம்
• சான்றிதழ் ஆவண நகல் (விற்பனை பத்திரம்)
• உட்பிரிவு விண்ணப்ப வழிகாட்டல்

எது தேவை?`,
    },
  },

  // --- BIRTH / DEATH CERTIFICATES ---
  {
    keywords: ['birth certificate', 'பிறப்பு சான்றிதழ்', 'birth cert'],
    response: {
      en: `We can search and download your digital *birth certificate* with QR code. If it's already registered, it's available instantly. For new applications, processing takes *7-15 days*.

*Documents needed:*
• Aadhaar of applicant and parents
• Hospital discharge / birth slip`,
      ta: `QR குறியீட்டுடன் டிஜிட்டல் *பிறப்பு சான்றிதழ்* பதிவிறக்கலாம். ஏற்கனவே பதிவு செய்யப்பட்டிருந்தால் உடனடியாக கிடைக்கும்.

*தேவை:*
• விண்ணப்பதாரர் & பெற்றோர் ஆதார்
• மருத்துமனை discharge / பிறப்பு சீட்டு`,
    },
  },
  {
    keywords: ['death certificate', 'legal heir', 'இறப்பு சான்றிதழ்', 'community certificate', 'income certificate'],
    response: {
      en: `We assist with:
• Death certificate download & verification
• Legal Heir Certificate application
• Community, Income, Nativity certificates
• First Graduate Certificate

Send the relevant documents and we'll guide you through the process.`,
      ta: `நாங்கள் உதவுவது:
• இறப்பு சான்றிதழ் பதிவிறக்கம் & சரிபார்ப்பு
• சட்ட வாரிசு சான்றிதழ்
• சமூக, வருமான, பிறப்பிட சான்றிதழ்
• முதல் பட்டதாரி சான்றிதழ்

தொடர்புடைய ஆவணங்களை அனுப்புங்கள்.`,
    },
  },

  // --- EXAM APPLICATIONS ---
  {
    keywords: ['tnpsc', 'tet', 'bank exam', 'exam apply', 'government exam', 'exam application', 'தேர்வு', 'ssc', 'rrb', 'railway exam'],
    response: {
      en: `Yes! We provide:
• TNPSC OTR creation & renewal
• Group 4, Group 2, Group 1 online applications
• TNTET, IBPS Bank, RRB Railway, SSC and Police exam applications
• Photo & signature resizing as per exam guidelines
• Hall ticket download with colour printout

*Documents needed:*
• Aadhaar Card
• 10th, 12th & Degree marksheets
• Passport photo (white background)
• Black ink signature on white paper
• Community & PSTM certificate (if applicable)

Send your details to apply immediately!`,
      ta: `ஆம்! நாங்கள் வழங்குவது:
• TNPSC OTR உருவாக்கம் & புதுப்பிப்பு
• குரூப் 4, 2, 1 ஆன்லைன் விண்ணப்பம்
• TNTET, வங்கி, ரயில்வே, SSC தேர்வு விண்ணப்பங்கள்
• புகைப்படம் & கையொப்பம் resize
• ஹால் டிக்கெட் பதிவிறக்கம் & பிரிண்ட்

*தேவை:*
• ஆதார், 10, 12, பட்டம் மதிப்பெண்
• பாஸ்போர்ட் புகைப்படம் & கையொப்பம்
• சமூக & PSTM சான்றிதழ்

விவரங்களை அனுப்புங்கள்!`,
    },
  },

  // --- TEMPLE DARSHAN ---
  {
    keywords: ['darshan', 'sabarimala', 'tirupati', 'shirdi', 'temple booking', 'darshan booking', 'palani', 'tiruchendur', 'கோயில்'],
    response: {
      en: `Yes! We handle online darshan bookings for:
• Sabarimala Virtual Queue Slot
• TTD Tirupati Special Entry Darshan
• TTD Accommodation / Room Booking
• Shirdi Sai Baba Online Darshan & Aarti Pass
• Tiruchendur Subramanya Swamy Temple
• Palani Murugan Temple & Rope Car Token

*What we need:*
• Aadhaar copies of all pilgrims
• Devotee photo (for Sabarimala)
• Contact mobile number
• Preferred travel dates and times

Send your details and we'll book confirmed tokens!`,
      ta: `ஆம்! ஆன்லைன் தரிசன முன்பதிவு:
• சபரிமலை விர்ச்சுவல் க்யூ
• TTD திருப்பதி ஸ்பெஷல் எண்ட்ரி
• TTD அறை முன்பதிவு
• ஷிர்டி சாய்பாபா தரிசனம்
• திருச்செந்தூர் & பழனி கோயில்

*தேவை:*
• அனைத்து பக்தர்களின் ஆதார்
• பக்தர் புகைப்படம்
• மொபைல் எண்
• பயண தேதி & நேரம்

விவரங்களை அனுப்பி டோக்கன் பெறுங்கள்!`,
    },
  },

  // --- TRAVEL TICKETS ---
  {
    keywords: ['train ticket', 'bus ticket', 'flight ticket', 'irctc', 'tatkal ticket', 'travel ticket', 'ticket booking', 'டிக்கெட்'],
    response: {
      en: `Yes! We offer instant booking for:
• IRCTC Train Tickets (Sleeper, 3AC, 2AC, Chair Car)
• Tatkal & Premium Tatkal Railway Tickets
• TNSTC / SETC Government Bus Tickets
• Private Omni AC Sleeper Bus Tickets
• Domestic & International Flight Tickets

*What we need:*
• Passenger names, age, gender
• Travel date & route
• Berth/seat preference
• Government ID proof (Aadhaar / Voter ID)

Confirmed ticket printout and WhatsApp PDF delivery!`,
      ta: `ஆம்! உடனடி புக்கிங்:
• IRCTC ரயில் டிக்கெட்
• தட்கல் & பிரீமியம் தட்கல்
• TNSTC / SETC அரசு பேருந்து
• தனியார் AC ஸ்லீப்பர் பேருந்து
• உள்நாட்டு & சர்வதேச விமான டிக்கெட்

*தேவை:*
• பயணிகள் பெயர், வயது, பாலினம்
• பயண தேதி & வழி
• இருக்கை விருப்பம்
• அரசு ID (ஆதார் / வாக்காளர்)

உறுதிப்படுத்தப்பட்ட டிக்கெட் வாட்ஸ்அப்பில்!`,
    },
  },

  // --- INSURANCE ---
  {
    keywords: ['insurance', 'vehicle insurance', 'health insurance', 'bike insurance', 'car insurance', 'காப்பீடு'],
    response: {
      en: `Yes! We provide instant insurance policies for:
• Two Wheeler (Comprehensive & Third Party)
• Four Wheeler & Commercial Vehicles
• Health / Medical Insurance for families

We also handle:
• Property Tax / Water Tax payment (Tiruppur Corporation)
• TNEB Electricity Bill payment with receipt

Send your RC book or previous policy and we'll get you covered in *5 minutes!*`,
      ta: `ஆம்! உடனடி காப்பீடு:
• இரு சக்கர (விரிவான & மூன்றாம் தரப்பு)
• நான்கு சக்கர & வணிக வாகனம்
• குடும்ப மருத்துவ காப்பீடு

மேலும்:
• சொத்து வரி / நீர் வரி செலுத்தல்
• TNEB மின் கட்டண செலுத்தல்

RC புத்தகம் அல்லது முந்தைய பாலிசி அனுப்புங்கள். *5 நிமிடங்களில்* காப்பீடு!`,
    },
  },

  // --- WELFARE BOARD ---
  {
    keywords: ['welfare board', 'nalavariyam', 'construction worker', 'நலவாரியம்', 'worker registration', 'pension claim'],
    response: {
      en: `Yes! We assist with:
• New Construction Workers Welfare Board registration
• Manual / Unorganized Workers Board registration
• Annual card renewal
• Pension claim (60+ years)
• Marriage & Education financial assistance
• Accidental / Death assistance claim

*Documents needed:*
• Aadhaar Card
• Bank Passbook (nationalized bank)
• Work certificate / VAO certificate
• Nominee Aadhaar & photo
• Ration Card / Smart Card copy`,
      ta: `ஆம்! நாங்கள் உதவுவது:
• கட்டுமான தொழிலாளர் நலவாரிய பதிவு
• அமைப்புசாரா தொழிலாளர் வாரிய பதிவு
• வருடாந்திர கார்டு புதுப்பிப்பு
• ஓய்வூதிய கோரிக்கை (60+ வயது)
• திருமணம் & கல்வி நிதி உதவி

*தேவை:*
• ஆதார், வங்கி பாஸ்புக்
• பணி சான்றிதழ் / VAO சான்றிதழ்
• நாமினி ஆதார் & புகைப்படம்
• ரேஷன் கார்டு நகல்`,
    },
  },

  // --- HOROSCOPE ---
  {
    keywords: ['horoscope', 'jathagam', 'ஜாதகம்', 'marriage matching', 'porutham', 'rasi', 'astrology'],
    response: {
      en: `Yes! We provide accurate computerized horoscopes in Tamil:
• Full Jathagam book with Dasa Bukthi
• New born baby Jathagam with birth star & Rasi
• Thirumana Porutham (10 Porutham marriage matching)

*We need:* Date of birth, exact time of birth (AM/PM), place of birth.
Ready in *15 minutes* or sent via WhatsApp PDF!`,
      ta: `ஆம்! துல்லியமான கணினி ஜாதகம்:
• முழு ஜாதகம் (தசா புக்தி உடன்)
• புதிதாக பிறந்த குழந்தை ஜாதகம் (நட்சத்திரம் & ராசி)
• திருமண பொருத்தம் (10 பொருத்தம்)

*தேவை:* பிறந்த தேதி, நேரம் (AM/PM), இடம்.
*15 நிமிடங்களில்* ரெடி அல்லது வாட்ஸ்அப் PDF!`,
    },
  },

  // --- GIFTS & PRINTING ---
  {
    keywords: ['gift', 'custom gift', 'personalised', 'printing', 'mug', 'tshirt', 't-shirt', 'photo frame', 'keychain', 'பரிசு', 'பிரிண்டிங்'],
    response: {
      en: `Yes! We offer *personalised gifts* and printing services:
• Custom Mugs & Bottles
• Photo Frames & Collages
• T-shirts with custom prints
• Keychains & Magnets
• Corporate branding materials
• Visiting Cards, Flex Banners, Certificates

Share your idea and we'll make it happen! Send us the photos and text you'd like.`,
      ta: `ஆம்! *பிரத்யேக பரிசுகள்* & பிரிண்டிங்:
• கஸ்டம் மக்கள் & பாட்டில்கள்
• புகைப்பட ஃபிரேம்கள்
• கஸ்டம் T-ஷர்ட்கள்
• கீசெயின்கள் & மேக்னட்கள்
• விசிடிங் கார்டுகள், ஃப்ளெக்ஸ் பேனர்கள்

உங்கள் யோசனையை பகிருங்கள்! புகைப்படங்கள் & உரையை அனுப்புங்கள்.`,
    },
  },

  // --- GENERAL ---
  {
    keywords: ['location', 'address', 'where', 'shop location', 'shop address', 'கடை', 'எங்கே'],
    response: {
      en: `*${config.BUSINESS_NAME}*
📍 ${config.BUSINESS_ADDRESS}
Tamil Nadu, India

🗺️ Google Maps: Search "*Success Computech Tiruppur*"`,
      ta: `*${config.BUSINESS_NAME}*
📍 ${config.BUSINESS_ADDRESS}
தமிழ்நாடு, இந்தியா

🗺️ Google Maps: "*Success Computech Tiruppur*" தேடுங்கள்`,
    },
  },
  {
    keywords: ['working hours', 'timing', 'open time', 'close time', 'நேரம்', 'shop time'],
    response: {
      en: `*Our Working Hours:*
🕤 Monday to Saturday: 9:30 AM to 9:00 PM
🕘 Sunday: 9:00 AM to 2:00 PM
We are open all 7 days!`,
      ta: `*எங்கள் பணி நேரம்:*
🕤 திங்கள் - சனி: காலை 9:30 - இரவு 9:00
🕘 ஞாயிறு: காலை 9:00 - மதியம் 2:00
அனைத்து 7 நாட்களும் திறந்திருக்கிறோம்!`,
    },
  },
  {
    keywords: ['visit shop', 'come to shop', 'need to visit', 'in person', 'walk in'],
    response: {
      en: `No! *90% of our services* can be done remotely via WhatsApp. Just send clear photos of your documents to ${config.BUSINESS_PHONE} and we'll handle everything. You'll receive acknowledgment receipts, tracking IDs, and completed documents right here on WhatsApp.`,
      ta: `இல்லை! *90% சேவைகள்* வாட்ஸ்அப் மூலமே செய்யலாம். ${config.BUSINESS_PHONE} க்கு ஆவண புகைப்படங்களை அனுப்புங்கள். ரசீது, ட்ராக்கிங் ID, முடிக்கப்பட்ட ஆவணங்கள் அனைத்தும் வாட்ஸ்அப்பில் கிடைக்கும்.`,
    },
  },
  {
    keywords: ['track', 'status', 'application status', 'track status', 'நிலை', 'where is my'],
    response: {
      en: `You can track your application:
1. Visit our website and use the "Track Status" section with your reference number (e.g., SC-2026-XXXX)
2. Or simply message your *name and service* here for an instant status update.`,
      ta: `உங்கள் விண்ணப்பத்தை கண்காணிக்க:
1. எங்கள் வெப்சைட்டில் "Track Status" பிரிவில் குறிப்பு எண் பயன்படுத்துங்கள்
2. அல்லது உங்கள் *பெயர் & சேவை* இங்கே அனுப்புங்கள்.`,
    },
  },
  {
    keywords: ['how it works', 'how does it work', 'process', 'step by step', 'procedure'],
    response: {
      en: `*How our service works:*

1️⃣ *Choose Service* — Select from our list or tell us what you need
2️⃣ *Submit Details* — Send document photos via WhatsApp (${config.BUSINESS_PHONE}) or visit us
3️⃣ *Document Verification* — Our team checks all proofs and prepares the file
4️⃣ *Application Filing* — We submit on the official government/service portal
5️⃣ *Get Confirmation* — Receive official receipt, tracking ID, e-document or physical card

It's that simple!`,
      ta: `*எங்கள் சேவை செயல்முறை:*

1️⃣ *சேவை தேர்வு* — பட்டியலிலிருந்து தேர்வு செய்யுங்கள்
2️⃣ *விவரங்கள் சமர்ப்பிப்பு* — வாட்ஸ்அப்பில் ஆவண புகைப்படம் அனுப்புங்கள்
3️⃣ *ஆவண சரிபார்ப்பு* — எங்கள் குழு சரிபார்க்கும்
4️⃣ *விண்ணப்பம் தாக்கல்* — அதிகாரப்பூர்வ போர்ட்டலில் சமர்ப்பிப்போம்
5️⃣ *உறுதிப்படுத்தல்* — ரசீது, ட்ராக்கிங் ID, e-ஆவணம் பெறுங்கள்

மிகவும் எளிது!`,
    },
  },
  {
    keywords: ['government office', 'government', 'are you government'],
    response: {
      en: `No. *${config.BUSINESS_NAME}* is an independent private digital service, printing, gift crafting, and application assistance centre. We are NOT a government department or affiliated with any government authority. We provide legitimate documentation, online portal application assistance, personalized gifts, and printing services.`,
      ta: `இல்லை. *${config.BUSINESS_NAME}* ஒரு சுதந்திரமான தனியார் டிஜிட்டல் சேவை, பிரிண்டிங், பரிசு & விண்ணப்ப உதவி மையம். நாங்கள் அரசு துறை அல்ல. சட்டப்பூர்வ ஆவண உதவி, ஆன்லைன் போர்ட்டல் விண்ணப்ப உதவி, பரிசுகள் & பிரிண்டிங் சேவைகள் வழங்குகிறோம்.`,
    },
  },

  // --- MENU NUMBER SELECTIONS ---
  {
    keywords: ['1', '1️⃣'],
    response: {
      en: `*ID & Document Services:*

We handle Aadhaar, PAN, Voter ID, Smart Card and PVC Card services.

Which one do you need?
• Aadhaar (address update, PVC card, download)
• PAN Card (new, lost, correction, minor)
• Voter ID (new, address change)
• Smart Card / Ration Card
• PVC ID Card Printing

Type the service name or ask us anything!`,
      ta: `*அடையாள அட்டை சேவைகள்:*

ஆதார், PAN, வாக்காளர், ஸ்மார்ட் கார்டு, PVC கார்டு சேவைகள்.

எது தேவை?
• ஆதார் (முகவரி புதுப்பிப்பு, PVC கார்டு)
• PAN கார்டு (புதிய, தொலைந்த, திருத்தம்)
• வாக்காளர் அட்டை
• ஸ்மார்ட் கார்டு / ரேஷன் கார்டு
• PVC ID கார்டு பிரிண்டிங்

சேவை பெயரை தட்டச்சு செய்யுங்கள்!`,
    },
  },
  {
    keywords: ['2', '2️⃣'],
    response: {
      en: `*Passport & Travel Services:*

We provide complete passport assistance — form filling, document check, appointment booking at POPSK Tiruppur / PSK Coimbatore.

• New Passport Application
• Passport Renewal
• Tatkal Passport
• Child / Minor Passport

Send your Aadhaar and marksheet to get started!`,
      ta: `*பாஸ்போர்ட் சேவைகள்:*

முழுமையான பாஸ்போர்ட் உதவி — படிவம், ஆவண சரிபார்ப்பு, நேர முன்பதிவு.

• புதிய பாஸ்போர்ட்
• பாஸ்போர்ட் புதுப்பிப்பு
• தட்கல் பாஸ்போர்ட்
• குழந்தை பாஸ்போர்ட்

ஆதார் & மதிப்பெண் அனுப்புங்கள்!`,
    },
  },
  {
    keywords: ['3', '3️⃣'],
    response: {
      en: `*Vehicle & Driving Services:*

• LLR Application
• DL Renewal & Duplicate
• RC Duplicate / HP Cancellation / NOC
• Ownership Transfer & FC Renewal
• FASTag Activation & Recharge
• Vehicle Insurance

Which service do you need?`,
      ta: `*வாகன & ஓட்டுநர் சேவைகள்:*

• LLR விண்ணப்பம்
• DL புதுப்பிப்பு & நகல்
• RC நகல் / HP ரத்து / NOC
• உரிமை மாற்றம் & FC புதுப்பிப்பு
• FASTag செயல்படுத்தல்
• வாகன காப்பீடு

எந்த சேவை?`,
    },
  },
  {
    keywords: ['4', '4️⃣'],
    response: {
      en: `*Business & Tax Services:*

• GST Registration & Monthly Returns
• Udyam / MSME Registration
• FSSAI Food Licence
• Professional Tax Registration

Which service do you need?`,
      ta: `*வணிக & வரி சேவைகள்:*

• GST பதிவு & மாதாந்திர ரிட்டர்ன்
• உத்யம் / MSME பதிவு
• FSSAI உணவு உரிமம்

எந்த சேவை?`,
    },
  },
  {
    keywords: ['5', '5️⃣'],
    response: {
      en: `*Employment & PF Services:*

• UAN Number Retrieval & Activation
• PF Withdrawal (Form 19, 10C)
• PF Advance (Form 31)
• KYC Update & E-Nomination
• Employment Exchange Registration & Renewal

Which service do you need?`,
      ta: `*வேலைவாய்ப்பு & PF சேவைகள்:*

• UAN எண் மீட்பு & செயல்படுத்தல்
• PF எடுப்பு (Form 19, 10C)
• PF முன்பணம் (Form 31)
• KYC புதுப்பிப்பு & E-Nomination
• வேலைவாய்ப்பு பதிவு & புதுப்பிப்பு

எந்த சேவை?`,
    },
  },
  {
    keywords: ['6', '6️⃣'],
    response: {
      en: `*Property & Certificates:*

• Patta / Chitta Download
• Encumbrance Certificate (EC)
• FMB Map / TSLR Extract
• Birth / Death Certificate
• Legal Heir / Community / Income Certificate

Which one do you need?`,
      ta: `*சொத்து & சான்றிதழ்கள்:*

• பட்டா / சிட்டா
• EC சான்றிதழ்
• FMB வரைபடம் / TSLR
• பிறப்பு / இறப்பு சான்றிதழ்
• சட்ட வாரிசு / சமூக / வருமான சான்றிதழ்

எது தேவை?`,
    },
  },
  {
    keywords: ['7', '7️⃣'],
    response: {
      en: `*Education & Exam Applications:*

• TNPSC OTR & Group exams
• TNTET / IBPS / RRB / SSC / Police exams
• Photo & signature resizing
• Hall ticket download & printout

Send your documents to apply immediately!`,
      ta: `*தேர்வு விண்ணப்பங்கள்:*

• TNPSC OTR & குரூப் தேர்வுகள்
• TNTET / வங்கி / ரயில்வே / SSC / போலீஸ்
• புகைப்படம் & கையொப்பம் resize
• ஹால் டிக்கெட் பதிவிறக்கம்

ஆவணங்களை அனுப்புங்கள்!`,
    },
  },
  {
    keywords: ['8', '8️⃣'],
    response: {
      en: `*Temple Darshan Booking:*

• Sabarimala Virtual Queue
• TTD Tirupati Darshan & Accommodation
• Shirdi Sai Baba Darshan
• Palani & Tiruchendur Temple

Send Aadhaar copies, travel dates and we'll book your tokens!`,
      ta: `*கோயில் தரிசன முன்பதிவு:*

• சபரிமலை விர்ச்சுவல் க்யூ
• TTD திருப்பதி தரிசனம் & அறை
• ஷிர்டி சாய்பாபா
• பழனி & திருச்செந்தூர்

ஆதார் நகல் & பயண தேதி அனுப்புங்கள்!`,
    },
  },
  {
    keywords: ['9', '9️⃣'],
    response: {
      en: `*Travel Ticket Booking:*

• IRCTC Train Tickets (all classes)
• Tatkal & Premium Tatkal
• Government & Private Bus Tickets
• Domestic & International Flights

Send passenger details and travel date to book now!`,
      ta: `*பயண டிக்கெட் புக்கிங்:*

• IRCTC ரயில் டிக்கெட்
• தட்கல் & பிரீமியம்
• அரசு & தனியார் பேருந்து
• விமான டிக்கெட்

பயணிகள் விவரம் & தேதி அனுப்புங்கள்!`,
    },
  },
  {
    keywords: ['10', '🔟'],
    response: {
      en: `*Insurance, Welfare & Astrology:*

• Vehicle Insurance (2W & 4W)
• Health / Medical Insurance
• Property Tax & EB Bill Payment
• Welfare Board Registration & Pension
• Computerized Horoscope / Jathagam
• Marriage Matching (10 Porutham)

Which service interests you?`,
      ta: `*காப்பீடு, நலவாரியம் & ஜாதகம்:*

• வாகன காப்பீடு
• மருத்துவ காப்பீடு
• சொத்து வரி & EB பில்
• நலவாரிய பதிவு & ஓய்வூதியம்
• கணினி ஜாதகம்
• திருமண பொருத்தம்

எந்த சேவை?`,
    },
  },
];

module.exports = {
  PRICE_RESPONSE,
  WELCOME_MESSAGE,
  AFTER_HOURS_MESSAGE,
  DOCUMENT_RECEIVED,
  UNKNOWN_QUERY,
  CTA,
  SERVICE_RESPONSES,
};
