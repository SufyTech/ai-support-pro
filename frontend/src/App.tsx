/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero.tsx";
import SocialProof from "./components/SocialProof.tsx";
import Solutions from "./components/Solutions.tsx";
import Agents from "./components/Agents.tsx";
import HowItWorks from "./components/HowItWorks.tsx";
import Metrics from "./components/Metrics.tsx";
import Pricing from "./components/Pricing.tsx";
import Security from "./components/Security.tsx";
import Contact from "./components/Contact.tsx";
import Footer from "./components/Footer.tsx";
import TicketList from "./components/TicketList.tsx";
import AIDispatcher from "./components/AIDispatcher.tsx"; // ✅ ADDED

import { useTickets } from "./hooks/useTickets.ts";
import { useTicketStats } from "./hooks/useTicketStats.ts";
import { Ticket } from "./types.ts"; // ✅ ADDED

export default function App() {
  const {
    tickets,
    loading: ticketsLoading,
    refresh: refreshTickets,
    setTickets, // ✅ ADDED - This is the KEY fix
  } = useTickets();

  const {
    stats,
    loading: statsLoading,
    refresh: refreshStats,
  } = useTicketStats();

  // ✅ UPDATED - Now accepts the new ticket and adds it immediately
  const handleTicketCreated = (newTicket: Ticket) => {
    // Add new ticket to the TOP of the list immediately
    setTickets((prevTickets) => [newTicket, ...prevTickets]);

    // Refresh stats
    refreshStats();
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-accent/30 selection:text-white">
      {/* Background patterns */}
      <div className="fixed inset-0 z-[-2] noise-overlay" />
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_500px_at_50%_200px,#1b1b3a,transparent)]" />
      <div
        className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #6c6cff 1px, transparent 1px), linear-gradient(to bottom, #6c6cff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <Navbar />

      <main>
        <Hero tickets={tickets} loading={ticketsLoading} />
        <SocialProof />
        <Solutions />
        <Agents />
        <HowItWorks />
        <Metrics stats={stats} loading={statsLoading} />

        {/* ✅ ADDED - New AI Dispatcher component */}
        <AIDispatcher onTicketCreated={handleTicketCreated} />

        <TicketList tickets={tickets} loading={ticketsLoading} />
        <Pricing />
        <Security />
        <Contact onTicketCreated={handleTicketCreated} />
      </main>

      <Footer />
    </div>
  );
}
