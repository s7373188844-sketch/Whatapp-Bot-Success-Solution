const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config');
const { getLanguage } = require('./languageDetector');
const { isWithinWorkingHours } = require('./timeUtils');
const leadManager = require('./leadManager');
const {
  PRICE_RESPONSE,
  WELCOME_MESSAGE,
  AFTER_HOURS_MESSAGE,
  DOCUMENT_RECEIVED,
  UNKNOWN_QUERY,
  CTA,
  SERVICE_RESPONSES,
} = require('./responses');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', (qr) => {
  console.log('\n========================================');
  console.log('  Scan this QR code with WhatsApp:');
  console.log('========================================\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('\n========================================');
  console.log(`  ${config.BUSINESS_NAME}`);
  console.log('  WhatsApp Bot is READY!');
  console.log('========================================\n');
});

client.on('authenticated', () => {
  console.log('[AUTH] Authenticated successfully.');
});

client.on('auth_failure', (msg) => {
  console.error('[AUTH] Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
  console.log('[DISCONNECTED]', reason);
  client.initialize();
});

function isPriceQuery(text) {
  const lower = text.toLowerCase();
  return config.PRICE_TRIGGER_WORDS.some((word) => lower.includes(word));
}

function isGreeting(text) {
  const lower = text.trim().toLowerCase();
  return config.GREETING_WORDS.some(
    (word) => lower === word || lower.startsWith(word + ' ') || lower.startsWith(word + '!')
  );
}

function isDocumentMessage(msg) {
  return msg.hasMedia && (
    msg.type === 'image' ||
    msg.type === 'document' ||
    msg.type === 'ptt' ||
    msg.type === 'audio'
  );
}

function detectService(text) {
  const lower = text.toLowerCase();
  const serviceMap = {
    'aadhaar': 'Aadhaar', 'aadhar': 'Aadhaar', 'ஆதார்': 'Aadhaar',
    'pan card': 'PAN Card', 'pan': 'PAN Card', 'பான்': 'PAN Card',
    'voter': 'Voter ID', 'வாக்காளர்': 'Voter ID',
    'ration': 'Smart Card', 'smart card': 'Smart Card', 'ரேஷன்': 'Smart Card',
    'passport': 'Passport', 'பாஸ்போர்ட்': 'Passport',
    'driving': 'Driving Licence', 'dl': 'Driving Licence', 'llr': 'Driving Licence',
    'gst': 'GST', 'msme': 'MSME', 'udyam': 'MSME',
    'fssai': 'FSSAI', 'food': 'FSSAI',
    'pf': 'PF/EPFO', 'epf': 'PF/EPFO', 'uan': 'PF/EPFO',
    'patta': 'Property', 'chitta': 'Property', 'ec': 'Property', 'பட்டா': 'Property',
    'birth': 'Certificates', 'death': 'Certificates', 'community': 'Certificates',
    'tnpsc': 'Exam Applications', 'exam': 'Exam Applications', 'tet': 'Exam Applications',
    'darshan': 'Temple Booking', 'sabarimala': 'Temple Booking', 'tirupati': 'Temple Booking',
    'train': 'Travel Tickets', 'bus': 'Travel Tickets', 'flight': 'Travel Tickets', 'ticket': 'Travel Tickets',
    'insurance': 'Insurance', 'காப்பீடு': 'Insurance',
    'welfare': 'Welfare Board', 'நலவாரியம்': 'Welfare Board',
    'horoscope': 'Horoscope', 'jathagam': 'Horoscope', 'ஜாதகம்': 'Horoscope',
    'gift': 'Gifts & Printing', 'print': 'Gifts & Printing', 'mug': 'Gifts & Printing',
    'pvc': 'PVC Card',
  };
  for (const [keyword, service] of Object.entries(serviceMap)) {
    if (lower.includes(keyword)) return service;
  }
  return null;
}

function findServiceResponse(text) {
  const lower = text.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const service of SERVICE_RESPONSES) {
    let score = 0;
    for (const keyword of service.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = service;
    }
  }

  return bestMatch;
}

async function notifyOwner(customerNumber, customerMessage, leadInfo) {
  try {
    const ownerChatId = config.OWNER_PHONE + '@c.us';
    const notification = `📩 *Price Enquiry Alert*

*Lead ID:* ${leadInfo.id}
*From:* ${customerNumber}
*Status:* ${leadInfo.status}
*Price Inquiries:* ${leadInfo.priceInquiryCount}
*Services Interested:* ${leadInfo.servicesInterested.join(', ') || 'General'}
*Message:* ${customerMessage}

Please follow up with the customer.`;
    await client.sendMessage(ownerChatId, notification);
  } catch (err) {
    console.error('[NOTIFY] Failed to notify owner:', err.message);
  }
}

function isOwnerCommand(text, from) {
  const ownerChatId = config.OWNER_PHONE + '@c.us';
  return from === ownerChatId && text.startsWith('#');
}

async function handleOwnerCommand(text, msg) {
  const cmd = text.toLowerCase().trim();

  if (cmd === '#stats') {
    const stats = leadManager.getLeadStats();
    const reply = `📊 *Lead Dashboard*

📌 Total Leads: ${stats.totalLeads}
🆕 Today's New Leads: ${stats.todayNewLeads}
🔥 Hot Leads (Price Inquiries): ${stats.hotLeads}
⏳ Pending Follow-up: ${stats.pendingFollowUp}`;
    await msg.reply(reply);
    return;
  }

  if (cmd === '#hot') {
    const hotLeads = leadManager.getHotLeads();
    if (hotLeads.length === 0) {
      await msg.reply('✅ No pending hot leads. All follow-ups done!');
      return;
    }
    let reply = '🔥 *Hot Leads (Pending Follow-up):*\n\n';
    for (const lead of hotLeads.slice(0, 15)) {
      reply += `• *${lead.id}* | 📞 ${lead.phone}\n`;
      reply += `  Services: ${lead.servicesInterested.join(', ')}\n`;
      reply += `  Messages: ${lead.messageCount} | Price Asks: ${lead.priceInquiryCount}\n`;
      reply += `  Last Contact: ${new Date(lead.lastContact).toLocaleString('en-IN')}\n\n`;
    }
    await msg.reply(reply);
    return;
  }

  if (cmd === '#leads') {
    const allLeads = leadManager.getAllLeads();
    if (allLeads.length === 0) {
      await msg.reply('📋 No leads recorded yet.');
      return;
    }
    const recent = allLeads.slice(-20).reverse();
    let reply = '📋 *Recent Leads:*\n\n';
    for (const lead of recent) {
      const statusIcon = lead.status === 'hot_lead' ? '🔥' : lead.status === 'followed_up' ? '✅' : '🆕';
      reply += `${statusIcon} *${lead.id}* | 📞 ${lead.phone}\n`;
      reply += `   Status: ${lead.status} | Msgs: ${lead.messageCount}\n`;
      reply += `   Services: ${lead.servicesInterested.join(', ') || 'General'}\n\n`;
    }
    await msg.reply(reply);
    return;
  }

  if (cmd.startsWith('#done ')) {
    const phone = cmd.replace('#done ', '').trim();
    const lead = leadManager.markFollowUpDone(phone);
    if (lead) {
      await msg.reply(`✅ Lead ${lead.id} (${phone}) marked as followed up.`);
    } else {
      await msg.reply(`❌ No lead found with phone: ${phone}`);
    }
    return;
  }

  if (cmd.startsWith('#find ')) {
    const phone = cmd.replace('#find ', '').trim();
    const lead = leadManager.getLeadByPhone(phone);
    if (lead) {
      let reply = `📋 *Lead Details*\n\n`;
      reply += `*ID:* ${lead.id}\n`;
      reply += `*Phone:* ${lead.phone}\n`;
      reply += `*Status:* ${lead.status}\n`;
      reply += `*First Contact:* ${new Date(lead.firstContact).toLocaleString('en-IN')}\n`;
      reply += `*Last Contact:* ${new Date(lead.lastContact).toLocaleString('en-IN')}\n`;
      reply += `*Total Messages:* ${lead.messageCount}\n`;
      reply += `*Price Inquiries:* ${lead.priceInquiryCount}\n`;
      reply += `*Services:* ${lead.servicesInterested.join(', ') || 'None'}\n`;
      reply += `*Follow-up Done:* ${lead.followUpDone ? 'Yes' : 'No'}\n\n`;
      reply += `*Recent Conversations:*\n`;
      for (const conv of lead.conversations.slice(-5)) {
        reply += `• [${new Date(conv.timestamp).toLocaleString('en-IN')}] ${conv.message.substring(0, 60)}\n`;
      }
      await msg.reply(reply);
    } else {
      await msg.reply(`❌ No lead found with phone: ${phone}`);
    }
    return;
  }

  if (cmd === '#help') {
    const reply = `🤖 *Bot Owner Commands:*

#stats — View lead dashboard summary
#hot — View pending hot leads (price inquiries)
#leads — View recent 20 leads
#find <phone> — View full details of a lead
#done <phone> — Mark lead follow-up as complete

_All commands must start with #_`;
    await msg.reply(reply);
    return;
  }
}

client.on('message', async (msg) => {
  try {
    const chat = await msg.getChat();

    // RULE: Do NOT reply to group chats
    if (chat.isGroup) return;

    const text = msg.body.trim();
    if (!text && !msg.hasMedia) return;

    // Owner dashboard commands (bypass normal flow)
    if (isOwnerCommand(text, msg.from)) {
      await handleOwnerCommand(text, msg);
      return;
    }

    const lang = getLanguage(text);
    const customerNumber = msg.from.replace('@c.us', '');
    const detectedService = detectService(text);

    console.log(`[MSG] From: ${customerNumber} | Lang: ${lang} | Service: ${detectedService || 'N/A'} | Text: ${text.substring(0, 50)}`);

    // 1. Check for document/media messages
    if (isDocumentMessage(msg)) {
      leadManager.addOrUpdateLead({
        phone: customerNumber,
        service: detectedService,
        message: '[Document/Media sent]',
        type: 'document',
      });
      const reply = DOCUMENT_RECEIVED[lang] + CTA[lang];
      await msg.reply(reply);
      return;
    }

    // 2. Check for price queries FIRST (highest priority)
    if (isPriceQuery(text)) {
      const lead = leadManager.addOrUpdateLead({
        phone: customerNumber,
        service: detectedService,
        message: text,
        type: 'price_inquiry',
      });
      const reply = PRICE_RESPONSE[lang];
      await msg.reply(reply);
      await notifyOwner(customerNumber, text, lead);
      return;
    }

    // 3. Check for greetings
    if (isGreeting(text)) {
      leadManager.addOrUpdateLead({
        phone: customerNumber,
        service: null,
        message: text,
        type: 'greeting',
      });
      const reply = WELCOME_MESSAGE[lang];
      await msg.reply(reply);
      return;
    }

    // 4. After-hours check
    if (!isWithinWorkingHours()) {
      leadManager.addOrUpdateLead({
        phone: customerNumber,
        service: detectedService,
        message: text,
        type: 'after_hours',
      });
      const reply = AFTER_HOURS_MESSAGE[lang];
      await msg.reply(reply);
      return;
    }

    // 5. Try to match a service response
    const serviceMatch = findServiceResponse(text);
    if (serviceMatch) {
      leadManager.addOrUpdateLead({
        phone: customerNumber,
        service: detectedService,
        message: text,
        type: 'inquiry',
      });
      const reply = serviceMatch.response[lang] + CTA[lang];
      await msg.reply(reply);
      return;
    }

    // 6. Unknown query fallback
    leadManager.addOrUpdateLead({
      phone: customerNumber,
      service: null,
      message: text,
      type: 'unknown',
    });
    const reply = UNKNOWN_QUERY[lang];
    await msg.reply(reply);
  } catch (err) {
    console.error('[ERROR] Message handling failed:', err);
  }
});

console.log('[INIT] Starting Success Computech WhatsApp Bot...');
client.initialize();
