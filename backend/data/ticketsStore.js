// data/ticketsStore.js

let tickets = [];
let nextId = 1;

function createTicket(subject, description) {
  const now = new Date().toISOString();
  const ticket = {
    id: nextId++,
    subject,
    description,
    status: "new", // new | processing | resolved | escalated
    category: null, // Billing | Technical | General | ...
    priority: null, // High | Medium | Low
    suggestedReply: null,
    createdAt: now,
    updatedAt: now,
  };
  tickets.push(ticket);
  return ticket;
}

function getAllTickets() {
  return tickets;
}

function findTicketById(id) {
  return tickets.find((t) => t.id === id);
}

function updateTicketStatus(id, newStatus) {
  const ticket = findTicketById(id);
  if (!ticket) return null;

  ticket.status = newStatus;
  ticket.updatedAt = new Date().toISOString();
  return ticket;
}

function getTicketStats() {
  const totalTickets = tickets.length;

  const byStatus = {
    new: 0,
    processing: 0,
    resolved: 0,
    escalated: 0,
  };

  const byCategory = {
    Billing: 0,
    Technical: 0,
    General: 0,
    Unknown: 0,
  };

  for (const t of tickets) {
    // status counts
    if (byStatus[t.status] !== undefined) {
      byStatus[t.status] += 1;
    }

    // category counts
    if (t.category === "Billing") byCategory.Billing += 1;
    else if (t.category === "Technical") byCategory.Technical += 1;
    else if (t.category === "General") byCategory.General += 1;
    else byCategory.Unknown += 1;
  }

  // Simple demo metrics so the UI looks good
  const resolvedCount = byStatus.resolved || 0;
  const autoResolvedPercent =
    totalTickets > 0 ? Math.round((resolvedCount / totalTickets) * 100) : 0;

  const avgResponseSeconds = totalTickets > 0 ? 30 : 0;
  const monthlySavingsUsd = totalTickets > 0 ? 5000 : 0;

  return {
    totalTickets,
    byStatus,
    byCategory,
    avgResponseSeconds,
    autoResolvedPercent,
    monthlySavingsUsd,
  };
}
module.exports = {
  createTicket,
  getAllTickets,
  findTicketById,
  updateTicketStatus,
  getTicketStats,
};
