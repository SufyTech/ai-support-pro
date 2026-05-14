// src/api/client.ts
import { Ticket, TicketStats } from "../types.ts";

const API_BASE_URL = "http://localhost:4000";

/**
 * Backend Requirements:
 * 1. Ensure CORS is enabled for your frontend origin (e.g., http://localhost:5173).
 * 2. GET /api/tickets -> Ticket[]
 * 3. GET /api/tickets/stats -> TicketStats
 * 4. POST /api/tickets -> { subject, description } -> Ticket
 */

export async function getTickets(): Promise<Ticket[]> {
  const response = await fetch(`${API_BASE_URL}/api/tickets`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tickets (status: ${response.status})`);
  }
  return response.json();
}

export async function getTicketStats(): Promise<TicketStats> {
  const response = await fetch(`${API_BASE_URL}/api/tickets/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stats (status: ${response.status})`);
  }
  return response.json();
}

export async function createTicket(payload: {
  subject: string;
  description: string;
}): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/api/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create ticket (status: ${response.status})`);
  }

  // This returns the full ticket object, including category, priority, status, suggestedReply
  return response.json();
}