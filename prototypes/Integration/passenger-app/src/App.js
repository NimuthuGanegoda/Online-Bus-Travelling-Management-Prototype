import { useState, useEffect, useRef } from "react";

// ─── THEME & GLOBALS ──────────────────────────────────────────────────────────
const T = {
  bg: "#0d0d0d",
  surface: "#161616",
  surfaceHover: "#1e1e1e",
  border: "#2a2a2a",
  borderActive: "#444",
  text: "#e8e8e8",
  textMuted: "#888",
  textDim: "#555",
  accent: "#fff",
  danger: "#ff4444",
  dangerBg: "#2a0a0a",
  warning: "#ffaa00",
  warningBg: "#2a1a00",
  success: "#44cc88",
  successBg: "#0a2a18",
  info: "#4488ff",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: ${T.bg}; color: ${T.text}; font-family: 'IBM Plex Sans', sans-serif; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: ${T.surface}; }
  ::-webkit-scrollbar-thumb { background: ${T.borderActive}; border-radius: 2px; }
  input, textarea, select { font-family: inherit; }
  button { cursor: pointer; font-family: inherit; }
  .mono { font-family: 'IBM Plex Mono', monospace; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes slideIn { from{transform:translateX(-8px);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
  .anim-slide { animation: slideIn 0.2s ease; }
  .anim-fade { animation: fadeIn 0.25s ease; }
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const BUSES = [
  { id:"BUS-001", plate:"NB-1234", route:"Colombo-Kandy", cap:50, driver:"Kamal Perera", status:"ACTIVE", last:"09:30 AM" },
  { id:"BUS-177", plate:"NB-5678", route:"Colombo-Galle", cap:55, driver:"Nimal Silva", status:"ACTIVE", last:"08:45 AM" },
  { id:"BUS-014", plate:"NB-9012", route:"Colombo-Negombo", cap:50, driver:"—", status:"MAINTENANCE", last:"Yesterday" },
  { id:"BUS-122", plate:"NB-3456", route:"Colombo-Kandy", cap:50, driver:"Ruwan Thilak", status:"ACTIVE", last:"10:00 AM" },
  { id:"BUS-031", plate:"NB-7890", route:"Colombo-Ratnapura", cap:45, driver:"Suresh Peris", status:"INACTIVE", last:"3 days ago" },
  { id:"BUS-138", plate:"NB-2468", route:"Colombo-Galle", cap:55, driver:"Chaminda R.", status:"ACTIVE", last:"09:55 AM" },
  { id:"BUS-045", plate:"NB-1357", route:"Colombo-Kurunegala", cap:45, driver:"—", status:"MAINTENANCE", last:"2 days ago" },
  { id:"BUS-052", plate:"NB-9753", route:"Colombo-Matara", cap:60, driver:"Asela K.", status:"ACTIVE", last:"10:10 AM" },
  { id:"BUS-061", plate:"NB-8642", route:"Colombo-Badulla", cap:45, driver:"Pradeep M.", status:"ACTIVE", last:"09:20 AM" },
];
const DRIVERS = [
  { id:"DRV-004", name:"Kamal Perera", bus:"BUS-001", route:"Colombo-Kandy", rating:8.4, trips:248, status:"ACTIVE", joined:"Jan 2022" },
  { id:"DRV-011", name:"Nimal Silva", bus:"BUS-177", route:"Colombo-Galle", rating:7.9, trips:186, status:"ACTIVE", joined:"Mar 2021" },
  { id:"DRV-022", name:"Saman Rajapaksha", bus:"BUS-122", route:"Colombo-Kandy", rating:7.2, trips:201, status:"ACTIVE", joined:"Jun 2020" },
  { id:"DRV-033", name:"Ruwan Thilak", bus:"BUS-122", route:"Colombo-Kandy", rating:6.8, trips:156, status:"ACTIVE", joined:"Sep 2021" },
  { id:"DRV-041", name:"Asela Kumara", bus:"BUS-052", route:"Colombo-Matara", rating:6.4, trips:132, status:"ACTIVE", joined:"Nov 2022" },
  { id:"DRV-047", name:"Pradeep Mendis", bus:"BUS-061", route:"Colombo-Badulla", rating:4.2, trips:89, status:"ACTIVE", joined:"Feb 2023" },
];
const ALERTS = [
  { id:"A-001", type:"Medical", driver:"Kamal P.", bus:"Bus 01", location:"Pettah", time:"09:14 AM", status:"ACTIVE", gps:"6.9357, 79.8518", route:"Colombo Fort → Pettah → Kandy", pax:38, desc:"Passenger fainted near Pettah stop. Ambulance required." },
  { id:"A-002", type:"Breakdown", driver:"Nimal S.", bus:"Bus 07", location:"Kandy Rd", time:"08:50 AM", status:"ACTIVE", gps:"7.2906, 80.6337", route:"Colombo → Kandy", pax:42, desc:"Engine overheating. Bus pulled over on Kandy Road." },
  { id:"A-003", type:"Accident", driver:"Saman R.", bus:"Bus 14", location:"Maradana", time:"07:30 AM", status:"RESOLVED", gps:"6.9271, 79.8612", route:"Colombo Fort → Maradana", pax:29, desc:"Minor collision at Maradana junction. No injuries reported." },
  { id:"A-004", type:"Security", driver:"Ruwan T.", bus:"Bus 22", location:"Galle Rd", time:"06:55 AM", status:"RESOLVED", gps:"6.8650, 79.8636", route:"Colombo → Galle", pax:35, desc:"Suspicious package reported. Police notified." },
  { id:"A-005", type:"Medical", driver:"Asela K.", bus:"Bus 52", location:"Colombo", time:"05:40 AM", status:"RESOLVED", gps:"6.9271, 79.8612", route:"Colombo → Matara", pax:22, desc:"Driver reported chest pain. Bus returned to depot." },
  { id:"A-006", type:"Accident", driver:"Pradeep M.", bus:"Bus 61", location:"Ratnapura", time:"Yesterday", status:"RESOLVED", gps:"6.6828, 80.3992", route:"Colombo → Badulla", pax:41, desc:"Skidding on wet road. Minor body damage only." },
];
const ROUTES = [
  { id:"RA", name:"Route A", from:"Colombo Fort", to:"Kandy", via:"Pettah", stops:8, distance:116, duration:"~2h 30m", buses:["Bus 01 (Kamal Perera)","Bus 22 (Ruwan Thilak)"], status:"ACTIVE", schedule:"06:00 AM — 10:00 PM", freq:"Every 30 mins",
    stopList:["Colombo Fort [Depart] 06:00 AM","Pettah Bus Stand [Stop] 06:10 AM","Maradana [Stop] 06:20 AM","Kelaniya [Stop] 06:45 AM","Kadugannawa [Stop] 07:40 AM","3 more stops…","Kandy Bus Stand [Arrive] 08:30 AM"] },
  { id:"RB", name:"Route B", from:"Colombo Fort", to:"Kandy", via:"Maradana", stops:6, distance:108, duration:"~2h 15m", buses:["Bus 17"], status:"ACTIVE", schedule:"07:00 AM — 09:00 PM", freq:"Every 45 mins",
    stopList:["Colombo Fort [Depart]","Maradana [Stop]","Kelaniya [Stop]","Gampaha [Stop]","Veyangoda [Stop]","Kandy Bus Stand [Arrive]"] },
  { id:"RC", name:"Route C", from:"Colombo", to:"Kandy", via:"Kelaniya", stops:5, distance:98, duration:"~2h", buses:["Bus 17","Bus 04"], status:"ACTIVE", schedule:"06:30 AM — 09:30 PM", freq:"Every 60 mins",
    stopList:["Colombo Fort [Depart]","Kelaniya [Stop]","Gampaha [Stop]","Mawanella [Stop]","Kandy Bus Stand [Arrive]"] },
  { id:"RD", name:"Route D", from:"Colombo", to:"Galle", via:"Expressway", stops:3, distance:130, duration:"~1h 30m", buses:[], status:"INACTIVE", schedule:"—", freq:"—",
    stopList:["Colombo [Depart]","Expressway","Galle [Arrive]"] },
];
const FLEET_BUSES = [
  { id:"01", label:"Bus 01 38/50", route:"Colombo-Kandy", status:"ON ROUTE", x:14, y:28, pax:38, cap:50, speed:42, driver:"Kamal Perera (DRV-004)", next:"Pettah Bus Stand (ETA: 5 mins)", gps:"6.9271, 79.8612" },
  { id:"07", label:"Bus 07", route:"Colombo-Kandy", status:"ALERT", x:38, y:18, pax:42, cap:50, speed:0, driver:"Nimal Silva (DRV-011)", next:"Breakdown", gps:"7.2906, 80.6337" },
  { id:"14", label:"Bus 14", route:"Colombo-Kandy", status:"AT DEPOT", x:21, y:42, pax:0, cap:50, speed:0, driver:"—", next:"—", gps:"6.9271, 79.8612" },
  { id:"22", label:"Bus 22", route:"Colombo-Kandy", status:"ON ROUTE", x:55, y:36, pax:50, cap:50, speed:55, driver:"Ruwan Thilak (DRV-033)", next:"Kadugannawa (ETA: 12 mins)", gps:"7.0870, 80.0144" },
  { id:"03", label:"Bus 03", route:"Colombo-Galle", status:"ALERT", x:43, y:54, pax:35, cap:55, speed:0, driver:"Chaminda R.", next:"Emergency", gps:"6.8650, 79.8636" },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant="default", size="md", style={} }) => {
  const base = {
    border: "1px solid",
    borderRadius: 3,
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
    ...size === "sm" ? { padding: "4px 10px", fontSize: 11 } : { padding: "7px 16px", fontSize: 12 },
  };
  const variants = {
    default: { background: T.surface, color: T.text, borderColor: T.border },
    primary: { background: T.text, color: T.bg, borderColor: T.text },
    danger: { background: T.dangerBg, color: T.danger, borderColor: T.danger },
    warning: { background: T.warningBg, color: T.warning, borderColor: T.warning },
    success: { background: T.successBg, color: T.success, borderColor: T.success },
    ghost: { background: "transparent", color: T.textMuted, borderColor: T.border },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.8"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
      {children}
    </button>
  );
};

const Badge = ({ children, variant="default" }) => {
  const styles = {
    default: { background: T.border, color: T.textMuted },
    active: { background: T.successBg, color: T.success },
    inactive: { background: "#1a1a1a", color: T.textDim },
    alert: { background: T.dangerBg, color: T.danger },
    maintenance: { background: T.warningBg, color: T.warning },
    resolved: { background: "#1a2a1a", color: "#66aa77" },
  };
  return (
    <span style={{ ...styles[variant] || styles.default, padding: "2px 8px", borderRadius: 2, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, letterSpacing: "0.05em" }}>
      {children}
    </span>
  );
};

const Card = ({ children, style={} }) => (
  <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: 20, ...style }}>
    {children}
  </div>
);

const StatCard = ({ label, value, sub, icon }) => (
  <Card style={{ flex: 1, minWidth: 160 }}>
    <div style={{ fontSize: 10, color: T.textMuted, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 }}>[{icon}]</div>
    <div style={{ fontSize: 36, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1, marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 12, color: T.text, marginBottom: 3 }}>{label}</div>
    {sub && <div style={{ fontSize: 10, color: T.textMuted }}>{sub}</div>}
  </Card>
);

const NavBar = ({ page, setPage }) => {
  const links = ["Dashboard","Fleet Map","CRUD","Routes","Alerts","Ratings"];
  return (
    <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"0 24px", height: 48, gap: 4 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginRight: 32, whiteSpace:"nowrap" }}>SL BusTrack — Admin</div>
      <div style={{ display:"flex", gap:2, flex:1 }}>
        {links.map(l => (
          <button key={l} onClick={() => setPage(l)} style={{
            background: "none", border: "none", color: page === l ? T.text : T.textMuted,
            fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", padding: "0 14px", height: 48,
            cursor:"pointer", borderBottom: page === l ? `2px solid ${T.text}` : "2px solid transparent",
            fontWeight: page === l ? 600 : 400, transition:"all 0.15s"
          }}>{l}</button>
        ))}
      </div>
      <div style={{ fontSize: 11, color: T.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
        [Admin] SysAdmin <span style={{ color: T.textDim }}>|</span>{" "}
        <span style={{ color: T.danger, cursor:"pointer" }}>[Logout]</span>
      </div>
    </div>
  );
};

const PageHeader = ({ title, right }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 20 }}>
    <h2 style={{ fontSize: 16, fontWeight: 600, fontFamily:"'IBM Plex Mono', monospace" }}>{title}</h2>
    {right}
  </div>
);

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    if (!user || !pass) { setErr("Please enter credentials."); return; }
    setLoading(true); setErr("");
    setTimeout(() => {
      if (user === "admin" && pass === "admin") { onLogin(); }
      else { setErr("Invalid credentials. Try admin / admin"); setLoading(false); }
    }, 900);
  };

  const inp = { width:"100%", background:"#1a1a1a", border:`1px solid ${T.border}`, borderRadius:3, padding:"10px 12px", color:T.text, fontSize:13, outline:"none" };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div className="anim-fade" style={{ width: 400, background:T.surface, border:`1px solid ${T.border}`, borderRadius:6, padding:40 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:60, height:60, borderRadius:"50%", background:T.bg, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:22 }}>🚌</div>
          <div style={{ fontSize:22, fontWeight:700, fontFamily:"'IBM Plex Mono', monospace", letterSpacing:"-0.03em" }}>SL BusTrack</div>
          <div style={{ fontSize:12, color:T.textMuted, marginTop:4 }}>Admin Control Panel</div>
          <div style={{ fontSize:10, color:T.textDim, marginTop:2, fontStyle:"italic" }}>Authorised Personnel Only</div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, color:T.textMuted, display:"block", marginBottom:6, fontFamily:"'IBM Plex Mono', monospace" }}>Admin ID / Username</label>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:10, color:T.textDim, fontFamily:"'IBM Plex Mono', monospace" }}>[Admin]</span>
            <input style={{ ...inp, paddingLeft:56 }} placeholder="Enter admin username" value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} />
          </div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, color:T.textMuted, display:"block", marginBottom:6, fontFamily:"'IBM Plex Mono', monospace" }}>Password</label>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:10, color:T.textDim, fontFamily:"'IBM Plex Mono', monospace" }}>[Lock]</span>
            <input type="password" style={{ ...inp, paddingLeft:56 }} placeholder="Enter password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} />
          </div>
        </div>
        {err && <div style={{ background:T.dangerBg, border:`1px solid ${T.danger}`, borderRadius:3, padding:"8px 12px", fontSize:11, color:T.danger, marginBottom:14, fontFamily:"'IBM Plex Mono', monospace" }}>{err}</div>}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:T.textMuted, cursor:"pointer" }}>
            <input type="checkbox" style={{ accentColor: T.text }} /> Remember me
          </label>
          <span style={{ fontSize:12, color:T.textMuted, cursor:"pointer", textDecoration:"underline" }}>Forgot Password?</span>
        </div>
        <button onClick={handle} style={{ width:"100%", background:T.text, color:T.bg, border:"none", borderRadius:3, padding:"12px", fontSize:13, fontWeight:700, fontFamily:"'IBM Plex Mono', monospace", letterSpacing:"0.05em", cursor:"pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "AUTHENTICATING..." : "LOGIN AS ADMIN"}
        </button>
        <div style={{ textAlign:"center", marginTop:12, fontSize:10, color:T.textDim, fontFamily:"'IBM Plex Mono', monospace" }}>[ JWT Authentication | Session expires in 8h ]</div>
        <div style={{ textAlign:"center", marginTop:8, fontSize:10, color: "#333" }}>hint: admin / admin</div>
      </div>
    </div>
  );
};

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
const DashboardPage = ({ setPage }) => {
  const [time] = useState("09:41 AM");
  return (
    <div className="anim-fade" style={{ padding: 24 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <h2 style={{ fontSize:16, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace" }}>Admin Home — Dashboard Overview</h2>
        <div style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>
          Last updated: {time} | Status: <span style={{ color:T.success }}>ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>
      <div style={{ display:"flex", gap:14, marginBottom:20 }}>
        <StatCard label="Active Buses" value="24" sub="of 32 total registered" icon="Bus" />
        <StatCard label="Passengers Today" value="1,482" sub="up 12% from yesterday" icon="People" />
        <StatCard label="Open Emergency Alerts" value="2" sub="5 resolved today" icon="Alert" />
        <StatCard label="Avg Driver Rating" value="7.4 / 10" sub="based on 48 drivers" icon="Star" />
        <StatCard label="Total Drivers" value="48" sub="3 on leave" icon="Driver" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        <Card>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <h3 style={{ fontSize:13, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace" }}>Active Emergency Alerts <span style={{ color:T.danger }}>[ 2 OPEN ]</span></h3>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr", gap:4, padding:"6px 8px", background:T.bg, borderRadius:3, marginBottom:8 }}>
            {["Alert ID","Driver","Bus Type","Time","GPS Status","Action"].map(h=>(
              <div key={h} style={{ fontSize:10, color:T.textDim, fontFamily:"'IBM Plex Mono', monospace" }}>{h}</div>
            ))}
          </div>
          {ALERTS.slice(0,4).map(a => (
            <div key={a.id} style={{ display:"flex", alignItems:"center", padding:"8px 8px", borderRadius:3, marginBottom:4,
              background: a.status==="ACTIVE" ? T.dangerBg : "transparent",
              border: `1px solid ${a.status==="ACTIVE" ? "#3a1212" : T.border}`,
              opacity: a.status==="RESOLVED" ? 0.5 : 1 }}>
              <div style={{ flex:1, fontSize:11, fontFamily:"'IBM Plex Mono', monospace", color: a.status==="ACTIVE" ? T.text : T.textMuted }}>
                {a.id} {a.driver} {a.bus} {a.type} {a.time} {a.location} <Badge variant={a.status==="ACTIVE"?"alert":"resolved"}>{a.status}</Badge>
                {a.status==="ACTIVE" && <> <Btn size="sm" variant="danger">Resolve</Btn></>}
                {a.status==="RESOLVED" && <span style={{ fontSize:10, color:T.textDim, marginLeft:6 }}>[View]</span>}
              </div>
            </div>
          ))}
          <div style={{ textAlign:"center", marginTop:8 }}>
            <span onClick={() => setPage("Alerts")} style={{ fontSize:11, color:T.textMuted, cursor:"pointer", fontFamily:"'IBM Plex Mono', monospace" }}>[ View all alerts → ]</span>
          </div>
        </Card>
        <Card>
          <div style={{ marginBottom:14 }}>
            <h3 style={{ fontSize:13, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace" }}>Fleet Status Summary</h3>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:4, padding:"6px 8px", background:T.bg, borderRadius:3, marginBottom:8 }}>
            {["Bus No.","Route","Driver","Passengers","Status ETA"].map(h=>(
              <div key={h} style={{ fontSize:10, color:T.textDim, fontFamily:"'IBM Plex Mono', monospace" }}>{h}</div>
            ))}
          </div>
          {[
            { bus:"Bus 01", route:"Colombo-Kandy", drv:"Kamal P.", pax:"38/50", status:"ON ROUTE", eta:"12:30 PM", ok:true },
            { bus:"Bus 177", route:"Colombo-Galle", drv:"Nimal S.", pax:"42/55", status:"ON ROUTE", eta:"01:15 PM", ok:true },
            { bus:"Bus 14", route:"Colombo-Negombo", drv:"Saman R.", pax:"18/50", status:"AT DEPOT", eta:"—", ok:false },
            { bus:"Bus 22", route:"Colombo-Kandy", drv:"Ruwan T.", pax:"50/50", status:"ON ROUTE", eta:"02:00 PM", ok:true },
          ].map((r,i) => (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:4, padding:"8px 8px", borderRadius:3, marginBottom:3,
              background: r.ok ? "transparent" : T.bg, opacity: r.ok ? 1 : 0.5, border:`1px solid ${r.ok ? T.border : "#1a1a1a"}` }}>
              <div style={{ fontSize:11, fontFamily:"'IBM Plex Mono', monospace", fontWeight:600 }}>{r.bus}</div>
              <div style={{ fontSize:11, color:T.textMuted }}>{r.route}</div>
              <div style={{ fontSize:11, color:T.textMuted }}>{r.drv}</div>
              <div style={{ fontSize:11, color:T.textMuted }}>{r.pax}</div>
              <div style={{ fontSize:11 }}><Badge variant={r.status==="ON ROUTE"?"active":"inactive"}>{r.status}</Badge> <span style={{ color:T.textDim, fontSize:10 }}>{r.eta}</span></div>
            </div>
          ))}
          <div style={{ textAlign:"center", marginTop:8 }}>
            <span onClick={() => setPage("Fleet Map")} style={{ fontSize:11, color:T.textMuted, cursor:"pointer", fontFamily:"'IBM Plex Mono', monospace" }}>[ View full fleet → ]</span>
          </div>
        </Card>
      </div>
      <Card style={{ padding:16 }}>
        <div style={{ fontSize:12, color:T.textMuted, marginBottom:12, fontFamily:"'IBM Plex Mono', monospace" }}>Quick Actions</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <Btn onClick={() => setPage("CRUD")}>[ +] Add Bus</Btn>
          <Btn onClick={() => setPage("CRUD")}>[ +] Add Driver</Btn>
          <Btn onClick={() => setPage("Routes")}>[Route] Add Route</Btn>
          <Btn onClick={() => setPage("Fleet Map")}>[Map] Live Fleet</Btn>
          <Btn variant="ghost">[Report] Export Report</Btn>
        </div>
      </Card>
    </div>
  );
};

// ─── FLEET MAP PAGE ───────────────────────────────────────────────────────────
const FleetMapPage = () => {
  const [selected, setSelected] = useState(FLEET_BUSES[0]);
  const [filter, setFilter] = useState("All");

  const statusColor = s => s==="ON ROUTE" ? T.success : s==="ALERT" ? T.danger : T.textMuted;
  const statusBg = s => s==="ON ROUTE" ? "#1a3a2a" : s==="ALERT" ? T.dangerBg : T.bg;

  return (
    <div className="anim-fade" style={{ padding:24 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <h2 style={{ fontSize:16, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace" }}>Live Fleet Map</h2>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {[`All Buses (${FLEET_BUSES.length+19})`, "On Route (18)", "At Depot (6)", "Alert Active (2)"].map(f => {
            const k = f.split(" ")[0]==="All"?"All":f.split(" ")[0];
            return <Btn key={f} size="sm" variant={filter===k?"primary":"default"} onClick={()=>setFilter(k)}>{f}</Btn>;
          })}
          <input placeholder="Search bus or route..." style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:3, padding:"5px 10px", color:T.text, fontSize:11, outline:"none", width:180 }} />
          <Btn size="sm" variant="success">[Refresh] Live</Btn>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16, height:"calc(100vh - 200px)" }}>
        <div style={{ display:"grid", gridTemplateRows:"1fr", gap:16 }}>
          {/* Map */}
          <Card style={{ padding:0, overflow:"hidden", position:"relative" }}>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, #0d1a0d 0%, #0d0d1a 50%, #1a0d0d 100%)" }}>
              {/* Grid lines */}
              {[...Array(10)].map((_,i) => (
                <div key={i} style={{ position:"absolute", left:`${i*10+5}%`, top:0, bottom:0, borderLeft:`1px solid ${T.border}`, opacity:0.3 }} />
              ))}
              {[...Array(8)].map((_,i) => (
                <div key={i} style={{ position:"absolute", top:`${i*12.5}%`, left:0, right:0, borderTop:`1px solid ${T.border}`, opacity:0.3 }} />
              ))}
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", color:T.textDim, fontSize:14, fontFamily:"'IBM Plex Mono', monospace", textAlign:"center", pointerEvents:"none" }}>
                [ LIVE MAP ]<br/><span style={{ fontSize:11 }}>Real-time GPS positions of all active buses</span>
              </div>
              {/* Bus markers */}
              {FLEET_BUSES.map(bus => (
                <div key={bus.id} onClick={() => setSelected(bus)} style={{ position:"absolute", left:`${bus.x}%`, top:`${bus.y}%`, cursor:"pointer" }}>
                  {bus.status==="ALERT" && (
                    <div style={{ position:"absolute", top:-24, left:"50%", transform:"translateX(-50%)", background:T.danger, color:"#fff", fontSize:10, padding:"2px 6px", borderRadius:2, whiteSpace:"nowrap", fontFamily:"'IBM Plex Mono', monospace" }}>
                      [!] ALERT Bus {bus.id}
                    </div>
                  )}
                  {selected?.id === bus.id && (
                    <div style={{ position:"absolute", bottom:26, left:"50%", transform:"translateX(-50%)", background:T.surface, border:`1px solid ${T.border}`, padding:"3px 8px", borderRadius:2, whiteSpace:"nowrap", fontSize:10, fontFamily:"'IBM Plex Mono', monospace" }}>
                      Bus {bus.id} {bus.pax}/{bus.cap}
                    </div>
                  )}
                  <div style={{ width:32, height:32, borderRadius:"50%", background: selected?.id===bus.id ? T.text : statusBg(bus.status),
                    border:`2px solid ${statusColor(bus.status)}`, display:"flex", alignItems:"center", justifyContent:"center",
                    color: selected?.id===bus.id ? T.bg : T.text, fontSize:11, fontFamily:"'IBM Plex Mono', monospace", fontWeight:700,
                    boxShadow: bus.status==="ALERT" ? `0 0 12px ${T.danger}` : selected?.id===bus.id ? "0 0 8px rgba(255,255,255,0.3)" : "none",
                    animation: bus.status==="ALERT" ? "pulse 1.5s infinite" : "none" }}>
                    {bus.id}
                  </div>
                </div>
              ))}
              {/* Legend */}
              <div style={{ position:"absolute", bottom:12, left:12, background:"rgba(0,0,0,0.8)", border:`1px solid ${T.border}`, borderRadius:3, padding:"8px 12px", fontSize:10, fontFamily:"'IBM Plex Mono', monospace" }}>
                <span style={{ color:T.success, marginRight:14 }}>● On Route</span>
                <span style={{ color:T.textMuted, marginRight:14 }}>○ At Depot</span>
                <span style={{ color:T.danger }}>⚠ Alert</span>
              </div>
              {/* Zoom controls */}
              <div style={{ position:"absolute", top:12, right:12, display:"flex", flexDirection:"column", gap:4 }}>
                <Btn size="sm">+</Btn>
                <Btn size="sm">−</Btn>
              </div>
            </div>
          </Card>
        </div>
        {/* Right Panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:12, overflow:"auto" }}>
          {selected && (
            <Card className="anim-fade" style={{ padding:16 }}>
              <div style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace", marginBottom:10 }}>Bus Details — Click a bus on the map</div>
              <div style={{ fontSize:15, fontWeight:700, fontFamily:"'IBM Plex Mono', monospace", marginBottom:10 }}>Bus {selected.id} — {selected.route.includes("Kandy")?"Route A":selected.route.includes("Galle")?"Route B":"Route C"}</div>
              {[
                ["Driver:", selected.driver],
                ["Route:", selected.route],
                ["Passengers:", `${selected.pax} / ${selected.cap} | Speed: ${selected.speed} km/h`],
                ["Next Stop:", selected.next],
                ["Status:", `[ ${selected.status} ] GPS: ${selected.gps}`],
              ].map(([k,v]) => (
                <div key={k} style={{ display:"grid", gridTemplateColumns:"90px 1fr", gap:6, marginBottom:6 }}>
                  <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>{k}</span>
                  <span style={{ fontSize:11, color:T.text, fontFamily:"'IBM Plex Mono', monospace", wordBreak:"break-all" }}>{v}</span>
                </div>
              ))}
              <div style={{ display:"flex", gap:6, marginTop:12, flexWrap:"wrap" }}>
                <Btn size="sm">[Track] View Trip</Btn>
                <Btn size="sm" variant={selected.status==="ALERT"?"danger":"default"}>[Alert] Send Alert</Btn>
                <Btn size="sm">[Driver] Profile</Btn>
              </div>
            </Card>
          )}
          <Card style={{ padding:16, flex:1, overflow:"auto" }}>
            <div style={{ fontSize:12, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace", marginBottom:10 }}>All Buses ({FLEET_BUSES.length + 19} active)</div>
            {[
              { n:"Bus 01", r:"Colombo-Kandy", info:"38/50", s:"ON ROUTE" },
              { n:"Bus 177", r:"Colombo-Galle", info:"42/55", s:"ON ROUTE" },
              { n:"Bus 240", r:"Colombo-Negombo", info:"", s:"ALERT" },
              { n:"Bus 14", r:"Colombo-Kandy", info:"", s:"AT DEPOT" },
              { n:"Bus 122", r:"Colombo-Kandy", info:"50/50", s:"ON ROUTE" },
              { n:"Bus 03", r:"Colombo-Galle", info:"35/55", s:"ALERT" },
            ].map((b,i) => (
              <div key={i} style={{ padding:"8px 0", borderBottom:`1px solid ${T.border}`, cursor:"pointer",
                color: b.s==="ALERT" ? T.danger : b.s==="AT DEPOT" ? T.textDim : T.text }}>
                <div style={{ fontSize:12, fontFamily:"'IBM Plex Mono', monospace" }}>
                  {b.n} — {b.r} {b.info && `| ${b.info}`} | <Badge variant={b.s==="ON ROUTE"?"active":b.s==="ALERT"?"alert":"inactive"}>{b.s}</Badge>
                </div>
              </div>
            ))}
            <div style={{ textAlign:"center", marginTop:10 }}>
              <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>[ Load more buses... ]</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── CRUD PAGE ────────────────────────────────────────────────────────────────
const CRUDPage = () => {
  const [tab, setTab] = useState("Buses");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [page, setPageNum] = useState(1);

  const filtered = BUSES.filter(b => {
    const matchS = filterStatus==="All" || b.status.toUpperCase()===filterStatus.toUpperCase();
    const matchQ = !search || b.id.toLowerCase().includes(search.toLowerCase()) || b.driver.toLowerCase().includes(search.toLowerCase()) || b.route.toLowerCase().includes(search.toLowerCase());
    return matchS && matchQ;
  });

  const statusVariant = s => s==="ACTIVE"?"active":s==="INACTIVE"?"inactive":"maintenance";

  return (
    <div className="anim-fade" style={{ padding:24 }}>
      <PageHeader title="CRUD Management" right={<Btn variant="primary" onClick={()=>setShowModal(true)}>[+] Add New Record</Btn>} />
      <div style={{ display:"flex", gap:0, marginBottom:16, borderBottom:`1px solid ${T.border}` }}>
        {["Buses","Drivers","Passengers"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background:"none", border:"none", borderBottom: tab===t ? `2px solid ${T.text}` : "2px solid transparent",
            color: tab===t ? T.text : T.textMuted, fontSize:12, fontFamily:"'IBM Plex Mono', monospace", padding:"10px 20px", cursor:"pointer", fontWeight: tab===t?600:400 }}>
            [{t==="Buses"?"Bus":t==="Drivers"?"Driver":"Person"}] {t}
          </button>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
        <input placeholder="[Search] Search bus ID, route, driver..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, maxWidth:280, background:T.surface, border:`1px solid ${T.border}`, borderRadius:3, padding:"7px 12px", color:T.text, fontSize:12, outline:"none" }} />
        <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>Filter by Status:</span>
        {["All","Active","Inactive","Maintenance"].map(f => (
          <Btn key={f} size="sm" variant={filterStatus===f?"primary":"default"} onClick={()=>setFilterStatus(f)}>{f}</Btn>
        ))}
        <div style={{ marginLeft:"auto" }}><Btn size="sm" variant="ghost">[Export] Export CSV</Btn></div>
      </div>
      {/* Table */}
      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"32px 1fr 1fr 1fr 80px 80px 90px 90px 100px", padding:"10px 16px", borderBottom:`1px solid ${T.border}`, background:T.bg }}>
          {["","Bus ID","Plate No.","Route","Capacity","Driver","Status","Last Active","Actions"].map((h,i) => (
            <div key={i} style={{ fontSize:10, color:T.textDim, fontFamily:"'IBM Plex Mono', monospace", fontWeight:600 }}>{h}</div>
          ))}
        </div>
        {(tab==="Buses" ? filtered : tab==="Drivers" ? DRIVERS : []).map((item, i) => {
          const bus = tab==="Buses" ? item : null;
          const drv = tab==="Drivers" ? item : null;
          const inactive = bus ? bus.status!=="ACTIVE" : false;
          return (
            <div key={item.id} style={{ display:"grid", gridTemplateColumns:"32px 1fr 1fr 1fr 80px 80px 90px 90px 100px", padding:"10px 16px",
              borderBottom:`1px solid ${T.border}`, opacity: inactive ? 0.5 : 1,
              background: i%2===0 ? "transparent" : "rgba(255,255,255,0.01)",
              transition:"background 0.1s" }}
              onMouseEnter={e=>e.currentTarget.style.background=T.surfaceHover}
              onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":"rgba(255,255,255,0.01)"}>
              <div><input type="checkbox" style={{ accentColor:T.text }} /></div>
              <div style={{ fontSize:12, fontFamily:"'IBM Plex Mono', monospace", fontWeight:600 }}>{bus ? bus.id : drv?.id}</div>
              <div style={{ fontSize:12, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>{bus ? bus.plate : drv?.bus}</div>
              <div style={{ fontSize:12, color:T.textMuted }}>{bus ? bus.route : drv?.route}</div>
              <div style={{ fontSize:12, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>{bus ? bus.cap : drv?.trips}</div>
              <div style={{ fontSize:12, color:T.textMuted }}>{bus ? bus.driver : drv?.name}</div>
              <div><Badge variant={statusVariant(bus ? bus.status : drv?.status || "ACTIVE")}>{bus ? bus.status : drv?.status}</Badge></div>
              <div style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>{bus ? bus.last : drv?.joined}</div>
              <div style={{ display:"flex", gap:6 }}>
                <Btn size="sm">[Edit]</Btn>
                <Btn size="sm" variant="danger">[Delete]</Btn>
              </div>
            </div>
          );
        })}
        {tab==="Passengers" && (
          <div style={{ padding:40, textAlign:"center", color:T.textMuted, fontSize:12, fontFamily:"'IBM Plex Mono', monospace" }}>
            Select the Passengers tab to view passenger records
          </div>
        )}
      </Card>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:12 }}>
        <div style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>Showing {filtered.length} of 32 buses</div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Btn size="sm" variant="ghost">[&lt; Prev]</Btn>
          {[1,2,3,4].map(p => <Btn key={p} size="sm" variant={page===p?"primary":"ghost"} onClick={()=>setPageNum(p)}>{p}</Btn>)}
          <Btn size="sm" variant="ghost">[ Next &gt;]</Btn>
        </div>
        <div style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>Rows per page: [ 10 ▾]</div>
      </div>
      {/* Modal */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <Card className="anim-fade" style={{ width:460, padding:28 }}>
            <div style={{ fontSize:14, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace", marginBottom:20 }}>
              [+] Add New {tab.slice(0,-1)}
            </div>
            {["Bus ID / Plate","Route","Capacity","Assigned Driver","Status"].map(f => (
              <div key={f} style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, color:T.textMuted, display:"block", marginBottom:5, fontFamily:"'IBM Plex Mono', monospace" }}>{f}</label>
                <input placeholder={`Enter ${f.toLowerCase()}`} style={{ width:"100%", background:T.bg, border:`1px solid ${T.border}`, borderRadius:3, padding:"8px 12px", color:T.text, fontSize:12, outline:"none" }} />
              </div>
            ))}
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
              <Btn variant="ghost" onClick={()=>setShowModal(false)}>Cancel</Btn>
              <Btn variant="primary" onClick={()=>setShowModal(false)}>Save Record</Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ─── ROUTES PAGE ──────────────────────────────────────────────────────────────
const RoutesPage = () => {
  const [selected, setSelected] = useState(ROUTES[0]);

  return (
    <div className="anim-fade" style={{ padding:24 }}>
      <PageHeader title="Route Management" right={<Btn variant="primary">[+] Add New Route</Btn>} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, height:"calc(100vh - 180px)" }}>
        {/* Left */}
        <div style={{ overflow:"auto", display:"flex", flexDirection:"column", gap:10 }}>
          <input placeholder="[Search] Search routes, stops, bus numbers..." style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:3, padding:"8px 12px", color:T.text, fontSize:12, outline:"none" }} />
          {ROUTES.map(r => (
            <div key={r.id} onClick={() => setSelected(r)} style={{ background: selected?.id===r.id ? "#1a1a1a" : T.surface,
              border: `1px solid ${selected?.id===r.id ? T.borderActive : T.border}`, borderRadius:4, padding:16, cursor:"pointer",
              opacity: r.status==="INACTIVE" ? 0.5 : 1, transition:"all 0.15s" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ fontSize:13, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace" }}>
                  {r.name} — {r.from} → {r.via} → {r.to}
                </div>
                {selected?.id===r.id && <Badge variant="active">SELECTED</Badge>}
              </div>
              <div style={{ fontSize:11, color:T.textMuted, marginBottom:4 }}>
                Stops: {r.stops} | Distance: {r.distance} km | Duration: {r.duration} | Status: <Badge variant={r.status==="ACTIVE"?"active":"inactive"}>{r.status}</Badge>
              </div>
              <div style={{ fontSize:11, color:T.textMuted, marginBottom:4 }}>Buses assigned: {r.buses.join(", ")||"—"}</div>
              <div style={{ fontSize:11, color:T.textMuted, marginBottom:12 }}>Schedule: {r.schedule} | Frequency: {r.freq}</div>
              <div style={{ display:"flex", gap:8 }}>
                <Btn size="sm">[Edit]</Btn>
                <Btn size="sm" variant="danger">[Delete]</Btn>
              </div>
            </div>
          ))}
        </div>
        {/* Right */}
        {selected && (
          <Card className="anim-fade" style={{ overflow:"auto", display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ fontSize:13, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace" }}>Route Detail — {selected.name}</div>
              <Btn size="sm">[Edit Route]</Btn>
            </div>
            {/* Map preview */}
            <div style={{ height:160, background:T.bg, border:`1px solid ${T.border}`, borderRadius:4, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:"80%", height:2, background:T.border, position:"relative" }}>
                  {selected.stopList.slice(0,selected.stopList.length).map((_,i,arr) => (
                    <div key={i} style={{ position:"absolute", left:`${(i/(arr.length-1))*100}%`, top:"50%", transform:"translate(-50%,-50%)",
                      width:10, height:10, borderRadius:"50%", background: i===0||i===arr.length-1 ? T.text : T.surface,
                      border:`2px solid ${T.borderActive}` }} />
                  ))}
                </div>
              </div>
              <div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)", fontSize:10, color:T.textDim, fontFamily:"'IBM Plex Mono', monospace" }}>
                [ Route Map Preview ]
              </div>
            </div>
            {/* Stops */}
            <div>
              <div style={{ fontSize:12, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace", marginBottom:10 }}>Stops ({selected.stops} total)</div>
              {selected.stopList.map((s,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background: i===0||i===selected.stopList.length-1 ? T.text : T.surface,
                    border:`2px solid ${T.borderActive}`, display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:9, color:T.bg, fontFamily:"'IBM Plex Mono', monospace", flexShrink:0 }}>{i+1}</div>
                  <div style={{ fontSize:12, fontFamily:"'IBM Plex Mono', monospace", color: s.includes("…")?T.textDim:T.text }}>{i+1}. {s}</div>
                </div>
              ))}
              <div style={{ marginTop:10 }}><Btn size="sm">[+] Add Stop</Btn></div>
            </div>
            {/* Assigned Buses */}
            <div>
              <div style={{ fontSize:12, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace", marginBottom:10 }}>Assigned Buses</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {selected.buses.map(b => <Btn key={b} size="sm">{b}</Btn>)}
                <Btn size="sm" variant="success">[+] Assign Bus</Btn>
              </div>
            </div>
            <div style={{ marginTop:"auto" }}>
              <Btn variant="primary" style={{ width:"100%" }}>SAVE CHANGES</Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// ─── ALERTS PAGE ──────────────────────────────────────────────────────────────
const AlertsPage = () => {
  const [tab, setTab] = useState("All (14)");
  const [selected, setSelected] = useState(ALERTS[0]);
  const [note, setNote] = useState("");

  const active = ALERTS.filter(a => a.status==="ACTIVE");
  const tabs = ["All (14)","Active (2)","Resolved (12)","Today (5)"];

  const filtered = tab.startsWith("Active") ? active : tab.startsWith("Resolved") ? ALERTS.filter(a=>a.status==="RESOLVED") : ALERTS;

  return (
    <div className="anim-fade" style={{ padding:24 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <h2 style={{ fontSize:16, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace" }}>Emergency Alert Management</h2>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ background:T.dangerBg, border:`1px solid ${T.danger}`, borderRadius:3, padding:"6px 16px", fontSize:12, fontFamily:"'IBM Plex Mono', monospace", color:T.danger, animation:"pulse 2s infinite" }}>
            [ {active.length} ACTIVE ALERTS ]
          </div>
          <Btn variant="warning">[Bell] Notify All Passengers</Btn>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.2fr", gap:16, height:"calc(100vh - 185px)" }}>
        {/* Left */}
        <div style={{ display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", gap:2, marginBottom:12 }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ background: tab===t ? T.surface:"none", border:`1px solid ${tab===t?T.borderActive:T.border}`, borderRadius:3, color: tab===t?T.text:T.textMuted, fontSize:11, fontFamily:"'IBM Plex Mono', monospace", padding:"6px 14px", cursor:"pointer" }}>{t}</button>
            ))}
          </div>
          <Card style={{ padding:"8px 0", flex:1, overflow:"auto" }}>
            <div style={{ padding:"6px 14px 10px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr", borderBottom:`1px solid ${T.border}` }}>
              {["ID","Type","Driver","Bus","Location","Time Status"].map(h=>(
                <div key={h} style={{ fontSize:10, color:T.textDim, fontFamily:"'IBM Plex Mono', monospace" }}>{h}</div>
              ))}
            </div>
            {filtered.map(a => (
              <div key={a.id} onClick={()=>setSelected(a)} style={{ padding:"10px 14px", cursor:"pointer",
                background: selected?.id===a.id ? T.surfaceHover : a.status==="ACTIVE" ? T.dangerBg : "transparent",
                borderLeft: `3px solid ${a.status==="ACTIVE" ? T.danger : "transparent"}`,
                borderBottom:`1px solid ${T.border}`, opacity: a.status==="RESOLVED"?0.6:1,
                display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ flex:1 }}>
                  {a.status==="ACTIVE" && <Badge variant="alert">[ACTIVE]</Badge>}
                  <span style={{ fontSize:11, fontFamily:"'IBM Plex Mono', monospace", marginLeft:6, color:T.text }}>
                    {a.id} {a.type} {a.driver} {a.bus} {a.location} {a.time}
                    {a.status==="RESOLVED" && <span style={{ color:"#66aa77" }}> [ RESOLVED ]</span>}
                    <span style={{ color:T.textDim }}> [View]</span>
                  </span>
                </div>
              </div>
            ))}
            <div style={{ padding:"12px 14px", textAlign:"center" }}>
              <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>[ Load more alerts... ]</span>
            </div>
          </Card>
        </div>
        {/* Right - Detail */}
        {selected && (
          <Card className="anim-fade" style={{ overflow:"auto" }}>
            <div style={{ fontSize:13, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace", marginBottom:16 }}>
              Alert Detail — {selected.id} [<span style={{ color:selected.status==="ACTIVE"?T.danger:"#66aa77" }}>{selected.status}</span>]
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, padding:14, background:T.dangerBg, border:`1px solid #3a1212`, borderRadius:4 }}>
              <div style={{ fontSize:20 }}>
                {selected.type==="Medical"?"[+]":selected.type==="Breakdown"?"⚠":selected.type==="Accident"?"!":"🔒"}
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, fontFamily:"'IBM Plex Mono', monospace", color:T.danger, letterSpacing:"0.05em" }}>{selected.type.toUpperCase()} EMERGENCY</div>
                <div style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>Received: {selected.time} | Duration: 27 mins ago</div>
              </div>
            </div>
            {[
              ["Driver:", selected.driver+" (DRV-004)"],
              ["Bus:", `Bus 01 (${selected.bus})`],
              ["Location:", `${selected.location} Bus Stand | GPS: ${selected.gps}`],
              ["Route:", selected.route],
              ["Passengers:", "38 on board | All safe — status unknown"],
              ["Description:", selected.desc],
            ].map(([k,v]) => (
              <div key={k} style={{ display:"grid", gridTemplateColumns:"110px 1fr", gap:8, marginBottom:8 }}>
                <div style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>{k}</div>
                <div style={{ fontSize:12, fontFamily:"'IBM Plex Mono', monospace", color:k==="Description:"?T.text:T.text, fontWeight: k==="Driver:"||k==="Description:"?600:400 }}>{v}</div>
              </div>
            ))}
            <div style={{ height:100, background:T.bg, border:`1px solid ${T.border}`, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", margin:"12px 0" }}>
              <span style={{ fontSize:11, color:T.textDim, fontFamily:"'IBM Plex Mono', monospace" }}>[ Incident Location Map — {selected.location} Bus Stand ]</span>
            </div>
            <div style={{ fontSize:12, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace", marginBottom:8 }}>Admin Notes / Response Log</div>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add admin response note here..."
              style={{ width:"100%", height:70, background:T.bg, border:`1px solid ${T.border}`, borderRadius:3, padding:"8px 12px", color:T.text, fontSize:12, resize:"vertical", outline:"none", fontFamily:"'IBM Plex Mono', monospace" }} />
            <div style={{ display:"flex", gap:10, marginTop:12 }}>
              <Btn variant={selected.status==="ACTIVE"?"primary":"ghost"}>[Resolve] MARK RESOLVED</Btn>
              <Btn variant="warning">[Alert] Notify Passengers</Btn>
              <Btn>[Call] Contact Driver</Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// ─── RATINGS PAGE ─────────────────────────────────────────────────────────────
const RatingsPage = () => {
  const [selected, setSelected] = useState(DRIVERS[0]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Rating");

  const stars = (n) => {
    const full = Math.round(n/2);
    return "★".repeat(full) + "☆".repeat(5-full);
  };

  return (
    <div className="anim-fade" style={{ padding:24 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <h2 style={{ fontSize:16, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace" }}>Driver Rating Management</h2>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ background:"#0d2a1a", border:`1px solid #1a4a2a`, borderRadius:3, padding:"6px 16px", fontSize:12, fontFamily:"'IBM Plex Mono', monospace", color:T.success }}>
            [ ML Model: ACTIVE ]
          </div>
          <Btn variant="ghost">[Export] Export Report</Btn>
        </div>
      </div>
      <div style={{ display:"flex", gap:14, marginBottom:16 }}>
        <StatCard label="System Avg Rating" value="7.4 / 10" sub="ML Generated" icon="Star" />
        <StatCard label="Total Drivers Rated" value="48" sub="" icon="Driver" />
        <StatCard label="Total Passenger Comments" value="5,840" sub="" icon="Comment" />
        <StatCard label="Low-rated Drivers (Below 5)" value="3" sub="" icon="Alert" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.3fr", gap:16, height:"calc(100vh - 310px)" }}>
        {/* Left */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <input placeholder="[Search] Search driver name or ID..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{ flex:1, background:T.surface, border:`1px solid ${T.border}`, borderRadius:3, padding:"7px 12px", color:T.text, fontSize:12, outline:"none" }} />
            <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>Sort by:</span>
            {["Rating","Name","Comments"].map(s => <Btn key={s} size="sm" variant={sortBy===s?"primary":"default"} onClick={()=>setSortBy(s)}>{s}{s==="Rating"?" ▾":""}</Btn>)}
          </div>
          <Card style={{ flex:1, overflow:"auto", padding:"8px 0" }}>
            <div style={{ padding:"6px 14px 10px", display:"grid", gridTemplateColumns:"30px 1fr 70px 120px 80px 60px", borderBottom:`1px solid ${T.border}` }}>
              {["Rank","Driver ID Name","Trips","ML Rating","Sub-ratings","Cmts"].map(h=>(
                <div key={h} style={{ fontSize:10, color:T.textDim, fontFamily:"'IBM Plex Mono', monospace" }}>{h}</div>
              ))}
            </div>
            {DRIVERS.map((d, i) => (
              <div key={d.id} onClick={()=>setSelected(d)} style={{ padding:"10px 14px", cursor:"pointer",
                background: selected?.id===d.id ? T.surfaceHover : d.rating < 5 ? T.dangerBg : "transparent",
                borderBottom:`1px solid ${T.border}`, display:"grid", gridTemplateColumns:"30px 1fr 70px 120px 80px 60px", alignItems:"center",
                borderLeft: d.rating < 5 ? `3px solid ${T.danger}` : "3px solid transparent" }}>
                <div style={{ fontSize:12, color:d.rating>=7.5?T.success:d.rating<5?T.danger:T.text, fontFamily:"'IBM Plex Mono', monospace", fontWeight:700 }}>
                  {d.rating >= 7.5 ? `#${i+1}` : ""}
                </div>
                <div style={{ fontSize:11, fontFamily:"'IBM Plex Mono', monospace" }}>{d.id} {d.name}</div>
                <div style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>{d.trips}</div>
                <div style={{ fontSize:12, fontFamily:"'IBM Plex Mono', monospace" }}>
                  <span style={{ color: d.rating>=7?T.success:d.rating<5?T.danger:T.warning }}>{stars(d.rating)}</span> {d.rating}
                </div>
                <div style={{ fontSize:10, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>9/10 8/10 9/10</div>
                <div style={{ display:"flex", gap:4 }}>
                  <Btn size="sm">{d.rating<5?"[Review]":"[View]"}</Btn>
                </div>
              </div>
            ))}
            <div style={{ padding:"10px 14px", textAlign:"center" }}>
              <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>[ Load more drivers... ]</span>
            </div>
          </Card>
        </div>
        {/* Right */}
        {selected && (
          <Card className="anim-fade" style={{ overflow:"auto" }}>
            <div style={{ fontSize:13, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace", marginBottom:16 }}>
              Driver Detail — {selected.name} ({selected.id})
            </div>
            <div style={{ display:"flex", gap:16, marginBottom:16, padding:14, background:T.bg, borderRadius:4, border:`1px solid ${T.border}` }}>
              <div style={{ width:60, height:60, borderRadius:"50%", background:T.surface, border:`2px solid ${T.borderActive}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontFamily:"'IBM Plex Mono', monospace", color:T.textMuted, flexShrink:0 }}>
                [DRV]
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:700 }}>{selected.name}</div>
                <div style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace", marginTop:4 }}>
                  ID: {selected.id} | {selected.bus} | {selected.trips} Trips | Joined: {selected.joined}
                </div>
                <div style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace", marginTop:2 }}>
                  Status: [<span style={{ color:T.success }}>ACTIVE</span>] | Route: {selected.route}
                </div>
              </div>
            </div>
            <div style={{ padding:14, background:T.bg, borderRadius:4, border:`1px solid ${T.border}`, marginBottom:14 }}>
              <div style={{ fontSize:10, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace", marginBottom:6 }}>
                [ ML Generated Rating — Based on 170 passenger comments ]
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ fontSize:28, color:T.warning }}>{stars(selected.rating)}</div>
                <div style={{ fontSize:32, fontWeight:700, fontFamily:"'IBM Plex Mono', monospace" }}>{selected.rating} / 10</div>
              </div>
              <div style={{ fontSize:12, color:T.textMuted, fontStyle:"italic", marginTop:4 }}>Efficient and punctual driver. Highly recommended.</div>
              <div style={{ fontSize:10, color:T.textDim, marginTop:2, fontFamily:"'IBM Plex Mono', monospace" }}>Last updated: 09:00 AM today</div>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace", marginBottom:10 }}>Rating Breakdown</div>
              {[["Punctuality",9],["Driving",8],["Friendliness",9]].map(([k,v]) => (
                <div key={k} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:11, color:T.textMuted }}>{k}</span>
                    <span style={{ fontSize:11, fontFamily:"'IBM Plex Mono', monospace" }}>{v}/10</span>
                  </div>
                  <div style={{ height:6, background:T.bg, borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${v*10}%`, background:T.success, borderRadius:3, transition:"width 0.5s" }} />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, fontFamily:"'IBM Plex Mono', monospace", marginBottom:10 }}>Passenger Comments (170 total)</div>
              {[
                { text:"Very punctual driver, arrived on time", stars:5, by:"Passenger A", date:"12 Feb 2025" },
                { text:"Smooth ride, very comfortable journey", stars:5, by:"Passenger B", date:"10 Feb 2025" },
                { text:"Good service, friendly and respectful driver", stars:4, by:"Passenger C", date:"08 Feb 2025" },
              ].map((c,i) => (
                <div key={i} style={{ padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ fontSize:12, fontStyle:"italic", color:T.text, flex:1 }}>"{c.text}"</div>
                    <div style={{ color:T.warning, fontSize:12, marginLeft:10 }}>{"★".repeat(c.stars)}</div>
                  </div>
                  <div style={{ fontSize:10, color:T.textDim, marginTop:4, fontFamily:"'IBM Plex Mono', monospace" }}>— {c.by} | {c.date}</div>
                </div>
              ))}
              <div style={{ textAlign:"center", marginTop:10 }}>
                <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'IBM Plex Mono', monospace" }}>[ View all 170 comments → ]</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <Btn variant="danger">[Flag] Driver</Btn>
              <Btn>[Mail] Email Driver</Btn>
              <Btn variant="ghost">[Export] Export Rating Report</Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// ─── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("Dashboard");

  const pages = { Dashboard:<DashboardPage setPage={setPage}/>, "Fleet Map":<FleetMapPage/>, CRUD:<CRUDPage/>, Routes:<RoutesPage/>, Alerts:<AlertsPage/>, Ratings:<RatingsPage/> };

  return (
    <>
      <style>{css}</style>
      {!loggedIn ? (
        <LoginPage onLogin={() => setLoggedIn(true)} />
      ) : (
        <div style={{ display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden" }}>
          {/* Browser bar mockup */}
          <div style={{ background:"#111", borderBottom:`1px solid ${T.border}`, padding:"6px 16px", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ display:"flex", gap:5 }}>
              {["#ff5f57","#ffbd2e","#28ca41"].map(c=><div key={c} style={{ width:10, height:10, borderRadius:"50%", background:c }}/>)}
            </div>
            <div style={{ flex:1, background:T.surface, border:`1px solid ${T.border}`, borderRadius:4, padding:"4px 12px", fontSize:11, fontFamily:"'IBM Plex Mono', monospace", color:T.textMuted, maxWidth:360, margin:"0 auto" }}>
              admin.bustrack.lk/{page.toLowerCase().replace(" ","-")}
            </div>
          </div>
          <NavBar page={page} setPage={setPage} />
          <div style={{ flex:1, overflow:"auto" }}>
            {pages[page]}
          </div>
        </div>
      )}
    </>
  );
}
