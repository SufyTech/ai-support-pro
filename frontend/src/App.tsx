/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
import AIDispatcher from "./components/AIDispatcher.tsx";
import KnowledgeSearch from "./components/KnowledgeSearch.tsx";
import ObservabilityDashboard from "./components/ObservabilityDashboard.tsx";

import { useTickets } from "./hooks/useTickets.ts";
import { useTicketStats } from "./hooks/useTicketStats.ts";
import { Ticket } from "./types.ts";

export default function App() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const { tickets, loading: ticketsLoading, setTickets } = useTickets();

  const {
    stats,
    loading: statsLoading,
    refresh: refreshStats,
  } = useTicketStats();

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets((prevTickets) => [newTicket, ...prevTickets]);
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

      <Navbar
        onDashboardToggle={() => setIsDashboardOpen((prev) => !prev)}
        isDashboardOpen={isDashboardOpen}
      />

      {/* Observability Dashboard Overlay */}
      <AnimatePresence>
        {isDashboardOpen && (
          <motion.div
            key="dashboard-overlay"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 pt-16 overflow-y-auto"
            style={{ background: "#060612" }}
          >
            <ObservabilityDashboard />
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Hero tickets={tickets} loading={ticketsLoading} />
        <SocialProof />
        <Solutions />
        <Agents />
        <HowItWorks />
        <Metrics stats={stats} loading={statsLoading} />
        <AIDispatcher onTicketCreated={handleTicketCreated} />
        <KnowledgeSearch />
        <TicketList tickets={tickets} loading={ticketsLoading} />
        <Pricing />
        <Security />
        <Contact onTicketCreated={handleTicketCreated} />
      </main>

      <Footer />
    </div>
  );
}
