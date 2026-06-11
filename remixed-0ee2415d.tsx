import { useState, useEffect, useRef } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────

const SITES_DATA = [
  { name: "Factory A — Pune",        present: 312, total: 340 },
  { name: "Warehouse B — Delhi",     present: 98,  total: 112 },
  { name: "Construction C — Mumbai", present: 187, total: 210 },
  { name: "Logistics D — Chennai",   present: 64,  total: 70  },
  { name: "Security E — Hyderabad",  present: 45,  total: 50  },
];

const CONTRACTORS = [
  { name: "In2IT Services Pvt Ltd",  id: "COR-2024-001", workers: 342, licence: "Valid – Dec 2026",    pf: "PF/MH/2019/1234", esi: "51000120456", status: "Active"  },
  { name: "Manpower Corp Ltd",       id: "COR-2023-089", workers: 218, licence: "Valid – Mar 2026",    pf: "PF/DL/2020/5678", esi: "51000187231", status: "Active"  },
  { name: "SecureStaff Solutions",   id: "COR-2024-015", workers: 89,  licence: "Expiring Aug 2026",   pf: "PF/MH/2021/9012", esi: "51000198712", status: "Review"  },
  { name: "BuildForce India",        id: "COR-2022-201", workers: 156, licence: "Expired!",            pf: "PF/MH/2018/3456", esi: "Not registered", status: "Expired" },
];

const EMPLOYEES = [
  { name: "Rajesh Kumar",  id: "EMP-001", contractor: "In2IT Services",  site: "Factory A — Pune",       skill: "Skilled",       type: "Monthly contract", expiry: "31 Dec 2026" },
  { name: "Priya Sharma",  id: "EMP-002", contractor: "Manpower Corp",   site: "Warehouse B — Delhi",    skill: "Semi-skilled",  type: "Daily wage",       expiry: "Ongoing"     },
  { name: "Mohammed Ali",  id: "EMP-003", contractor: "SecureStaff",     site: "Construction C",         skill: "Unskilled",     type: "Fixed-term",       expiry: "30 Sep 2026" },
  { name: "Sunita Devi",   id: "EMP-004", contractor: "In2IT Services",  site: "Logistics D — Chennai",  skill: "Highly skilled",type: "Outsourced",        expiry: "31 Mar 2027" },
  { name: "Arun Singh",    id: "EMP-005", contractor: "BuildForce India", site: "Security E — Hyderabad",skill: "Skilled",       type: "Project-based",    expiry: "15 Nov 2026" },
  { name: "Deepa Nair",    id: "EMP-006", contractor: "Manpower Corp",   site: "Factory A — Pune",       skill: "Semi-skilled",  type: "Monthly contract", expiry: "31 Dec 2026" },
];

const ATTENDANCE_LOG = [
  { name: "Rajesh Kumar", time: "08:02 AM", site: "Factory A",   face: true,  gps: true,  status: "Present" },
  { name: "Priya Sharma", time: "08:14 AM", site: "Warehouse B", face: true,  gps: true,  status: "Present" },
  { name: "Mohammed Ali", time: "08:31 AM", site: "Const. C",    face: true,  gps: true,  status: "Present" },
  { name: "Arun Singh",   time: "—",        site: "Security E",  face: false, gps: false, status: "Absent"  },
  { name: "Vijay Mehta",  time: "07:55 AM", site: "Factory A",   face: true,  gps: true,  status: "Present" },
  { name: "Deepa Nair",   time: "09:01 AM", site: "Logistics D", face: true,  gps: true,  status: "Late"    },
];

const OT_REGISTER = [
  { name: "Rajesh Kumar", type: "Public holiday", hours: "8h", amount: "₹2,885", status: "Approved" },
  { name: "Priya Sharma", type: "Weekly off",     hours: "4h", amount: "₹1,154", status: "Pending"  },
  { name: "Mohammed Ali", type: "Addl. shift",    hours: "6h", amount: "₹1,300", status: "Approved" },
  { name: "Sunita Devi",  type: "Public holiday", hours: "8h", amount: "₹3,462", status: "Approved" },
  { name: "Vijay Mehta",  type: "Weekly off",     hours: "3h", amount: "₹866",   status: "Pending"  },
];

const PAYROLL_DATA = [
  { name: "Rajesh Kumar", basic: "₹22,000", ot: "₹2,885", allow: "₹4,500", net: "₹29,385", status: "Processed" },
  { name: "Priya Sharma", basic: "₹18,000", ot: "₹1,154", allow: "₹3,200", net: "₹22,354", status: "Pending"   },
  { name: "Mohammed Ali", basic: "₹16,000", ot: "₹1,300", allow: "₹2,800", net: "₹20,100", status: "Processed" },
  { name: "Sunita Devi",  basic: "₹28,000", ot: "₹3,462", allow: "₹5,500", net: "₹36,962", status: "Processed" },
  { name: "Vijay Mehta",  basic: "₹20,000", ot: "₹866",   allow: "₹3,800", net: "₹24,666", status: "Pending"   },
];

const APPROVALS_DATA = [
  { name: "Priya Sharma",  site: "Warehouse B",  type: "Weekly off",     hours: "4h", amount: "₹1,154", date: "10 Jun" },
  { name: "Vijay Mehta",   site: "Factory A",    type: "Weekly off",     hours: "3h", amount: "₹866",   date: "10 Jun" },
  { name: "Anil Rao",      site: "Const. C",     type: "Public holiday", hours: "8h", amount: "₹2,308", date: "09 Jun" },
  { name: "Deepa Nair",    site: "Logistics D",  type: "Addl. shift",    hours: "5h", amount: "₹1,082", date: "09 Jun" },
  { name: "Suresh Kumar",  site: "Security E",   type: "Weekly off",     hours: "6h", amount: "₹1,298", date: "08 Jun" },
];

const CHANNELS = [
  { icon: "📱", name: "Mobile app",       desc: "Full-featured GPS check-in, OT, payslip — Android & iOS" },
  { icon: "💬", name: "WhatsApp bot",     desc: "ATTENDANCE · SALARY · SHIFT keyword commands via Business API" },
  { icon: "📨", name: "SMS attendance",   desc: "Basic phones: send IN or OUT to company number" },
  { icon: "📞", name: "IVR voice",        desc: "Press 1 Check-In, 2 Check-Out — 11 languages supported" },
  { icon: "📳", name: "Missed call",      desc: "Dial → auto-detect → mark attendance → SMS confirm" },
  { icon: "🖥️", name: "Supervisor kiosk",desc: "Tablet bulk-attendance for workers without phones" },
];

const LANGUAGES = ["English","Hindi","Tamil","Telugu","Kannada","Malayalam","Marathi","Bengali","Gujarati","Punjabi","Arabic"];

const SMS_TEMPLATES = [
  { title: "Attendance confirmed", msg: "Attendance marked at Factory A at 08:03 AM.", variant: "green"  },
  { title: "OT approved",          msg: "Overtime approved: 4 hrs, ₹1,442 added to payroll.", variant: "teal"   },
  { title: "Contract expiry",      msg: "Your contract expires in 15 days. Contact HR.", variant: "amber"  },
  { title: "Geo-fence rejected",   msg: "Attendance rejected — outside assigned work location.", variant: "red"    },
  { title: "Salary credited",      msg: "Net pay ₹29,385 credited. Bank: XXXX1234.", variant: "blue"   },
];

const MOB_SCREENS = [
  { title: "Dashboard",   sub: "Today's overview",    color: "#0D9488", rows: [["Shift","08:00 – 17:00"],["Status","Checked in ✓"],["Site","Factory A, Pune"],["OT today","1.5 hrs"]],     cta: "View schedule"      },
  { title: "Attendance",  sub: "GPS · Selfie · Face", color: "#185FA5", rows: [["GPS","12.97°N 77.59°E"],["Geo-fence","Inside ✓"],["Selfie","Captured ✓"],["Face match","Verified ✓"]], cta: "Check out"          },
  { title: "Overtime",    sub: "Requests & history",  color: "#534AB7", rows: [["Pending","2 requests"],["Approved","₹4,039"],["This month","12 hrs OT"],["Type","Public holiday"]],    cta: "Request OT"         },
  { title: "My pay",      sub: "June 2026",            color: "#854F0B", rows: [["Basic","₹22,000"],["OT earned","₹2,885"],["Net pay","₹29,385"],["Bank","XXXX1234"]],                  cta: "Download payslip"   },
];

const MOB_FEATURES = [
  { icon: "📍", title: "GPS check-in / out",     desc: "Geo-validated, sub-10s flow" },
  { icon: "🤳", title: "Selfie attendance",       desc: "Liveness + face match, anti-spoof" },
  { icon: "⏱️", title: "OT request & tracking",  desc: "Submit, track, notifications" },
  { icon: "🧾", title: "Payslip access",          desc: "View & download salary breakdown" },
  { icon: "📅", title: "Shift calendar",          desc: "Schedule, swaps, weekly off" },
  { icon: "🔔", title: "Push notifications",      desc: "OT approvals, shift reminders" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const AV_COLORS = [
  { bg: "#E1F5EE", tx: "#085041" },
  { bg: "#E6F1FB", tx: "#0C447C" },
  { bg: "#EEEDFE", tx: "#3C3489" },
  { bg: "#FAEEDA", tx: "#633806" },
  { bg: "#EAF3DE", tx: "#27500A" },
];

function Avatar({ name, idx = 0, size = 30 }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2);
  const { bg, tx } = AV_COLORS[idx % AV_COLORS.length];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: tx,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 500, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

const BADGE_STYLES = {
  teal:   { bg: "#E1F5EE", tx: "#085041" },
  green:  { bg: "#EAF3DE", tx: "#27500A" },
  amber:  { bg: "#FAEEDA", tx: "#633806" },
  red:    { bg: "#FCEBEB", tx: "#791F1F" },
  blue:   { bg: "#E6F1FB", tx: "#0C447C" },
  purple: { bg: "#EEEDFE", tx: "#3C3489" },
  gray:   { bg: "#F1EFE8", tx: "#5F5E5A" },
};

function Badge({ label, variant = "teal" }) {
  const { bg, tx } = BADGE_STYLES[variant] || BADGE_STYLES.gray;
  return (
    <span style={{ background: bg, color: tx, fontSize: 10, fontWeight: 500,
      padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap", display: "inline-block" }}>
      {label}
    </span>
  );
}

function statusVariant(s) {
  if (!s) return "gray";
  const l = s.toLowerCase();
  if (l.includes("approved") || l.includes("processed") || l.includes("active") || l.includes("present") || l.includes("valid –")) return "green";
  if (l.includes("pending") || l.includes("late") || l.includes("expiring") || l.includes("review")) return "amber";
  if (l.includes("absent") || l.includes("expired") || l.includes("rejected")) return "red";
  if (l.includes("highly")) return "purple";
  if (l.includes("skilled")) return "teal";
  if (l.includes("semi")) return "blue";
  if (l.includes("unskilled")) return "amber";
  return "gray";
}

function otTypeVariant(t) {
  if (!t) return "gray";
  if (t.toLowerCase().includes("holiday")) return "red";
  if (t.toLowerCase().includes("weekly") || t.toLowerCase().includes("off")) return "teal";
  return "blue";
}

function ProgressBar({ value, color = "#0D9488" }) {
  return (
    <div style={{ height: 5, background: "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 3 }} />
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: "#fff", border: "0.5px solid #E2E8F0", borderRadius: 12,
      padding: 16, ...style }}>
      {children}
    </div>
  );
}

function CardHead({ title, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#0B1F3A" }}>{title}</span>
      {right}
    </div>
  );
}

function KpiCard({ label, value, sub, valueColor = "#0B1F3A" }) {
  return (
    <div style={{ background: "#fff", border: "0.5px solid #E2E8F0", borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ fontSize: 11, color: "#64748B", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: valueColor, lineHeight: 1, marginBottom: 3 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: "#94A3B8" }}>{sub}</div>}
    </div>
  );
}

function Btn({ children, primary, sm, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: sm ? 11 : 12, fontWeight: 500,
      padding: sm ? "5px 10px" : "7px 14px",
      borderRadius: 8, border: primary ? "none" : "0.5px solid #E2E8F0",
      background: primary ? "#0D9488" : "#fff", color: primary ? "#fff" : "#0B1F3A",
      cursor: "pointer", whiteSpace: "nowrap", ...style
    }}>
      {children}
    </button>
  );
}

function FldIn({ label, value, onChange, type = "text", options }) {
  const shared = {
    fontSize: 12, padding: "7px 10px", border: "0.5px solid #E2E8F0",
    borderRadius: 8, width: "100%", color: "#0B1F3A", background: "#fff"
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <label style={{ fontSize: 11, fontWeight: 500, color: "#64748B" }}>{label}</label>
      {options
        ? <select style={shared} value={value} onChange={e => onChange(e.target.value)}>
            {options.map(o => <option key={o}>{o}</option>)}
          </select>
        : <input style={shared} type={type} value={value} onChange={e => onChange(e.target.value)} />
      }
    </div>
  );
}

// ─── Mini bar chart (pure SVG, no external deps) ─────────────────────────────

function BarChart({ data, labels, color = "#0D9488", min = 80, max = 100, unit = "%" }) {
  const W = 520, H = 130, PAD = 28, BAR_W = 40, GAP = (W - PAD * 2 - BAR_W * data.length) / (data.length - 1);
  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} style={{ width: "100%", display: "block" }} role="img" aria-label="Bar chart">
      {data.map((v, i) => {
        const pct = (v - min) / (max - min);
        const bh = Math.max(pct * H, 4);
        const x = PAD + i * (BAR_W + GAP);
        const y = H - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={BAR_W} height={bh} rx={4} fill={color} opacity={i === data.length - 1 ? 0.4 : 1} />
            <text x={x + BAR_W / 2} y={H + 16} textAnchor="middle" fontSize={11} fill="#94A3B8">{labels[i]}</text>
            <text x={x + BAR_W / 2} y={y - 5}  textAnchor="middle" fontSize={10} fill="#0D9488">{v}{unit}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({ data, labels, color = "#0D9488" }) {
  const W = 420, H = 120, PAD = 24;
  const minV = Math.min(...data) - 5, maxV = Math.max(...data) + 5;
  const pts = data.map((v, i) => {
    const x = PAD + i * (W - PAD * 2) / (data.length - 1);
    const y = H - ((v - minV) / (maxV - minV)) * H;
    return [x, y];
  });
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const fill = [...pts, [pts[pts.length - 1][0], H], [pts[0][0], H]].map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + "Z";
  return (
    <svg viewBox={`0 0 ${W} ${H + 28}`} style={{ width: "100%", display: "block" }} role="img" aria-label="Line chart">
      <path d={fill} fill={color} fillOpacity={0.1} />
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={4} fill={color} />
          <text x={x} y={H + 18} textAnchor="middle" fontSize={11} fill="#94A3B8">{labels[i]}</text>
        </g>
      ))}
    </svg>
  );
}

function DonutChart({ data, colors, labels }) {
  const total = data.reduce((a, b) => a + b, 0);
  let angle = -Math.PI / 2;
  const slices = data.map((v, i) => {
    const sweep = (v / total) * 2 * Math.PI;
    const x1 = 60 + 50 * Math.cos(angle), y1 = 60 + 50 * Math.sin(angle);
    angle += sweep;
    const x2 = 60 + 50 * Math.cos(angle), y2 = 60 + 50 * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return { path: `M60,60 L${x1},${y1} A50,50 0 ${large},1 ${x2},${y2} Z`, color: colors[i], label: labels[i], pct: Math.round(v / total * 100) };
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg viewBox="0 0 120 120" style={{ width: 100, flexShrink: 0 }}>
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
        <circle cx={60} cy={60} r={30} fill="#fff" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ color: "#64748B" }}>{s.label}</span>
            <span style={{ fontWeight: 500, color: "#0B1F3A" }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GeoFence Visual ─────────────────────────────────────────────────────────

function GeoFenceMap() {
  return (
    <div style={{ background: "#0F2744", borderRadius: 10, padding: 16, height: 190, position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {[160, 110, 64].map((sz, i) => (
        <div key={i} style={{ position: "absolute", width: sz, height: sz, borderRadius: "50%",
          border: `${i === 2 ? 2 : 1.5}px solid rgba(13,148,136,${0.2 + i * 0.15})`,
          background: `rgba(13,148,136,${0.03 + i * 0.04})` }} />
      ))}
      <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#0D9488", position: "relative", zIndex: 3 }} />
      {[{ top: "28%", left: "38%" }, { top: "58%", left: "62%" }, { top: "70%", left: "44%" }].map((pos, i) => (
        <div key={i} style={{ position: "absolute", width: 9, height: 9, borderRadius: "50%", background: "#4ADE80", ...pos }} />
      ))}
      {[{ top: "18%", left: "18%" }, { top: "76%", left: "76%" }].map((pos, i) => (
        <div key={i} style={{ position: "absolute", width: 9, height: 9, borderRadius: "50%", background: "#F87171", ...pos }} />
      ))}
    </div>
  );
}

// ─── Step Chain ──────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Employee",     state: "done"    },
  { label: "Supervisor",   state: "done"    },
  { label: "Site manager", state: "done"    },
  { label: "HR exec",      state: "current" },
  { label: "Payroll",      state: "pending" },
];

function StepChain() {
  const dotStyle = (state) => {
    if (state === "done")    return { bg: "#0D9488", tx: "#fff", border: "#0D9488" };
    if (state === "current") return { bg: "#FAEEDA", tx: "#633806", border: "#BA7517" };
    return { bg: "#F1EFE8", tx: "#94A3B8", border: "#E2E8F0" };
  };
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "16px 8px 8px" }}>
      {STEPS.map((s, i) => {
        const ds = dotStyle(s.state);
        const connColor = i < STEPS.length - 1 && STEPS[i].state === "done" && STEPS[i + 1].state !== "pending" ? "#0D9488" : "#E2E8F0";
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: ds.bg, color: ds.tx,
                border: `1.5px solid ${ds.border}`, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 12, fontWeight: 500 }}>
                {s.state === "done" ? "✓" : i + 1}
              </div>
              <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 5, textAlign: "center", maxWidth: 60 }}>{s.label}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1.5, background: connColor, marginTop: -18 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── OT Calculator ───────────────────────────────────────────────────────────

function OTCalculator() {
  const [salary, setSalary] = useState("30000");
  const [days,   setDays]   = useState("26");
  const [dHours, setDHours] = useState("8");
  const [otHrs,  setOtHrs]  = useState("4");
  const [otType, setOtType] = useState("2.5");

  const sal  = parseFloat(salary) || 0;
  const d    = parseFloat(days)   || 1;
  const dh   = parseFloat(dHours) || 1;
  const hrs  = parseFloat(otHrs)  || 0;
  const mult = parseFloat(otType) || 1.5;
  const hr   = sal / d / dh;
  const total = Math.round(hr * mult * hrs);

  return (
    <div style={{ background: "#fff", border: "0.5px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: "#0B1F3A", marginBottom: 12 }}>Live OT calculator</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <FldIn label="Monthly salary (₹)" value={salary} onChange={setSalary} />
        <FldIn label="Working days"       value={days}   onChange={setDays}   />
        <FldIn label="Daily hours"        value={dHours} onChange={setDHours} />
        <FldIn label="OT hours"           value={otHrs}  onChange={setOtHrs}  type="number" />
      </div>
      <div style={{ marginBottom: 12 }}>
        <FldIn label="OT type" value={otType} onChange={setOtType} options={["1.5","2.0","2.5"]}
        />
        <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 3 }}>
          1.5 = Additional shift · 2.0 = Weekly off · 2.5 = Public holiday
        </div>
      </div>
      <div style={{ background: "#E1F5EE", border: "0.5px solid #0D9488", borderRadius: 10, padding: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
          <span style={{ color: "#64748B" }}>Hourly rate</span>
          <span style={{ fontWeight: 500, color: "#0B1F3A" }}>₹{hr.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
          <span style={{ color: "#64748B" }}>Multiplier</span>
          <span style={{ fontWeight: 500, color: "#0B1F3A" }}>×{mult.toFixed(1)}</span>
        </div>
        <div style={{ borderTop: "0.5px solid #0D9488", paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#085041" }}>OT amount</span>
          <span style={{ fontSize: 22, fontWeight: 500, color: "#0D9488" }}>₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Approvals with live state ────────────────────────────────────────────────

function ApprovalsPage() {
  const [rows, setRows] = useState(APPROVALS_DATA.map(r => ({ ...r, state: "pending" })));

  function approve(i) { setRows(r => r.map((x, j) => j === i ? { ...x, state: "approved" } : x)); }
  function reject(i)  { setRows(r => r.map((x, j) => j === i ? { ...x, state: "rejected" } : x)); }
  function bulkApprove() { setRows(r => r.map(x => x.state === "pending" ? { ...x, state: "approved" } : x)); }

  const pending = rows.filter(r => r.state === "pending").length;

  return (
    <div>
      <Card style={{ marginBottom: 12 }}>
        <CardHead title="Approval workflow" right={<Badge label="5-level chain" variant="teal" />} />
        <StepChain />
      </Card>
      <Card>
        <CardHead
          title="Pending OT approvals"
          right={
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Btn sm onClick={bulkApprove} style={{ color: "#3B6D11", borderColor: "#3B6D11" }}>✓ Bulk approve</Btn>
              <Badge label={`${pending} pending`} variant={pending > 0 ? "amber" : "green"} />
            </div>
          }
        />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["Employee","Site","OT type","Hours","Amount","Submitted","Actions"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "7px 10px", fontSize: 10, fontWeight: 500,
                    color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px",
                    borderBottom: "0.5px solid #E2E8F0", background: "#F8FAFC" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ opacity: row.state !== "pending" ? 0.45 : 1 }}>
                  <td style={{ padding: "9px 10px", borderBottom: "0.5px solid #E2E8F0", fontWeight: 500 }}>{row.name}</td>
                  <td style={{ padding: "9px 10px", borderBottom: "0.5px solid #E2E8F0", fontSize: 11, color: "#64748B" }}>{row.site}</td>
                  <td style={{ padding: "9px 10px", borderBottom: "0.5px solid #E2E8F0" }}>
                    <Badge label={row.type} variant={otTypeVariant(row.type)} />
                  </td>
                  <td style={{ padding: "9px 10px", borderBottom: "0.5px solid #E2E8F0" }}>{row.hours}</td>
                  <td style={{ padding: "9px 10px", borderBottom: "0.5px solid #E2E8F0", color: "#0D9488", fontWeight: 500 }}>{row.amount}</td>
                  <td style={{ padding: "9px 10px", borderBottom: "0.5px solid #E2E8F0", color: "#94A3B8", fontSize: 11 }}>{row.date}</td>
                  <td style={{ padding: "9px 10px", borderBottom: "0.5px solid #E2E8F0" }}>
                    {row.state === "pending" ? (
                      <div style={{ display: "flex", gap: 5 }}>
                        <Btn sm onClick={() => approve(i)} style={{ color: "#3B6D11", borderColor: "#3B6D11" }}>Approve</Btn>
                        <Btn sm onClick={() => reject(i)}  style={{ color: "#791F1F", borderColor: "#E24B4A" }}>Reject</Btn>
                      </div>
                    ) : (
                      <Badge label={row.state === "approved" ? "Approved" : "Rejected"} variant={row.state === "approved" ? "green" : "red"} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Pages ───────────────────────────────────────────────────────────────────

function DashboardPage() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
        <KpiCard label="Active employees" value="2,847" sub="↑ 12 this week"  valueColor="#0D9488" />
        <KpiCard label="Attendance rate"  value="94.2%" sub="Target 92% ✓"    valueColor="#3B6D11" />
        <KpiCard label="OT cost (June)"   value="₹8.4L" sub="↑ 6% vs May"     valueColor="#BA7517" />
        <KpiCard label="Contracts expiring" value="23"  sub="Within 30 days"  valueColor="#E24B4A" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <Card>
          <CardHead title="Site attendance — today" right={<Badge label="Live" variant="teal" />} />
          {SITES_DATA.map((s, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: "#0B1F3A" }}>{s.name}</span>
                <span style={{ fontWeight: 500, color: "#0B1F3A" }}>{s.present} / {s.total}</span>
              </div>
              <ProgressBar value={Math.round(s.present / s.total * 100)} color={i % 2 === 0 ? "#0D9488" : "#3B6D11"} />
            </div>
          ))}
        </Card>
        <div>
          <Card style={{ marginBottom: 10 }}>
            <CardHead title="Pending actions" right={<Badge label="7 items" variant="amber" />} />
            {[["OT approvals","5 pending","amber"],["Contract renewals","3 due","red"],["Attendance corrections","2 today","blue"],["New onboarding","4 in progress","teal"]].map(([l, v, variant]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #E2E8F0", fontSize: 12 }}>
                <span>{l}</span><Badge label={v} variant={variant} />
              </div>
            ))}
          </Card>
          <Card>
            <CardHead title="Contractor cost vs budget" />
            {CONTRACTORS.slice(0,3).map((c, i) => {
              const pct = [78,91,55][i];
              return (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                    <span>{c.name}</span><span style={{ fontWeight: 500 }}>{pct}%</span>
                  </div>
                  <ProgressBar value={pct} color={pct > 85 ? "#BA7517" : "#0D9488"} />
                </div>
              );
            })}
          </Card>
        </div>
      </div>
      <Card>
        <CardHead title="Attendance trend — this week"
          right={<div style={{ display: "flex", gap: 12, fontSize: 11, color: "#64748B" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, background: "#0D9488", borderRadius: 2, display: "inline-block" }} />Present</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, background: "#E2E8F0", borderRadius: 2, display: "inline-block" }} />Weekend</span>
          </div>}
        />
        <BarChart data={[96,94,95,93,94,88]} labels={["Mon","Tue","Wed","Thu","Fri","Sat"]} />
      </Card>
    </div>
  );
}

function ContractorsPage() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
        <KpiCard label="Active contractors"  value="18" valueColor="#0D9488" />
        <KpiCard label="Fully compliant"     value="15" sub="3 pending review" valueColor="#3B6D11" />
        <KpiCard label="Licences expiring"   value="4"  sub="Within 60 days"  valueColor="#BA7517" />
      </div>
      <Card>
        <CardHead title="Contractor master" right={<Btn primary sm>+ Add contractor</Btn>} />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>{["Contractor","Workers","Labour licence","PF reg.","ESI reg.","Status"].map(h =>
                <th key={h} style={{ textAlign:"left",padding:"7px 10px",fontSize:10,fontWeight:500,color:"#64748B",
                  textTransform:"uppercase",letterSpacing:"0.4px",borderBottom:"0.5px solid #E2E8F0",background:"#F8FAFC" }}>{h}</th>
              )}</tr>
            </thead>
            <tbody>
              {CONTRACTORS.map((c, i) => (
                <tr key={i}>
                  <td style={{ padding:"9px 10px",borderBottom:"0.5px solid #E2E8F0" }}>
                    <div style={{ fontWeight:500 }}>{c.name}</div>
                    <div style={{ fontSize:10,color:"#94A3B8" }}>{c.id}</div>
                  </td>
                  <td style={{ padding:"9px 10px",borderBottom:"0.5px solid #E2E8F0",fontWeight:500 }}>{c.workers}</td>
                  <td style={{ padding:"9px 10px",borderBottom:"0.5px solid #E2E8F0" }}>
                    <Badge label={c.licence} variant={c.licence.includes("Expired!") ? "red" : c.licence.includes("Expiring") ? "amber" : "green"} />
                  </td>
                  <td style={{ padding:"9px 10px",borderBottom:"0.5px solid #E2E8F0",fontSize:11,color:"#64748B" }}>{c.pf}</td>
                  <td style={{ padding:"9px 10px",borderBottom:"0.5px solid #E2E8F0",fontSize:11,color:"#64748B" }}>{c.esi}</td>
                  <td style={{ padding:"9px 10px",borderBottom:"0.5px solid #E2E8F0" }}>
                    <Badge label={c.status} variant={statusVariant(c.status)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("All skill levels");
  const filtered = EMPLOYEES.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.contractor.toLowerCase().includes(search.toLowerCase());
    const matchSkill  = skillFilter === "All skill levels" || e.skill.toLowerCase() === skillFilter.toLowerCase();
    return matchSearch && matchSkill;
  });
  return (
    <div>
      <div style={{ display:"flex",gap:8,marginBottom:12,flexWrap:"wrap" }}>
        <input style={{ flex:1,minWidth:140,fontSize:12,padding:"7px 10px",border:"0.5px solid #E2E8F0",borderRadius:8,color:"#0B1F3A" }}
          placeholder="Search employees…" value={search} onChange={e => setSearch(e.target.value)} />
        <FldIn label="" value={skillFilter} onChange={setSkillFilter}
          options={["All skill levels","Highly skilled","Skilled","Semi-skilled","Unskilled"]} />
      </div>
      <Card>
        <CardHead title="Contract employees" right={<Badge label={`${filtered.length} results`} variant="teal" />} />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
            <thead>
              <tr>{["Employee","Contractor","Site","Skill","Contract type","Expiry","Status"].map(h =>
                <th key={h} style={{ textAlign:"left",padding:"7px 10px",fontSize:10,fontWeight:500,color:"#64748B",
                  textTransform:"uppercase",letterSpacing:"0.4px",borderBottom:"0.5px solid #E2E8F0",background:"#F8FAFC" }}>{h}</th>
              )}</tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={i}>
                  <td style={{ padding:"9px 10px",borderBottom:"0.5px solid #E2E8F0" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <Avatar name={e.name} idx={i} />
                      <div><div style={{ fontWeight:500,fontSize:12 }}>{e.name}</div><div style={{ fontSize:10,color:"#94A3B8" }}>{e.id}</div></div>
                    </div>
                  </td>
                  <td style={{ padding:"9px 10px",borderBottom:"0.5px solid #E2E8F0",fontSize:11 }}>{e.contractor}</td>
                  <td style={{ padding:"9px 10px",borderBottom:"0.5px solid #E2E8F0",fontSize:11 }}>{e.site}</td>
                  <td style={{ padding:"9px 10px",borderBottom:"0.5px solid #E2E8F0" }}><Badge label={e.skill} variant={statusVariant(e.skill)} /></td>
                  <td style={{ padding:"9px 10px",borderBottom:"0.5px solid #E2E8F0",fontSize:11 }}>{e.type}</td>
                  <td style={{ padding:"9px 10px",borderBottom:"0.5px solid #E2E8F0",fontSize:11 }}>{e.expiry}</td>
                  <td style={{ padding:"9px 10px",borderBottom:"0.5px solid #E2E8F0" }}><Badge label="Active" variant="green" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SitesPage() {
  const [fenceType, setFenceType] = useState("Circular");
  const [radius, setRadius] = useState("250");
  const FENCES = [
    { name:"Factory A — Pune",       type:"Circular · 250m", inside:312 },
    { name:"Warehouse B — Delhi",    type:"Polygon · 6 pts", inside:98  },
    { name:"Construction C",         type:"Circular · 100m", inside:187 },
    { name:"Logistics D — Chennai",  type:"Polygon · 8 pts", inside:64  },
  ];
  return (
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
      <div>
        <Card style={{ marginBottom:12 }}>
          <CardHead title="Active geo-fences" right={<Btn primary sm>+ New fence</Btn>} />
          {FENCES.map((f, i) => (
            <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"10px 12px",border:"0.5px solid #E2E8F0",borderRadius:8,marginBottom:8,background:"#fff" }}>
              <div>
                <div style={{ fontWeight:500,fontSize:12 }}>{f.name}</div>
                <div style={{ fontSize:11,color:"#94A3B8",marginTop:2 }}>{f.type}</div>
              </div>
              <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4 }}>
                <Badge label="Active" variant="green" />
                <span style={{ fontSize:11,color:"#0D9488" }}>{f.inside} inside</span>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <CardHead title="Configure fence" />
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12 }}>
            <FldIn label="Site name"    value="Factory A — Pune" onChange={()=>{}} />
            <FldIn label="Fence type"   value={fenceType} onChange={setFenceType} options={["Circular","Polygon","Temporary"]} />
            <FldIn label="Latitude"     value="12.9716" onChange={()=>{}} />
            <FldIn label="Longitude"    value="77.5946" onChange={()=>{}} />
            <FldIn label="Radius (m)"   value={radius}  onChange={setRadius} type="number" />
            <FldIn label="Effective from" value="2026-06-01" onChange={()=>{}} type="date" />
          </div>
          <Btn primary sm>Save fence</Btn>
        </Card>
      </div>
      <Card>
        <CardHead title="Geo-fence visualiser" right={<Badge label="Live" variant="teal" />} />
        <GeoFenceMap />
        <div style={{ display:"flex",gap:16,marginTop:10,fontSize:11,color:"#64748B" }}>
          <span style={{ display:"flex",alignItems:"center",gap:5 }}><span style={{ width:9,height:9,borderRadius:"50%",background:"#4ADE80",display:"inline-block" }} />Inside fence</span>
          <span style={{ display:"flex",alignItems:"center",gap:5 }}><span style={{ width:9,height:9,borderRadius:"50%",background:"#F87171",display:"inline-block" }} />Outside — rejected</span>
        </div>
        <div style={{ marginTop:14 }}>
          <div style={{ fontSize:13,fontWeight:500,color:"#0B1F3A",marginBottom:8 }}>Today's fence events</div>
          {[["08:47 AM","Rajesh Kumar","Outside fence — 180m","amber"],["11:23 AM","Priya Sharma","GPS spoof detected","red"],["09:12 AM","Arun Singh","Checked in — valid","green"]].map(([t,n,d,v],i) => (
            <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"0.5px solid #E2E8F0" }}>
              <div><div style={{ fontWeight:500,fontSize:12 }}>{n}</div><div style={{ fontSize:11,color:"#64748B" }}>{d}</div></div>
              <Badge label={t} variant={v} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AttendancePage() {
  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14 }}>
        <KpiCard label="Present today"       value="2,681" sub="94.2% rate"     valueColor="#3B6D11" />
        <KpiCard label="Absent"              value="166"                         valueColor="#E24B4A" />
        <KpiCard label="Geo-fence violations" value="8"   sub="Today"           valueColor="#BA7517" />
        <KpiCard label="Face verify pass"    value="99.1%"                       valueColor="#0D9488" />
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <Card>
          <CardHead title="Live attendance log" right={<Badge label="Real-time" variant="teal" />} />
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
            <thead><tr>{["Employee","Check-in","Site","Face","GPS","Status"].map(h =>
              <th key={h} style={{ textAlign:"left",padding:"7px 8px",fontSize:10,fontWeight:500,color:"#64748B",
                textTransform:"uppercase",letterSpacing:"0.4px",borderBottom:"0.5px solid #E2E8F0",background:"#F8FAFC" }}>{h}</th>
            )}</tr></thead>
            <tbody>{ATTENDANCE_LOG.map((row, i) => (
              <tr key={i}>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                    <Avatar name={row.name} idx={i} size={26} />
                    <span style={{ fontSize:12,fontWeight:500 }}>{row.name}</span>
                  </div>
                </td>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0",fontWeight:500 }}>{row.time}</td>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0",fontSize:11 }}>{row.site}</td>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0",color:row.face?"#3B6D11":"#94A3B8" }}>{row.face?"✓":"—"}</td>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0",color:row.gps?"#3B6D11":"#94A3B8"  }}>{row.gps ?"✓":"—"}</td>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0" }}><Badge label={row.status} variant={statusVariant(row.status)} /></td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
        <div>
          <Card style={{ marginBottom:10 }}>
            <CardHead title="Shift breakdown" />
            <DonutChart data={[45,25,20,10]} colors={["#0D9488","#185FA5","#534AB7","#BA7517"]} labels={["General","Morning","Night","Evening"]} />
          </Card>
          <Card>
            <CardHead title="Geo-fence violations" right={<Badge label="8 today" variant="red" />} />
            {[["Rajesh Kumar","Outside fence by 180m","08:47 AM"],["Priya Sharma","GPS spoofing detected","11:23 AM"]].map(([n,d,t],i) => (
              <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"0.5px solid #E2E8F0" }}>
                <div><div style={{ fontWeight:500,fontSize:12 }}>{n}</div><div style={{ fontSize:11,color:"#64748B" }}>{d}</div></div>
                <span style={{ fontSize:11,color:"#94A3B8" }}>{t}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function OvertimePage() {
  return (
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
      <div>
        <div style={{ background:"#E1F5EE",border:"0.5px solid #0D9488",borderRadius:12,padding:14,marginBottom:12 }}>
          <div style={{ fontSize:12,fontWeight:500,color:"#085041",marginBottom:8 }}>Overtime formula</div>
          <div style={{ fontSize:12,color:"#085041",marginBottom:4 }}>Hourly rate = Monthly salary ÷ Working days ÷ Daily hours</div>
          <div style={{ fontSize:12,color:"#085041" }}>OT amount = Hourly rate × Multiplier × OT hours</div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12 }}>
          {[["×1.5","Additional shift","Extra shift beyond schedule","#E6F1FB","#B5D4F4","#0C447C"],
            ["×2.0","Weekly off","Work on rest day","#E1F5EE","#0D9488","#085041"],
            ["×2.5","Public holiday","Statutory holiday work","#FCEBEB","#F7C1C1","#791F1F"]].map(([v,t,d,bg,bd,tx]) => (
            <div key={t} style={{ background:bg,border:`0.5px solid ${bd}`,borderRadius:12,padding:12,textAlign:"center" }}>
              <div style={{ fontSize:22,fontWeight:500,color:tx }}>{v}</div>
              <div style={{ fontSize:11,fontWeight:500,color:tx,margin:"2px 0" }}>{t}</div>
              <div style={{ fontSize:10,color:"#64748B" }}>{d}</div>
            </div>
          ))}
        </div>
        <OTCalculator />
      </div>
      <div>
        <Card style={{ marginBottom:12 }}>
          <CardHead title="OT register — June 2026" right={<Btn sm>↓ Export</Btn>} />
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
            <thead><tr>{["Employee","Type","Hours","Amount","Status"].map(h =>
              <th key={h} style={{ textAlign:"left",padding:"7px 8px",fontSize:10,fontWeight:500,color:"#64748B",
                textTransform:"uppercase",letterSpacing:"0.4px",borderBottom:"0.5px solid #E2E8F0",background:"#F8FAFC" }}>{h}</th>
            )}</tr></thead>
            <tbody>{OT_REGISTER.map((r, i) => (
              <tr key={i}>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0",fontWeight:500 }}>{r.name}</td>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0" }}><Badge label={r.type} variant={otTypeVariant(r.type)} /></td>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0" }}>{r.hours}</td>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0",color:"#0D9488",fontWeight:500 }}>{r.amount}</td>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0" }}><Badge label={r.status} variant={statusVariant(r.status)} /></td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
        <Card>
          <CardHead title="OT cost by site" />
          {[["Factory A","₹3.2L",78],["Warehouse B","₹1.9L",54],["Construction C","₹1.8L",66],["Logistics D","₹0.9L",42]].map(([s,a,p],i) => (
            <div key={i} style={{ marginBottom:8 }}>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3 }}>
                <span>{s}</span><span style={{ fontWeight:500,color:"#0D9488" }}>{a}</span>
              </div>
              <ProgressBar value={p} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function PayrollPage() {
  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14 }}>
        <KpiCard label="Total payroll (June)" value="₹1.2Cr"  valueColor="#0D9488" />
        <KpiCard label="OT component"         value="₹8.4L"   sub="7% of total"    valueColor="#BA7517" />
        <KpiCard label="Payslips generated"   value="2,847"                         valueColor="#3B6D11" />
        <KpiCard label="Pending approval"     value="12"                            valueColor="#E24B4A" />
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <Card>
          <CardHead title="Salary register — June 2026" right={<Btn sm>↓ Export</Btn>} />
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
            <thead><tr>{["Employee","Basic","OT","Allowances","Net pay","Status"].map(h =>
              <th key={h} style={{ textAlign:"left",padding:"7px 8px",fontSize:10,fontWeight:500,color:"#64748B",
                textTransform:"uppercase",letterSpacing:"0.4px",borderBottom:"0.5px solid #E2E8F0",background:"#F8FAFC" }}>{h}</th>
            )}</tr></thead>
            <tbody>{PAYROLL_DATA.map((r, i) => (
              <tr key={i}>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0",fontWeight:500 }}>{r.name}</td>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0" }}>{r.basic}</td>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0",color:"#0D9488",fontWeight:500 }}>{r.ot}</td>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0" }}>{r.allow}</td>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0",fontWeight:500 }}>{r.net}</td>
                <td style={{ padding:"8px 8px",borderBottom:"0.5px solid #E2E8F0" }}><Badge label={r.status} variant={statusVariant(r.status)} /></td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
        <div>
          <Card style={{ marginBottom:12 }}>
            <CardHead title="Payroll cost — monthly trend" />
            <LineChart data={[98,102,108,104,110,120]} labels={["Jan","Feb","Mar","Apr","May","Jun"]} />
          </Card>
          <Card>
            <CardHead title="Contractor cost summary" />
            {[["In2IT Services","342 workers","₹54.3L","On budget","green"],["Manpower Corp","218 workers","₹31.8L","5% over","amber"],["SecureStaff","89 workers","₹12.4L","On budget","green"],["BuildForce India","156 workers","₹21.7L","On budget","green"]].map(([n,w,c,st,v],i) => (
              <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"0.5px solid #E2E8F0" }}>
                <div><div style={{ fontWeight:500,fontSize:12 }}>{n}</div><div style={{ fontSize:11,color:"#94A3B8" }}>{w}</div></div>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontWeight:500,color:"#0D9488" }}>{c}</span>
                  <Badge label={st} variant={v} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function MobilePage() {
  return (
    <div>
      <div style={{ display:"flex",gap:14,flexWrap:"wrap",marginBottom:14 }}>
        {MOB_SCREENS.map((sc, i) => (
          <div key={i} style={{ textAlign:"center" }}>
            <div style={{ background:"#0B1F3A",borderRadius:18,padding:"10px 8px 14px",width:148 }}>
              <div style={{ width:32,height:4,background:"rgba(255,255,255,0.15)",borderRadius:2,margin:"0 auto 8px" }} />
              <div style={{ background:"#fff",borderRadius:10,overflow:"hidden" }}>
                <div style={{ background:sc.color,padding:"10px 10px 8px" }}>
                  <div style={{ fontSize:12,fontWeight:500,color:"#fff" }}>{sc.title}</div>
                  <div style={{ fontSize:9,color:"rgba(255,255,255,0.7)",marginTop:1 }}>{sc.sub}</div>
                </div>
                {sc.rows.map(([k, v], j) => (
                  <div key={j} style={{ padding:"7px 10px",borderBottom:"0.5px solid #E2E8F0",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <span style={{ fontSize:9,color:"#64748B" }}>{k}</span>
                    <span style={{ fontSize:10,fontWeight:500,color:"#0B1F3A" }}>{v}</span>
                  </div>
                ))}
                <div style={{ margin:"7px 7px 5px",background:sc.color,borderRadius:7,padding:"7px",textAlign:"center",fontSize:10,fontWeight:500,color:"#fff",cursor:"pointer" }}>
                  {sc.cta}
                </div>
              </div>
            </div>
            <div style={{ fontSize:11,color:"#64748B",marginTop:6 }}>{sc.title}</div>
          </div>
        ))}
      </div>
      <Card>
        <CardHead title="App feature set" right={<Badge label="Android & iOS" variant="teal" />} />
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
          {MOB_FEATURES.map((f, i) => (
            <div key={i} style={{ display:"flex",gap:10,padding:10,border:"0.5px solid #E2E8F0",borderRadius:8,alignItems:"flex-start" }}>
              <div style={{ width:32,height:32,borderRadius:8,background:"#E1F5EE",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontSize:12,fontWeight:500,color:"#0B1F3A" }}>{f.title}</div>
                <div style={{ fontSize:11,color:"#64748B" }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ChannelsPage() {
  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14 }}>
        {CHANNELS.map((ch, i) => (
          <div key={i} style={{ border:"0.5px solid #E2E8F0",borderRadius:12,padding:14,background:"#fff" }}>
            <div style={{ fontSize:22,marginBottom:6,color:"#0D9488" }}>{ch.icon}</div>
            <div style={{ fontSize:12,fontWeight:500,color:"#0B1F3A",marginBottom:3 }}>{ch.name}</div>
            <div style={{ fontSize:11,color:"#64748B",lineHeight:1.45 }}>{ch.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <Card>
          <CardHead title="SMS templates" />
          {SMS_TEMPLATES.map((t, i) => (
            <div key={i} style={{ marginBottom:10,padding:10,border:"0.5px solid #E2E8F0",borderRadius:8 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                <span style={{ fontSize:12,fontWeight:500 }}>{t.title}</span>
                <Badge label={t.title.split(" ")[0]} variant={t.variant} />
              </div>
              <div style={{ fontSize:11,color:"#94A3B8",fontStyle:"italic" }}>"{t.msg}"</div>
            </div>
          ))}
        </Card>
        <Card>
          <CardHead title="Language support" right={<Badge label="11 languages" variant="teal" />} />
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:6 }}>
            {LANGUAGES.map(l => (
              <div key={l} style={{ display:"flex",alignItems:"center",gap:7,padding:"6px 8px",background:"#F8FAFC",borderRadius:8,fontSize:12 }}>
                <div style={{ width:7,height:7,borderRadius:"50%",background:"#0D9488",flexShrink:0 }} />
                {l}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Nav config ──────────────────────────────────────────────────────────────

const NAV = [
  { id:"dashboard",   label:"Dashboard",        icon:"📊", group:"Overview"     },
  { id:"contractors", label:"Contractors",       icon:"🏢", group:"Workforce"    },
  { id:"employees",   label:"Employees",         icon:"👥", group:"Workforce"    },
  { id:"sites",       label:"Sites & Geo-fence", icon:"📍", group:"Workforce"    },
  { id:"attendance",  label:"Attendance",        icon:"🕐", group:"Operations"   },
  { id:"overtime",    label:"Overtime Engine",   icon:"⏱️", group:"Operations"   },
  { id:"approvals",   label:"OT Approvals",      icon:"✅", group:"Operations", badge:"5" },
  { id:"payroll",     label:"Payroll",           icon:"💰", group:"Finance"      },
  { id:"mobile",      label:"Mobile App",        icon:"📱", group:"Field & Comms"},
  { id:"channels",    label:"Channels",          icon:"💬", group:"Field & Comms"},
];

const PAGES_MAP = {
  dashboard:   <DashboardPage />,
  contractors: <ContractorsPage />,
  employees:   <EmployeesPage />,
  sites:       <SitesPage />,
  attendance:  <AttendancePage />,
  overtime:    <OvertimePage />,
  approvals:   <ApprovalsPage />,
  payroll:     <PayrollPage />,
  mobile:      <MobilePage />,
  channels:    <ChannelsPage />,
};

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState("dashboard");

  const groups = [...new Set(NAV.map(n => n.group))];

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"system-ui,sans-serif",
      background:"#F8FAFC", color:"#0B1F3A", fontSize:13, lineHeight:1.5 }}>

      {/* Sidebar */}
      <nav style={{ width:210, minWidth:210, background:"#0B1F3A", display:"flex", flexDirection:"column",
        overflowY:"auto", borderRight:"0.5px solid rgba(255,255,255,0.06)" }} aria-label="Platform navigation">
        <div style={{ padding:"16px 16px 12px", borderBottom:"0.5px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
            <div style={{ width:28, height:28, borderRadius:7, background:"#0D9488", display:"flex",
              alignItems:"center", justifyContent:"center", fontSize:14 }}>👥</div>
            <span style={{ fontSize:14, fontWeight:500, color:"#fff", letterSpacing:"-0.2px" }}>Contract Management</span>
          </div>
          <div style={{ fontSize:10, color:"rgba(94,234,212,0.8)", paddingLeft:36 }}>Workforce & Payroll</div>
        </div>
        {groups.map(grp => (
          <div key={grp} style={{ padding:"8px 0 0" }}>
            <div style={{ fontSize:9, fontWeight:500, color:"rgba(255,255,255,0.3)", letterSpacing:"0.8px",
              padding:"0 12px 4px", textTransform:"uppercase" }}>{grp}</div>
            {NAV.filter(n => n.group === grp).map(n => (
              <div key={n.id} onClick={() => setActive(n.id)}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 12px", cursor:"pointer",
                  fontSize:12, color: active === n.id ? "#5EEAD4" : "rgba(255,255,255,0.55)",
                  background: active === n.id ? "rgba(13,148,136,0.2)" : "transparent",
                  borderLeft: `2px solid ${active === n.id ? "#0D9488" : "transparent"}`,
                  transition:"background 0.1s" }}>
                <span style={{ fontSize:14 }}>{n.icon}</span>
                <span>{n.label}</span>
                {n.badge && (
                  <span style={{ marginLeft:"auto", background:"rgba(13,148,136,0.3)", color:"#5EEAD4",
                    fontSize:9, padding:"1px 5px", borderRadius:10 }}>{n.badge}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        {/* Topbar */}
        <div style={{ height:50, minHeight:50, display:"flex", alignItems:"center", padding:"0 18px", gap:10,
          borderBottom:"0.5px solid #E2E8F0", background:"#fff" }}>
          <span style={{ flex:1, fontSize:14, fontWeight:500, color:"#0B1F3A" }}>
            {NAV.find(n => n.id === active)?.label}
          </span>
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"#F8FAFC", border:"0.5px solid #E2E8F0",
            borderRadius:8, padding:"5px 10px", fontSize:12, color:"#94A3B8" }}>
            🔍 Search…
          </div>
          <span style={{ fontSize:10, fontWeight:500, padding:"2px 8px", borderRadius:20,
            background:"#E1F5EE", color:"#085041" }}>June 2026</span>
          <button style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:500,
            padding:"5px 12px", borderRadius:8, border:"none", background:"#0D9488", color:"#fff", cursor:"pointer" }}>
            + Add new
          </button>
          <div style={{ width:30, height:30, borderRadius:"50%", background:"#E1F5EE", color:"#085041",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:500 }}>HR</div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:18, background:"#F8FAFC" }}>
          {PAGES_MAP[active]}
        </div>

      </div>
    </div>
  );
}
