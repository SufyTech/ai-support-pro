import { useState, useEffect, useCallback } from "react";
import { getReviews } from "../api/client";
import { Review } from "../types";

const STORAGE_KEY = "ai-code-review-bot-user-reviews";

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Read local reviews first, so they're available no matter what
    // happens with the backend call below.
    const storedReviews = localStorage.getItem(STORAGE_KEY);
    const userReviews: Review[] = storedReviews ? JSON.parse(storedReviews) : [];

    try {
      const backendReviews = await getReviews();
      setReviews([...userReviews, ...backendReviews]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reviews");
      console.error("Error fetching reviews:", err);
      // Backend failed (e.g. 404 during redeploy) — still show local reviews
      // instead of wiping the screen.
      setReviews(userReviews);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const setReviewsWithPersistence = (updater: React.SetStateAction<Review[]>) => {
    setReviews((prevReviews) => {
      const newReviews = typeof updater === 'function' ? updater(prevReviews) : updater;

      // Seed data uses PR-00X ids, user-created ones don't match that pattern
      const userReviews = newReviews.filter(r => !r.id.match(/^PR-00\d$/));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(userReviews));

      return newReviews;
    });
  };

  return {
    reviews,
    setReviews: setReviewsWithPersistence,
    loading,
    error,
    refresh: fetchReviews,
  };
}