const fs = require('fs');
const path = require('path');

const LEADS_FILE = path.join(__dirname, '..', 'data', 'leads.json');
const DATA_DIR = path.join(__dirname, '..', 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

function loadLeads() {
  ensureDataDir();
  const data = fs.readFileSync(LEADS_FILE, 'utf8');
  return JSON.parse(data);
}

function saveLeads(leads) {
  ensureDataDir();
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
}

function generateLeadId() {
  const now = new Date();
  const year = now.getFullYear();
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `SC-${year}-${seq}`;
}

function addOrUpdateLead({ phone, name, service, message, type }) {
  const leads = loadLeads();
  const now = new Date().toISOString();

  const existing = leads.find((l) => l.phone === phone);

  if (existing) {
    existing.lastContact = now;
    existing.messageCount += 1;
    existing.conversations.push({
      timestamp: now,
      message,
      service: service || 'general',
      type: type || 'inquiry',
    });
    if (service && !existing.servicesInterested.includes(service)) {
      existing.servicesInterested.push(service);
    }
    if (type === 'price_inquiry') {
      existing.status = 'hot_lead';
      existing.priceInquiryCount = (existing.priceInquiryCount || 0) + 1;
    }
    saveLeads(leads);
    return existing;
  }

  const newLead = {
    id: generateLeadId(),
    phone,
    name: name || 'Unknown',
    firstContact: now,
    lastContact: now,
    status: type === 'price_inquiry' ? 'hot_lead' : 'new',
    messageCount: 1,
    priceInquiryCount: type === 'price_inquiry' ? 1 : 0,
    servicesInterested: service ? [service] : [],
    conversations: [
      {
        timestamp: now,
        message,
        service: service || 'general',
        type: type || 'inquiry',
      },
    ],
    followUpDone: false,
    notes: '',
  };

  leads.push(newLead);
  saveLeads(leads);
  return newLead;
}

function getLeadByPhone(phone) {
  const leads = loadLeads();
  return leads.find((l) => l.phone === phone) || null;
}

function getHotLeads() {
  const leads = loadLeads();
  return leads.filter((l) => l.status === 'hot_lead' && !l.followUpDone);
}

function getAllLeads() {
  return loadLeads();
}

function updateLeadStatus(phone, status) {
  const leads = loadLeads();
  const lead = leads.find((l) => l.phone === phone);
  if (lead) {
    lead.status = status;
    saveLeads(leads);
  }
  return lead;
}

function markFollowUpDone(phone) {
  const leads = loadLeads();
  const lead = leads.find((l) => l.phone === phone);
  if (lead) {
    lead.followUpDone = true;
    lead.status = 'followed_up';
    saveLeads(leads);
  }
  return lead;
}

function getLeadStats() {
  const leads = loadLeads();
  const today = new Date().toISOString().split('T')[0];
  const todayLeads = leads.filter((l) => l.firstContact.startsWith(today));
  const hotLeads = leads.filter((l) => l.status === 'hot_lead');
  const pendingFollowUp = leads.filter((l) => l.status === 'hot_lead' && !l.followUpDone);

  return {
    totalLeads: leads.length,
    todayNewLeads: todayLeads.length,
    hotLeads: hotLeads.length,
    pendingFollowUp: pendingFollowUp.length,
  };
}

module.exports = {
  addOrUpdateLead,
  getLeadByPhone,
  getHotLeads,
  getAllLeads,
  updateLeadStatus,
  markFollowUpDone,
  getLeadStats,
};
