require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const db = require('./database');
const EvolutionApi = require('./evolutionApi');
const AIAgent = require('./aiAgent');
const { getLanguage } = require('./languageDetector');
const { isWithinWorkingHours } = require('./timeUtils');

for (const key of ['EVOLUTION_API_URL', 'EVOLUTION_API_KEY', 'EVOLUTION_INSTANCE', 'GEMINI_API_KEY', 'DASHBOARD_PASSWORD']) {
  if (!process.env[key]) {
    console.error(`[CONFIG] Missing required env var ${key}`);
    process.exit(1);
  }
}

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

const evolution = new EvolutionApi({
  baseUrl: process.env.EVOLUTION_API_URL,
  globalKey: process.env.EVOLUTION_API_KEY,
  instanceName: process.env.EVOLUTION_INSTANCE,
  instanceToken: process.env.EVOLUTION_INSTANCE_TOKEN,
});

const aiAgent = new AIAgent(process.env.GEMINI_API_KEY, process.env.GEMINI_MODEL);

const OWNER_ID = config.OWNER_PHONE.replace(/[^0-9]/g, '');
const processedMessages = new Set();

const PRICE_RESPONSE = {
  en: `Thank you for your interest! Our team will get back to you shortly with the exact details. You can also call us directly at ${config.BUSINESS_PHONE} for immediate assistance.`,
  ta: `உங்கள் ஆர்வத்திற்கு நன்றி! எங்கள் குழு விரைவில் துல்லியமான விவரங்களுடன் உங்களை தொடர்பு கொள்ளும். உடனடி உதவிக்கு ${config.BUSINESS_PHONE} என்ற எண்ணில் அழைக்கவும்.`,
};

const AFTER_HOURS = {
  en: `Thank you for messaging *${config.BUSINESS_NAME}!* Our working hours are Mon-Sat 9:30 AM to 9:00 PM and Sunday 9:00 AM to 2:00 PM. We've noted your message and will respond first thing during business hours. For urgent needs, please call ${config.BUSINESS_PHONE}.`,
  ta: `*சக்ஸஸ் கம்ப்யூடெக்*கிற்கு செய்தி அனுப்பியதற்கு நன்றி! எங்கள் பணி நேரம் திங்கள்-சனி காலை 9:30 முதல் இரவு 9:00 வரை, ஞாயிறு காலை 9:00 முதல் மதியம் 2:00 வரை. உங்கள் செய்தி பதிவு செய்யப்பட்டுள்ளது, பணி நேரத்தில் உடனடியாக பதிலளிக்கப்படும். அவசரத்திற்கு ${config.BUSINESS_PHONE} அழைக்கவும்.`,
};

const DOC_RECEIVED = {
  en: `We've received your documents! ✅ Our team is reviewing them now. We'll verify the eligibility and get back to you shortly with the next steps. Thank you for choosing *Success Computech!*`,
  ta: `உங்கள் ஆவணங்கள் பெறப்பட்டன! ✅ எங்கள் குழு இப்போது சரிபார்த்துக் கொண்டிருக்கிறது. தகுதியை உறுதி செய்து அடுத்த நடவடிக்கை குறித்து விரைவில் தெரிவிப்போம். *சக்ஸஸ் கம்ப்யூடெக்*கை தேர்ந்தெடுத்ததற்கு நன்றி!`,
};

function isPriceQuery(text) {
  const lower = text.toLowerCase();
  return config.PRICE_TRIGGER_WORDS.some((w) => {
    // Short ASCII triggers like "rs"/"rate" must match whole words, or "first"/"separate" would count.
    if (/^[a-z ]+$/.test(w)) return new RegExp(`\\b${w}\\b`).test(lower);
    return lower.includes(w);
  });
}

function detectService(text) {
  const lower = text.toLowerCase();
  const map = [
    [/aadh?aa?r|ஆதார்/, 'Aadhaar'], [/\bpan\b|பான்/, 'PAN Card'], [/voter|வாக்காளர்/, 'Voter ID'],
    [/ration|smart card|ரேஷன்/, 'Smart Card'], [/passport|பாஸ்போர்ட்/, 'Passport'],
    [/driving|\bdl\b|\bllr\b|licen[cs]e/, 'Driving Licence'], [/\bgst/, 'GST'], [/msme|udyam/, 'MSME'],
    [/fssai/, 'FSSAI'], [/\bpf\b|\bepf|\buan\b/, 'PF/EPFO'], [/patta|chitta|\bec\b|encumbrance|பட்டா/, 'Property'],
    [/birth|death|community cert|income cert/, 'Certificates'], [/tnpsc|\bexam|\btet\b/, 'Exam Applications'],
    [/darshan|sabarimala|tirupati|shirdi/, 'Temple Booking'], [/train|\bbus\b|flight|ticket/, 'Travel Tickets'],
    [/insurance|காப்பீடு/, 'Insurance'], [/welfare|நலவாரியம்/, 'Welfare Board'],
    [/horoscope|jathagam|ஜாதகம்/, 'Horoscope'], [/gift|print|\bmug/, 'Gifts & Printing'], [/\bpvc\b/, 'PVC Card'],
  ];
  for (const [re, svc] of map) if (re.test(lower)) return svc;
  return null;
}

// "919876543210:12@s.whatsapp.net" -> { user: "919876543210", server: "s.whatsapp.net" }
function splitJid(jid) {
  if (!jid || typeof jid !== 'string' || !jid.includes('@')) return null;
  const [userPart, server] = jid.split('@');
  return { user: userPart.split(':')[0], server };
}

// Normalizes Evolution Go (whatsmeow: data.Info/data.Message) and Evolution v2 (data.key/data.message) payloads.
function parseIncoming(body) {
  const data = body?.data || body;
  if (!data) return null;

  if (data.Info) {
    const info = data.Info;
    const candidates = [info.Chat, info.Sender, info.SenderAlt, info.RecipientAlt].map(splitJid).filter(Boolean);
    const chat = splitJid(info.Chat);
    const pn = candidates.find((j) => j.server === 's.whatsapp.net');
    const contact = pn || chat;
    return {
      id: info.ID,
      fromMe: !!info.IsFromMe,
      isGroup: !!info.IsGroup || chat?.server === 'g.us',
      contactId: contact ? (contact.server === 's.whatsapp.net' ? contact.user : `${contact.user}@${contact.server}`) : null,
      pushName: info.PushName,
      message: data.Message || {},
    };
  }

  if (data.key) {
    const chat = splitJid(data.key.remoteJid);
    return {
      id: data.key.id,
      fromMe: !!data.key.fromMe,
      isGroup: chat?.server === 'g.us',
      contactId: chat ? (chat.server === 's.whatsapp.net' ? chat.user : `${chat.user}@${chat.server}`) : null,
      pushName: data.pushName,
      message: data.message || {},
    };
  }
  return null;
}

function extractText(m) {
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.documentMessage?.caption ||
    m.videoMessage?.caption ||
    m.buttonsResponseMessage?.selectedDisplayText ||
    m.listResponseMessage?.title ||
    null
  );
}

function isMedia(m) {
  return !!(m.imageMessage || m.documentMessage || m.audioMessage || m.videoMessage || m.documentWithCaptionMessage);
}

let samplesLogged = 0;
function logWebhookSample(body) {
  if (samplesLogged >= 20) return;
  samplesLogged++;
  try {
    fs.appendFileSync(path.join(db.DATA_DIR, 'webhook-samples.log'), JSON.stringify(body) + '\n');
  } catch {}
}

async function reply(to, text) {
  await evolution.sendText(to, text);
  db.storeOutboundMessage(to, text);
}

// ── Owner commands (sent from the business phone to its own "Message yourself" chat) ──
function handleOwnerCommand(text) {
  const cmd = text.toLowerCase().trim();
  if (cmd === '#stats') {
    const s = db.getStats();
    return `📊 *Lead Dashboard*\n\nTotal Leads: ${s.totalLeads}\nToday's New: ${s.todayLeads}\nHot Leads: ${s.hotLeads}\nPending Follow-up: ${s.pendingFollowUp}\nTotal Messages: ${s.totalMessages}`;
  }
  if (cmd === '#hot') {
    const leads = db.getHotLeads();
    if (!leads.length) return '✅ No pending hot leads. All follow-ups done!';
    return '🔥 *Hot Leads (Pending):*\n\n' + leads.slice(0, 15).map((l) => {
      const services = JSON.parse(l.services_interested || '[]');
      return `• *${l.id}* | ${l.phone} (${l.name})\n  ${services.join(', ') || 'General'} | Price asks: ${l.price_inquiry_count}`;
    }).join('\n\n');
  }
  if (cmd === '#leads') {
    const leads = db.getAllLeads(20);
    if (!leads.length) return '📋 No leads recorded yet.';
    return '📋 *Recent Leads:*\n\n' + leads.map((l) => {
      const icon = l.status === 'hot_lead' ? '🔥' : l.status === 'followed_up' ? '✅' : '🆕';
      return `${icon} *${l.id}* | ${l.phone} | ${l.name}`;
    }).join('\n');
  }
  if (cmd.startsWith('#done ')) {
    const p = cmd.slice(6).trim();
    const lead = db.markFollowUpDone(p);
    return lead ? `✅ Lead ${lead.id} (${p}) marked as followed up.` : `❌ No lead found: ${p}`;
  }
  if (cmd.startsWith('#find ')) {
    const p = cmd.slice(6).trim();
    const lead = db.getLeadByPhone(p);
    if (!lead) return `❌ No lead found: ${p}`;
    const services = JSON.parse(lead.services_interested || '[]');
    return `📋 *Lead Details*\n\nID: ${lead.id}\nPhone: ${lead.phone}\nName: ${lead.name}\nStatus: ${lead.status}\nMessages: ${lead.message_count}\nPrice Asks: ${lead.price_inquiry_count}\nServices: ${services.join(', ') || 'None'}\nFollow-up: ${lead.follow_up_done ? 'Done' : 'Pending'}`;
  }
  if (cmd === '#help') {
    return `🤖 *Bot Owner Commands:*\n\n#stats — Dashboard summary\n#hot — Pending hot leads\n#leads — Recent 20 leads\n#find <phone> — Lead details\n#done <phone> — Mark follow-up done`;
  }
  return null;
}

async function handleIncoming(body) {
  const msg = parseIncoming(body);
  if (!msg || !msg.id || !msg.contactId || msg.isGroup) return;

  if (processedMessages.has(msg.id)) return;
  processedMessages.add(msg.id);
  if (processedMessages.size > 5000) processedMessages.clear();

  const text = extractText(msg.message);
  const media = isMedia(msg.message);
  if (!text && !media) return;

  if (msg.fromMe) {
    if (msg.contactId === OWNER_ID && text && text.trim().startsWith('#')) {
      const out = handleOwnerCommand(text);
      if (out) await evolution.sendText(OWNER_ID, out);
    }
    return;
  }

  const phone = msg.contactId;
  const customerMessage = text || '[Media/Document]';
  const lang = getLanguage(customerMessage);
  const service = detectService(customerMessage);
  const priceQuery = !!text && isPriceQuery(text);

  console.log(`[MSG] ${phone} (${msg.pushName || '?'}) | ${lang} | ${service || '-'} | ${customerMessage.substring(0, 60)}`);

  db.addOrUpdateLead({
    phone,
    name: msg.pushName,
    service,
    message: customerMessage,
    type: priceQuery ? 'price_inquiry' : media ? 'document' : 'inquiry',
    messageType: media ? 'media' : 'text',
  });

  if (media) return reply(phone, DOC_RECEIVED[lang]);

  if (priceQuery) {
    await reply(phone, PRICE_RESPONSE[lang]);
    const lead = db.getLeadByPhone(phone);
    evolution.sendText(
      OWNER_ID,
      `📩 *Price Enquiry Alert*\n\nLead: ${lead?.id}\nFrom: ${phone} (${msg.pushName || 'Unknown'})\nServices: ${JSON.parse(lead?.services_interested || '[]').join(', ') || 'General'}\nMessage: ${customerMessage}\n\nPlease follow up.`
    ).catch((e) => console.error('[NOTIFY] Owner notification failed:', e.message));
    return;
  }

  if (!isWithinWorkingHours()) return reply(phone, AFTER_HOURS[lang]);

  // History already includes the message we just stored.
  const history = db.getConversationHistory(phone, 20);
  const aiReply = await aiAgent.generateResponse(history);
  await reply(phone, aiReply);
}

app.post('/webhook', (req, res) => {
  res.sendStatus(200);
  logWebhookSample(req.body);
  handleIncoming(req.body).catch((err) => {
    console.error('[WEBHOOK] Error:', err.response?.data || err.message);
  });
});

// ── Dashboard API ──
function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (token !== process.env.DASHBOARD_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

const parseLead = (l) => ({ ...l, services_interested: JSON.parse(l.services_interested || '[]') });

app.post('/api/login', (req, res) => {
  if (req.body?.password === process.env.DASHBOARD_PASSWORD) {
    return res.json({ success: true, token: process.env.DASHBOARD_PASSWORD });
  }
  res.status(401).json({ error: 'Invalid password' });
});

app.get('/api/stats', auth, (req, res) => res.json(db.getStats()));

app.get('/api/leads', auth, (req, res) => {
  const { search, status } = req.query;
  let leads = search ? db.searchLeads(search) : db.getAllLeads(200);
  if (status && status !== 'all') leads = leads.filter((l) => l.status === status);
  res.json(leads.map(parseLead));
});

app.get('/api/leads/:phone', auth, (req, res) => {
  const lead = db.getLeadByPhone(req.params.phone);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json({ lead: parseLead(lead), messages: db.getMessages(req.params.phone, 200) });
});

app.post('/api/leads/:phone/follow-up', auth, (req, res) => {
  const lead = db.markFollowUpDone(req.params.phone);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(parseLead(lead));
});

app.post('/api/leads/:phone/notes', auth, (req, res) => {
  const lead = db.updateLeadNotes(req.params.phone, req.body.notes || '');
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(parseLead(lead));
});

app.post('/api/send-message', auth, async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) return res.status(400).json({ error: 'phone and message are required' });
    await reply(phone, message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.message || err.message });
  }
});

app.get('/api/connection', auth, async (req, res) => {
  try {
    res.json(await evolution.getStatus());
  } catch (err) {
    res.json({ Connected: false, error: err.message });
  }
});

app.post('/api/setup-webhook', auth, async (req, res) => {
  try {
    if (!req.body?.url) return res.status(400).json({ error: 'url is required' });
    res.json({ success: true, result: await evolution.setWebhook(req.body.url) });
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.message || err.message });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`[INIT] ${config.BUSINESS_NAME} bot listening on http://localhost:${PORT}`);
  try {
    const status = await evolution.getStatus();
    console.log(`[INIT] Evolution instance "${process.env.EVOLUTION_INSTANCE}": connected=${status.Connected} loggedIn=${status.LoggedIn}`);
  } catch (err) {
    console.error('[INIT] Could not reach Evolution API:', err.response?.data || err.message);
  }

  // On Railway, register our public webhook automatically.
  const publicUrl = process.env.PUBLIC_URL || (process.env.RAILWAY_PUBLIC_DOMAIN && `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  if (publicUrl) {
    try {
      await evolution.setWebhook(`${publicUrl.replace(/\/+$/, '')}/webhook`);
      console.log(`[INIT] Webhook registered: ${publicUrl}/webhook`);
    } catch (err) {
      console.error('[INIT] Webhook registration failed:', err.response?.data || err.message);
    }
  }
});
