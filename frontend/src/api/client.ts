// src/api/client.ts
import { Review, ReviewStats } from "../types.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Backend Requirements:
 * 1. Ensure CORS is enabled for your frontend origin (e.g., http://localhost:5173).
 * 2. GET /api/reviews -> Review[]
 * 3. GET /api/reviews/stats -> ReviewStats
 * 4. POST /api/reviews -> { pr_title, code_diff } -> Review
 */

export async function getReviews(): Promise<Review[]> {
  const response = await fetch(`${API_BASE_URL}/api/reviews`);
  if (!response.ok) {
    throw new Error(`Failed to fetch reviews (status: ${response.status})`);
  }
  return response.json();
}

export async function getReviewStats(): Promise<ReviewStats> {
  const response = await fetch(`${API_BASE_URL}/api/reviews/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stats (status: ${response.status})`);
  }
  return response.json();
}

export async function createReview(payload: {
  pr_title: string;
  code_diff: string;
}): Promise<Review> {
  const response = await fetch(`${API_BASE_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create review (status: ${response.status})`);
  }

  // Returns the full review object, including change_type, risk_level, status, reviewComment
  return response.json();
}