require('dotenv').config();

const express = require('express');
const path = require('path');
const { waitUntil } = require('@vercel/functions');
const config = require('./config');
const db = require('./database');
const EvolutionApi = require('./evolutionApi');
const AIAgent = require('./aiAgent');
const { getLanguage } = require('./languageDetector');
const { getEsevaiReply } = require('./esevai');
const { WELCOME_MENU, isGreeting, parseMenuChoice, getMenuItemReply } = require('./menu');

const REQUIRED_ENV = ['DATABASE_URL', 'EVOLUTION_API_URL', 'EVOLUTION_API_KEY', 'EVOLUTION_INSTANCE', 'GEMINI_API_KEY', 'DASHBOARD_PASSWORD'];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length) {
  // Throwing (not process.exit) so Vercel shows the reason in the function logs.
  throw new Error(`[CONFIG] Missing required env vars: ${missingEnv.join(', ')}`);
}

const app = express();
app.use(express.json({ limit: '10mb' }));

// On Vercel, public/ is served by the CDN; these cover local runs and any request that falls through to the function.
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));
app.use(express.static(PUBLIC_DIR));

const evolution = new EvolutionApi({
  baseUrl: process.env.EVOLUTION_API_URL,
  globalKey: process.env.EVOLUTION_API_KEY,
  instanceName: process.env.EVOLUTION_INSTANCE,
  instanceToken: process.env.EVOLUTION_INSTANCE_TOKEN,
});

const aiAgent = new AIAgent(process.env.GEMINI_API_KEY, process.env.GEMINI_MODEL);

const OWNER_ID = config.OWNER_PHONE.replace(/[^0-9]/g, '');

const PRICE_RESPONSE = {
  en: `Thank you for your interest! Our team will get back to you shortly with the exact details. You can also call us directly at ${config.BUSINESS_PHONE} for immediate assistance.`,
  ta: `உங்கள் ஆர்வத்திற்கு நன்றி! எங்கள் குழு விரைவில் துல்லியமான விவரங்களுடன் உங்களை தொடர்பு கொள்ளும். உடனடி உதவிக்கு ${config.BUSINESS_PHONE} என்ற எண்ணில் அழைக்கவும்.`,
};

const DOC_RECEIVED = {
  en: `We've received your documents! ✅ Our team is reviewing them now. We'll verify the eligibility and get back to you shortly with the next steps. Thank you for choosing *Success Computech!*`,
  ta: `உங்கள் ஆவணங்கள் பெறப்பட்டன! ✅ எங்கள் குழு இப்போது சரிபார்த்துக் கொண்டிருக்கிறது. தகுதியை உறுதி செய்து அடுத்த நடவடிக்கை குறித்து விரைவில் தெரிவிப்போம். *சக்ஸஸ் கம்ப்யூடெக்*கை தேர்ந்தெடுத்ததற்கு நன்றி!`,
};

const VOICE_RECEIVED = {
  en: `We've received your voice message! 🎙️ Our team will listen and get back to you shortly. For a faster reply, please type your question here.`,
  ta: `உங்கள் குரல் செய்தி கிடைத்தது! 🎙️ எங்கள் குழு கேட்டு விரைவில் பதிலளிக்கும். விரைவான பதிலுக்கு உங்கள் கேள்வியை இங்கே டைப் செய்யவும்.`,
};

// Canned replies (documents, voice, e-Sevai lists) go out at most once per number in this window.
const CANNED_REPEAT_MINUTES = 30;
// Loop guard: stops ping-pong with other auto-reply bots and floods from one number.
const LOOP_WINDOW_MINUTES = 10;
const MAX_REPLIES_PER_WINDOW = 5;
// A bare number counts as a menu choice only if we sent the welcome menu within this window.
const MENU_CHOICE_WINDOW_MINUTES = 24 * 60;

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

// Channels (…@newsletter), status updates (status@broadcast) and broadcast lists aren't customer chats.
function isBroadcastJid(jid) {
  return jid?.server === 'newsletter' || jid?.server === 'broadcast';
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
      isBroadcast: isBroadcastJid(chat),
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
      isBroadcast: isBroadcastJid(chat),
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
    m.documentWithCaptionMessage?.message?.documentMessage?.caption ||
    m.buttonsResponseMessage?.selectedDisplayText ||
    m.listResponseMessage?.title ||
    null
  );
}

function isMedia(m) {
  return !!(m.imageMessage || m.documentMessage || m.audioMessage || m.videoMessage || m.documentWithCaptionMessage);
}

// Payload samples go to the function logs (Vercel's filesystem is read-only); first 20 per instance.
let samplesLogged = 0;
function logWebhookSample(body) {
  if (samplesLogged >= 20) return;
  samplesLogged++;
  console.log('[WEBHOOK SAMPLE]', JSON.stringify(body).substring(0, 3000));
}

async function reply(to, text) {
  await evolution.sendText(to, text);
  await db.storeOutboundMessage(to, text);
}

// ── Owner commands (sent from the business phone to its own "Message yourself" chat) ──
async function handleOwnerCommand(text) {
  const cmd = text.toLowerCase().trim();
  if (cmd === '#stats') {
    const s = await db.getStats();
    return `📊 *Lead Dashboard*\n\nTotal Leads: ${s.totalLeads}\nToday's New: ${s.todayLeads}\nHot Leads: ${s.hotLeads}\nPending Follow-up: ${s.pendingFollowUp}\nTotal Messages: ${s.totalMessages}`;
  }
  if (cmd === '#hot') {
    const leads = await db.getHotLeads();
    if (!leads.length) return '✅ No pending hot leads. All follow-ups done!';
    return '🔥 *Hot Leads (Pending):*\n\n' + leads.slice(0, 15).map((l) => {
      return `• *${l.id}* | ${l.phone} (${l.name})\n  ${l.services_interested.join(', ') || 'General'} | Price asks: ${l.price_inquiry_count}`;
    }).join('\n\n');
  }
  if (cmd === '#leads') {
    const leads = await db.getAllLeads(20);
    if (!leads.length) return '📋 No leads recorded yet.';
    return '📋 *Recent Leads:*\n\n' + leads.map((l) => {
      const icon = l.status === 'hot_lead' ? '🔥' : l.status === 'followed_up' ? '✅' : '🆕';
      return `${icon} *${l.id}* | ${l.phone} | ${l.name}`;
    }).join('\n');
  }
  if (cmd.startsWith('#done ')) {
    const p = cmd.slice(6).trim();
    const lead = await db.markFollowUpDone(p);
    return lead ? `✅ Lead ${lead.id} (${p}) marked as followed up.` : `❌ No lead found: ${p}`;
  }
  if (cmd.startsWith('#find ')) {
    const p = cmd.slice(6).trim();
    const lead = await db.getLeadByPhone(p);
    if (!lead) return `❌ No lead found: ${p}`;
    return `📋 *Lead Details*\n\nID: ${lead.id}\nPhone: ${lead.phone}\nName: ${lead.name}\nStatus: ${lead.status}\nMessages: ${lead.message_count}\nPrice Asks: ${lead.price_inquiry_count}\nServices: ${lead.services_interested.join(', ') || 'None'}\nFollow-up: ${lead.follow_up_done ? 'Done' : 'Pending'}`;
  }
  if (cmd === '#help') {
    return `🤖 *Bot Owner Commands:*\n\n#stats — Dashboard summary\n#hot — Pending hot leads\n#leads — Recent 20 leads\n#find <phone> — Lead details\n#done <phone> — Mark follow-up done`;
  }
  return null;
}

async function handleIncoming(body) {
  const msg = parseIncoming(body);
  if (!msg || !msg.id || !msg.contactId || msg.isGroup || msg.isBroadcast) return;

  const text = extractText(msg.message);
  const media = isMedia(msg.message);
  if (!text && !media) return;

  if (!(await db.claimMessage(msg.id))) return;

  if (msg.fromMe) {
    if (msg.contactId === OWNER_ID && text && text.trim().startsWith('#')) {
      const out = await handleOwnerCommand(text);
      if (out) await evolution.sendText(OWNER_ID, out);
    }
    return;
  }

  const phone = msg.contactId;
  // A photo/document with a caption is answered from its caption; the prefix tells the AI something was attached.
  const mediaLabel = msg.message.audioMessage ? '[Voice message]' : '[Media/Document]';
  const customerMessage = media ? (text ? `${mediaLabel} ${text}` : mediaLabel) : text;
  const lang = getLanguage(customerMessage);
  const priceQuery = !!text && isPriceQuery(text);
  const esevai = text ? getEsevaiReply(text, lang) : null;
  const choice = text ? parseMenuChoice(text) : null;
  const menuItem = choice && (await db.countRecentMessages(phone, 'outbound', MENU_CHOICE_WINDOW_MINUTES, WELCOME_MENU)) > 0
    ? getMenuItemReply(choice)
    : null;
  const service = menuItem?.service || esevai?.service || detectService(customerMessage);

  console.log(`[MSG] ${phone} (${msg.pushName || '?'}) | ${lang} | ${service || '-'} | ${customerMessage.substring(0, 60)}`);

  const [lead, settings] = await Promise.all([
    db.addOrUpdateLead({
      phone,
      name: msg.pushName,
      service,
      message: customerMessage,
      type: priceQuery ? 'price_inquiry' : media ? 'document' : 'inquiry',
      messageType: media ? 'media' : 'text',
    }),
    db.getSettings(),
  ]);

  // The message is saved either way, so it still shows in the dashboard.
  if (!settings.autoReply) return console.log(`[SKIP] ${phone}: auto-reply is off`);
  if (settings.testMode && !settings.testNumbers.includes(phone)) {
    return console.log(`[SKIP] ${phone}: test mode, not a test number`);
  }

  // Loop guard. The current message is already stored, so a count above 1 means it's a repeat.
  const [recentReplies, sameMessageCount] = await Promise.all([
    db.countRecentMessages(phone, 'outbound', LOOP_WINDOW_MINUTES),
    db.countRecentMessages(phone, 'inbound', LOOP_WINDOW_MINUTES, customerMessage),
  ]);
  if (recentReplies >= MAX_REPLIES_PER_WINDOW) {
    return console.log(`[SKIP] ${phone}: ${recentReplies} replies in ${LOOP_WINDOW_MINUTES} min (loop guard)`);
  }
  // Caption-less media is rate-limited by its own once-per-window acknowledgement below.
  if (text && sameMessageCount > 1) return console.log(`[SKIP] ${phone}: repeated message`);

  const sentRecently = async (cannedText) =>
    (await db.countRecentMessages(phone, 'outbound', CANNED_REPEAT_MINUTES, cannedText)) > 0;

  if (media && !text) {
    const canned = msg.message.audioMessage ? VOICE_RECEIVED[lang] : DOC_RECEIVED[lang];
    if (await sentRecently(canned)) return console.log(`[SKIP] ${phone}: media acknowledgement already sent`);
    return reply(phone, canned);
  }

  if (isGreeting(text)) return reply(phone, WELCOME_MENU);
  if (menuItem) return reply(phone, menuItem.reply);

  if (priceQuery) {
    // Awaited (not fire-and-forget) so the serverless function doesn't freeze before the alert goes out.
    await Promise.all([
      reply(phone, PRICE_RESPONSE[lang]),
      evolution.sendText(
        OWNER_ID,
        `📩 *Price Enquiry Alert*\n\nLead: ${lead?.id}\nFrom: ${phone} (${msg.pushName || 'Unknown'})\nServices: ${lead?.services_interested?.join(', ') || 'General'}\nMessage: ${customerMessage}\n\nPlease follow up.`
      ).catch((e) => console.error('[NOTIFY] Owner notification failed:', e.message)),
    ]);
    return;
  }

  // e-Sevai certificate questions get the exact document list; if already sent recently, the AI answers instead.
  if (esevai && !(await sentRecently(esevai.reply))) return reply(phone, esevai.reply);

  // History already includes the message we just stored.
  const history = await db.getConversationHistory(phone, 20);
  const aiReply = await aiAgent.generateResponse(history, { extraInstructions: settings.extraInstructions });
  // Replies 24/7: no working-hours check.
  await reply(phone, aiReply);
}

// Also accepts a named path (e.g. /webhook/askmitra) so the URL configured in Evolution can carry a suffix.
app.post(['/webhook', '/webhook/:name'], (req, res) => {
  logWebhookSample(req.body);
  // Acknowledge Evolution right away; waitUntil keeps the Vercel function alive until the reply is sent.
  waitUntil(
    handleIncoming(req.body).catch((err) => {
      console.error('[WEBHOOK] Error:', err.response?.data || err.message);
    })
  );
  res.sendStatus(200);
});

// ── Dashboard API ──
function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (token !== process.env.DASHBOARD_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// Express 4 doesn't catch rejected promises, so async handlers report DB errors through this.
const route = (fn) => (req, res) =>
  fn(req, res).catch((err) => {
    console.error(`[API] ${req.method} ${req.path}:`, err.message);
    res.status(500).json({ error: err.message });
  });

app.post('/api/login', (req, res) => {
  if (req.body?.password === process.env.DASHBOARD_PASSWORD) {
    return res.json({ success: true, token: process.env.DASHBOARD_PASSWORD });
  }
  res.status(401).json({ error: 'Invalid password' });
});

app.get('/api/stats', auth, route(async (req, res) => res.json(await db.getStats())));

app.get('/api/leads', auth, route(async (req, res) => {
  const { search, status } = req.query;
  let leads = search ? await db.searchLeads(search) : await db.getAllLeads(200);
  if (status && status !== 'all') leads = leads.filter((l) => l.status === status);
  res.json(leads);
}));

app.get('/api/leads/:phone', auth, route(async (req, res) => {
  const [lead, messages] = await Promise.all([db.getLeadByPhone(req.params.phone), db.getMessages(req.params.phone, 200)]);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json({ lead, messages });
}));

app.post('/api/leads/:phone/follow-up', auth, route(async (req, res) => {
  const lead = await db.markFollowUpDone(req.params.phone);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
}));

app.post('/api/leads/:phone/notes', auth, route(async (req, res) => {
  const lead = await db.updateLeadNotes(req.params.phone, req.body.notes || '');
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
}));

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

// "+91 98765-43210" / "9876543210" -> "919876543210" (WhatsApp IDs are country code + number).
function normalizePhone(input) {
  const digits = String(input).replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
}

app.get('/api/settings', auth, route(async (req, res) => res.json(await db.getSettings())));

app.post('/api/settings', auth, route(async (req, res) => {
  const { autoReply, testMode, testNumbers, extraInstructions } = req.body || {};
  const changes = {};
  if (typeof autoReply === 'boolean') changes.autoReply = autoReply;
  if (typeof testMode === 'boolean') changes.testMode = testMode;
  if (Array.isArray(testNumbers)) {
    changes.testNumbers = [...new Set(testNumbers.map(normalizePhone).filter((n) => n.length >= 10 && n.length <= 15))];
  }
  if (typeof extraInstructions === 'string') changes.extraInstructions = extraInstructions.slice(0, 4000);
  if (changes.testMode && !(changes.testNumbers ?? (await db.getSettings()).testNumbers).length) {
    return res.status(400).json({ error: 'Add at least one test number before turning on test mode' });
  }
  res.json(await db.saveSettings(changes));
}));

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

// Vercel imports the app and handles requests itself; only open a port for local/long-running hosts.
module.exports = app;

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, async () => {
    console.log(`[INIT] ${config.BUSINESS_NAME} bot listening on http://localhost:${PORT}`);
    try {
      const status = await evolution.getStatus();
      console.log(`[INIT] Evolution instance "${process.env.EVOLUTION_INSTANCE}": connected=${status.Connected} loggedIn=${status.LoggedIn}`);
    } catch (err) {
      console.error('[INIT] Could not reach Evolution API:', err.response?.data || err.message);
    }

    // On Railway, register our public webhook automatically. (On Vercel, use the dashboard's Webhook Setup.)
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
}
