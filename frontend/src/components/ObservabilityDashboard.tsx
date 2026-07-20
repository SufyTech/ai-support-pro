import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

const rColor = (r: string) =>
  ({ critical: "#ef4444", high: "#f59e0b", medium: "#6366f1", low: "#10b981" })[
    r
  ] || "#64748b";

const revColor = (a: string) => (a?.includes("Human") ? "#ef4444" : "#10b981");

const tt = {
  contentStyle: {
    background: "#0d0d1f",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: 10,
    color: "#e2e8f0",
    fontSize: 12,
    padding: "8px 12px",
  },
  cursor: { fill: "rgba(99,102,241,0.06)" },
};

const S: Record<string, React.CSSProperties> = {
  card: {
    background: "linear-gradient(145deg, #0d0d22 0%, #0a0a1e 100%)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: "24px 28px",
  },
  secLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#334155",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
};

const badge = (color: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "3px 10px",
  borderRadius: 20,
  fontSize: 11,
  fontWeight: 600,
  background: color + "18",
  color,
  border: `1px solid ${color}28`,
});

interface Stats {
  totalReviews: number;
  escalated: number;
  normal: number;
  escalation_rate: number;
  agents_frequency: Record<string, number>;
  change_types: Record<string, number>;
  risk_levels: Record<string, number>;
}

interface Review {
  id: string;
  pr_title: string;
  change_type: string;
  risk_level: string;
  assigned_reviewer: string;
  agents_run: string[];
}

interface ObservabilityDashboardProps {
  onClose?: () => void;
}

export default function ObservabilityDashboard({
  onClose,
}: ObservabilityDashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(new Date());

  const fetchData = async () => {
    try {
      const [s, r] = await Promise.all([
        axios.get(`${API}/api/reviews/stats`),
        axios.get(`${API}/api/reviews`),
      ]);
      setStats(s.data);
      setReviews(Array.isArray(r.data) ? r.data : []);
      setError(null);
      setRefresh(new Date());
    } catch {
      setError("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 10000);
    return () => clearInterval(iv);
  }, []);

  const agentData = stats?.agents_frequency
    ? Object.entries(stats.agents_frequency).map(([n, c]) => ({
        name: n.replace("_agent", "").replace(/_/g, " "),
        count: c,
      }))
    : [];

  const changeTypeData = stats?.change_types
    ? Object.entries(stats.change_types).map(([n, c]) => ({
        name: n,
        count: c,
      }))
    : [];

  const riskData = stats?.risk_levels
    ? Object.entries(stats.risk_levels).map(([n, v]) => ({ name: n, value: v }))
    : [];

  const escData = stats
    ? [
        { name: "AI Approved", value: stats.normal || 0 },
        { name: "Human Review", value: stats.escalated || 0 },
      ]
    : [];

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          fontFamily: "'Inter',system-ui,sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: "3px solid rgba(99,102,241,0.2)",
              borderTopColor: "#6366f1",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <div style={{ color: "#475569", fontSize: 13 }}>
            Loading dashboard...
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          fontFamily: "'Inter',system-ui,sans-serif",
        }}
      >
        <div
          style={{
            background: "#0d0d1f",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 16,
            padding: 40,
            maxWidth: 420,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
          <div
            style={{
              color: "#f87171",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Connection Failed
          </div>
          <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>
            {error}
          </div>
          <button
            onClick={fetchData}
            style={{
              marginTop: 20,
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#a78bfa",
              borderRadius: 8,
              padding: "8px 20px",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "inherit",
            }}
          >
            ↻ Retry
          </button>
        </div>
      </div>
    );

  return (
    <div
      style={{
        fontFamily: "'Inter',system-ui,sans-serif",
        color: "#e2e8f0",
      }}
    >
      <style>{`
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
        @media(max-width:768px){
          .dash-grid-4{grid-template-columns:1fr 1fr!important}
          .dash-grid-2{grid-template-columns:1fr!important}
          .dash-main{padding:20px 16px!important}
          .dash-table{font-size:11px!important}
        }
        @media(max-width:480px){
          .dash-grid-4{grid-template-columns:1fr!important}
          .stat-card,.chart-card{padding:18px 16px!important}
        }
      `}</style>

      {/* Small inline refresh row, replaces old header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 20,
            padding: "4px 12px",
            fontSize: 11,
            color: "#10b981",
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#10b981",
              animation: "pulse 2s infinite",
            }}
          />
          LIVE · {refresh.toLocaleTimeString()}
        </div>
        <button
          onClick={fetchData}
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.25)",
            color: "#a78bfa",
            borderRadius: 9,
            padding: "6px 16px",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Main */}
      <div className="dash-main">
        {/* Stat Cards */}
        <div style={{ marginBottom: 28 }}>
          <div style={S.secLabel}>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(99,102,241,0.08)",
              }}
            />
            Overview
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(99,102,241,0.08)",
              }}
            />
          </div>
          <div
            className="dash-grid-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 14,
            }}
          >
            {[
              {
                label: "Total Reviews",
                value: stats?.totalReviews ?? 0,
                sub: "All time",
                icon: "🔍",
                color: "#6366f1",
                glow: "rgba(99,102,241,0.2)",
              },
              {
                label: "Escalated",
                value: stats?.escalated ?? 0,
                sub: "Human reviewer assigned",
                icon: "🚨",
                color: "#ef4444",
                glow: "rgba(239,68,68,0.15)",
              },
              {
                label: "AI Approved",
                value: stats?.normal ?? 0,
                sub: "Fully automated",
                icon: "🤖",
                color: "#10b981",
                glow: "rgba(16,185,129,0.15)",
              },
              {
                label: "Escalation Rate",
                value: `${stats?.escalation_rate ?? 0}%`,
                sub:
                  (stats?.escalation_rate ?? 0) > 30
                    ? "⚠ High — review triggers"
                    : "✓ Healthy range",
                icon: "📊",
                color: "#f59e0b",
                glow: "rgba(245,158,11,0.15)",
              },
            ].map((c) => (
              <div
                key={c.label}
                className="stat-card"
                style={{
                  ...S.card,
                  borderTop: `2px solid ${c.color}`,
                  boxShadow: `0 4px 24px ${c.glow}`,
                  animation: "fadeIn 0.4s ease",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: `${c.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    marginBottom: 16,
                  }}
                >
                  {c.icon}
                </div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    color: c.color,
                    lineHeight: 1,
                    letterSpacing: -2,
                    marginBottom: 6,
                  }}
                >
                  {c.value}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#94a3b8",
                    fontWeight: 600,
                    marginBottom: 3,
                  }}
                >
                  {c.label}
                </div>
                <div style={{ fontSize: 11, color: "#334155" }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Activity */}
        <div style={{ marginBottom: 22 }}>
          <div style={S.secLabel}>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(99,102,241,0.08)",
              }}
            />
            Agent Activity
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(99,102,241,0.08)",
              }}
            />
          </div>
          <div
            className="dash-grid-2"
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}
          >
            <div className="chart-card" style={S.card}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#94a3b8",
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#6366f1",
                  }}
                />
                Agent Execution Frequency
              </div>
              <div style={{ fontSize: 11, color: "#334155", marginBottom: 20 }}>
                How many times each agent ran across all reviews
              </div>
              {agentData.length === 0 ? (
                <div
                  style={{
                    color: "#1e293b",
                    textAlign: "center",
                    padding: "50px 0",
                    fontSize: 13,
                  }}
                >
                  No agent data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={agentData}
                    barSize={36}
                    margin={{ left: -15 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#475569", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#475569", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip {...tt} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {agentData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="chart-card" style={S.card}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#94a3b8",
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#10b981",
                  }}
                />
                Escalation Split
              </div>
              <div style={{ fontSize: 11, color: "#334155", marginBottom: 14 }}>
                AI vs Human resolution
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={escData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip {...tt} />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 10,
                }}
              >
                {escData.map((d, i) => (
                  <div
                    key={d.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "7px 12px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: ["#10b981", "#ef4444"][i],
                        }}
                      />
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>
                        {d.name}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: "#e2e8f0",
                      }}
                    >
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ marginBottom: 22 }}>
          <div style={S.secLabel}>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(99,102,241,0.08)",
              }}
            />
            Review Breakdown
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(99,102,241,0.08)",
              }}
            />
          </div>
          <div
            className="dash-grid-2"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div className="chart-card" style={S.card}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#94a3b8",
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#f59e0b",
                  }}
                />
                By Change Type
              </div>
              <div style={{ fontSize: 11, color: "#334155", marginBottom: 20 }}>
                PR volume per change type
              </div>
              {changeTypeData.length === 0 ? (
                <div
                  style={{
                    color: "#1e293b",
                    textAlign: "center",
                    padding: "40px 0",
                    fontSize: 13,
                  }}
                >
                  No data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={170}>
                  <BarChart
                    data={changeTypeData}
                    layout="vertical"
                    barSize={10}
                    margin={{ left: 0 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fill: "#475569", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      width={72}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip {...tt} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {changeTypeData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="chart-card" style={S.card}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#94a3b8",
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#ef4444",
                  }}
                />
                By Risk Level
              </div>
              <div style={{ fontSize: 11, color: "#334155", marginBottom: 20 }}>
                Distribution across risk levels
              </div>
              {riskData.length === 0 ? (
                <div
                  style={{
                    color: "#1e293b",
                    textAlign: "center",
                    padding: "40px 0",
                    fontSize: 13,
                  }}
                >
                  No data yet
                </div>
              ) : (
                <div style={{ paddingTop: 4 }}>
                  {riskData.map((p) => {
                    const pct = stats?.totalReviews
                      ? Math.round((p.value / stats.totalReviews) * 100)
                      : 0;
                    const col = rColor(p.name);
                    return (
                      <div key={p.name} style={{ marginBottom: 16 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              color: "#94a3b8",
                              textTransform: "capitalize",
                              fontWeight: 600,
                            }}
                          >
                            {p.name}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: col,
                            }}
                          >
                            {p.value}{" "}
                            <span style={{ color: "#334155", fontWeight: 400 }}>
                              · {pct}%
                            </span>
                          </span>
                        </div>
                        <div
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            borderRadius: 6,
                            height: 6,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              background: `linear-gradient(90deg, ${col}, ${col}99)`,
                              borderRadius: 6,
                              transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div>
          <div style={S.secLabel}>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(99,102,241,0.08)",
              }}
            />
            Recent Reviews
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(99,102,241,0.08)",
              }}
            />
          </div>
          <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            <div
              style={{
                padding: "16px 28px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>
                All Reviews
              </div>
              <div style={{ fontSize: 11, color: "#334155" }}>
                {reviews.length} total
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table
                className="dash-table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    {[
                      "ID",
                      "PR Title",
                      "Change Type",
                      "Risk Level",
                      "Reviewer",
                      "Agent Flow",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "12px 16px 12px 0",
                          color: "#334155",
                          fontWeight: 600,
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h === "ID" ? (
                          <span style={{ paddingLeft: 28 }}>{h}</span>
                        ) : (
                          h
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...reviews]
                    .reverse()
                    .slice(0, 20)
                    .map((r) => (
                      <tr key={r.id}>
                        <td
                          style={{
                            padding: "13px 16px 13px 28px",
                            color: "#1e293b",
                            fontFamily: "monospace",
                            fontSize: 10,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {r.id}
                        </td>
                        <td
                          style={{
                            padding: "13px 16px 13px 0",
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "#cbd5e1",
                            fontWeight: 500,
                          }}
                        >
                          {r.pr_title}
                        </td>
                        <td style={{ padding: "13px 16px 13px 0" }}>
                          <span style={badge("#3b82f6")}>
                            {r.change_type || "—"}
                          </span>
                        </td>
                        <td style={{ padding: "13px 16px 13px 0" }}>
                          <span style={badge(rColor(r.risk_level))}>
                            {r.risk_level || "—"}
                          </span>
                        </td>
                        <td style={{ padding: "13px 16px 13px 0" }}>
                          <span style={badge(revColor(r.assigned_reviewer))}>
                            {r.assigned_reviewer || "—"}
                          </span>
                        </td>
                        <td style={{ padding: "13px 28px 13px 0" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                              flexWrap: "wrap",
                            }}
                          >
                            {Array.isArray(r.agents_run)
                              ? r.agents_run.map((a, i) => (
                                  <span
                                    key={i}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 3,
                                    }}
                                  >
                                    <span
                                      className={`agent-chip${a.includes("escalation") || a.includes("human") ? " esc" : ""}`}
                                    >
                                      {a
                                        .replace("_agent", "")
                                        .replace(/_/g, " ")}
                                    </span>
                                    {i < r.agents_run.length - 1 && (
                                      <span
                                        style={{
                                          color: "#1e293b",
                                          fontSize: 10,
                                        }}
                                      >
                                        ›
                                      </span>
                                    )}
                                  </span>
                                ))
                              : "—"}
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
