const { neon } = require('@neondatabase/serverless');

// Neon's HTTP driver: no persistent connection, so it works in Vercel's short-lived functions.
const sql = neon(process.env.DATABASE_URL || 'postgresql://missing-database-url@localhost/none');

const LEAD_COLUMNS = sql`
  id, phone, name, status, first_contact, last_contact, message_count,
  price_inquiry_count, services_interested, follow_up_done, notes
`;

// Each cold start runs the schema once; every statement is idempotent.
let schemaReady;
function ready() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`CREATE SEQUENCE IF NOT EXISTS lead_seq`;
      await sql`
        CREATE TABLE IF NOT EXISTS leads (
          id TEXT PRIMARY KEY DEFAULT ('SC-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('lead_seq')::text, 4, '0')),
          phone TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL DEFAULT 'Unknown',
          status TEXT NOT NULL DEFAULT 'new',
          first_contact TIMESTAMPTZ NOT NULL DEFAULT now(),
          last_contact TIMESTAMPTZ NOT NULL DEFAULT now(),
          message_count INTEGER NOT NULL DEFAULT 0,
          price_inquiry_count INTEGER NOT NULL DEFAULT 0,
          services_interested JSONB NOT NULL DEFAULT '[]',
          follow_up_done BOOLEAN NOT NULL DEFAULT false,
          notes TEXT NOT NULL DEFAULT ''
        )`;
      await sql`
        CREATE TABLE IF NOT EXISTS messages (
          id BIGSERIAL PRIMARY KEY,
          lead_phone TEXT NOT NULL REFERENCES leads(phone),
          direction TEXT NOT NULL,
          message TEXT NOT NULL,
          message_type TEXT NOT NULL DEFAULT 'text',
          service_detected TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      // WhatsApp message IDs already handled; replaces the in-memory Set, which isn't shared between function instances.
      await sql`
        CREATE TABLE IF NOT EXISTS processed_messages (
          id TEXT PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      await sql`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      await sql`CREATE INDEX IF NOT EXISTS idx_messages_phone ON messages(lead_phone, id)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_leads_last_contact ON leads(last_contact DESC)`;
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

// Returns true the first time a message ID is seen, false for webhook retries/duplicates.
async function claimMessage(id) {
  await ready();
  const rows = await sql`INSERT INTO processed_messages (id) VALUES (${id}) ON CONFLICT DO NOTHING RETURNING id`;
  return rows.length > 0;
}

async function addOrUpdateLead({ phone, name, service, message, type, messageType }) {
  await ready();
  const isPrice = type === 'price_inquiry';
  const displayName = name || 'Unknown';

  const update = () => sql`
    UPDATE leads SET
      name = CASE WHEN ${displayName} <> 'Unknown' THEN ${displayName} ELSE name END,
      last_contact = now(),
      message_count = message_count + 1,
      status = CASE WHEN ${isPrice} THEN 'hot_lead' ELSE status END,
      price_inquiry_count = price_inquiry_count + ${isPrice ? 1 : 0},
      services_interested = CASE
        WHEN ${service}::text IS NULL OR services_interested @> jsonb_build_array(${service}::text) THEN services_interested
        ELSE services_interested || jsonb_build_array(${service}::text)
      END
    WHERE phone = ${phone}
    RETURNING ${LEAD_COLUMNS}`;

  // Update first so the lead_seq number is only used for genuinely new leads.
  let [lead] = await update();
  if (!lead) {
    [lead] = await sql`
      INSERT INTO leads (phone, name, status, message_count, price_inquiry_count, services_interested)
      VALUES (${phone}, ${displayName}, ${isPrice ? 'hot_lead' : 'new'}, 1, ${isPrice ? 1 : 0},
              ${JSON.stringify(service ? [service] : [])}::jsonb)
      ON CONFLICT (phone) DO NOTHING
      RETURNING ${LEAD_COLUMNS}`;
    // Another request created the lead in between; apply this message as an update instead.
    if (!lead) [lead] = await update();
  }

  await sql`
    INSERT INTO messages (lead_phone, direction, message, message_type, service_detected)
    VALUES (${phone}, 'inbound', ${message}, ${messageType || 'text'}, ${service || null})`;

  return lead;
}

async function storeOutboundMessage(phone, message) {
  await ready();
  // Manual sends from the dashboard may target a number that hasn't messaged us yet.
  await sql`INSERT INTO leads (phone) VALUES (${phone}) ON CONFLICT (phone) DO NOTHING`;
  await sql`
    INSERT INTO messages (lead_phone, direction, message, message_type)
    VALUES (${phone}, 'outbound', ${message}, 'text')`;
}

async function getConversationHistory(phone, limit = 20) {
  await ready();
  const rows = await sql`SELECT * FROM messages WHERE lead_phone = ${phone} ORDER BY id DESC LIMIT ${limit}`;
  return rows.reverse();
}

// Messages in one direction for a number within the last `minutes`, optionally only those with exact `message` text.
async function countRecentMessages(phone, direction, minutes, message = null) {
  await ready();
  const [r] = await sql`
    SELECT COUNT(*)::int AS n FROM messages
    WHERE lead_phone = ${phone} AND direction = ${direction}
      AND created_at > now() - make_interval(mins => ${minutes})
      AND (${message}::text IS NULL OR message = ${message})`;
  return r.n;
}

async function getLeadByPhone(phone) {
  await ready();
  const [lead] = await sql`SELECT ${LEAD_COLUMNS} FROM leads WHERE phone = ${phone}`;
  return lead || null;
}

async function getAllLeads(limit = 100) {
  await ready();
  return sql`SELECT ${LEAD_COLUMNS} FROM leads ORDER BY last_contact DESC LIMIT ${limit}`;
}

async function getHotLeads() {
  await ready();
  return sql`
    SELECT ${LEAD_COLUMNS} FROM leads
    WHERE status = 'hot_lead' AND follow_up_done = false
    ORDER BY last_contact DESC`;
}

async function markFollowUpDone(phone) {
  await ready();
  const [lead] = await sql`
    UPDATE leads SET follow_up_done = true, status = 'followed_up'
    WHERE phone = ${phone}
    RETURNING ${LEAD_COLUMNS}`;
  return lead || null;
}

async function getStats() {
  await ready();
  // "Today" is the shop's day in IST, not UTC.
  const [s] = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM leads) AS "totalLeads",
      (SELECT COUNT(*)::int FROM leads
        WHERE (first_contact AT TIME ZONE 'Asia/Kolkata')::date = (now() AT TIME ZONE 'Asia/Kolkata')::date) AS "todayLeads",
      (SELECT COUNT(*)::int FROM leads WHERE status = 'hot_lead') AS "hotLeads",
      (SELECT COUNT(*)::int FROM leads WHERE status = 'hot_lead' AND follow_up_done = false) AS "pendingFollowUp",
      (SELECT COUNT(*)::int FROM messages) AS "totalMessages"`;
  return s;
}

async function searchLeads(query) {
  await ready();
  const q = `%${query}%`;
  return sql`
    SELECT ${LEAD_COLUMNS} FROM leads
    WHERE phone ILIKE ${q} OR name ILIKE ${q} OR services_interested::text ILIKE ${q}
    ORDER BY last_contact DESC
    LIMIT 200`;
}

async function getMessages(phone, limit = 100) {
  await ready();
  // Latest `limit` messages, returned oldest first for display.
  const rows = await sql`SELECT * FROM messages WHERE lead_phone = ${phone} ORDER BY id DESC LIMIT ${limit}`;
  return rows.reverse();
}

async function updateLeadNotes(phone, notes) {
  await ready();
  const [lead] = await sql`UPDATE leads SET notes = ${notes} WHERE phone = ${phone} RETURNING ${LEAD_COLUMNS}`;
  return lead || null;
}

// Bot behaviour settings edited from the dashboard; stored as one JSON row so new fields need no migration.
const DEFAULT_SETTINGS = {
  autoReply: true, // master switch for all automatic replies
  testMode: false, // when on, only testNumbers get replies
  testNumbers: [],
  extraInstructions: '', // appended to the AI system prompt
};

async function getSettings() {
  await ready();
  const [row] = await sql`SELECT value FROM settings WHERE key = 'bot'`;
  return { ...DEFAULT_SETTINGS, ...(row?.value || {}) };
}

async function saveSettings(changes) {
  const merged = { ...(await getSettings()), ...changes };
  await sql`
    INSERT INTO settings (key, value) VALUES ('bot', ${JSON.stringify(merged)}::jsonb)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
  return merged;
}

module.exports = {
  getSettings,
  saveSettings,
  claimMessage,
  addOrUpdateLead,
  storeOutboundMessage,
  getConversationHistory,
  countRecentMessages,
  getLeadByPhone,
  getAllLeads,
  getHotLeads,
  markFollowUpDone,
  getStats,
  searchLeads,
  getMessages,
  updateLeadNotes,
};
