import { useState, useEffect, useReducer, useCallback, useMemo } from "react";

// ─── Icons (inline SVG components) ───────────────────────────────────────────

const LOGO_URL = "/logo.png";
const Icons = {
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  Folder: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  User: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Calendar: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  Invoice: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Mail: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Phone: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  ChevronRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Send: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  DollarSign: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Building: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01"/></svg>,
  Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Save: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Clipboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  Map: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Upload: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Link: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  File: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>,
  Cloud: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
};

// ─── Sample Data ─────────────────────────────────────────────────────────────
// ─── Billing Source ("Workbook") — mirrors Jennifer's 3 Excel files ─────────
const BILLING_SOURCES = [
  { id: "las", label: "LAS / Harlem", prefix: "H", description: "Legal Aid Society — Harlem Office" },
  { id: "fla", label: "Florida", prefix: "FLA", description: "Florida Public Defenders — Miami & Jacksonville" },
  { id: "ind", label: "Individuals", prefix: "", description: "Private attorneys & out-of-state PDs" },
];


const COUNTIES = ["New York", "Bronx", "Queens", "Kings", "Richmond", "Miami-Dade", "Duval", "Norfolk", "Aroostook"];

const CASE_TYPES = ["Assault / Battery", "Drug Offense", "DUI / DWI", "Domestic Violence", "Fraud / White Collar", "Homicide / Manslaughter", "Weapons Charge", "Federal Criminal", "Probation Violation", "Sex Offense", "Robbery", "Other"];

const SERVICE_TYPES = ["Review of medical records and verbal report", "Review of medical records and written report", "Review of extensive medical records and verbal report", "Review of medical records, photos for verbal report", "Review of medical records and testimony", "Chronology", "COVID Report", "COVID Letter", "Verbal", "Report and testimony", "Written medical report", "Deposition", "CLE"];

const CASE_STATUSES = ["Consult Scheduled", "Intake", "Need Docs", "Needs Attention", "Completed", "Send Info to Attorney", "Need to Invoice", "Invoice Sent", "Invoice Paid", "Closed"];


const HOURLY_RATE = 300;

// ─── Utilities ───────────────────────────────────────────────────────────────
const formatCurrency = (n) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// Convert Excel serial number or string to ISO date (YYYY-MM-DD)
const parseExcelDate = (val) => {
  if (!val || val === "") return "";
  const num = parseFloat(val);
  if (!isNaN(num) && num > 1000) {
    // Excel dates are days since Dec 30, 1899
    const d = new Date(Math.round((num - 25569) * 86400 * 1000));
    return d.toISOString().split("T")[0];
  }
  const d = new Date(val);
  if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  return String(val).trim();
};

// Generate a .ics (vCalendar) file for a due date and trigger download
const downloadICS = (clientName, dueDate, description = "") => {
  const dt = dueDate.replace(/-/g, "");
  const tomorrow = dueDate.replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = `nursebill-${Date.now()}@nursebill`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NurseBill//NurseBill//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${dt}`,
    `DTEND;VALUE=DATE:${dt}`,
    `SUMMARY:Due: ${clientName}`,
    `DESCRIPTION:${description || `Case due date — ${clientName}`}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${clientName.replace(/[^a-z0-9]/gi, "_")}_due.ics`;
  a.click();
  URL.revokeObjectURL(url);
};

const statusColor = (s) => {
  switch (s) {
    case "Consult Scheduled":      return { bg: "#ede9fe", text: "#7c3aed" };
    case "Intake":                 return { bg: "#e0f2fe", text: "#0284c7" };
    case "Need Docs":              return { bg: "#fef3c7", text: "#b45309" };
    case "Needs Attention":        return { bg: "#fee2e2", text: "#dc2626" };
    case "Completed":              return { bg: "#ecfdf5", text: "#059669" };
    case "Send Info to Attorney":  return { bg: "#fdf2f8", text: "#db2777" };
    case "Need to Invoice":        return { bg: "#fef9c3", text: "#854d0e" };
    case "Invoice Sent":           return { bg: "#fff7ed", text: "#ea580c" };
    case "Invoice Paid":           return { bg: "#d1fae5", text: "#047857" };
    case "Closed":                 return { bg: "#f5f5f4", text: "#78716c" };
    // legacy statuses from imported data
    case "Active":    return { bg: "#ede9fe", text: "#7c3aed" };
    case "Billed":    return { bg: "#fff7ed", text: "#ea580c" };
    case "Paid":      return { bg: "#ecfdf5", text: "#059669" };
    case "Unpaid":    return { bg: "#fee2e2", text: "#dc2626" };
    case "Pro Bono":  return { bg: "#e0f2fe", text: "#0284c7" };
    default:          return { bg: "#f5f5f4", text: "#78716c" };
  }
};

const serviceTypeColor = (type) => {
  switch (type) {
    case "Report Delivered": return { bg: "#ecfdf5", text: "#059669" };
    case "Oral Report": return { bg: "#ede9fe", text: "#7c3aed" };
    case "Report Request": return { bg: "#fff7ed", text: "#ea580c" };
    case "Review Request": return { bg: "#fef3c7", text: "#d97706" };
    case "Assessment Request": return { bg: "#fff7ed", text: "#ea580c" };
    case "Consultation Request": return { bg: "#fdf2f8", text: "#db2777" };
    case "Testimony": return { bg: "#fee2e2", text: "#dc2626" };
    case "General": return { bg: "#e0f2fe", text: "#0284c7" };
    default: return { bg: "#f5f5f4", text: "#78716c" };
  }
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@400;600;700;800&display=swap');

:root {
  --bg: #faf8f6;
  --surface: #ffffff;
  --surface-raised: #fdfcfb;
  --border: #ece7e1;
  --border-strong: #ddd6cc;
  --text: #2a2438;
  --text-secondary: #6e6479;
  --text-muted: #a99eb5;
  --accent: #8b5cf6;
  --accent-hover: #7c3aed;
  --accent-light: #f0ebff;
  --accent-lighter: #f8f6ff;
  --warm: #e67e5a;
  --warm-light: #fef3ee;
  --danger: #e44058;
  --danger-light: #feeaed;
  --pride-1: #e44058;
  --pride-2: #f59e42;
  --pride-3: #f7d94e;
  --pride-4: #6ecf73;
  --pride-5: #5b8def;
  --pride-6: #8b5cf6;
  --shadow-sm: 0 1px 3px rgba(42,36,56,0.06);
  --shadow-md: 0 4px 14px rgba(42,36,56,0.08);
  --shadow-lg: 0 8px 30px rgba(42,36,56,0.12);
  --radius: 10px;
  --radius-sm: 6px;
  --radius-lg: 14px;
  --font-body: 'DM Sans', sans-serif;
  --font-display: 'Playfair Display', Georgia, serif;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --pride-gradient: linear-gradient(135deg, #e44058 0%, #f59e42 20%, #f7d94e 40%, #6ecf73 55%, #5b8def 75%, #8b5cf6 100%);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ─── Sidebar ─────────────────────────────────────── */
.sidebar {
  width: 240px;
  min-width: 240px;
  background: linear-gradient(180deg, #1e1832 0%, #2a2438 40%, #1e1832 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--pride-gradient);
  z-index: 1;
}

.sidebar-brand {
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.sidebar-brand h1 {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
}

.sidebar-brand p {
  font-size: 10.5px;
  color: rgba(255,255,255,0.4);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
}

.sidebar-nav {
  padding: 16px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition);
  font-size: 13.5px;
  font-weight: 400;
  color: rgba(255,255,255,0.6);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.nav-item:hover {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.9);
}

.nav-item.active {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  color: #fff;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(139,92,246,0.3);
}

.nav-item svg { opacity: 0.75; flex-shrink: 0; }
.nav-item.active svg { opacity: 1; }

.sidebar-stats {
  padding: 16px 20px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 4px 0;
}

.stat-row .label { color: rgba(255,255,255,0.4); }
.stat-row .value { color: rgba(255,255,255,0.8); font-weight: 500; }

/* ─── Main Content ────────────────────────────────── */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: var(--surface);
  border-bottom: none;
  min-height: 64px;
  position: relative;
}

.topbar::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: var(--pride-gradient);
  opacity: 0.5;
}

.topbar-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.topbar-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
}

/* ─── Shared Components ───────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all var(--transition);
  border: 1px solid transparent;
  white-space: nowrap;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.btn-primary:hover { background: var(--accent-hover); }

.btn-secondary {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border-strong);
}
.btn-secondary:hover { background: var(--surface-raised); border-color: var(--text-muted); }

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: none;
  padding: 6px 10px;
}
.btn-ghost:hover { color: var(--text); background: rgba(0,0,0,0.04); }

.btn-danger {
  background: var(--danger);
  color: #fff;
}
.btn-danger:hover { background: #a93226; }

.btn-warm {
  background: var(--warm);
  color: #fff;
}
.btn-warm:hover { background: #b0845c; }

.btn-sm { padding: 5px 10px; font-size: 12px; }

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 14px;
  width: 280px;
  transition: all var(--transition);
}

.search-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-light);
}

.search-box input {
  border: none;
  background: none;
  outline: none;
  font-size: 13px;
  font-family: var(--font-body);
  color: var(--text);
  width: 100%;
}

.search-box input::placeholder { color: var(--text-muted); }
.search-box svg { color: var(--text-muted); flex-shrink: 0; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  padding: 18px 22px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 15px;
  font-weight: 600;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.status-badge-clickable {
  transition: all 0.15s ease;
  user-select: none;
}
.status-badge-clickable:hover {
  filter: brightness(0.92);
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.filter-bar {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.filter-select {
  padding: 7px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: var(--font-body);
  color: var(--text);
  background: var(--surface);
  cursor: pointer;
  outline: none;
  transition: all var(--transition);
  appearance: auto;
}

.filter-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-light); }

/* ─── Tables ──────────────────────────────────────── */
.table-wrap { overflow-x: auto; }

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  background: var(--surface-raised);
  border-bottom: 1px solid var(--border);
}

td {
  padding: 14px 16px;
  font-size: 13.5px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

tr:last-child td { border-bottom: none; }

tr:hover td { background: var(--accent-lighter); }

.clickable-row { cursor: pointer; }

/* ─── Modal ───────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(44,40,37,0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn { from { opacity: 0; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(16px); } }

.modal {
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 640px;
  max-height: 85vh;
  overflow-y: auto;
  animation: slideUp 0.25s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.modal-header h2 {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
}

.modal-body { padding: 24px; }

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* ─── Forms ───────────────────────────────────────── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group.full { grid-column: 1 / -1; }

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-family: var(--font-body);
  color: var(--text);
  background: var(--surface);
  outline: none;
  transition: all var(--transition);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-light);
}

.form-group textarea { resize: vertical; min-height: 80px; }

/* ─── Case Detail Panel ──────────────────────────── */
.detail-panel {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
}

.detail-section { margin-bottom: 24px; }

.detail-section h4 {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 3px;
}

.info-item span {
  font-size: 14px;
  font-weight: 500;
}

.email-card {
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all var(--transition);
}

.email-card:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-sm);
}

.email-card .email-subject {
  font-size: 13.5px;
  font-weight: 500;
  margin-bottom: 4px;
}

.email-card .email-meta {
  font-size: 11.5px;
  color: var(--text-muted);
}

/* ─── Calendar ────────────────────────────────────── */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.cal-header-cell {
  background: var(--surface-raised);
  padding: 10px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.cal-cell {
  background: var(--surface);
  min-height: 100px;
  padding: 8px;
  cursor: pointer;
  transition: background var(--transition);
}

.cal-cell:hover { background: var(--accent-lighter); }
.cal-cell.other-month { opacity: 0.35; }
.cal-cell.today { background: var(--accent-light); }

.cal-date {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.cal-event {
  font-size: 10.5px;
  padding: 3px 6px;
  border-radius: 4px;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.cal-event.billable { background: var(--accent-light); color: var(--accent); }
.cal-event.non-billable { background: var(--warm-light); color: var(--warm); }

.cal-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.cal-nav h3 {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  min-width: 180px;
}

/* ─── Invoice ─────────────────────────────────────── */
.invoice-preview {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 40px;
  max-width: 700px;
  margin: 0 auto;
  box-shadow: var(--shadow-md);
}

.invoice-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--accent);
}

.invoice-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--accent);
}

.invoice-number {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.invoice-parties {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.invoice-parties h5 {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.invoice-parties p {
  font-size: 13.5px;
  line-height: 1.6;
}

.invoice-table { margin-bottom: 24px; }

.invoice-table th {
  background: var(--accent);
  color: #fff;
  font-size: 10px;
  padding: 10px 14px;
}

.invoice-table th:first-child { border-radius: var(--radius-sm) 0 0 0; }
.invoice-table th:last-child { border-radius: 0 var(--radius-sm) 0 0; }

.invoice-table td {
  padding: 10px 14px;
  font-size: 13px;
  border-bottom: 1px solid var(--border);
}

.invoice-total-row {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}

.invoice-total {
  text-align: right;
  min-width: 200px;
}

.invoice-total .line {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.invoice-total .line.grand {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  border-top: 2px solid var(--text);
  padding-top: 8px;
  margin-top: 4px;
}

/* ─── Intake Form ─────────────────────────────────── */
.intake-form {
  max-width: 700px;
  margin: 0 auto;
}

.intake-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}

.intake-section h3 {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ─── Toast ───────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--text);
  color: #fff;
  padding: 14px 20px;
  border-radius: var(--radius);
  font-size: 13.5px;
  box-shadow: var(--shadow-lg);
  z-index: 2000;
  animation: slideUp 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.toast.success { background: var(--accent); }
.toast.error { background: var(--danger); }

/* ─── Empty State ─────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.3;
}

.empty-state h4 {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.empty-state p { font-size: 13px; }

/* ─── Upload / Hightail ───────────────────────────── */
.upload-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  min-height: 500px;
}

.upload-sidebar-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.upload-sidebar-panel .panel-header {
  padding: 16px 18px;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.folder-tree { padding: 8px 0; }

.folder-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 18px;
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition);
  color: var(--text-secondary);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.folder-item:hover { background: var(--accent-lighter); color: var(--text); }
.folder-item.active { background: var(--accent-light); color: var(--accent); font-weight: 600; }

.folder-item.indent-1 { padding-left: 36px; }
.folder-item.indent-2 { padding-left: 54px; font-size: 12px; }

.folder-item .folder-icon { flex-shrink: 0; opacity: 0.6; }
.folder-item.active .folder-icon { opacity: 1; }

.upload-main-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
}

.upload-main-header {
  padding: 16px 22px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-main-header h3 { font-size: 15px; font-weight: 600; }

.upload-dropzone {
  border: 2px dashed var(--border-strong);
  border-radius: var(--radius);
  padding: 40px 20px;
  text-align: center;
  margin: 20px 22px;
  cursor: pointer;
  transition: all var(--transition);
  background: var(--surface-raised);
}

.upload-dropzone:hover,
.upload-dropzone.dragover {
  border-color: var(--accent);
  background: var(--accent-lighter);
}

.upload-dropzone .drop-icon {
  margin-bottom: 12px;
  color: var(--text-muted);
}

.upload-dropzone h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.upload-dropzone p {
  font-size: 12px;
  color: var(--text-muted);
}

.file-list {
  flex: 1;
  padding: 0 22px 22px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
  transition: all var(--transition);
}

.file-item:hover { border-color: var(--border-strong); }

.file-icon-box {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.file-icon-box.pdf { background: #fdecea; color: #c0392b; }
.file-icon-box.doc { background: #e3f2fd; color: #1565c0; }
.file-icon-box.img { background: #e8f5e9; color: #2e7d32; }
.file-icon-box.xls { background: #e8f5e9; color: #2e7d32; }
.file-icon-box.other { background: #f5f5f5; color: #616161; }

.file-info { flex: 1; min-width: 0; }
.file-info .file-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-info .file-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

.file-status-badge {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.hightail-banner {
  background: linear-gradient(135deg, #2a2438 0%, #3d2a5c 50%, #8b5cf6 100%);
  border-radius: var(--radius-lg);
  padding: 24px;
  color: #fff;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hightail-banner h3 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.hightail-banner p {
  font-size: 13px;
  opacity: 0.8;
}

.hightail-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius);
  font-size: 12px;
  font-weight: 600;
}

.hightail-status.connected { background: rgba(46,125,50,0.2); color: #a5d6a7; }
.hightail-status.disconnected { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.7); }

.progress-bar-track {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 6px;
}

.progress-bar-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.send-modal-file-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  margin-top: 8px;
}

.send-modal-file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 12px;
  border-bottom: 1px solid var(--border);
}

.send-modal-file-item:last-child { border-bottom: none; }

/* ─── Email Evidence Screenshots ──────────────── */
.evidence-section {
  margin-top: 36px;
  padding-top: 28px;
  border-top: 2px solid var(--border-strong);
}

.evidence-section h4 {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.evidence-section .evidence-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.email-screenshot {
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  margin-bottom: 16px;
  overflow: hidden;
  background: var(--surface);
  break-inside: avoid;
  page-break-inside: avoid;
}

.email-screenshot-toolbar {
  background: #f0eee9;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border);
}

.email-screenshot-toolbar .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.email-screenshot-toolbar .dot.red { background: #e74c3c; }
.email-screenshot-toolbar .dot.yellow { background: #f39c12; }
.email-screenshot-toolbar .dot.green { background: #27ae60; }

.email-screenshot-toolbar .toolbar-label {
  font-size: 10px;
  color: var(--text-muted);
  margin-left: 6px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
}

.email-screenshot-header {
  padding: 14px 18px 10px;
  border-bottom: 1px solid #f0eee9;
}

.email-screenshot-header .field {
  display: flex;
  gap: 8px;
  font-size: 12px;
  padding: 2px 0;
}

.email-screenshot-header .field .label {
  color: var(--text-muted);
  font-weight: 600;
  min-width: 55px;
  text-align: right;
}

.email-screenshot-header .field .value {
  color: var(--text);
}

.email-screenshot-body {
  padding: 14px 18px 18px;
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--text-secondary);
}

.email-screenshot-footer {
  padding: 8px 18px;
  background: #fafaf8;
  border-top: 1px solid #f0eee9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.email-screenshot-footer .evidence-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 5px;
}

.email-screenshot-footer .evidence-num {
  font-size: 10px;
  color: var(--text-muted);
}

.email-select-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
}

.email-select-panel h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.email-select-panel p {
  font-size: 12.5px;
  color: var(--text-secondary);
  margin-bottom: 14px;
}

.email-select-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
  cursor: pointer;
  transition: all var(--transition);
  background: var(--surface);
}

.email-select-item:hover {
  border-color: var(--accent);
  background: var(--accent-lighter);
}

.email-select-item.selected {
  border-color: var(--accent);
  background: var(--accent-light);
}

.email-select-item input[type="checkbox"] {
  margin-top: 2px;
  accent-color: var(--accent);
  cursor: pointer;
}

.email-select-item .email-select-info {
  flex: 1;
}

.email-select-item .email-select-subject {
  font-size: 13px;
  font-weight: 500;
}

.email-select-item .email-select-meta {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.email-select-item .email-service-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  white-space: nowrap;
}

/* ─── Responsive ──────────────────────────────────── */
@media (max-width: 900px) {
  .sidebar { width: 60px; min-width: 60px; }
  .sidebar-brand h1, .sidebar-brand p, .nav-item span, .sidebar-stats { display: none; }
  .nav-item { justify-content: center; padding: 10px; }
  .sidebar-brand { padding: 16px 12px; }
  .content { padding: 20px 16px; }
  .topbar { padding: 12px 16px; }
  .detail-panel { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .invoice-parties { grid-template-columns: 1fr; }
}
`;

// ─── Components ──────────────────────────────────────────────────────────────

// ─── Gmail Integration Service ──────────────────────────────────────────────
// Uses Google Identity Services + Gmail API for reading & sending email.
// To set up: console.cloud.google.com → enable Gmail API → create OAuth2 Web credentials

const GMAIL_CLIENT_ID = "201626866277-9nlpvo0lkhjcc6dda3cka10ctprdm9vt.apps.googleusercontent.com";
const GMAIL_SCOPES = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send";

function useGmail() {
  const [gmailToken, setGmailToken] = useState(null);
  const [gmailUser, setGmailUser] = useState(null);
  const [gmailLoading, setGmailLoading] = useState(false);
  const [gmailError, setGmailError] = useState(null);

  const isConnected = !!gmailToken;

  const connect = async (clientId) => {
    if (!clientId) { setGmailError("No Google Client ID — use Settings to configure."); return; }
    setGmailLoading(true);
    setGmailError(null);
    try {
      if (!window.google?.accounts?.oauth2) {
        await new Promise((resolve, reject) => {
          if (document.getElementById("gsi-script")) { resolve(); return; }
          const s = document.createElement("script");
          s.id = "gsi-script"; s.src = "https://accounts.google.com/gsi/client";
          s.onload = resolve; s.onerror = () => reject(new Error("Failed to load Google Identity Services"));
          document.head.appendChild(s);
        });
      }
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId, scope: GMAIL_SCOPES,
        callback: async (response) => {
          if (response.error) { setGmailError(response.error_description || response.error); setGmailLoading(false); return; }
          setGmailToken(response.access_token);
          try {
            const p = await fetch("https://www.googleapis.com/gmail/v1/users/me/profile", { headers: { Authorization: `Bearer ${response.access_token}` } }).then(r => r.json());
            setGmailUser({ email: p.emailAddress, messagesTotal: p.messagesTotal });
          } catch (e) { setGmailUser({ email: "Connected" }); }
          setGmailLoading(false);
        },
      });
      tokenClient.requestAccessToken();
    } catch (e) { setGmailError(e.message); setGmailLoading(false); }
  };

  const disconnect = () => {
    if (gmailToken && window.google?.accounts?.oauth2) window.google.accounts.oauth2.revoke(gmailToken);
    setGmailToken(null); setGmailUser(null);
  };

  const searchEmails = async (query, maxResults = 20) => {
    if (!gmailToken) throw new Error("Not connected to Gmail");
    const res = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`, { headers: { Authorization: `Bearer ${gmailToken}` } });
    if (!res.ok) { if (res.status === 401) { setGmailToken(null); setGmailUser(null); } throw new Error(`Gmail search failed: ${res.status}`); }
    const data = await res.json();
    return data.messages || [];
  };

  const getMessage = async (messageId) => {
    if (!gmailToken) throw new Error("Not connected to Gmail");
    const res = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`, { headers: { Authorization: `Bearer ${gmailToken}` } });
    if (!res.ok) throw new Error(`Failed to fetch message: ${res.status}`);
    const msg = await res.json();
    const getHeader = (name) => (msg.payload?.headers?.find(h => h.name.toLowerCase() === name.toLowerCase()))?.value || "";
    let body = "";
    const findPart = (part, mime) => { if (part.mimeType === mime && part.body?.data) body = atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/")); if (part.parts) part.parts.forEach(p => findPart(p, mime)); };
    if (msg.payload) findPart(msg.payload, "text/plain");
    if (!body && msg.payload) { findPart(msg.payload, "text/html"); body = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }
    let date = "", time = "";
    try { const d = new Date(getHeader("Date")); date = d.toISOString().split("T")[0]; time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }); } catch (e) {}
    return { gmailId: msg.id, threadId: msg.threadId, subject: getHeader("Subject"), from: getHeader("From").replace(/<[^>]+>/g, "").trim(), to: getHeader("To").replace(/<[^>]+>/g, "").trim(), date, time, body: body.substring(0, 500), snippet: msg.snippet || "" };
  };

  const pullEmailsForCase = async (client, lawyer) => {
    if (!gmailToken) throw new Error("Not connected to Gmail");
    setGmailLoading(true); setGmailError(null);
    try {
      const terms = [];
      if (lawyer?.email) terms.push(`{from:${lawyer.email} to:${lawyer.email}}`);
      if (client?.name) { const fn = client.name.split(/[, ]+/)[0]; if (fn.length > 2) terms.push(fn); }
      if (client?.caseNumber) terms.push(`"${client.caseNumber}"`);
      const query = terms.join(" ");
      if (!query) throw new Error("No search criteria");
      const messageIds = await searchEmails(query, 15);
      const emails = [];
      for (const { id } of messageIds) {
        try { const msg = await getMessage(id); msg.serviceType = detectServiceType(msg.subject + " " + msg.body); emails.push(msg); } catch (e) { console.warn("Skip msg:", id); }
      }
      setGmailLoading(false);
      return emails;
    } catch (e) { setGmailError(e.message); setGmailLoading(false); throw e; }
  };

  const sendEmail = async ({ to, subject, body }) => {
    if (!gmailToken) throw new Error("Not connected to Gmail");
    const mime = [`To: ${to}`, `Subject: ${subject}`, `MIME-Version: 1.0`, `Content-Type: text/plain; charset="UTF-8"`, "", body].join("\r\n");
    const raw = btoa(unescape(encodeURIComponent(mime))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const res = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST", headers: { Authorization: `Bearer ${gmailToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ raw }),
    });
    if (!res.ok) throw new Error(`Failed to send: ${res.status}`);
    return await res.json();
  };

  return { isConnected, gmailToken, gmailUser, gmailLoading, gmailError, connect, disconnect, searchEmails, getMessage, pullEmailsForCase, sendEmail };
}

// ─── Google Calendar Integration ─────────────────────────────────────────────
// Scopes: calendar.events so we can create/update/delete events and poll changes
const GCAL_SCOPES = "https://www.googleapis.com/auth/calendar.events";
const GCAL_BASE = "https://www.googleapis.com/calendar/v3";

function useGoogleCalendar() {
  const [calToken, setCalToken]     = useState(null);
  const [calUser,  setCalUser]      = useState(null);
  const [calLoading, setCalLoading] = useState(false);
  const [calError,   setCalError]   = useState(null);
  const [syncToken,  setSyncToken]  = useState(null);   // incremental sync cursor
  const [lastSynced, setLastSynced] = useState(null);

  const isConnected = !!calToken;

  // Ensure GSI script is loaded (may already be loaded by Gmail hook)
  const ensureGSI = () => new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) { resolve(); return; }
    if (document.getElementById("gsi-script")) {
      // Tag exists but not yet loaded — wait
      const check = setInterval(() => { if (window.google?.accounts?.oauth2) { clearInterval(check); resolve(); } }, 100);
      setTimeout(() => { clearInterval(check); resolve(); }, 5000);
      return;
    }
    const s = document.createElement("script");
    s.id = "gsi-script"; s.src = "https://accounts.google.com/gsi/client";
    s.onload = resolve; s.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(s);
  });

  const handleUnauthorized = () => { setCalToken(null); setCalUser(null); };

  const connect = async (clientId) => {
    if (!clientId) { setCalError("No Google Client ID configured."); return; }
    setCalLoading(true); setCalError(null);
    try {
      await ensureGSI();
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: GCAL_SCOPES,
        callback: async (response) => {
          if (response.error) { setCalError(response.error_description || response.error); setCalLoading(false); return; }
          setCalToken(response.access_token);
          // Get timezone to confirm connection
          try {
            const r = await fetch(`${GCAL_BASE}/users/me/settings/timezone`, { headers: { Authorization: `Bearer ${response.access_token}` } });
            const d = r.ok ? await r.json() : {};
            setCalUser({ timezone: d.value || "UTC" });
          } catch { setCalUser({ timezone: "UTC" }); }
          setCalLoading(false);
        },
      });
      tokenClient.requestAccessToken();
    } catch (e) { setCalError(e.message); setCalLoading(false); }
  };

  const disconnect = () => {
    if (calToken && window.google?.accounts?.oauth2) window.google.accounts.oauth2.revoke(calToken);
    setCalToken(null); setCalUser(null); setSyncToken(null); setLastSynced(null);
  };

  // Build a Google Calendar event body for a client due date (all-day event)
  const buildEventBody = (client, lawyer) => {
    const dt = client.dueDate;
    const nextDay = new Date(dt + "T12:00:00");
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDt = nextDay.toISOString().split("T")[0];
    return {
      summary: `Due: ${client.name}`,
      description: [
        `Case Type: ${client.caseType || "—"}`,
        `Attorney: ${lawyer?.name || "—"}`,
        `Firm: ${lawyer?.firm || "—"}`,
        client.caseNumber ? `Case #: ${client.caseNumber}` : null,
        `Status: ${client.status || "—"}`,
        "",
        "— Synced by NurseBill",
      ].filter(Boolean).join("\n"),
      start: { date: dt },
      end:   { date: nextDt },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 24 * 60 }, // 1 day before
          { method: "popup", minutes: 60 },       // 1 hour before
        ],
      },
      extendedProperties: {
        private: {
          nursebillClientId: client.id,
          nursebillApp: "true",
        },
      },
    };
  };

  const createEvent = async (client, lawyer) => {
    if (!calToken || !client.dueDate) return null;
    const res = await fetch(`${GCAL_BASE}/calendars/primary/events`, {
      method: "POST",
      headers: { Authorization: `Bearer ${calToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(buildEventBody(client, lawyer)),
    });
    if (!res.ok) { if (res.status === 401) handleUnauthorized(); throw new Error(`Calendar create failed: ${res.status}`); }
    return (await res.json()).id;
  };

  const updateEvent = async (eventId, client, lawyer) => {
    if (!calToken || !eventId || !client.dueDate) return null;
    const res = await fetch(`${GCAL_BASE}/calendars/primary/events/${encodeURIComponent(eventId)}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${calToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(buildEventBody(client, lawyer)),
    });
    if (res.status === 401) { handleUnauthorized(); return null; }
    if (res.status === 410 || res.status === 404) return null; // gone — recreate
    if (!res.ok) throw new Error(`Calendar update failed: ${res.status}`);
    return eventId;
  };

  const deleteEvent = async (eventId) => {
    if (!calToken || !eventId) return;
    const res = await fetch(`${GCAL_BASE}/calendars/primary/events/${encodeURIComponent(eventId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${calToken}` },
    });
    if (res.status === 401) handleUnauthorized();
    // 404/410 = already gone, that's fine
  };

  // Create or update a calendar event for this client's due date.
  // Pass newDueDate="" to delete. Returns the new gcalEventId (or null).
  const syncDueDate = async (client, lawyer, newDueDate, currentEventId) => {
    if (!calToken) return currentEventId ?? null;
    const patched = { ...client, dueDate: newDueDate };

    if (!newDueDate) {
      if (currentEventId) await deleteEvent(currentEventId).catch(console.warn);
      return null;
    }

    if (currentEventId) {
      try {
        const result = await updateEvent(currentEventId, patched, lawyer);
        if (result) return currentEventId; // updated OK
        // 404/410 — fall through to create
      } catch (e) { console.warn("gcal update failed, recreating:", e.message); }
    }

    try { return await createEvent(patched, lawyer); }
    catch (e) { console.error("gcal create failed:", e); return null; }
  };

  // Poll Google Calendar for changes to NurseBill events since last sync.
  // Uses incremental sync (syncToken) for efficiency after the first call.
  // Returns [{clientId, dueDate, gcalEventId}] — callers apply to client state.
  const pollChanges = async () => {
    if (!calToken) return [];
    setCalLoading(true);
    try {
      let url;
      if (syncToken) {
        url = `${GCAL_BASE}/calendars/primary/events?syncToken=${encodeURIComponent(syncToken)}&showDeleted=true`;
      } else {
        const timeMin = new Date();
        timeMin.setFullYear(timeMin.getFullYear() - 2);
        url = `${GCAL_BASE}/calendars/primary/events?privateExtendedProperty=nursebillApp%3Dtrue&showDeleted=true&timeMin=${encodeURIComponent(timeMin.toISOString())}`;
      }

      const res = await fetch(url, { headers: { Authorization: `Bearer ${calToken}` } });

      if (res.status === 410) { setSyncToken(null); setCalLoading(false); return []; } // expired — reset
      if (res.status === 401) { handleUnauthorized(); setCalLoading(false); return []; }
      if (!res.ok) { setCalLoading(false); return []; }

      const data = await res.json();
      if (data.nextSyncToken) setSyncToken(data.nextSyncToken);

      const changes = (data.items || []).map((event) => {
        const clientId = event.extendedProperties?.private?.nursebillClientId;
        if (!clientId) return null;
        if (event.status === "cancelled") return { clientId, dueDate: "", gcalEventId: null };
        const dueDate = event.start?.date || event.start?.dateTime?.split("T")[0] || "";
        return { clientId, dueDate, gcalEventId: event.id };
      }).filter(Boolean);

      setLastSynced(new Date());
      setCalLoading(false);
      return changes;
    } catch (e) {
      setCalError(e.message); setCalLoading(false); return [];
    }
  };

  return {
    isConnected, calToken, calUser, calLoading, calError, lastSynced, syncToken,
    connect, disconnect, syncDueDate, pollChanges, deleteEvent,
  };
}

function detectServiceType(text) {
  const t = text.toLowerCase();
  if (/testimony|testif/.test(t)) return "Testimony";
  if (/written report|medical report|full report/.test(t)) return "Report Delivered";
  if (/verbal report|verbal/.test(t)) return "Oral Report";
  if (/review.*request|need.*review|can you review|records for/.test(t)) return "Review Request";
  if (/consult|question about/.test(t)) return "Consultation Request";
  if (/invoice|billing|payment/.test(t)) return "Invoice";
  if (/chronolog|chron/.test(t)) return "Chronology";
  return "General";
}

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast ${type}`}>{message}</div>;
}

// ─── Cases Tab ───────────────────────────────────────────────────────────────
function CasesTab({ clients, lawyers, onSelectCase, onUpdateClient, searchTerm, setSearchTerm }) {
  const [filterLawyer, setFilterLawyer] = useState("all");
  const [filterCounty, setFilterCounty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [showClosed, setShowClosed] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [toast, setToast] = useState(null);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>;
    return <span style={{ marginLeft: 4 }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const changeStatus = (e, client) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    onUpdateClient(client.id, { status: newStatus });
    setToast({ msg: `${client.name} → ${newStatus}`, type: "success" });
  };

  const archiveCutoff = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 36);
    return d;
  }, []);

  const filtered = useMemo(() => {
    const list = clients.filter((c) => {
      if (!showClosed && c.status === "Closed") return false;
      if (!showClosed && c.dateOpened && new Date(c.dateOpened) < archiveCutoff) return false;
      if (filterSource !== "all" && c.source !== filterSource) return false;
      if (filterLawyer !== "all" && c.lawyerId !== filterLawyer) return false;
      if (filterCounty !== "all" && c.county !== filterCounty) return false;
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const lawyer = lawyers.find((l) => l.id === c.lawyerId);
        return (
          c.name.toLowerCase().includes(term) ||
          (lawyer && lawyer.name.toLowerCase().includes(term)) ||
          c.county.toLowerCase().includes(term) ||
          c.caseType.toLowerCase().includes(term) ||
          (c.caseNumber || "").toLowerCase().includes(term) ||
          (c.invoiceNo || "").toLowerCase().includes(term)
        );
      }
      return true;
    });

    if (!sortBy) return list;
    return [...list].sort((a, b) => {
      let av, bv;
      if (sortBy === "client") {
        av = a.name.toLowerCase(); bv = b.name.toLowerCase();
      } else if (sortBy === "attorney") {
        av = (lawyers.find((l) => l.id === a.lawyerId)?.name || "").toLowerCase();
        bv = (lawyers.find((l) => l.id === b.lawyerId)?.name || "").toLowerCase();
      } else if (sortBy === "year") {
        av = a.dateOpened || ""; bv = b.dateOpened || "";
      } else if (sortBy === "invoice") {
        // Sort invoice numbers naturally: H001 < H002, FLA025 < FLA026
        av = (a.invoiceNo || "").toLowerCase(); bv = (b.invoiceNo || "").toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [clients, filterLawyer, filterCounty, filterStatus, filterSource, searchTerm, lawyers, showClosed, archiveCutoff, sortBy, sortDir]);

  // Lawyers filtered by selected source
  const sourceLawyers = useMemo(() => {
    if (filterSource === "all") return lawyers;
    return lawyers.filter((l) => l.source === filterSource);
  }, [lawyers, filterSource]);

  // Counts per source
  const sourceCounts = useMemo(() => {
    const counts = { all: clients.length };
    BILLING_SOURCES.forEach((s) => { counts[s.id] = clients.filter((c) => c.source === s.id).length; });
    return counts;
  }, [clients]);

  // Status counts for current source
  const statusCounts = useMemo(() => {
    const src = filterSource === "all" ? clients : clients.filter((c) => c.source === filterSource);
    const counts = {};
    CASE_STATUSES.forEach((s) => { counts[s] = src.filter((c) => c.status === s).length; });
    return counts;
  }, [clients, filterSource]);

  // Unique statuses present in data
  const activeStatuses = CASE_STATUSES.filter((s) => statusCounts[s] > 0);

  return (
    <>
      {/* Billing Source Tabs — mirrors her 3 Excel workbooks */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          className={`btn btn-sm ${filterSource === "all" ? "" : "btn-secondary"}`}
          style={filterSource === "all" ? { background: "var(--accent)", color: "#fff", border: "none" } : {}}
          onClick={() => { setFilterSource("all"); setFilterLawyer("all"); }}
        >
          All Cases <span style={{ opacity: 0.7, fontSize: 11, marginLeft: 4 }}>{sourceCounts.all}</span>
        </button>
        {BILLING_SOURCES.map((s) => (
          <button
            key={s.id}
            className={`btn btn-sm ${filterSource === s.id ? "" : "btn-secondary"}`}
            style={filterSource === s.id ? { background: "var(--accent)", color: "#fff", border: "none" } : {}}
            onClick={() => { setFilterSource(s.id); setFilterLawyer("all"); }}
          >
            {s.label} <span style={{ opacity: 0.7, fontSize: 11, marginLeft: 4 }}>{sourceCounts[s.id]}</span>
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
          <Icons.Filter />
          <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Filters</span>
        </div>
        <select className="filter-select" value={filterLawyer} onChange={(e) => setFilterLawyer(e.target.value)}>
          <option value="all">All Attorneys</option>
          {sourceLawyers.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {activeStatuses.map((s) => <option key={s} value={s}>{s} ({statusCounts[s]})</option>)}
        </select>
        <select className="filter-select" value={filterCounty} onChange={(e) => setFilterCounty(e.target.value)}>
          <option value="all">All Counties</option>
          {COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {(filterLawyer !== "all" || filterCounty !== "all" || filterStatus !== "all") && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setFilterLawyer("all"); setFilterCounty("all"); setFilterStatus("all"); }}>
            Clear filters
          </button>
        )}
        <button
          className={`btn btn-sm ${showClosed ? "" : "btn-secondary"}`}
          style={showClosed ? { background: "#f5f5f4", color: "#78716c", border: "1px solid #d6d3d1" } : {}}
          onClick={() => setShowClosed(!showClosed)}
        >
          {showClosed ? "Hide Archived" : "Show Archived"}
        </button>
      </div>

      {/* Summary cards for selected source */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Billed", value: formatCurrency(filtered.reduce((s, c) => s + (c.totalBilled || 0), 0)) },
          { label: "Paid", value: formatCurrency(filtered.reduce((s, c) => s + (c.status === "Paid" ? (c.totalBilled || 0) : 0), 0)) },
          { label: "Outstanding", value: formatCurrency(filtered.reduce((s, c) => s + (c.status === "Billed" ? (c.totalBilled || 0) : 0), 0)) },
          { label: "Pro Bono Given", value: formatCurrency(filtered.reduce((s, c) => s + (c.proBono || 0), 0)) },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-display)" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th style={{ cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("client")}>Client <SortIcon col="client" /></th>
                <th style={{ cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("attorney")}>Attorney <SortIcon col="attorney" /></th>
                <th>Case / Docket</th>
                <th>Service</th>
                <th>Rate</th>
                <th>Units</th>
                <th style={{ cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("year")}>Year <SortIcon col="year" /></th>
                <th style={{ textAlign: "right" }}>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No cases match your filters</td></tr>
              ) : (
                filtered.map((c) => {
                  const lawyer = lawyers.find((l) => l.id === c.lawyerId);
                  const sc = statusColor(c.status);
                  return (
                    <tr key={c.id} className="clickable-row" onClick={() => onSelectCase(c)}>
                      <td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{c.invoiceNo || "—"}</td>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td>{lawyer?.name || "—"}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 11 }}>{c.caseNumber || "—"}</td>
                      <td style={{ fontSize: 12, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.product || c.caseType}</td>
                      <td style={{ fontSize: 12 }}>{c.rate ? (typeof c.rate === "number" ? `$${c.rate}/h` : c.rate) : "—"}</td>
                      <td style={{ fontSize: 12 }}>{c.unit != null ? (typeof c.unit === "number" ? `${c.unit}h` : c.unit) : "—"}</td>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.dateOpened ? new Date(c.dateOpened).getFullYear() : "—"}</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>{c.totalBilled != null ? formatCurrency(c.totalBilled) : "—"}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          value={c.status || ""}
                          onChange={(e) => changeStatus(e, c)}
                          style={{ background: sc.bg, color: sc.text, border: "none", borderRadius: 6, padding: "3px 8px", fontSize: 12, fontWeight: 600, cursor: "pointer", outline: "none" }}
                        >
                          {CASE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          {/* keep legacy values selectable if case already has one */}
                          {!CASE_STATUSES.includes(c.status) && c.status && <option value={c.status}>{c.status}</option>}
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

// ─── Case Detail View ────────────────────────────────────────────────────────
function CaseDetail({ client, lawyer, emails, events, onBack, onGenerateInvoice, onUpdateClient, onAddEvent, onDeleteClient, gmail, gcal, gmailClientId, setGmailClientId, onAddEmails }) {
  const sc = statusColor(client.status);
  const caseEmails = emails.filter((e) => e.clientId === client.id);
  const caseEvents = events.filter((e) => e.clientId === client.id);

  const emptyEvent = { title: "", date: new Date().toISOString().split("T")[0], duration: "", type: "Record Review", billable: true };
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState(emptyEvent);
  const [caseFiles, setCaseFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!window.electronAPI) return;
    setFilesLoading(true);
    window.electronAPI.getRootPath()
      .then((root) => window.electronAPI.getFiles(`${root}/${lawyer?.name}/${client.name}`))
      .then((files) => { setCaseFiles(files || []); setFilesLoading(false); })
      .catch(() => { setCaseFiles([]); setFilesLoading(false); });
  }, [client.id, lawyer?.name, client.name]);

  const saveEvent = () => {
    if (!newEvent.title || !newEvent.date || newEvent.duration === "") return;
    onAddEvent({ ...newEvent, id: `ev${Date.now()}`, clientId: client.id, duration: parseFloat(newEvent.duration) || 0 });
    setNewEvent(emptyEvent);
    setShowAddEvent(false);
  };

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: 12 }}>
          ← Back to Cases
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700 }}>{client.name}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
              {client.caseType} · {lawyer?.name} · {client.county} {client.caseNumber ? `· ${client.caseNumber}` : ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select
              value={client.status || ""}
              onChange={(e) => onUpdateClient(client.id, { status: e.target.value })}
              style={{ background: sc.bg, color: sc.text, border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", outline: "none" }}
            >
              {CASE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              {!CASE_STATUSES.includes(client.status) && client.status && <option value={client.status}>{client.status}</option>}
            </select>
            <button className="btn btn-primary" onClick={() => onGenerateInvoice(client)}>
              <Icons.Invoice /> Generate Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Billing summary bar — editable hours + key fields */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Invoice", value: client.invoiceNo || "—", mono: true },
          { label: "Rate", value: client.rate ? (typeof client.rate === "number" ? `$${client.rate}/h` : client.rate) : "—" },
          { label: "Total", value: client.total != null ? formatCurrency(client.total) : "—" },
          { label: "Pro Bono", value: client.proBono ? formatCurrency(client.proBono) : "NA" },
          { label: "Billed", value: client.totalBilled != null ? formatCurrency(client.totalBilled) : "—" },
          { label: "Date Paid", value: client.datePaid || "—" },
          { label: "Outcome", value: client.outcome || "—" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "10px 12px", background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 13, fontWeight: 600, fontFamily: s.mono ? "monospace" : "inherit" }}>{s.value}</div>
          </div>
        ))}
        {/* Editable hours */}
        <div style={{ padding: "10px 12px", background: "var(--accent-light)", border: "1px solid var(--accent)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>Hours Worked</div>
          <input
            type="number"
            min="0"
            step="0.5"
            defaultValue={client.unit ?? ""}
            placeholder="0"
            onBlur={(e) => {
              const hrs = parseFloat(e.target.value);
              if (!isNaN(hrs)) onUpdateClient(client.id, { unit: hrs });
            }}
            style={{ fontSize: 13, fontWeight: 600, width: "100%", border: "none", background: "transparent", color: "var(--accent)", outline: "none" }}
          />
        </div>
      </div>

      <div className="detail-panel">
        <div>
          <div className="detail-section">
            <h4>Case Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <label>Defendant</label>
                <span>{client.name}</span>
              </div>
              <div className="info-item">
                <label>Charge</label>
                <span>{client.caseType}</span>
              </div>
              <div className="info-item">
                <label>Case Number</label>
                <span style={{ fontFamily: "monospace" }}>{client.caseNumber || "—"}</span>
              </div>
              <div className="info-item">
                <label>Court</label>
                <span>{client.court || "—"}</span>
              </div>
              <div className="info-item">
                <label>Defense Attorney</label>
                <span>{lawyer?.name}</span>
              </div>
              <div className="info-item">
                <label>Firm</label>
                <span>{lawyer?.firm}</span>
              </div>
              <div className="info-item">
                <label>County</label>
                <span>{client.county}</span>
              </div>
              <div className="info-item">
                <label>Date Hired</label>
                <input
                  type="date"
                  defaultValue={client.dateOpened || ""}
                  onBlur={(e) => { if (e.target.value) onUpdateClient(client.id, { dateOpened: e.target.value }); }}
                  style={{ fontSize: 13, border: "none", background: "transparent", color: "inherit", fontWeight: 500, cursor: "pointer", width: "100%" }}
                />
              </div>
              <div className="info-item">
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  Due Date
                  {gcal?.isConnected && client.gcalEventId && (
                    <span title="Synced to Google Calendar" style={{ fontSize: 10, background: "#dcfce7", color: "#166534", borderRadius: 10, padding: "1px 6px", fontWeight: 600 }}>● GCal</span>
                  )}
                  {gcal?.isConnected && client.dueDate && !client.gcalEventId && (
                    <span title="Not yet synced" style={{ fontSize: 10, background: "#fef9c3", color: "#713f12", borderRadius: 10, padding: "1px 6px", fontWeight: 600 }}>○ Pending</span>
                  )}
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="date"
                    key={`due-${client.id}`}
                    defaultValue={client.dueDate || ""}
                    onBlur={async (e) => {
                      const newDue = e.target.value;
                      if (gcal?.isConnected) {
                        const newEventId = await gcal.syncDueDate(client, lawyer, newDue, client.gcalEventId);
                        onUpdateClient(client.id, { dueDate: newDue, gcalEventId: newEventId });
                      } else {
                        onUpdateClient(client.id, { dueDate: newDue });
                      }
                    }}
                    style={{ fontSize: 13, border: "none", background: "transparent", color: "inherit", fontWeight: 500, cursor: "pointer", flex: 1 }}
                  />
                  {client.dueDate && (
                    <button
                      title={gcal?.isConnected ? "Open in Google Calendar" : "Download .ics file"}
                      onClick={() => {
                        if (gcal?.isConnected && client.gcalEventId) {
                          window.open(`https://calendar.google.com/calendar/r/eventedit?eid=${encodeURIComponent(client.gcalEventId)}`, "_blank");
                        } else {
                          downloadICS(client.name, client.dueDate, `${client.caseType} — ${lawyer?.name}`);
                        }
                      }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", padding: 2 }}
                    >
                      <Icons.Calendar />
                    </button>
                  )}
                </div>
              </div>
              <div className="info-item">
                <label>Date Billed</label>
                <input
                  type="date"
                  key={`billed-${client.id}`}
                  defaultValue={client.dateBilled || ""}
                  onBlur={(e) => onUpdateClient(client.id, { dateBilled: e.target.value })}
                  style={{ fontSize: 13, border: "none", background: "transparent", color: "inherit", fontWeight: 500, cursor: "pointer", width: "100%" }}
                />
              </div>
              <div className="info-item">
                <label>Next Hearing</label>
                <span style={{ color: client.nextHearing ? "var(--warm)" : "var(--text-muted)", fontWeight: client.nextHearing ? 600 : 400 }}>
                  {client.nextHearing ? formatDate(client.nextHearing) : "None scheduled"}
                </span>
              </div>
              <div className="info-item">
                <label>Outstanding Balance</label>
                <span style={{ color: client.balance > 0 ? "var(--danger)" : "var(--accent)", fontWeight: 600 }}>
                  {formatCurrency(client.balance)}
                </span>
              </div>
              <div className="info-item">
                <label>Billable Hours (This Month)</label>
                <span>{caseEvents.reduce((sum, e) => sum + e.duration, 0)} hrs</span>
              </div>
              <div className="info-item">
                <label>Est. Charges (This Month)</label>
                <span style={{ fontWeight: 600 }}>{formatCurrency(caseEvents.reduce((sum, e) => sum + e.duration, 0) * HOURLY_RATE)}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>Notes</h4>
            <textarea
              key={client.id}
              defaultValue={client.notes || ""}
              rows={4}
              placeholder="Case notes, follow-ups, reminders..."
              onBlur={(e) => onUpdateClient(client.id, { notes: e.target.value })}
              style={{ width: "100%", fontSize: 13, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface-raised)", resize: "vertical", fontFamily: "inherit", color: "var(--text-primary)" }}
            />
          </div>

          <div className="detail-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h4 style={{ marginBottom: 0 }}>Billable Events</h4>
              <button className="btn btn-sm btn-primary" onClick={() => setShowAddEvent(!showAddEvent)}>
                {showAddEvent ? "Cancel" : "+ Add Event"}
              </button>
            </div>

            {showAddEvent && (
              <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 14, marginBottom: 12 }}>
                <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Description</label>
                    <input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Records review, verbal report..." style={{ fontSize: 12 }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Date</label>
                    <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} style={{ fontSize: 12 }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Hours</label>
                    <input type="number" min="0" step="0.5" value={newEvent.duration} onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })} placeholder="2.5" style={{ fontSize: 12 }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Type</label>
                    <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })} style={{ fontSize: 12 }}>
                      <option>Record Review</option>
                      <option>Report Writing</option>
                      <option>Verbal Report</option>
                      <option>Testimony</option>
                      <option>Consultation</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
                  <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input type="checkbox" checked={newEvent.billable} onChange={(e) => setNewEvent({ ...newEvent, billable: e.target.checked })} />
                    Billable
                  </label>
                  <button className="btn btn-sm btn-primary" onClick={saveEvent} style={{ marginLeft: "auto" }}>Save Event</button>
                </div>
              </div>
            )}

            {caseEvents.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No events for this case</p>
            ) : (
              <div className="card">
                <table>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Duration</th>
                      <th>Type</th>
                      <th style={{ textAlign: "right" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseEvents.map((ev) => (
                      <tr key={ev.id}>
                        <td style={{ fontWeight: 500 }}>{ev.title}</td>
                        <td>{formatDate(ev.date)}</td>
                        <td>{ev.duration} hrs</td>
                        <td>{ev.type}</td>
                        <td style={{ textAlign: "right", fontWeight: 600 }}>{formatCurrency(ev.duration * HOURLY_RATE)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="detail-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h4 style={{ marginBottom: 0 }}>Case Files</h4>
              {window.electronAPI && (
                <button className="btn btn-sm btn-secondary" onClick={async () => {
                  const root = await window.electronAPI.getRootPath();
                  window.electronAPI.openInFinder(`${root}/${lawyer?.name}/${client.name}`);
                }}>
                  Open in Finder
                </button>
              )}
            </div>
            {filesLoading ? (
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading files...</p>
            ) : caseFiles.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No files in case folder yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {caseFiles.map((f) => (
                  <div key={f.path} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}
                    onClick={() => window.electronAPI?.openFile(f.path)}>
                    <span style={{ fontSize: 16 }}>{f.extension === "pdf" ? "📄" : f.extension === "docx" || f.extension === "doc" ? "📝" : f.extension === "xlsx" || f.extension === "xls" ? "📊" : "📎"}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{f.extension?.toUpperCase()} · {f.size ? (f.size / 1024 < 1000 ? `${(f.size / 1024).toFixed(0)} KB` : `${(f.size / 1024 / 1024).toFixed(1)} MB`) : ""}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="detail-section">
            <h4>Defense Attorney Contact</h4>
            <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16 }}>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{lawyer?.name}</p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>{lawyer?.firm}</p>
              <p style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6, marginBottom: 4, color: "var(--text-secondary)" }}>
                <Icons.Mail /> {lawyer?.email}
              </p>
              <p style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)" }}>
                <Icons.Phone /> {lawyer?.phone}
              </p>
            </div>
          </div>

          <div className="detail-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h4>Case Emails ({caseEmails.length})</h4>
              {gmail?.isConnected ? (
                <button
                  className="btn btn-sm btn-primary"
                  disabled={gmail.gmailLoading}
                  onClick={async () => {
                    try {
                      const pulled = await gmail.pullEmailsForCase(client, lawyer);
                      if (pulled.length === 0) { alert("No emails found matching this case."); return; }
                      // Tag with client/lawyer IDs and deduplicate
                      const existing = new Set(caseEmails.map(e => e.gmailId).filter(Boolean));
                      const newEmails = pulled
                        .filter(e => !existing.has(e.gmailId))
                        .map(e => ({ ...e, id: `gmail-${e.gmailId}`, clientId: client.id, lawyerId: lawyer?.id }));
                      if (newEmails.length > 0) onAddEmails(newEmails);
                      alert(`Found ${pulled.length} emails, added ${newEmails.length} new.`);
                    } catch (e) { alert("Gmail error: " + e.message); }
                  }}
                >
                  <Icons.Mail /> {gmail.gmailLoading ? "Searching..." : "Pull from Gmail"}
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => gmail?.connect(gmailClientId)}
                  disabled={gmail?.gmailLoading}
                >
                  <Icons.Mail /> Connect Gmail
                </button>
              )}
            </div>

            {/* Gmail connection banner */}
            <div style={{ background: gmail?.isConnected ? "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)" : "linear-gradient(135deg, #f8f9fa 0%, #e8eaed 100%)", border: `1px solid ${gmail?.isConnected ? "#a5d6a7" : "#dadce0"}`, borderRadius: "var(--radius)", padding: 14, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📧</div>
                <div style={{ flex: 1 }}>
                  {gmail?.isConnected ? (
                    <>
                      <div style={{ fontWeight: 600, fontSize: 12, color: "#2e7d32" }}>Gmail — {gmail.gmailUser?.email || "Connected"}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
                        {caseEmails.length > 0
                          ? `${caseEmails.length} emails matched to this case`
                          : `Click "Pull from Gmail" to search for emails with ${lawyer?.name || "this attorney"}`}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontWeight: 600, fontSize: 12, color: "#202124" }}>Gmail — Not connected</div>
                      <div style={{ fontSize: 11, color: "#5f6368", marginTop: 2 }}>Click Connect Gmail to sign in with Google</div>
                    </>
                  )}
                </div>
                <span className="badge" style={{ background: gmail?.isConnected ? "#e8f5e9" : "#fff3e0", color: gmail?.isConnected ? "#2e7d32" : "#e65100", fontSize: 10 }}>
                  {gmail?.isConnected ? "Connected" : "Offline"}
                </span>
              </div>
              {gmail?.isConnected && (
                <div style={{ fontSize: 10, color: "#80868b", marginTop: 8, borderTop: "1px solid #c8e6c9", paddingTop: 8 }}>
                  Searches: to/from {lawyer?.email || "attorney"} containing "{client.name.split(/[, ]+/)[0]}" or "{client.caseNumber || "case reference"}"
                </div>
              )}
              {gmail?.gmailError && (
                <div style={{ fontSize: 11, color: "var(--danger)", marginTop: 6 }}>{gmail.gmailError}</div>
              )}
            </div>

            {caseEmails.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: 16 }}>
                No emails yet. Use "Pull from Gmail" or forward case emails to import them.
              </p>
            ) : (
              caseEmails.map((em) => {
                const stc = serviceTypeColor(em.serviceType);
                return (
                  <div key={em.id} className="email-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <div className="email-subject">{em.subject}</div>
                      {em.serviceType && (
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 12, fontWeight: 600, whiteSpace: "nowrap", background: stc.bg, color: stc.text, marginLeft: 8 }}>
                          {em.serviceType}
                        </span>
                      )}
                    </div>
                    <div className="email-meta">{em.from} → {em.to || "—"} · {formatDate(em.date)}{em.time ? ` at ${em.time}` : ""}</div>
                  </div>
                );
              })
            )}

            {/* Manual email add */}
            <details style={{ marginTop: 12 }}>
              <summary style={{ fontSize: 12, color: "var(--text-muted)", cursor: "pointer", userSelect: "none" }}>
                + Add email record manually
              </summary>
              <div style={{ marginTop: 10, padding: 12, background: "var(--surface-raised)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Subject</label>
                    <input placeholder="Re: Lancaster records review" style={{ fontSize: 12 }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Date</label>
                    <input type="date" style={{ fontSize: 12 }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>From</label>
                    <input defaultValue="JGrossmanLNC@gmail.com" style={{ fontSize: 12 }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Service Type</label>
                    <select style={{ fontSize: 12 }}>
                      <option>Report Delivered</option>
                      <option>Review Request</option>
                      <option>Oral Report</option>
                      <option>Consultation Request</option>
                      <option>Testimony</option>
                      <option>Report Request</option>
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 8 }}>
                  <label style={{ fontSize: 11 }}>Notes / Body snippet</label>
                  <textarea rows={2} placeholder="Brief description of what this email documents..." style={{ fontSize: 12 }} />
                </div>
                <button className="btn btn-sm btn-primary" style={{ marginTop: 8 }}>Save Email Record</button>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Delete Case — small button fixed to bottom-right of case view */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            title="Delete this case"
            style={{ background: "none", border: "1px solid #fca5a5", borderRadius: "var(--radius-sm)", color: "#dc2626", fontSize: 11, padding: "4px 10px", cursor: "pointer", opacity: 0.6 }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
          >
            <Icons.Trash /> Delete Case
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "var(--radius-sm)", padding: "8px 14px" }}>
            <span style={{ fontSize: 13, color: "#991b1b", fontWeight: 600 }}>
              Delete <em>{client.name}</em>? This cannot be undone.
            </span>
            <button
              onClick={() => {
                if (gcal?.isConnected && client.gcalEventId) gcal.deleteEvent(client.gcalEventId).catch(console.warn);
                onDeleteClient(client.id);
                onBack();
              }}
              style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", padding: "5px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{ background: "none", border: "1px solid #fca5a5", borderRadius: "var(--radius-sm)", padding: "5px 12px", fontSize: 12, cursor: "pointer", color: "#991b1b" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Settings Tab ────────────────────────────────────────────────────────────
function SettingsTab({ dashboardName, setDashboardName, clients, lawyers, onClearAll, syncFolder, onChangeSyncFolder, gcal, gmailClientId }) {
  const [nameInput, setNameInput] = useState(dashboardName);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [folderLoading, setFolderLoading] = useState(false);

  const handleNameSave = () => {
    if (nameInput.trim()) setDashboardName(nameInput.trim());
  };

  const handlePickFolder = async () => {
    if (!window.electronAPI) return;
    setFolderLoading(true);
    try {
      const picked = await window.electronAPI.pickFolder();
      if (picked) {
        await window.electronAPI.setRootPath(picked);
        onChangeSyncFolder(picked);
      }
    } catch (e) {
      console.error("Folder pick failed:", e);
    }
    setFolderLoading(false);
  };

  const sectionStyle = {
    background: "var(--surface-raised)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "20px 24px",
    marginBottom: 20,
  };
  const labelStyle = { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 6, display: "block" };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Your Name */}
      <div style={sectionStyle}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Your Profile</h3>
        <div style={{ marginBottom: 8 }}>
          <label style={labelStyle}>Name &amp; Credentials</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
              style={{ flex: 1, fontSize: 14, padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)", color: "var(--text-primary)" }}
              placeholder="Jennifer Grossman BSN, RN, LNC"
            />
            <button className="btn btn-primary" onClick={handleNameSave}>Save</button>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>Shown in the sidebar under the NurseBill logo.</p>
        </div>
      </div>

      {/* Google Calendar */}
      <div style={sectionStyle}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Google Calendar</h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>
          Sync due dates directly to your Google Calendar. Changes you make in Google Calendar are pulled back automatically every 5 minutes.
        </p>

        {gcal?.isConnected ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 13, background: "#dcfce7", color: "#166534", borderRadius: 20, padding: "4px 12px", fontWeight: 600 }}>
                ● Connected {gcal.calUser?.timezone ? `· ${gcal.calUser.timezone}` : ""}
              </span>
              <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={gcal.disconnect}>Disconnect</button>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
              {gcal.lastSynced
                ? `Last synced: ${gcal.lastSynced.toLocaleTimeString()}`
                : "Sync runs every 5 minutes and on app focus."}
            </div>
            {gcal.calError && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{gcal.calError}</p>}
          </div>
        ) : (
          <div>
            <button
              className="btn btn-primary"
              onClick={() => gcal?.connect(gmailClientId)}
              disabled={gcal?.calLoading}
              style={{ marginBottom: 8 }}
            >
              {gcal?.calLoading ? "Connecting…" : "Connect Google Calendar"}
            </button>
            {gcal?.calError && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 6 }}>{gcal.calError}</p>}
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
              Uses the same Google account as Gmail. Make sure the Calendar API is enabled in your Google Cloud Console project.
            </p>
          </div>
        )}
      </div>

      {/* Sync Folder */}
      <div style={sectionStyle}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>File Sync Folder</h3>
        <label style={labelStyle}>Current Folder</label>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
          <div style={{ flex: 1, fontSize: 13, fontFamily: "monospace", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 12px", color: "var(--text-secondary)", wordBreak: "break-all" }}>
            {syncFolder || "~/Desktop/NurseBill Cases"}
          </div>
          <button className="btn btn-secondary" onClick={handlePickFolder} disabled={folderLoading}>
            {folderLoading ? "Choosing…" : "Change Folder"}
          </button>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
          NurseBill watches this folder for case files. Change it to any folder on your computer.
        </p>
      </div>

      {/* Data */}
      <div style={sectionStyle}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Data</h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
          Currently tracking <strong>{clients.length}</strong> case{clients.length !== 1 ? "s" : ""} and <strong>{lawyers.length}</strong> attorney{lawyers.length !== 1 ? "s" : ""}.
        </p>

        {!clearConfirm ? (
          <button
            className="btn"
            onClick={() => setClearConfirm(true)}
            style={{ background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5", fontWeight: 600 }}
          >
            Clear All Data…
          </button>
        ) : (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "var(--radius-sm)", padding: "16px 18px" }}>
            <p style={{ fontWeight: 700, color: "#991b1b", marginBottom: 6 }}>
              Delete all {clients.length} cases and {lawyers.length} attorneys?
            </p>
            <p style={{ fontSize: 13, color: "#7f1d1d", marginBottom: 14 }}>
              This cannot be undone. Imported data and manually added cases will both be removed.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn"
                onClick={() => { onClearAll(); setClearConfirm(false); }}
                style={{ background: "#dc2626", color: "#fff", border: "none", fontWeight: 700 }}
              >
                Yes, Delete Everything
              </button>
              <button className="btn btn-secondary" onClick={() => setClearConfirm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Intake Tab ──────────────────────────────────────────────────────────────
function IntakeTab({ lawyers, clients, onSave }) {
  const emptyForm = {
    lawyerName: "", firm: "", lawyerEmail: "", lawyerPhone: "",
    clientName: "", clientDOB: "",
    county: "", caseType: "", dateOfArrest: "", referralSource: "",
    caseNumber: "", court: "", nextHearing: "", bailStatus: "", prosecutionAgency: "",
    hourlyRate: "", estimateOfWork: "", dueDate: "", dateBilled: "",
    notes: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const update = (field) => (e) => {
    setDuplicateWarning(null);
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSave = () => {
    if (!form.lawyerName || !form.clientName) return;

    // Check for duplicate: same client name + same attorney
    const existing = clients.find((c) => {
      const clientMatch = c.name.toLowerCase() === form.clientName.toLowerCase();
      const lawyer = lawyers.find((l) => l.id === c.lawyerId);
      const lawyerMatch = lawyer?.name?.toLowerCase() === form.lawyerName.toLowerCase();
      return clientMatch && lawyerMatch;
    });

    if (existing && !duplicateWarning) {
      setDuplicateWarning(existing);
      return;
    }

    onSave(form);
    setForm(emptyForm);
    setDuplicateWarning(null);
  };

  return (
    <div className="intake-form">
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--accent-light)", padding: "10px 20px", borderRadius: "var(--radius)", marginBottom: 12 }}>
          <Icons.Clipboard />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--accent)" }}>New Client Intake</span>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Complete during initial phone consultation</p>
      </div>

      <div className="intake-section">
        <h3><Icons.User /> Attorney Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Attorney Name (Last, First)</label>
            <input value={form.lawyerName} onChange={update("lawyerName")} placeholder="Anderson, Karen" />
          </div>
          <div className="form-group">
            <label>Firm</label>
            <input value={form.firm} onChange={update("firm")} placeholder="Anderson & Associates" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.lawyerEmail} onChange={update("lawyerEmail")} placeholder="karen@anderson-law.com" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={form.lawyerPhone} onChange={update("lawyerPhone")} placeholder="(555) 234-5678" />
          </div>
        </div>
      </div>

      <div className="intake-section">
        <h3><Icons.User /> Client Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Client Name (Last, First)</label>
            <input value={form.clientName} onChange={update("clientName")} placeholder="Thompson, David" />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" value={form.clientDOB} onChange={update("clientDOB")} />
          </div>
        </div>
      </div>

      <div className="intake-section">
        <h3><Icons.Folder /> Case Details</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>County</label>
            <select value={form.county} onChange={update("county")}>
              <option value="">Select county...</option>
              {COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Case Type</label>
            <select value={form.caseType} onChange={update("caseType")}>
              <option value="">Select charge type...</option>
              {CASE_TYPES.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Date of Arrest / Incident</label>
            <input type="date" value={form.dateOfArrest} onChange={update("dateOfArrest")} />
          </div>
          <div className="form-group">
            <label>Referral Source</label>
            <input value={form.referralSource} onChange={update("referralSource")} placeholder="How did they find us?" />
          </div>
        </div>
      </div>

      <div className="intake-section">
        <h3><Icons.Building /> Court & Charges</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Case / Docket Number</label>
            <input value={form.caseNumber} onChange={update("caseNumber")} placeholder="CR-2026-00000" />
          </div>
          <div className="form-group">
            <label>Court</label>
            <input value={form.court} onChange={update("court")} placeholder="LA Superior Court" />
          </div>
          <div className="form-group">
            <label>Date of Arrest / Incident</label>
            <input type="date" value={form.dateOfArrest} onChange={update("dateOfArrest")} />
          </div>
          <div className="form-group">
            <label>Next Hearing Date</label>
            <input type="date" value={form.nextHearing} onChange={update("nextHearing")} />
          </div>
          <div className="form-group">
            <label>Bail Status</label>
            <select value={form.bailStatus} onChange={update("bailStatus")}>
              <option value="">Select...</option>
              <option>Released on Bail</option>
              <option>Released OR</option>
              <option>In Custody</option>
              <option>Bail Pending</option>
              <option>No Bail</option>
            </select>
          </div>
          <div className="form-group">
            <label>Prosecution Agency</label>
            <input value={form.prosecutionAgency} onChange={update("prosecutionAgency")} placeholder="DA's Office, US Attorney, etc." />
          </div>
        </div>
      </div>

      <div className="intake-section">
        <h3><Icons.Invoice /> Billing</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Hourly Rate ($)</label>
            <input type="number" min="0" step="0.01" value={form.hourlyRate} onChange={update("hourlyRate")} placeholder="150.00" />
          </div>
          <div className="form-group">
            <label>Estimate of Work</label>
            <input value={form.estimateOfWork} onChange={update("estimateOfWork")} placeholder="e.g. 10–15 hrs record review + report" />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" value={form.dueDate} onChange={update("dueDate")} />
          </div>
          <div className="form-group">
            <label>Date Billed</label>
            <input type="date" value={form.dateBilled} onChange={update("dateBilled")} />
          </div>
        </div>
      </div>

      <div className="intake-section">
        <h3><Icons.Edit /> Notes</h3>
        <div className="form-group full">
          <textarea value={form.notes} onChange={update("notes")} rows={4} placeholder="Additional notes from the phone call..." />
        </div>
      </div>

      {duplicateWarning && (
        <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: "var(--radius)", padding: "14px 18px", marginBottom: 16 }}>
          <p style={{ fontWeight: 600, color: "#92400e", marginBottom: 6 }}>
            ⚠️ Possible duplicate — a case for <strong>{duplicateWarning.name}</strong> with this attorney already exists ({duplicateWarning.status}{duplicateWarning.caseNumber ? `, ${duplicateWarning.caseNumber}` : ""}).
          </p>
          <p style={{ fontSize: 13, color: "#78350f", marginBottom: 10 }}>Is this a new case or did you mean to edit the existing one?</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" onClick={handleSave} style={{ background: "#d97706", border: "none" }}>
              Save as New Case Anyway
            </button>
            <button className="btn btn-secondary" onClick={() => setDuplicateWarning(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
        <button className="btn btn-secondary" onClick={() => { setForm(emptyForm); setDuplicateWarning(null); }}>Clear Form</button>
        <button className="btn btn-primary" onClick={handleSave} style={{ padding: "10px 28px" }}>
          <Icons.Save /> Save Intake
        </button>
      </div>
    </div>
  );
}

// ─── Calendar Tab ────────────────────────────────────────────────────────────
function CalendarTab({ events, clients }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Feb 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();

  const days = [];
  // Previous month fill
  const prevLast = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    days.push({ date: prevLast - i, month: month - 1, other: true });
  }
  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: i, month, other: false });
  }
  // Next month fill
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: i, month: month + 1, other: true });
  }

  const today = new Date();
  const isToday = (d) => !d.other && d.date === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const getEventsForDay = (d) => {
    if (d.other) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d.date).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const totalBillableHours = events.filter(e => e.billable && e.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)).reduce((s, e) => s + e.duration, 0);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div className="cal-nav">
          <button className="btn btn-secondary btn-sm" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>← Prev</button>
          <h3>{monthNames[month]} {year}</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>Next →</button>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
            <Icons.Clock />
            <span><strong>{totalBillableHours}</strong> billable hrs</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
            <Icons.DollarSign />
            <span><strong>{formatCurrency(totalBillableHours * HOURLY_RATE)}</strong> est. revenue</span>
          </div>
        </div>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="cal-header-cell">{d}</div>
        ))}
        {days.map((d, i) => {
          const dayEvents = getEventsForDay(d);
          return (
            <div key={i} className={`cal-cell ${d.other ? "other-month" : ""} ${isToday(d) ? "today" : ""}`}>
              <div className="cal-date">{d.date}</div>
              {dayEvents.map((ev) => {
                const client = clients.find((c) => c.id === ev.clientId);
                return (
                  <div key={ev.id} className={`cal-event ${ev.billable ? "billable" : "non-billable"}`} title={`${ev.title}\n${ev.time} · ${ev.duration}hrs${client ? ` · ${client.name}` : ""}`}>
                    {ev.title}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3>Upcoming Events</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Client</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Type</th>
                <th style={{ textAlign: "right" }}>Est. Charge</th>
              </tr>
            </thead>
            <tbody>
              {events
                .filter((e) => e.date >= "2026-02-17")
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((ev) => {
                  const client = clients.find((c) => c.id === ev.clientId);
                  return (
                    <tr key={ev.id}>
                      <td style={{ fontWeight: 500 }}>{ev.title}</td>
                      <td>{client?.name || "—"}</td>
                      <td>{formatDate(ev.date)}</td>
                      <td>{ev.time}</td>
                      <td>{ev.duration} hrs</td>
                      <td>
                        <span className="badge" style={{ background: ev.billable ? "var(--accent-light)" : "var(--warm-light)", color: ev.billable ? "var(--accent)" : "var(--warm)" }}>
                          {ev.type}
                        </span>
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>{ev.billable ? formatCurrency(ev.duration * HOURLY_RATE) : "—"}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── Invoice Tab ─────────────────────────────────────────────────────────────
// ─── Upload / Hightail Tab ──────────────────────────────────────────────────
function UploadTab({ clients, lawyers }) {
  const [hightailConnected, setHightailConnected] = useState(false);
  const [hightailEmail, setHightailEmail] = useState("");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [dragOver, setDragOver] = useState(false);
  const [sendingToHightail, setSendingToHightail] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const [isElectron, setIsElectron] = useState(false);
  const [desktopTree, setDesktopTree] = useState(null);
  const [rootPath, setRootPath] = useState("");
  const [loadingTree, setLoadingTree] = useState(true);

  // Check if running in Electron and load desktop folder tree
  useEffect(() => {
    async function init() {
      try {
        if (window.electronAPI) {
          const electron = await window.electronAPI.isElectron();
          setIsElectron(electron);
          const rp = await window.electronAPI.getRootPath();
          setRootPath(rp);
          await refreshTree();
        }
      } catch (e) {
        console.log("Not in Electron, using browser mode");
      }
      setLoadingTree(false);
    }
    init();
  }, []);

  // Refresh folder tree from Desktop
  const refreshTree = async () => {
    if (window.electronAPI) {
      const tree = await window.electronAPI.readFolderTree();
      setDesktopTree(tree);
    }
  };

  // Listen for real-time file system changes (Electron only)
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onRefreshHint(() => refreshTree());
      return () => window.electronAPI.removeAllListeners('fs:refresh-hint');
    }
  }, []);

  // Build folder tree — from Desktop folders if Electron, otherwise from app data
  const folderTree = useMemo(() => {
    if (desktopTree && desktopTree.lawyers.length > 0) {
      return desktopTree.lawyers.map((l) => ({
        id: `lawyer-${l.name}`,
        label: l.name,
        type: "lawyer",
        path: l.path,
        files: l.files || [],
        children: (l.clients || []).map((c) => ({
          id: `client-${l.name}-${c.name}`,
          label: c.name,
          type: "client",
          path: c.path,
          files: c.files || [],
        })),
      }));
    }
    // Fallback: build from app data (lawyer/client names)
    return lawyers.map((l) => {
      const lawyerClients = clients.filter((c) => c.lawyerId === l.id);
      return {
        id: `lawyer-${l.id}`,
        label: l.name,
        type: "lawyer",
        path: `${rootPath || "~/Desktop/NurseBill Cases"}/${l.name}`,
        files: [],
        children: lawyerClients.map((c) => ({
          id: `client-${c.id}`,
          label: c.name,
          type: "client",
          path: `${rootPath || "~/Desktop/NurseBill Cases"}/${l.name}/${c.name}`,
          files: [],
        })),
      };
    });
  }, [desktopTree, lawyers, clients, rootPath]);

  // All files flattened
  const allFiles = useMemo(() => {
    const files = [];
    folderTree.forEach((l) => {
      (l.files || []).forEach((f) => files.push({ ...f, folderId: l.id, lawyerName: l.label, clientName: null }));
      (l.children || []).forEach((c) => {
        (c.files || []).forEach((f) => files.push({ ...f, folderId: c.id, lawyerName: l.label, clientName: c.label }));
      });
    });
    return files;
  }, [folderTree]);

  const filteredFiles = useMemo(() => {
    if (selectedFolder === "all") return allFiles;
    return allFiles.filter((f) => f.folderId === selectedFolder);
  }, [allFiles, selectedFolder]);

  const selectedFolderLabel = useMemo(() => {
    if (selectedFolder === "all") return "All Files";
    for (const l of folderTree) {
      if (l.id === selectedFolder) return l.label;
      for (const c of l.children) {
        if (c.id === selectedFolder) return c.label;
      }
    }
    return "All Files";
  }, [selectedFolder, folderTree]);

  const selectedFolderPath = useMemo(() => {
    if (selectedFolder === "all") return rootPath;
    for (const l of folderTree) {
      if (l.id === selectedFolder) return l.path;
      for (const c of l.children) {
        if (c.id === selectedFolder) return c.path;
      }
    }
    return rootPath;
  }, [selectedFolder, folderTree, rootPath]);

  // File operations using Electron APIs
  const handlePickFiles = async () => {
    if (window.electronAPI && isElectron) {
      const picked = await window.electronAPI.pickFiles();
      if (picked.length > 0 && selectedFolder !== "all") {
        // Find the lawyer/client names from the selected folder
        for (const l of folderTree) {
          if (l.id === selectedFolder) {
            for (const f of picked) {
              await window.electronAPI.copyToCase(f.path, l.label, "");
            }
            break;
          }
          for (const c of l.children) {
            if (c.id === selectedFolder) {
              for (const f of picked) {
                await window.electronAPI.copyToCase(f.path, l.label, c.label);
              }
              break;
            }
          }
        }
        await refreshTree();
        setToast({ msg: `${picked.length} file${picked.length !== 1 ? "s" : ""} copied to ${selectedFolderLabel}!`, type: "success" });
      }
    } else {
      setToast({ msg: "File picker requires the desktop app. Run with: npm start", type: "info" });
    }
  };

  const handleOpenFile = async (filePath) => {
    if (window.electronAPI && isElectron) {
      await window.electronAPI.openFile(filePath);
    }
  };

  const handleOpenInFinder = async (folderPath) => {
    if (window.electronAPI && isElectron) {
      await window.electronAPI.openInFinder(folderPath || rootPath);
    } else {
      setToast({ msg: "Open in Finder requires the desktop app", type: "info" });
    }
  };

  const handleTrashFile = async (filePath) => {
    if (window.electronAPI && isElectron) {
      const result = await window.electronAPI.trashFile(filePath);
      if (result) {
        await refreshTree();
        setToast({ msg: "File moved to Trash", type: "success" });
      }
    }
  };

  const handleCreateCaseFolder = async () => {
    // When a new intake is saved, create the folder structure
    if (window.electronAPI && isElectron) {
      // This gets called from the Intake tab too
      for (const l of lawyers) {
        await window.electronAPI.createLawyerFolder(l.name);
        const lawyerClients = clients.filter((c) => c.lawyerId === l.id);
        for (const c of lawyerClients) {
          await window.electronAPI.createClientFolder(l.name, c.name);
        }
      }
      await refreshTree();
      setToast({ msg: "All case folders synced to Desktop!", type: "success" });
    }
  };

  // Hightail functions (same as before)
  const handleConnect = () => {
    if (!hightailEmail) return;
    setHightailConnected(true);
    setShowConnectModal(false);
    setToast({ msg: "Connected to Hightail!", type: "success" });
  };

  const readyFiles = filteredFiles;

  const handleSendToHightail = () => {
    if (readyFiles.length === 0) return;
    setSendingToHightail(true);
    setSendProgress(0);
    setShowSendModal(false);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setSendingToHightail(false);
        setSendProgress(0);
        setToast({ msg: `${readyFiles.length} file${readyFiles.length !== 1 ? "s" : ""} sent to Hightail!`, type: "success" });
      }
      setSendProgress(Math.min(progress, 100));
    }, 400);
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const fileTypeIcon = (ext) => {
    const map = { pdf: "PDF", doc: "DOC", docx: "DOC", xls: "XLS", xlsx: "XLS", jpg: "IMG", jpeg: "IMG", png: "IMG", gif: "IMG", tiff: "IMG" };
    return map[ext] || "FILE";
  };

  const fileTypeClass = (ext) => {
    if (["pdf"].includes(ext)) return "pdf";
    if (["doc", "docx", "rtf", "txt"].includes(ext)) return "doc";
    if (["xls", "xlsx", "csv"].includes(ext)) return "xls";
    if (["jpg", "jpeg", "png", "gif", "tiff", "bmp"].includes(ext)) return "img";
    return "other";
  };

  return (
    <>
      {/* Desktop Sync Banner */}
      <div style={{
        background: isElectron
          ? "linear-gradient(135deg, #2e7d32 0%, #388e3c 50%, #43a047 100%)"
          : "linear-gradient(135deg, #37474f 0%, #455a64 100%)",
        borderRadius: "var(--radius-lg)", padding: 20, color: "#fff", marginBottom: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 2 }}>
            {isElectron ? "✅ Desktop Folders Connected" : "📁 Desktop Folder Sync"}
          </h3>
          <p style={{ fontSize: 12.5, opacity: 0.85 }}>
            {isElectron
              ? `Watching: ${rootPath} · Files sync automatically`
              : "Run as desktop app (npm start) to sync with your Mac folders directly"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isElectron && (
            <button className="btn btn-sm" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "none" }} onClick={handleCreateCaseFolder}>
              Sync All Folders
            </button>
          )}
          <button className="btn btn-sm" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "none" }} onClick={() => handleOpenInFinder(rootPath)}>
            {isElectron ? "Open in Finder" : "📂 Show Path"}
          </button>
        </div>
      </div>

      {/* Hightail Connection Banner */}
      <div className="hightail-banner">
        <div>
          <h3>☁ Hightail Integration</h3>
          <p>Your uplink: <strong>spaces.hightail.com/uplink/jgrossman</strong> · Securely send &amp; receive large case files</p>
        </div>
        {hightailConnected ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="hightail-status connected">
              <Icons.Check /> Connected as {hightailEmail}
            </div>
            <button className="btn btn-sm" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none" }} onClick={() => setHightailConnected(false)}>
              Disconnect
            </button>
          </div>
        ) : (
          <button className="btn" style={{ background: "#fff", color: "var(--accent-hover)", fontWeight: 600 }} onClick={() => setShowConnectModal(true)}>
            Connect to Hightail
          </button>
        )}
      </div>

      {/* Sending progress bar */}
      {sendingToHightail && (
        <div className="card" style={{ padding: 20, marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
          <Icons.Cloud />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Sending files to Hightail...</div>
            <div className="progress-bar-track" style={{ height: 6 }}>
              <div className="progress-bar-fill" style={{ width: `${sendProgress}%` }} />
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>{Math.round(sendProgress)}%</span>
        </div>
      )}

      <div className="upload-layout">
        {/* Folder Tree — mirrors Mac Desktop */}
        <div className="upload-sidebar-panel">
          <div className="panel-header">
            <span>Desktop Folders</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{allFiles.length} files</span>
          </div>
          <div className="folder-tree">
            <button className={`folder-item ${selectedFolder === "all" ? "active" : ""}`} onClick={() => setSelectedFolder("all")}>
              <span className="folder-icon"><Icons.Folder /></span>
              NurseBill Cases
            </button>
            {folderTree.map((lawyer) => (
              <div key={lawyer.id}>
                <button className={`folder-item indent-1 ${selectedFolder === lawyer.id ? "active" : ""}`} onClick={() => setSelectedFolder(lawyer.id)}>
                  <span className="folder-icon"><Icons.User /></span>
                  {lawyer.label}
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-muted)" }}>
                    {(lawyer.children || []).reduce((sum, c) => sum + (c.files || []).length, 0) + (lawyer.files || []).length}
                  </span>
                </button>
                {(lawyer.children || []).map((client) => (
                  <button key={client.id} className={`folder-item indent-2 ${selectedFolder === client.id ? "active" : ""}`} onClick={() => setSelectedFolder(client.id)}>
                    <span className="folder-icon"><Icons.Folder /></span>
                    {client.label}
                    <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-muted)" }}>
                      {(client.files || []).length}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main Upload Area */}
        <div className="upload-main-panel">
          <div className="upload-main-header">
            <div>
              <h3>{selectedFolderLabel}</h3>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, fontFamily: "monospace" }}>{selectedFolderPath}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => handleOpenInFinder(selectedFolderPath)}>
                📂 {isElectron ? "Finder" : "Path"}
              </button>
              {hightailConnected && filteredFiles.length > 0 && (
                <button className="btn btn-sm" style={{ background: "var(--accent-hover)", color: "#fff", border: "none" }} onClick={() => setShowSendModal(true)}>
                  <Icons.Cloud /> Send {filteredFiles.length} to Hightail
                </button>
              )}
            </div>
          </div>

          {/* Drop Zone */}
          <div
            className={`upload-dropzone ${dragOver ? "dragover" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handlePickFiles(); }}
            onClick={handlePickFiles}
          >
            <div className="drop-icon"><Icons.Upload /></div>
            <h4>{isElectron ? "Click to add files from your Mac" : "Drop files here or click to upload"}</h4>
            <p>
              {isElectron
                ? `Files will be saved to: ${selectedFolderPath}`
                : "PDF, DOC, XLS, images, ZIP — up to 10 GB per file via Hightail"}
            </p>
          </div>

          {/* File List */}
          <div className="file-list">
            {loadingTree ? (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                <p style={{ fontSize: 13 }}>Loading files from Desktop...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                <Icons.File />
                <p style={{ marginTop: 8, fontSize: 13 }}>No files in this folder</p>
                {isElectron && <p style={{ fontSize: 11, marginTop: 4 }}>Drop files into the Mac folder or click above to add</p>}
              </div>
            ) : (
              filteredFiles.map((file, idx) => (
                <div key={file.path || idx} className="file-item" style={{ cursor: isElectron ? "pointer" : "default" }}
                  onDoubleClick={() => handleOpenFile(file.path)}>
                  <div className={`file-icon-box ${fileTypeClass(file.extension)}`}>
                    {fileTypeIcon(file.extension)}
                  </div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-meta">
                      {formatBytes(file.size)} · {file.modified ? formatDate(file.modified.split("T")[0]) : ""}
                      {file.clientName && <span> · {file.clientName}</span>}
                    </div>
                  </div>
                  {isElectron && (
                    <button className="btn btn-ghost btn-sm" title="Show in Finder" onClick={(e) => { e.stopPropagation(); handleOpenInFinder(file.path); }}>
                      📂
                    </button>
                  )}
                  <button className="btn btn-ghost btn-sm" title="Remove file" onClick={(e) => { e.stopPropagation(); handleTrashFile(file.path); }}>
                    <Icons.Trash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Connect to Hightail Modal */}
      {showConnectModal && (
        <div className="modal-overlay" onClick={() => setShowConnectModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h2>Connect to Hightail</h2>
              <button className="btn btn-ghost" onClick={() => setShowConnectModal(false)}><Icons.X /></button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>☁</div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Enter your Hightail account email to connect. Files will be sent securely via the Hightail API with tracking and encryption.
                </p>
              </div>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Hightail Email</label>
                <input value={hightailEmail} onChange={(e) => setHightailEmail(e.target.value)} placeholder="you@email.com" />
              </div>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>API Token (from Hightail Admin)</label>
                <input type="password" placeholder="Enter your Hightail API token" />
              </div>
              <div style={{ background: "var(--accent-lighter)", padding: 12, borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text-secondary)" }}>
                Need a token? Go to your <strong>Hightail Admin Console</strong> → API Settings → Generate Token. Available on Teams &amp; Business plans.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowConnectModal(false)}>Cancel</button>
              <button className="btn" style={{ background: "var(--accent-hover)", color: "#fff", border: "none" }} onClick={handleConnect}>
                <Icons.Cloud /> Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send to Hightail Modal */}
      {showSendModal && (
        <div className="modal-overlay" onClick={() => setShowSendModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h2>Send to Hightail</h2>
              <button className="btn btn-ghost" onClick={() => setShowSendModal(false)}><Icons.X /></button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Recipient Email(s)</label>
                <input placeholder="attorney@lawfirm.com" />
              </div>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Message (optional)</label>
                <textarea rows={3} placeholder="Please find the attached case files for your review..." />
              </div>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Security</label>
                <div style={{ display: "flex", gap: 12 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 400, textTransform: "none", letterSpacing: 0, cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent)" }} /> Require identity verification
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 400, textTransform: "none", letterSpacing: 0, cursor: "pointer" }}>
                    <input type="checkbox" style={{ accentColor: "var(--accent)" }} /> Set expiration date
                  </label>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Files to Send ({filteredFiles.length})
                </label>
                <div className="send-modal-file-list">
                  {filteredFiles.map((f, i) => (
                    <div key={f.path || i} className="send-modal-file-item">
                      <div className={`file-icon-box ${fileTypeClass(f.extension)}`} style={{ width: 24, height: 24, fontSize: 8, borderRadius: 4 }}>{fileTypeIcon(f.extension)}</div>
                      <span style={{ flex: 1 }}>{f.name}</span>
                      <span style={{ color: "var(--text-muted)" }}>{formatBytes(f.size)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowSendModal(false)}>Cancel</button>
              <button className="btn" style={{ background: "var(--accent-hover)", color: "#fff", border: "none" }} onClick={handleSendToHightail}>
                <Icons.Send /> Send via Hightail
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

// ─── Invoice Tab ─────────────────────────────────────────────────────────────
function InvoiceTab({ clients, lawyers, events, emails, preselectedClient, gmail }) {
  const [selectedClientId, setSelectedClientId] = useState(preselectedClient?.id || "");
  const [showPreview, setShowPreview] = useState(!!preselectedClient);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [selectedEmailIds, setSelectedEmailIds] = useState([]);

  // ── Editable invoice fields — these ARE the template ──
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" }).replace(/\//g, "."));
  const [invoiceDue, setInvoiceDue] = useState("Upon Receipt");
  const [lawFirm, setLawFirm] = useState("");
  const [attorneyName, setAttorneyName] = useState("");
  const [mitSpec, setMitSpec] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientIndictment, setClientIndictment] = useState("");
  const [lineItems, setLineItems] = useState([]);
  const [proBono, setProBono] = useState(0);

  useEffect(() => {
    if (preselectedClient) {
      setSelectedClientId(preselectedClient.id);
      setShowPreview(true);
    }
  }, [preselectedClient]);

  // When client selection changes, populate all template fields from their data
  const client = clients.find((c) => c.id === selectedClientId);
  const lawyer = client ? lawyers.find((l) => l.id === client.lawyerId) : null;
  const caseEmails = client ? emails.filter((e) => e.clientId === client.id) : [];

  useEffect(() => {
    if (client && lawyer) {
      setInvoiceNo(client.invoiceNo || `H${String(clients.indexOf(client) + 1).padStart(3, "0")}`);
      setLawFirm(lawyer.firm || "");
      setAttorneyName(lawyer.name || "");
      setMitSpec(client.mitigationSpecialist || "");
      setClientName(client.name || "");
      setClientIndictment(client.caseNumber || "");
      setProBono(client.proBono || 0);
      // Pre-populate a line item from client data if available
      if (client.product && client.rate) {
        setLineItems([{
          id: "li-1",
          date: client.dateOpened ? client.dateOpened.replace(/-/g, ".").replace(/^20/, "") : "",
          description: client.product,
          rate: typeof client.rate === "number" ? `$${client.rate}/h` : client.rate,
          unit: client.unit != null ? (typeof client.unit === "number" ? `${client.unit}h` : client.unit) : "",
          lineTotal: client.total || (typeof client.rate === "number" && typeof client.unit === "number" ? client.rate * client.unit : 0),
        }]);
      } else {
        setLineItems([{ id: "li-1", date: "", description: "", rate: "$300/h", unit: "", lineTotal: 0 }]);
      }
      setSelectedEmailIds(caseEmails.map((e) => e.id));
    }
  }, [selectedClientId]);

  // ── Line item CRUD ──
  const addLineItem = () => {
    setLineItems((prev) => [...prev, {
      id: `li-${Date.now()}`,
      date: "",
      description: "",
      rate: "$300/h",
      unit: "",
      lineTotal: 0,
    }]);
  };

  const updateLineItem = (id, field, value) => {
    setLineItems((prev) => prev.map((li) => {
      if (li.id !== id) return li;
      const updated = { ...li, [field]: value };
      // Auto-calc lineTotal when rate or unit changes
      if (field === "rate" || field === "unit") {
        const rateNum = parseFloat(updated.rate.replace(/[^0-9.]/g, "")) || 0;
        const unitNum = parseFloat(updated.unit.replace(/[^0-9.]/g, "")) || 0;
        if (rateNum > 0 && unitNum > 0) {
          updated.lineTotal = rateNum * unitNum;
        }
      }
      return updated;
    }));
  };

  const removeLineItem = (id) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((li) => li.id !== id));
  };

  // ── Totals ──
  const subtotal = lineItems.reduce((s, li) => s + (Number(li.lineTotal) || 0), 0);
  const totalDue = subtotal - (Number(proBono) || 0);

  // ── Email evidence ──
  const toggleEmail = (id) => setSelectedEmailIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const selectedEmails = caseEmails.filter((e) => selectedEmailIds.includes(e.id)).sort((a, b) => a.date.localeCompare(b.date));

  // ── Export data (for the .docx generator) ──
  const getExportData = () => ({
    invoiceNo, invoiceDate, invoiceDue, lawFirm,
    attorney: attorneyName, mitigationSpecialist: mitSpec,
    client: clientName, clientIndictment,
    lineItems: lineItems.map((li) => ({
      date: li.date, description: li.description,
      rate: li.rate, unit: li.unit, lineTotal: li.lineTotal,
    })),
    subtotal, proBono: Number(proBono) || 0, totalDue,
  });

  return (
    <>
      {!showPreview ? (
        <div style={{ maxWidth: 500, margin: "60px auto", textAlign: "center" }}>
          <div style={{ marginBottom: 24 }}>
            <Icons.Invoice />
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginTop: 12, marginBottom: 8 }}>Generate Invoice</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Select a client — the template fills automatically. Edit anything before exporting.</p>
          </div>
          <div className="form-group" style={{ textAlign: "left", marginBottom: 20 }}>
            <label>Select Client</label>
            <select className="filter-select" style={{ width: "100%" }} value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}>
              <option value="">Choose a client...</option>
              {clients.filter((c) => c.status !== "Closed" && c.status !== "Paid").map((c) => {
                const l = lawyers.find((l) => l.id === c.lawyerId);
                return <option key={c.id} value={c.id}>{c.name} — {l?.name} {c.invoiceNo ? `(${c.invoiceNo})` : ""}</option>;
              })}
            </select>
          </div>
          <button className="btn btn-primary" disabled={!selectedClientId} onClick={() => setShowPreview(true)}>
            <Icons.Eye /> Open Invoice Template
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <button className="btn btn-ghost" onClick={() => { setShowPreview(false); setEmailSent(false); }}>← Back</button>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => {
                // In Electron, this would call: node generate_invoice.mjs <path> --data <json>
                const json = JSON.stringify(getExportData());
                console.log("Export data for .docx generator:", json);
                alert("In the desktop app, this saves a .docx to your case folder.\n\nExport data logged to console.");
              }}>
                <Icons.Save /> Export .docx
              </button>
              <button className="btn btn-primary" onClick={() => setShowEmailModal(true)}>
                <Icons.Send /> Email Invoice
              </button>
            </div>
          </div>

          {/* Email Evidence Selector */}
          {caseEmails.length > 0 && (
            <div className="email-select-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h4><Icons.Mail /> Attach Email Evidence</h4>
                  <p>Select which emails to include as proof-of-service screenshots.</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedEmailIds(caseEmails.map((e) => e.id))}>Select All</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedEmailIds([])}>Clear</button>
                </div>
              </div>
              {caseEmails.sort((a, b) => a.date.localeCompare(b.date)).map((em) => {
                const stc = serviceTypeColor(em.serviceType);
                return (
                  <div key={em.id} className={`email-select-item ${selectedEmailIds.includes(em.id) ? "selected" : ""}`} onClick={() => toggleEmail(em.id)}>
                    <input type="checkbox" checked={selectedEmailIds.includes(em.id)} onChange={() => {}} />
                    <div className="email-select-info">
                      <div className="email-select-subject">{em.subject}</div>
                      <div className="email-select-meta">From: {em.from} · {formatDate(em.date)}{em.time ? ` at ${em.time}` : ""}</div>
                    </div>
                    <span className="email-service-tag" style={{ background: stc.bg, color: stc.text }}>{em.serviceType}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              LIVE EDITABLE INVOICE TEMPLATE
              Every field is editable. Changes reflect instantly in the preview.
              ══════════════════════════════════════════════════════════════ */}
          <div className="invoice-preview" style={{ fontFamily: "'Book Antiqua', 'Palatino Linotype', Georgia, serif" }}>

            {/* Header: Name + Contact (left) / Invoice No + Due (right) */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#396894", lineHeight: 1.4, marginBottom: 6 }}>
                  Jennifer Grossman BSN, RN, LNC
                </div>
                <div style={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>
                  JGrossmanLNC@gmail.com<br />
                  413.218.5092
                </div>
              </div>
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>Invoice No:</span>
                  <input
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    style={{ fontFamily: "inherit", fontSize: 11, border: "1px dashed #ccc", borderRadius: 3, padding: "2px 6px", width: 80, textAlign: "right", background: "#fafafa" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>Invoice Due:</span>
                  <input
                    value={invoiceDue}
                    onChange={(e) => setInvoiceDue(e.target.value)}
                    style={{ fontFamily: "inherit", fontSize: 11, border: "1px dashed #ccc", borderRadius: 3, padding: "2px 6px", width: 100, textAlign: "right", background: "#fafafa" }}
                  />
                </div>
              </div>
            </div>

            {/* Blue divider */}
            <div style={{ borderBottom: "2px solid #396894", marginBottom: 16 }} />

            {/* Date + Bill To — all editable */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>Date:</span>
                <input
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  style={{ fontFamily: "inherit", fontSize: 11, border: "1px dashed #ccc", borderRadius: 3, padding: "2px 6px", width: 80, background: "#fafafa" }}
                />
              </div>

              <div style={{ marginBottom: 6 }}>
                <input
                  value={lawFirm}
                  onChange={(e) => setLawFirm(e.target.value)}
                  placeholder="Law Firm"
                  style={{ fontFamily: "inherit", fontSize: 11, fontWeight: 700, border: "1px dashed #ccc", borderRadius: 3, padding: "2px 6px", width: "100%", background: "#fafafa" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>Attorney:</span>
                <input
                  value={attorneyName}
                  onChange={(e) => setAttorneyName(e.target.value)}
                  style={{ fontFamily: "inherit", fontSize: 11, border: "1px dashed #ccc", borderRadius: 3, padding: "2px 6px", flex: 1, background: "#fafafa" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>Mitigation Specialist:</span>
                <input
                  value={mitSpec}
                  onChange={(e) => setMitSpec(e.target.value)}
                  placeholder="(leave blank if none)"
                  style={{ fontFamily: "inherit", fontSize: 11, border: "1px dashed #ccc", borderRadius: 3, padding: "2px 6px", flex: 1, background: "#fafafa" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>Client:</span>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  style={{ fontFamily: "inherit", fontSize: 11, border: "1px dashed #ccc", borderRadius: 3, padding: "2px 6px", width: 200, background: "#fafafa" }}
                />
                <span style={{ fontSize: 11 }}>(</span>
                <input
                  value={clientIndictment}
                  onChange={(e) => setClientIndictment(e.target.value)}
                  placeholder="case/docket #"
                  style={{ fontFamily: "inherit", fontSize: 11, border: "1px dashed #ccc", borderRadius: 3, padding: "2px 6px", width: 160, background: "#fafafa" }}
                />
                <span style={{ fontSize: 11 }}>)</span>
              </div>
            </div>

            {/* ── EDITABLE Services Table ── */}
            <div className="invoice-table">
              <table style={{ fontFamily: "'Book Antiqua', 'Palatino Linotype', Georgia, serif" }}>
                <thead>
                  <tr>
                    <th style={{ fontWeight: 700, width: 90 }}>Date</th>
                    <th style={{ fontWeight: 700 }}>Description of Services</th>
                    <th style={{ fontWeight: 700, width: 80 }}>Rate</th>
                    <th style={{ fontWeight: 700, width: 60 }}>Unit</th>
                    <th style={{ textAlign: "right", fontWeight: 700, width: 100 }}>Line Total</th>
                    <th style={{ width: 30 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((li) => (
                    <tr key={li.id}>
                      <td>
                        <input
                          value={li.date}
                          onChange={(e) => updateLineItem(li.id, "date", e.target.value)}
                          placeholder="1.28.26"
                          style={{ fontFamily: "inherit", fontSize: 11, border: "1px dashed #ccc", borderRadius: 3, padding: "2px 4px", width: "100%", background: "#fafafa" }}
                        />
                      </td>
                      <td>
                        <input
                          value={li.description}
                          onChange={(e) => updateLineItem(li.id, "description", e.target.value)}
                          placeholder="Review of medical records and verbal report"
                          style={{ fontFamily: "inherit", fontSize: 11, border: "1px dashed #ccc", borderRadius: 3, padding: "2px 4px", width: "100%", background: "#fafafa" }}
                        />
                      </td>
                      <td>
                        <input
                          value={li.rate}
                          onChange={(e) => updateLineItem(li.id, "rate", e.target.value)}
                          style={{ fontFamily: "inherit", fontSize: 11, border: "1px dashed #ccc", borderRadius: 3, padding: "2px 4px", width: "100%", background: "#fafafa", textAlign: "center" }}
                        />
                      </td>
                      <td>
                        <input
                          value={li.unit}
                          onChange={(e) => updateLineItem(li.id, "unit", e.target.value)}
                          placeholder="3h"
                          style={{ fontFamily: "inherit", fontSize: 11, border: "1px dashed #ccc", borderRadius: 3, padding: "2px 4px", width: "100%", background: "#fafafa", textAlign: "center" }}
                        />
                      </td>
                      <td>
                        <input
                          value={li.lineTotal}
                          onChange={(e) => updateLineItem(li.id, "lineTotal", e.target.value)}
                          style={{ fontFamily: "inherit", fontSize: 11, border: "1px dashed #ccc", borderRadius: 3, padding: "2px 4px", width: "100%", background: "#fafafa", textAlign: "right", fontWeight: 600 }}
                        />
                      </td>
                      <td>
                        {lineItems.length > 1 && (
                          <button onClick={() => removeLineItem(li.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#cc0000", fontSize: 13, padding: 0 }} title="Remove line">✕</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={addLineItem}
                style={{ marginTop: 8, fontSize: 11, color: "#396894", background: "none", border: "1px dashed #396894", borderRadius: 3, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit" }}
              >
                + Add Line Item
              </button>
            </div>

            {/* Totals — Subtotal / Pro Bono / Total Amount Due */}
            <div className="invoice-total-row">
              <div className="invoice-total">
                <div className="line">
                  <span style={{ fontWeight: 700 }}>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="line" style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, flex: 1 }}>Pro Bono</span>
                  <input
                    value={proBono}
                    onChange={(e) => setProBono(e.target.value)}
                    style={{ fontFamily: "inherit", fontSize: 12, border: "1px dashed #ccc", borderRadius: 3, padding: "2px 6px", width: 80, textAlign: "right", background: "#fafafa" }}
                  />
                </div>
                <div className="line grand">
                  <span style={{ fontWeight: 700 }}>Total Amount Due</span>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(totalDue)}</span>
                </div>
              </div>
            </div>

            {/* Footer — payment info */}
            <div style={{ textAlign: "right", fontSize: 10, lineHeight: 1.7, marginTop: 24, color: "var(--text-secondary)" }}>
              Please make payments to:<br />
              <strong>Jennifer Grossman</strong><br />
              85 Summit Street #2<br />
              Brooklyn, NY 11231
            </div>

            <div style={{ textAlign: "center", fontSize: 8, marginTop: 20, color: "var(--text-muted)", fontStyle: "italic", fontFamily: "'Avenir', 'Avenir Book', system-ui, sans-serif" }}>
              <span style={{ color: "#cc0000" }}>* updated Fee Schedule to start 1.1.2024</span><br />
              If payment is not received within 30 days, a separate invoice will be generated for unpaid invoices with additional interest of 1.5% of the outstanding balance per month.
            </div>

            {/* ── Email Evidence Screenshots ── */}
            {selectedEmails.length > 0 && (
              <div className="evidence-section">
                <h4>📎 Supporting Documentation — Email Evidence</h4>
                <p className="evidence-subtitle">
                  The following {selectedEmails.length} email{selectedEmails.length !== 1 ? "s" : ""} serve as proof of services rendered.
                </p>
                {selectedEmails.map((em, idx) => {
                  const stc = serviceTypeColor(em.serviceType);
                  return (
                    <div key={em.id} className="email-screenshot">
                      <div className="email-screenshot-toolbar">
                        <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
                        <span className="toolbar-label">Email Record</span>
                      </div>
                      <div className="email-screenshot-header">
                        <div className="field"><span className="label">From:</span><span className="value">{em.from}</span></div>
                        <div className="field"><span className="label">To:</span><span className="value">{em.to}</span></div>
                        <div className="field"><span className="label">Date:</span><span className="value">{formatDate(em.date)}{em.time ? ` at ${em.time}` : ""}</span></div>
                        <div className="field"><span className="label">Subject:</span><span className="value" style={{ fontWeight: 600 }}>{em.subject}</span></div>
                      </div>
                      <div className="email-screenshot-body">{em.body}</div>
                      <div className="email-screenshot-footer">
                        <span className="evidence-label">
                          <span style={{ display: "inline-flex", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700, background: stc.bg, color: stc.text }}>{em.serviceType}</span>
                          Evidence of Service
                        </span>
                        <span className="evidence-num">Exhibit {idx + 1} of {selectedEmails.length}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Email Modal */}
          {showEmailModal && (
            <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
                <div className="modal-header">
                  <h2>Email Invoice</h2>
                  <button className="btn btn-ghost" onClick={() => setShowEmailModal(false)}><Icons.X /></button>
                </div>
                <div className="modal-body">
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label>From</label>
                    <input value={gmail?.gmailUser?.email || "JGrossmanLNC@gmail.com"} readOnly style={{ color: "var(--text-muted)" }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label>To</label>
                    <input id="invoice-email-to" defaultValue={lawyer?.email} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label>Subject</label>
                    <input id="invoice-email-subject" defaultValue={`Invoice ${invoiceNo} — ${clientName}`} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label>Message</label>
                    <textarea id="invoice-email-body" rows={10} defaultValue={`Hello,\n\nI hope this email finds you well. Please find attached invoice ${invoiceNo} and supporting documentation.\n\nBest,\nJennifer\n\n\nJennifer Grossman, RN, BSN, LNC\n\nFILE UPLOAD HERE: https://spaces.hightail.com/uplink/jgrossman\n\nThis email, and any attachments thereto, is intended only for use by the addressee(s) and may contain legally privileged and/or confidential information. If you are not the intended recipient, please do not disclose, distribute or copy this communication.`} />
                  </div>
                  <div style={{ background: "var(--accent-lighter)", padding: 12, borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text-secondary)" }}>
                    <strong>Attachments:</strong> Invoice {invoiceNo} (.docx) {selectedEmails.length > 0 ? `+ ${selectedEmails.length} email evidence screenshot${selectedEmails.length !== 1 ? "s" : ""}` : ""}<br />
                    <strong>Hightail Uplink:</strong> <a href="https://spaces.hightail.com/uplink/jgrossman" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>spaces.hightail.com/uplink/jgrossman</a>
                  </div>
                  {!gmail?.isConnected && (
                    <div style={{ marginTop: 10, padding: 10, background: "#fff3e0", borderRadius: "var(--radius-sm)", fontSize: 11, color: "#e65100" }}>
                      Gmail not connected — email will be simulated. Connect Gmail from a case detail page to send for real.
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowEmailModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={async () => {
                    const to = document.getElementById("invoice-email-to")?.value || lawyer?.email;
                    const subject = document.getElementById("invoice-email-subject")?.value || `Invoice ${invoiceNo}`;
                    const body = document.getElementById("invoice-email-body")?.value || "";
                    if (gmail?.isConnected) {
                      try {
                        await gmail.sendEmail({ to, subject, body });
                        setShowEmailModal(false);
                        setEmailSent(true);
                      } catch (e) { alert("Failed to send: " + e.message); }
                    } else {
                      setShowEmailModal(false);
                      setEmailSent(true);
                    }
                  }}>
                    <Icons.Send /> {gmail?.isConnected ? "Send via Gmail" : "Send Email"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {emailSent && <Toast message={`Invoice ${invoiceNo} emailed to ${lawyer?.email}!`} type="success" onClose={() => setEmailSent(false)} />}
        </>
      )}
    </>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
// ─── Import Data Tab ────────────────────────────────────────────────────────
// Reads Jennifer's Excel workbooks and maps them to app data
// Supports: LAS_BILLING, FL_BILLING, BILLING_INDIVIDUALS
function ImportTab({ onImportComplete, importStats, currentClientCount }) {
  const [files, setFiles] = useState([]);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [clearExisting, setClearExisting] = useState(false);
  const [parsedRows, setParsedRows] = useState([]);

  // Detect which billing source a file belongs to based on filename
  const detectSource = (filename) => {
    const fn = filename.toUpperCase();
    if (fn.includes("LAS")) return "las";
    if (fn.includes("FL") || fn.includes("FLORIDA")) return "fla";
    if (fn.includes("INDIVIDUAL")) return "ind";
    return "ind"; // default
  };

  // Detect source label
  const sourceLabel = (source) => {
    return BILLING_SOURCES.find((s) => s.id === source)?.label || "Unknown";
  };

  // Pick files (Electron native dialog or browser file input)
  const handlePickFiles = async () => {
    if (window.electronAPI) {
      try {
        const electron = await window.electronAPI.isElectron();
        if (electron) {
          // Electron: use native file picker
          const picked = await window.electronAPI.pickFiles();
          if (picked.length > 0) {
            setFiles(picked.map((f) => ({
              name: f.name,
              path: f.path,
              size: f.size,
              source: detectSource(f.name),
            })));
          }
          return;
        }
      } catch (e) {}
    }
    // Browser fallback: use hidden file input
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".xlsx,.xls,.csv";
    input.onchange = (e) => {
      const fileList = Array.from(e.target.files);
      setFiles(fileList.map((f) => ({
        name: f.name,
        file: f,
        size: f.size,
        source: detectSource(f.name),
      })));
    };
    input.click();
  };

  // Parse an Excel file using SheetJS (works in browser)
  const parseExcelFile = async (fileInfo) => {
    const XLSX = await import("sheetjs");

    let workbook;
    if (fileInfo.file) {
      // Browser: read from File object
      const buf = await fileInfo.file.arrayBuffer();
      workbook = XLSX.read(buf, { type: "array" });
    } else if (fileInfo.path && window.electronAPI) {
      // Electron: read raw bytes from disk via IPC
      const buf = await window.electronAPI.readFile(fileInfo.path);
      workbook = XLSX.read(buf, { type: "buffer" });
    } else {
      throw new Error("File data not available — pick files using the file picker");
    }

    const source = fileInfo.source;
    const rows = [];

    // Find a column index by checking multiple possible header names (case-insensitive, trimmed)
    const findCol = (headers, names) => {
      for (const name of names) {
        const idx = headers.findIndex(
          (h) => h && h.toString().toLowerCase().trim() === name.toLowerCase().trim()
        );
        if (idx >= 0) return idx;
      }
      return -1;
    };

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      if (raw.length < 2) continue;

      // Find the header row — it's the one that contains "Invoice" or "Attorney"
      let headerIdx = -1;
      for (let i = 0; i < Math.min(5, raw.length); i++) {
        const r = raw[i].map((c) => String(c).toLowerCase().trim());
        if (r.includes("invoice") || r.includes("attorney")) {
          headerIdx = i;
          break;
        }
      }
      if (headerIdx === -1) continue;

      const headers = raw[headerIdx].map((h) => String(h).trim());

      // Column mapping
      const cols = {
        invoice: findCol(headers, ["Invoice"]),
        startDate: findCol(headers, ["Start Date"]),
        notes: findCol(headers, ["Notes"]),
        dueDate: findCol(headers, ["Due Date", "End /Due Date", "End Date"]),
        identifier: findCol(headers, ["Identifier", "Book/Case/Docket", "Case/Docket"]),
        attorney: findCol(headers, ["Attorney"]),
        client: findCol(headers, ["Client", "Client "]),
        product: findCol(headers, ["Description of Services", "Product"]),
        rate: findCol(headers, ["Rate", "Rate/Estimate"]),
        unit: findCol(headers, ["Unit", "Hours"]),
        proBono: findCol(headers, ["Pro Bono"]),
        total: findCol(headers, ["Total"]),
        totalBilled: findCol(headers, ["Total Billed"]),
        datePaid: findCol(headers, ["Date Paid"]),
        totalPaid: findCol(headers, ["Total Paid"]),
        address: findCol(headers, ["Address"]),
        email: findCol(headers, ["Email", "Email "]),
        phone: findCol(headers, ["Phone"]),
        outcome: findCol(headers, ["Outcome", "OUTCOME", "Result"]),
        city: findCol(headers, ["City"]),
      };

      // Process data rows
      for (let i = headerIdx + 1; i < raw.length; i++) {
        const r = raw[i];
        if (!r || r.length === 0) continue;

        const get = (col) => col >= 0 && r[col] != null ? String(r[col]).trim() : "";

        const invoice = get(cols.invoice);
        const attorney = get(cols.attorney);
        const client = get(cols.client);
        const identifier = get(cols.identifier);

        // Skip junk rows: completely empty, or separator rows like "PAID PAID PAID", "DONE BILL"
        const isEmpty = !invoice && !attorney && !client && !get(cols.product);
        const isSeparator = identifier && /^(PAID|DONE|BILL|OPEN|\s)+$/i.test(identifier);
        if (isEmpty || isSeparator) continue;

        // Skip rows that are just sub-header notes (like "Miami: Experts@pdmiami.com...")
        if (!invoice && !client && identifier && identifier.includes("@")) continue;

        const totalRaw = get(cols.total);
        const totalNum = parseFloat(String(totalRaw).replace(/[^0-9.-]/g, "")) || 0;
        const proBonoRaw = get(cols.proBono);
        const proBonoNum = parseFloat(String(proBonoRaw).replace(/[^0-9.-]/g, "")) || 0;
        const totalBilledRaw = get(cols.totalBilled);
        const totalBilledNum = parseFloat(String(totalBilledRaw).replace(/[^0-9.-]/g, "")) || 0;
        const totalPaidRaw = get(cols.totalPaid);
        const totalPaidNum = parseFloat(String(totalPaidRaw).replace(/[^0-9.-]/g, "")) || 0;

        // Determine status
        let status = "Active";
        const datePaid = get(cols.datePaid);
        if (totalPaidNum > 0 || (datePaid && /paid|deposit|check/i.test(datePaid))) {
          status = "Paid";
        } else if (datePaid && /sent|emailed|billed|invoice/i.test(datePaid)) {
          status = "Billed";
        } else if (totalNum > 0 && !datePaid) {
          status = "Done/Bill";
        }

        rows.push({
          source,
          sheet: sheetName,
          invoice,
          startDate: parseExcelDate(cols.startDate >= 0 && r[cols.startDate] != null ? r[cols.startDate] : ""),
          notes: get(cols.notes),
          dueDate: parseExcelDate(cols.dueDate >= 0 && r[cols.dueDate] != null ? r[cols.dueDate] : ""),
          identifier,
          attorney,
          client,
          product: get(cols.product),
          rate: get(cols.rate),
          unit: get(cols.unit),
          proBono: proBonoNum,
          total: totalNum,
          totalBilled: totalBilledNum,
          datePaid,
          totalPaid: totalPaidNum,
          address: get(cols.address),
          email: get(cols.email),
          phone: get(cols.phone),
          outcome: get(cols.outcome),
          city: get(cols.city),
          status,
        });
      }
    }

    return { filename: fileInfo.name, source, rows };
  };

  // Actually parse all selected files
  const handleImport = async () => {
    if (files.length === 0) return;
    setImporting(true);
    setError(null);

    try {
      const results = [];
      for (const f of files) {
        const result = await parseExcelFile(f);
        results.push(result);
      }

      // Aggregate stats
      const allRows = results.flatMap((r) => r.rows);
      const stats = {
        filesProcessed: files.length,
        sheetsProcessed: results.reduce((s, r) => s + new Set(r.rows.map((rr) => rr.sheet)).size, 0),
        rowsFound: allRows.length,
        rowsImported: allRows.length,
        lawyersFound: new Set(allRows.filter((r) => r.attorney).map((r) => r.attorney)).size,
        sources: {},
      };

      for (const r of results) {
        const label = sourceLabel(r.source);
        stats.sources[label] = (stats.sources[label] || 0) + r.rows.length;
      }

      // Store parsed rows for confirmImport
      setParsedRows(allRows);
      setPreview(stats);
      setImporting(false);
    } catch (e) {
      console.error("Import error:", e);
      setError(e.message);
      setImporting(false);
    }
  };

  const confirmImport = () => {
    if (!preview || parsedRows.length === 0) return;

    // Convert flat spreadsheet rows into client + lawyer records
    const lawyerMap = new Map(); // attorney name → lawyer object
    const clientList = [];
    let clientId = 1;
    let lawyerId = 1;

    // Determine law firm from source
    const firmForSource = (source) => {
      if (source === "las") return "Legal Aid Society";
      if (source === "fla") return "Office of the Public Defender — Florida";
      return "Private/Individual";
    };

    for (const row of parsedRows) {
      if (!row.client && !row.attorney) continue; // skip truly empty

      // Upsert lawyer
      const attName = row.attorney || "Unknown";
      if (!lawyerMap.has(attName)) {
        const lid = `imported-l${lawyerId++}`;
        lawyerMap.set(attName, {
          id: lid,
          name: attName,
          firm: firmForSource(row.source),
          email: row.email || "",
          phone: row.phone || "",
        });
      }
      const lawyer = lawyerMap.get(attName);

      // Create client record
      clientList.push({
        id: `imported-c${clientId++}`,
        name: row.client || "Unknown Client",
        lawyerId: lawyer.id,
        caseNumber: row.identifier || "",
        caseType: row.product || "",
        invoiceNo: row.invoice || "",
        dateOpened: row.startDate || "",
        dueDate: row.dueDate || "",
        dateBilled: "",
        status: row.status || "Open",
        product: row.product || "",
        rate: row.rate || "",
        unit: row.unit || "",
        total: row.total || 0,
        proBono: row.proBono || 0,
        totalBilled: row.totalBilled || 0,
        totalPaid: row.totalPaid || 0,
        datePaid: row.datePaid || "",
        notes: row.notes || "",
        outcome: row.outcome || "",
        city: row.city || "",
        source: row.source || "ind",
        sheet: row.sheet || "",
        balance: 0,
        mitigationSpecialist: "",
      });
    }

    onImportComplete({
      importedClients: clientList,
      importedLawyers: Array.from(lawyerMap.values()),
      stats: preview,
      clearExisting,
    });
    setFiles([]);
    setPreview(null);
    setParsedRows([]);
  };

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <>
      {/* Intro banner */}
      <div style={{
        background: "linear-gradient(135deg, #2a2438 0%, #3d2a5c 50%, #8b5cf6 100%)",
        borderRadius: "var(--radius-lg)", padding: 24, color: "#fff", marginBottom: 24,
      }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
          Import Your Excel Billing Data
        </h3>
        <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.6 }}>
          Drop in your existing billing spreadsheets and NurseBill will read every sheet, map columns automatically, and import all your cases. Supports your three workbooks: LAS Billing, Florida Billing, and Individual Billing.
        </p>
      </div>

      {/* How it works */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h4 style={{ fontFamily: "var(--font-display)", marginBottom: 12 }}>How Import Works</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { step: "1", title: "Select Files", desc: "Pick your .xlsx billing files from your Mac" },
            { step: "2", title: "Auto-Detect", desc: "NurseBill identifies LAS, Florida, or Individual format" },
            { step: "3", title: "Map Columns", desc: "Matches Invoice, Attorney, Client, Rate, etc. automatically" },
            { step: "4", title: "Import", desc: "All years & sheets imported. Skips empty rows and headers." },
          ].map((s) => (
            <div key={s.step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File picker area */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h4 style={{ fontFamily: "var(--font-display)" }}>Files to Import</h4>
          <button className="btn btn-primary" onClick={handlePickFiles}>
            <Icons.Upload /> Select Excel Files
          </button>
        </div>

        {files.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)", border: "2px dashed var(--border)", borderRadius: "var(--radius)", cursor: "pointer" }} onClick={handlePickFiles}>
            <Icons.File />
            <p style={{ marginTop: 8, fontSize: 13 }}>Click to select your billing spreadsheets (.xlsx)</p>
            <p style={{ fontSize: 11, marginTop: 4 }}>LAS_BILLING_2021-present.xlsx, FL_BILLING_FLORIDA_2021-present.xlsx, BILLING_INDIVIDUALS_2021-present.xlsx</p>
          </div>
        ) : (
          <div>
            {files.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < files.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div className="file-icon-box xls" style={{ width: 32, height: 32, fontSize: 9, borderRadius: 6 }}>XLS</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{formatBytes(f.size)}</div>
                </div>
                <span className="badge" style={{
                  background: f.source === "las" ? "#e8f5e9" : f.source === "fla" ? "#e3f2fd" : "#fff3e0",
                  color: f.source === "las" ? "#2e7d32" : f.source === "fla" ? "#1565c0" : "#e65100",
                }}>
                  {sourceLabel(f.source)}
                </span>
                <select
                  value={f.source}
                  onChange={(e) => setFiles((prev) => prev.map((pf, pi) => pi === i ? { ...pf, source: e.target.value } : pf))}
                  className="filter-select"
                  style={{ width: "auto", minWidth: 120 }}
                >
                  {BILLING_SOURCES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <button className="btn btn-ghost btn-sm" onClick={() => setFiles((prev) => prev.filter((_, pi) => pi !== i))}>
                  <Icons.Trash />
                </button>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={clearExisting} onChange={(e) => setClearExisting(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
                Clear sample data before importing (recommended)
              </label>
              <button className="btn btn-primary" onClick={handleImport} disabled={importing}>
                {importing ? "Reading files..." : `Scan ${files.length} File${files.length !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: "var(--danger-light)", color: "var(--danger)", padding: 12, borderRadius: "var(--radius-sm)", marginTop: 12, fontSize: 13 }}>
            Error: {error}
          </div>
        )}
      </div>

      {/* Preview / Confirmation */}
      {preview && (
        <div className="card" style={{ padding: 20, marginBottom: 20, border: "2px solid var(--accent)" }}>
          <h4 style={{ fontFamily: "var(--font-display)", marginBottom: 16, color: "var(--accent)" }}>Import Preview</h4>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Files", value: preview.filesProcessed },
              { label: "Year Sheets", value: preview.sheetsProcessed },
              { label: "Total Rows", value: preview.rowsFound },
              { label: "To Import", value: preview.rowsImported },
              { label: "Attorneys", value: preview.lawyersFound },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center", padding: 12, background: "var(--accent-lighter)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>By Source:</div>
            {Object.entries(preview.sources).map(([source, count]) => (
              <div key={source} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span>{source}</span>
                <span style={{ fontWeight: 600 }}>{count} cases</span>
              </div>
            ))}
          </div>

          {/* Sample data preview */}
          {parsedRows.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Sample Data (first 10 rows):</div>
              <div className="table-wrap" style={{ maxHeight: 280, overflowY: "auto" }}>
                <table style={{ fontSize: 11 }}>
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Client</th>
                      <th>Attorney</th>
                      <th>Service</th>
                      <th>Rate</th>
                      <th>Unit</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.slice(0, 10).map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{r.invoice || "—"}</td>
                        <td>{r.client || "—"}</td>
                        <td>{r.attorney || "—"}</td>
                        <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.product || "—"}</td>
                        <td>{r.rate || "—"}</td>
                        <td>{r.unit || "—"}</td>
                        <td style={{ textAlign: "right" }}>{r.total ? formatCurrency(r.total) : "—"}</td>
                        <td>
                          <span className="badge" style={{
                            background: r.status === "Paid" ? "#e8f5e9" : r.status === "Billed" ? "#fff3e0" : "#e3f2fd",
                            color: r.status === "Paid" ? "#2e7d32" : r.status === "Billed" ? "#e65100" : "#1565c0",
                            fontSize: 10,
                          }}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 10 && (
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                  ...and {parsedRows.length - 10} more rows
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" onClick={() => setPreview(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={confirmImport}>
              <Icons.Check /> Confirm Import
            </button>
          </div>
        </div>
      )}

      {/* Previous import stats */}
      {importStats && !preview && (
        <div className="card" style={{ padding: 20 }}>
          <h4 style={{ fontFamily: "var(--font-display)", marginBottom: 8 }}>Last Import</h4>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Imported from {importStats.filesProcessed} file{importStats.filesProcessed !== 1 ? "s" : ""}. 
            Currently {currentClientCount} total cases in the system.
          </p>
        </div>
      )}

      {/* Column mapping reference */}
      <div className="card" style={{ padding: 20 }}>
        <h4 style={{ fontFamily: "var(--font-display)", marginBottom: 12 }}>Column Mapping Reference</h4>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12 }}>
          NurseBill automatically maps your Excel columns. Here's what it looks for:
        </p>
        <div className="table-wrap">
          <table style={{ fontSize: 12 }}>
            <thead>
              <tr>
                <th>App Field</th>
                <th>Your Excel Column(s)</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Invoice No", "Invoice", "H001, FLA025, VA001"],
                ["Attorney", "Attorney", "Christine Wang"],
                ["Client", "Client", "Trevor Lancaster"],
                ["Case/Docket", "Identifier, Book/Case/Docket", "IND-70829-25"],
                ["Service", "Description of Services, Product", "Review of medical records and verbal report"],
                ["Rate", "Rate, Rate/Estimate", "$300/h"],
                ["Units", "Unit, Hours", "3h, min, minimum"],
                ["Total", "Total", "900"],
                ["Pro Bono", "Pro Bono", "300"],
                ["Total Billed", "Total Billed", "600"],
                ["Date Paid", "Date Paid", "1.28.26"],
                ["Outcome", "Outcome, Result", "charges dropped, took a plea"],
                ["Status", "Auto-detected from section headers", "PAID → Paid, BILLED → Billed"],
              ].map(([field, col, example]) => (
                <tr key={field}>
                  <td style={{ fontWeight: 600 }}>{field}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 11 }}>{col}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("cases");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [invoiceClient, setInvoiceClient] = useState(null);
  const [toast, setToast] = useState(null);

  const [clients, setClients] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [emails, setEmails] = useState([]);
  const [events, setEvents] = useState([]);
  const [importStats, setImportStats] = useState(null);
  const [gmailClientId, setGmailClientId] = useState(GMAIL_CLIENT_ID);
  const [dashboardName, setDashboardName] = useState("Jennifer Grossman BSN, RN, LNC");
  const [syncFolder, setSyncFolder] = useState("");
  const gmail = useGmail();
  const gcal  = useGoogleCalendar();

  const showToast = (msg, type = "success") => setToast({ msg, type });

  // ─── Google Calendar two-way poll ─────────────────────────────────────────
  // Runs every 5 minutes and on window focus. Applies any changes made in
  // Google Calendar (moved/deleted events) back to NurseBill client records.
  const applyCalendarChanges = useCallback(async () => {
    if (!gcal.isConnected) return;
    const changes = await gcal.pollChanges();
    if (changes.length === 0) return;
    setClients((prev) => prev.map((c) => {
      const change = changes.find((ch) => ch.clientId === c.id);
      if (!change) return c;
      return { ...c, dueDate: change.dueDate ?? c.dueDate, gcalEventId: change.gcalEventId ?? null };
    }));
    if (selectedCase) {
      const change = changes.find((ch) => ch.clientId === selectedCase.id);
      if (change) setSelectedCase((prev) => prev ? { ...prev, dueDate: change.dueDate ?? prev.dueDate, gcalEventId: change.gcalEventId ?? null } : prev);
    }
  }, [gcal.isConnected, gcal.pollChanges, selectedCase]);

  useEffect(() => {
    if (!gcal.isConnected) return;
    // Poll immediately on connect, then every 5 minutes
    applyCalendarChanges();
    const id = setInterval(applyCalendarChanges, 5 * 60 * 1000);
    // Also poll on window focus (when user switches back from GCal)
    window.addEventListener("focus", applyCalendarChanges);
    return () => { clearInterval(id); window.removeEventListener("focus", applyCalendarChanges); };
  }, [gcal.isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectCase = (c) => setSelectedCase(c);
  const handleBackFromCase = () => setSelectedCase(null);

  // Update any field on a client record
  const handleUpdateClient = (clientId, updates) => {
    setClients((prev) => prev.map((c) => c.id === clientId ? { ...c, ...updates } : c));
    // If we're viewing this case, update the selected case too
    if (selectedCase?.id === clientId) {
      setSelectedCase((prev) => prev ? { ...prev, ...updates } : prev);
    }
  };

  const handleGenerateInvoice = (client) => {
    setInvoiceClient(client);
    setActiveTab("invoices");
  };

  const handleIntakeSave = (form) => {
    const newLawyerId = `l${Date.now()}`;
    const existingLawyer = lawyers.find((l) => l.name === form.lawyerName);
    const newClient = {
      id: `c${Date.now()}`,
      name: form.clientName,
      lawyerId: existingLawyer?.id || newLawyerId,
      county: form.county,
      caseType: form.caseType,
      status: "Active",
      dateOpened: new Date().toISOString().split("T")[0],
      balance: 0,
      caseNumber: form.caseNumber || null,
      court: form.court || null,
      nextHearing: form.nextHearing || null,
      source: existingLawyer?.source || "ind",
      invoiceNo: "",
      rate: HOURLY_RATE,
      unit: null,
      total: null,
      proBono: 0,
      totalBilled: null,
      datePaid: null,
      product: "",
      outcome: "",
      mitigationSpecialist: form.mitigationSpecialist || "",
      dueDate: form.dueDate || "",
      dateBilled: form.dateBilled || "",
      notes: form.notes || "",
    };
    setClients((prev) => [...prev, newClient]);
    showToast("Intake saved! New case created.");
    setActiveTab("cases");
  };

  // ─── EXCEL IMPORT HANDLER ──────────────────────────────────────────────
  const handleImportComplete = ({ importedClients, importedLawyers, stats, clearExisting }) => {
    if (clearExisting) {
      // Replace all data with imported data
      setLawyers(importedLawyers);
      setClients(importedClients);
    } else {
      // Merge lawyers (avoid duplicates by name)
      setLawyers((prev) => {
        const existing = new Set(prev.map((l) => l.name.toLowerCase()));
        const newLawyers = importedLawyers.filter((l) => !existing.has(l.name.toLowerCase()));
        return [...prev, ...newLawyers];
      });
      // Merge clients — deduplicate by name + caseNumber (or name + invoiceNo)
      setClients((prev) => {
        const existingKeys = new Set(
          prev.map((c) => `${c.name.toLowerCase()}|${(c.caseNumber || c.invoiceNo || "").toLowerCase()}`)
        );
        return [...prev, ...importedClients.filter((c) => {
          const key = `${c.name.toLowerCase()}|${(c.caseNumber || c.invoiceNo || "").toLowerCase()}`;
          return !existingKeys.has(key);
        })];
      });
    }
    const skipped = clients.filter((c) => {
      const key = `${c.name.toLowerCase()}|${(c.caseNumber || c.invoiceNo || "").toLowerCase()}`;
      return importedClients.some((ic) => `${ic.name.toLowerCase()}|${(ic.caseNumber || ic.invoiceNo || "").toLowerCase()}` === key);
    }).length;
    setImportStats(stats);
    const skipMsg = skipped > 0 ? `, skipped ${skipped} duplicate${skipped !== 1 ? "s" : ""}` : "";
    showToast(`Imported ${importedClients.length - skipped} cases from ${stats.filesProcessed} file${stats.filesProcessed !== 1 ? "s" : ""}${skipMsg}!`);
    setActiveTab("cases");
  };

  const handleClearAll = () => {
    setClients([]);
    setLawyers([]);
    setEmails([]);
    setEvents([]);
    setImportStats(null);
    setSelectedCase(null);
    showToast("All data cleared.", "info");
    setActiveTab("cases");
  };

  const handleDeleteClient = (clientId) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    setEvents((prev) => prev.filter((e) => e.clientId !== clientId));
    setEmails((prev) => prev.filter((e) => e.clientId !== clientId));
    showToast("Case deleted.");
  };

  const activeCases = clients.filter((c) => c.status === "Active").length;
  const totalBilled = clients.reduce((s, c) => s + (c.totalBilled || 0), 0);
  const totalOutstanding = clients.filter((c) => c.status === "Billed").reduce((s, c) => s + (c.totalBilled || 0), 0);

  const tabs = [
    { id: "cases", label: "Cases", icon: <Icons.Folder /> },
    { id: "intake", label: "New Intake", icon: <Icons.Clipboard /> },
    { id: "calendar", label: "Calendar", icon: <Icons.Calendar /> },
    { id: "uploads", label: "Uploads", icon: <Icons.Upload /> },
    { id: "invoices", label: "Invoices", icon: <Icons.Invoice /> },
    { id: "import", label: "Import Data", icon: <Icons.File /> },
    { id: "settings", label: "Settings", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  ];

  const tabTitles = {
    cases: selectedCase ? "Case Detail" : "Case Management",
    intake: "Client Intake",
    calendar: "Calendar & Scheduling",
    uploads: "File Uploads & Hightail",
    invoices: "Invoice Generator",
    import: "Import Billing Data",
    settings: "Settings",
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Sidebar */}
        <nav className="sidebar">
          <div className="sidebar-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <img src={LOGO_URL} alt="NurseBill" style={{ height: 32, width: "auto", flexShrink: 0, filter: "drop-shadow(0 0 6px rgba(139,92,246,0.4))" }} />
              <div>
                <h1>NurseBill</h1>
              </div>
            </div>
            <p>{dashboardName}</p>
          </div>
          <div className="sidebar-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedCase(null);
                  if (tab.id !== "invoices") setInvoiceClient(null);
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="sidebar-stats">
            <div className="stat-row">
              <span className="label">Active Cases</span>
              <span className="value">{activeCases}</span>
            </div>
            <div className="stat-row">
              <span className="label">Attorneys</span>
              <span className="value">{lawyers.length}</span>
            </div>
            <div className="stat-row">
              <span className="label">Total Billed</span>
              <span className="value">{formatCurrency(totalBilled)}</span>
            </div>
            <div className="stat-row">
              <span className="label">Outstanding</span>
              <span className="value">{formatCurrency(totalOutstanding)}</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main">
          <header className="topbar">
            <h2 className="topbar-title">{tabTitles[activeTab]}</h2>
            <div className="topbar-actions">
              {activeTab === "cases" && !selectedCase && (
                <div className="search-box">
                  <Icons.Search />
                  <input
                    placeholder="Search cases, lawyers, invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}
              {activeTab === "cases" && !selectedCase && (
                <button className="btn btn-primary" onClick={() => setActiveTab("intake")}>
                  <Icons.Plus /> New Intake
                </button>
              )}
            </div>
          </header>

          <div className="content">
            {activeTab === "cases" && !selectedCase && (
              <CasesTab
                clients={clients}
                lawyers={lawyers}
                onSelectCase={handleSelectCase}
                onUpdateClient={handleUpdateClient}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}
            {activeTab === "cases" && selectedCase && (
              <CaseDetail
                client={selectedCase}
                lawyer={lawyers.find((l) => l.id === selectedCase.lawyerId)}
                emails={emails}
                events={events}
                onBack={handleBackFromCase}
                onGenerateInvoice={handleGenerateInvoice}
                onUpdateClient={handleUpdateClient}
                onAddEvent={(ev) => setEvents(prev => [...prev, ev])}
                onDeleteClient={handleDeleteClient}
                gmail={gmail}
                gcal={gcal}
                gmailClientId={gmailClientId}
                setGmailClientId={setGmailClientId}
                onAddEmails={(newEmails) => setEmails(prev => [...prev, ...newEmails])}
              />
            )}
            {activeTab === "intake" && (
              <IntakeTab lawyers={lawyers} clients={clients} onSave={handleIntakeSave} />
            )}
            {activeTab === "calendar" && (
              <CalendarTab events={events} clients={clients} />
            )}
            {activeTab === "uploads" && (
              <UploadTab clients={clients} lawyers={lawyers} />
            )}
            {activeTab === "invoices" && (
              <InvoiceTab
                clients={clients}
                lawyers={lawyers}
                events={events}
                emails={emails}
                preselectedClient={invoiceClient}
                gmail={gmail}
              />
            )}
            {activeTab === "import" && (
              <ImportTab
                onImportComplete={handleImportComplete}
                importStats={importStats}
                currentClientCount={clients.length}
              />
            )}
            {activeTab === "settings" && (
              <SettingsTab
                dashboardName={dashboardName}
                setDashboardName={setDashboardName}
                clients={clients}
                lawyers={lawyers}
                onClearAll={handleClearAll}
                syncFolder={syncFolder}
                onChangeSyncFolder={setSyncFolder}
                gcal={gcal}
                gmailClientId={gmailClientId}
              />
            )}
          </div>
        </main>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
