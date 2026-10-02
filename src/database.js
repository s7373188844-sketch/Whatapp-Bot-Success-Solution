const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// On Railway, set DATA_DIR to a mounted Volume path (e.g. /data) or the DB is wiped on every redeploy.
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'bot.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    name TEXT DEFAULT 'Unknown',
    status TEXT DEFAULT 'new',
    first_contact DATETIME DEFAULT (datetime('now')),
    last_contact DATETIME DEFAULT (datetime('now')),
    message_count INTEGER DEFAULT 0,
    price_inquiry_count INTEGER DEFAULT 0,
    services_interested TEXT DEFAULT '[]',
    follow_up_done INTEGER DEFAULT 0,
    notes TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_phone TEXT NOT NULL,
    direction TEXT NOT NULL,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    service_detected TEXT,
    created_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (lead_phone) REFERENCES leads(phone)
  );

  CREATE INDEX IF NOT EXISTS idx_messages_phone ON messages(lead_phone);
  CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
  CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
`);

function generateLeadId() {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `SC-${year}-${seq}`;
}

function addOrUpdateLead({ phone, name, service, message, type, messageType }) {
  const existing = db.prepare('SELECT * FROM leads WHERE phone = ?').get(phone);

  if (existing) {
    const services = JSON.parse(existing.services_interested || '[]');
    if (service && !services.includes(service)) services.push(service);
    const newStatus = type === 'price_inquiry' ? 'hot_lead' : existing.status;
    const priceInc = type === 'price_inquiry' ? 1 : 0;

    db.prepare(`
      UPDATE leads SET
        name = CASE WHEN @name != 'Unknown' THEN @name ELSE name END,
        last_contact = datetime('now'),
        message_count = message_count + 1,
        status = @status,
        price_inquiry_count = price_inquiry_count + @priceInc,
        services_interested = @services
      WHERE phone = @phone
    `).run({
      name: name || 'Unknown',
      status: newStatus,
      priceInc,
      services: JSON.stringify(services),
      phone,
    });

    db.prepare(
      `INSERT INTO messages (lead_phone, direction, message, message_type, service_detected) VALUES (?, 'inbound', ?, ?, ?)`
    ).run(phone, message, messageType || 'text', service || null);

    return db.prepare('SELECT * FROM leads WHERE phone = ?').get(phone);
  }

  const id = generateLeadId();
  db.prepare(`
    INSERT INTO leads (id, phone, name, status, message_count, price_inquiry_count, services_interested)
    VALUES (?, ?, ?, ?, 1, ?, ?)
  `).run(
    id, phone, name || 'Unknown',
    type === 'price_inquiry' ? 'hot_lead' : 'new',
    type === 'price_inquiry' ? 1 : 0,
    JSON.stringify(service ? [service] : [])
  );

  db.prepare(
    `INSERT INTO messages (lead_phone, direction, message, message_type, service_detected) VALUES (?, 'inbound', ?, ?, ?)`
  ).run(phone, message, messageType || 'text', service || null);

  return db.prepare('SELECT * FROM leads WHERE phone = ?').get(phone);
}

function storeOutboundMessage(phone, message) {
  db.prepare(
    `INSERT INTO messages (lead_phone, direction, message, message_type) VALUES (?, 'outbound', ?, 'text')`
  ).run(phone, message);
}

function getConversationHistory(phone, limit = 20) {
  return db.prepare(
    'SELECT * FROM messages WHERE lead_phone = ? ORDER BY created_at DESC LIMIT ?'
  ).all(phone, limit).reverse();
}

function getLeadByPhone(phone) {
  return db.prepare('SELECT * FROM leads WHERE phone = ?').get(phone) || null;
}

function getAllLeads(limit = 100) {
  return db.prepare('SELECT * FROM leads ORDER BY last_contact DESC LIMIT ?').all(limit);
}

function getHotLeads() {
  return db.prepare(
    "SELECT * FROM leads WHERE status = 'hot_lead' AND follow_up_done = 0 ORDER BY last_contact DESC"
  ).all();
}

function markFollowUpDone(phone) {
  db.prepare("UPDATE leads SET follow_up_done = 1, status = 'followed_up' WHERE phone = ?").run(phone);
  return db.prepare('SELECT * FROM leads WHERE phone = ?').get(phone);
}

function getStats() {
  const totalLeads = db.prepare('SELECT COUNT(*) as c FROM leads').get().c;
  const today = new Date().toISOString().split('T')[0];
  const todayLeads = db.prepare("SELECT COUNT(*) as c FROM leads WHERE date(first_contact) = ?").get(today).c;
  const hotLeads = db.prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'hot_lead'").get().c;
  const pendingFollowUp = db.prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'hot_lead' AND follow_up_done = 0").get().c;
  const totalMessages = db.prepare('SELECT COUNT(*) as c FROM messages').get().c;
  return { totalLeads, todayLeads, hotLeads, pendingFollowUp, totalMessages };
}

function searchLeads(query) {
  const q = `%${query}%`;
  return db.prepare(
    'SELECT * FROM leads WHERE phone LIKE ? OR name LIKE ? OR services_interested LIKE ? ORDER BY last_contact DESC'
  ).all(q, q, q);
}

function getMessages(phone, limit = 100) {
  return db.prepare('SELECT * FROM messages WHERE lead_phone = ? ORDER BY created_at ASC LIMIT ?').all(phone, limit);
}

function updateLeadNotes(phone, notes) {
  db.prepare('UPDATE leads SET notes = ? WHERE phone = ?').run(notes, phone);
  return db.prepare('SELECT * FROM leads WHERE phone = ?').get(phone);
}

module.exports = {
  DATA_DIR,
  addOrUpdateLead,
  storeOutboundMessage,
  getConversationHistory,
  getLeadByPhone,
  getAllLeads,
  getHotLeads,
  markFollowUpDone,
  getStats,
  searchLeads,
  getMessages,
  updateLeadNotes,
};
