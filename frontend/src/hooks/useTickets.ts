import { useState, useEffect, useCallback } from "react";
import { getTickets } from "../api/client";
import { Ticket } from "../types";

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tickets");
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return {
    tickets,
    setTickets, 
    loading,
    error,
    refresh: fetchTickets,
  };
}