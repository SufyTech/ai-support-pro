export type ReviewStatus = 'new' | 'processing' | 'resolved' | 'escalated';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ReviewHistoryItem {
  timestamp: string;
  message: string;
  actor: 'system' | 'agent' | 'user';
}

export interface Review {
  id: string;
  pr_title: string;
  status: ReviewStatus;
  risk_level: RiskLevel;
  change_type: string;
  createdAt: string;
  code_diff?: string;
  history?: ReviewHistoryItem[];
}

export interface ReviewStats {
  totalReviews: number;
  byStatus: Record<ReviewStatus, number>;
  byChangeType: {
    Feature: number;
    "Bug Fix": number;
    Refactor: number;
    "Dependency Update": number;
    Documentation: number;
  };
  avgResponseSeconds: number;
  autoApprovedPercent: number;
  monthlySavingsUsd: number;
}