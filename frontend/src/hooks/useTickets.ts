import { useState, useEffect, useCallback } from "react";
import { getTickets } from "../api/client";
import { Ticket } from "../types";

const STORAGE_KEY = "ai-support-pro-user-tickets";

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tickets from localStorage + backend
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get backend tickets (sample data)
      const backendTickets = await getTickets();
      
      // Get user-created tickets from localStorage
      const storedTickets = localStorage.getItem(STORAGE_KEY);
      const userTickets: Ticket[] = storedTickets ? JSON.parse(storedTickets) : [];
      
      // Merge: user tickets first (newest), then backend tickets
      const allTickets = [...userTickets, ...backendTickets];
      
      setTickets(allTickets);
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

  // Custom setTickets that also saves to localStorage
  const setTicketsWithPersistence = (updater: React.SetStateAction<Ticket[]>) => {
    setTickets((prevTickets) => {
      const newTickets = typeof updater === 'function' ? updater(prevTickets) : updater;
      
      // Extract only user-created tickets (ones created via API, not from backend)
      const userTickets = newTickets.filter(t => !['TICK-001', 'TICK-002', 'TICK-003'].includes(t.id));
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userTickets));
      
      return newTickets;
    });
  };

  return {
    tickets,
    setTickets: setTicketsWithPersistence,
    loading,
    error,
    refresh: fetchTickets,
  };
}