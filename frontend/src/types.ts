export type TicketStatus = 'new' | 'processing' | 'resolved' | 'escalated';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketHistoryItem {
  timestamp: string;
  message: string;
  actor: 'system' | 'agent' | 'user';
}

export interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  createdAt: string;
  description?: string;
  history?: TicketHistoryItem[];
}

export interface TicketStats {
  totalTickets: number;
  byStatus: Record<TicketStatus, number>;
  byCategory: {
    Billing: number;
    Technical: number;
    General: number;
    Unknown: number;
  };
  avgResponseSeconds: number;
  autoResolvedPercent: number;
  monthlySavingsUsd: number;
}