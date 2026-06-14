import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import axios from "axios";

const API = "http://localhost:8000";
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

const pColor = (p) => ({ urgent: "#ef4444", high: "#f59e0b", medium: "#6366f1", low: "#10b981" })[p] || "#64748b";
const aColor = (a) => a?.includes("Human") ? "#ef4444" : "#10b981";

const tt = {
  contentStyle: { background: "#0d0d1f", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 10, color: "#e2e8f0", fontSize: 12, padding: "8px 12px" },
  cursor: { fill: "rgba(99,102,241,0.06)" },
};

export default function App() {
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(new Date());

  const fetchData = async () => {
    try {
      const [s, t] = await Promise.all([axios.get(`${API}/api/tickets/stats`), axios.get(`${API}/api/tickets`)]);
      setStats(s.data); setTickets(Array.isArray(t.data) ? t.data : []); setError(null); setRefresh(new Date());
    } catch { setError("Cannot connect to backend on port 8000."); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); const iv = setInterval(fetchData, 10000); return () => clearInterval(iv); }, []);

  const agentData = stats?.agents_frequency ? Object.entries(stats.agents_frequency).map(([n, c]) => ({ name: n.replace("_agent", "").replace(/_/g, " "), count: c })) : [];
  const catData = stats?.categories ? Object.entries(stats.categories).map(([n, c]) => ({ name: n, count: c })) : [];
  const priData = stats?.priorities ? Object.entries(stats.priorities).map(([n, v]) => ({ name: n, value: v })) : [];
  const escData = stats ? [{ name: "AI Resolved", value: stats.normal || 0 }, { name: "Escalated", value: stats.escalated || 0 }] : [];

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#060612", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',system-ui,sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 44, height: 44, border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <div style={{ color: "#475569", fontSize: 13 }}>Loading dashboard...</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: "#060612", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',system-ui,sans-serif" }}>
      <div style={{ background: "#0d0d1f", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, padding: 40, maxWidth: 420, textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
        <div style={{ color: "#f87171", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Connection Failed</div>
        <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>{error}</div>
        <button onClick={fetchData} style={{ marginTop: 20, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a78bfa", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>↻ Retry</button>
      </div>
    </div>
  );

  const S = {
    app: { minHeight: "100vh", background: "#060612", fontFamily: "'Inter',system-ui,sans-serif", color: "#e2e8f0" },
    header: { background: "rgba(10,10,28,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.12)", padding: "0 48px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 },
    main: { padding: "40px 48px", maxWidth: 1500, margin: "0 auto" },
    card: { background: "linear-gradient(145deg, #0d0d22 0%, #0a0a1e 100%)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 18, padding: "24px 28px" },
    secLabel: { fontSize: 10, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: 2, marginBottom: 18, display: "flex", alignItems: "center", gap: 10 },
    badge: (color) => ({ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: color + "18", color, border: `1px solid ${color}28` }),
  };

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .stat-card{transition:transform 0.2s,box-shadow 0.2s}
        .stat-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(99,102,241,0.12)!important}
        .chart-card{transition:border-color 0.2s}
        .chart-card:hover{border-color:rgba(99,102,241,0.15)!important}
        tbody tr{transition:background 0.15s}
        tbody tr:hover td{background:rgba(99,102,241,0.04)!important}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:#0a0a1e}
        ::-webkit-scrollbar-thumb{background:#1e1e3a;border-radius:3px}
        .agent-chip{display:inline-block;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);color:#818cf8;border-radius:5px;padding:2px 7px;font-size:10px;font-weight:500;white-space:nowrap}
        .agent-chip.esc{background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.2);color:#f87171}
      `}</style>

      {/* ── Header ── */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 0 24px rgba(99,102,241,0.45)" }}>⚡</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, background: "linear-gradient(90deg,#fff 40%,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI Support Observability</div>
            <div style={{ fontSize: 11, color: "#334155", marginTop: 1 }}>Real-time agent monitoring · refreshed {refresh.toLocaleTimeString()}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "5px 14px", fontSize: 11, color: "#10b981", fontWeight: 700, letterSpacing: 1 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />LIVE
          </div>
          <button onClick={fetchData} style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#a78bfa", borderRadius: 9, padding: "7px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s" }}>↻ Refresh</button>
        </div>
      </div>

      <div style={S.main}>

        {/* ── Stat Cards ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={S.secLabel}><div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.08)" }} />Overview<div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.08)" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {[
              { label: "Total Tickets", value: stats?.totalTickets ?? 0, sub: "All time", icon: "🎫", color: "#6366f1", glow: "rgba(99,102,241,0.2)" },
              { label: "Escalated", value: stats?.escalated ?? 0, sub: "Human Agent assigned", icon: "🚨", color: "#ef4444", glow: "rgba(239,68,68,0.15)" },
              { label: "AI Resolved", value: stats?.normal ?? 0, sub: "Fully automated", icon: "🤖", color: "#10b981", glow: "rgba(16,185,129,0.15)" },
              { label: "Escalation Rate", value: `${stats?.escalation_rate ?? 0}%`, sub: stats?.escalation_rate > 30 ? "⚠ High — review triggers" : "✓ Healthy range", icon: "📊", color: "#f59e0b", glow: "rgba(245,158,11,0.15)" },
            ].map((c) => (
              <div key={c.label} className="stat-card" style={{ ...S.card, borderTop: `2px solid ${c.color}`, boxShadow: `0 4px 24px ${c.glow}`, animation: "fadeIn 0.4s ease" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${c.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 18 }}>{c.icon}</div>
                <div style={{ fontSize: 38, fontWeight: 800, color: c.color, lineHeight: 1, letterSpacing: -2, marginBottom: 6 }}>{c.value}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600, marginBottom: 3 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: "#334155" }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Agent Activity ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={S.secLabel}><div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.08)" }} />Agent Activity<div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.08)" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>

            {/* Bar chart */}
            <div className="chart-card" style={S.card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1" }} />Agent Execution Frequency
              </div>
              <div style={{ fontSize: 11, color: "#334155", marginBottom: 20 }}>How many times each agent ran across all tickets</div>
              {agentData.length === 0
                ? <div style={{ color: "#1e293b", textAlign: "center", padding: "50px 0", fontSize: 13 }}>No agent data yet</div>
                : <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={agentData} barSize={40} margin={{ left: -15 }}>
                      <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip {...tt} />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {agentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>}
            </div>

            {/* Donut */}
            <div className="chart-card" style={S.card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />Escalation Split
              </div>
              <div style={{ fontSize: 11, color: "#334155", marginBottom: 16 }}>AI vs Human resolution</div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={escData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} dataKey="value" strokeWidth={0}>
                    <Cell fill="#10b981" /><Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip {...tt} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                {escData.map((d, i) => (
                  <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: ["#10b981", "#ef4444"][i] }} />
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#e2e8f0" }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Breakdown ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={S.secLabel}><div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.08)" }} />Ticket Breakdown<div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.08)" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Category */}
            <div className="chart-card" style={S.card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b" }} />By Category
              </div>
              <div style={{ fontSize: 11, color: "#334155", marginBottom: 20 }}>Ticket volume per category</div>
              {catData.length === 0
                ? <div style={{ color: "#1e293b", textAlign: "center", padding: "40px 0", fontSize: 13 }}>No data yet</div>
                : <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={catData} layout="vertical" barSize={12} margin={{ left: 0 }}>
                      <XAxis type="number" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} width={72} axisLine={false} tickLine={false} />
                      <Tooltip {...tt} />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                        {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>}
            </div>

            {/* Priority */}
            <div className="chart-card" style={S.card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444" }} />By Priority
              </div>
              <div style={{ fontSize: 11, color: "#334155", marginBottom: 20 }}>Distribution across priority levels</div>
              {priData.length === 0
                ? <div style={{ color: "#1e293b", textAlign: "center", padding: "40px 0", fontSize: 13 }}>No data yet</div>
                : <div style={{ paddingTop: 4 }}>
                    {priData.map((p) => {
                      const pct = stats?.totalTickets ? Math.round((p.value / stats.totalTickets) * 100) : 0;
                      const col = pColor(p.name);
                      return (
                        <div key={p.name} style={{ marginBottom: 18 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                            <span style={{ fontSize: 12, color: "#94a3b8", textTransform: "capitalize", fontWeight: 600 }}>{p.name}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{p.value} <span style={{ color: "#334155", fontWeight: 400 }}>· {pct}%</span></span>
                          </div>
                          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 6, height: 7, overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${col}, ${col}99)`, borderRadius: 6, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>}
            </div>
          </div>
        </div>

        {/* ── Recent Tickets ── */}
        <div>
          <div style={S.secLabel}><div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.08)" }} />Recent Tickets<div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.08)" }} /></div>
          <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "18px 28px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>All Tickets</div>
              <div style={{ fontSize: 11, color: "#334155" }}>{tickets.length} total</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {["ID", "Subject", "Category", "Priority", "Assigned To", "Agent Flow"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "12px 16px 12px 0", color: "#334155", fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>
                        {h === "ID" ? <span style={{ paddingLeft: 28 }}>{h}</span> : h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...tickets].reverse().slice(0, 20).map((t) => (
                    <tr key={t.id}>
                      <td style={{ padding: "14px 16px 14px 28px", color: "#1e293b", fontFamily: "monospace", fontSize: 10, whiteSpace: "nowrap" }}>{t.id}</td>
                      <td style={{ padding: "14px 16px 14px 0", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#cbd5e1", fontWeight: 500 }}>{t.subject}</td>
                      <td style={{ padding: "14px 16px 14px 0" }}><span style={S.badge("#3b82f6")}>{t.category || "—"}</span></td>
                      <td style={{ padding: "14px 16px 14px 0" }}><span style={S.badge(pColor(t.priority))}>{t.priority || "—"}</span></td>
                      <td style={{ padding: "14px 16px 14px 0" }}><span style={S.badge(aColor(t.assigned_agent))}>{t.assigned_agent || "—"}</span></td>
                      <td style={{ padding: "14px 28px 14px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                          {Array.isArray(t.agents_run) ? t.agents_run.map((a, i) => (
                            <span key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                              <span className={`agent-chip${a.includes("escalation") || a.includes("human") ? " esc" : ""}`}>
                                {a.replace("_agent", "").replace(/_/g, " ")}
                              </span>
                              {i < t.agents_run.length - 1 && <span style={{ color: "#1e293b", fontSize: 10 }}>›</span>}
                            </span>
                          )) : "—"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}