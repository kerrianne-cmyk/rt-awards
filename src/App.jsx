import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://rjlblqbbzstsdhgodmyx.supabase.co",
  "sb_publishable_Ob8HdKTDu2RTm_fXZ2cQrQ_4RM5l-3S"
);

const STAFF = ["Georgie", "Stew", "Amanda", "Sid", "Jason", "Emma", "Kerrianne"];
const ADMIN_PASSWORD = "rehab2026";

const CATEGORIES = [
  { id: "client_champion", emoji: "🏆", title: "Client Champion", description: "Went above and beyond for a customer this month", color: "#30E7D1", bg: "#0f3d38" },
  { id: "unsung_hero", emoji: "🙌", title: "Unsung Hero", description: "Quietly made everyone else's job easier", color: "#6093eb", bg: "#0f1a3d" },
  { id: "good_energy", emoji: "☀️", title: "Good Energy", description: "Showed up for the team when it counted", color: "#f5c842", bg: "#3d3000" },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentMonth = MONTHS[new Date().getMonth()];


// ── CONFETTI ─────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const colors = ["#30E7D1","#6093eb","#f5c842","#ff6b6b","#fff","#51E5FF","#ff9ff3"];
  if (!active) return null;
  const particles = Array.from({ length: 120 }, (_, i) => ({
    id: i, x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 2, size: Math.random() * 12 + 5,
    duration: Math.random() * 2.5 + 2, isCircle: Math.random() > 0.5,
  }));
  return (
    <>
      <style>{`@keyframes fall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}`}</style>
      {particles.map(p => (
        <div key={p.id} style={{
          position:"fixed",left:p.x+"%",top:"-10px",
          width:p.size+"px",height:p.size+"px",background:p.color,
          borderRadius:p.isCircle?"50%":"2px",zIndex:9999,
          animation:`fall ${p.duration}s ${p.delay}s ease-in forwards`,
        }}/>
      ))}
    </>
  );
}

// ── CELEBRATION OVERLAY ───────────────────────────────────────────────────────
function CelebrationOverlay({ winner, category, onDone }) {
  const [phase, setPhase] = useState("countdown"); // countdown | reveal | done
  const [count, setCount] = useState(3);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    if (phase === "countdown") {
      if (count > 0) {
        const t = setTimeout(() => setCount(c => c - 1), 900);
        return () => clearTimeout(t);
      } else {
        setTimeout(() => setPhase("reveal"), 400);
      }
    }
    if (phase === "reveal") {
      setTimeout(() => setShowName(true), 200);
      setTimeout(() => onDone(), 3200);
    }
  }, [phase, count]);

  return (
    <div style={{
      position:"fixed",inset:0,background:"rgba(10,22,40,0.97)",
      display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",zIndex:1000,fontFamily:"'DM Sans',sans-serif",
      textAlign:"center",padding:"24px",
    }}>
      <Confetti active={phase === "reveal"} />
      {phase === "countdown" && (
        <div key={count} style={{
          fontSize:"120px",fontFamily:"'Space Grotesk',sans-serif",
          color:category.color,lineHeight:1,
          animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          <style>{`@keyframes popIn{0%{transform:scale(0.3);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>
          {count === 0 ? "🎉" : count}
        </div>
      )}
      {phase === "reveal" && (
        <div style={{ opacity: showName ? 1 : 0, transform: showName ? "translateY(0)" : "translateY(30px)", transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>{category.emoji}</div>
          <div style={{ fontSize: "13px", letterSpacing: "4px", color: category.color, fontWeight: 700, textTransform: "uppercase", marginBottom: "16px" }}>
            {category.title}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "clamp(40px,10vw,80px)",
            color: "#fff", lineHeight: 1.1, marginBottom: "16px",
            textShadow: `0 0 60px ${category.color}80`,
          }}>
            {winner}
          </div>
          <div style={{ fontSize: "32px" }}>🎊</div>
        </div>
      )}
    </div>
  );
}

// ── FONTS / BASE ──────────────────────────────────────────────────────────────
const fonts = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap');`;
const baseWrap = { minHeight:"100vh",background:"#0a1628",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"'DM Sans',sans-serif" };

function Label({ children, color="#30E7D1" }) {
  return <div style={{ fontSize:"12px",letterSpacing:"4px",color,fontWeight:600,textTransform:"uppercase",marginBottom:"12px" }}>{children}</div>;
}

// ── VOTER SCREEN ──────────────────────────────────────────────────────────────
function VoterScreen({ onSelect, allVotes, onAdminClick, history }) {
  const [hovered, setHovered] = useState(null);

  // Build last month winner badges
  const lastMonth = history.length > 0 ? history[history.length - 1] : null;
  const prevWinners = lastMonth ? Object.values(lastMonth.winners) : [];

  return (
    <div style={baseWrap}>
      <style>{fonts}</style>
      <div style={{ textAlign:"center",marginBottom:"40px" }}>
        <Label>Rehab Technology</Label>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:"clamp(32px,6vw,52px)",color:"#fff",lineHeight:1.1,marginBottom:"12px" }}>
          Monthly Awards
        </h1>
        <p style={{ color:"#6b7fa3",fontSize:"16px" }}>{currentMonth} — Who's getting your vote?</p>
      </div>

      <div style={{ fontSize:"13px",letterSpacing:"3px",color:"#6b7fa3",textTransform:"uppercase",marginBottom:"20px",fontWeight:500 }}>
        Who are you?
      </div>

      <div style={{ display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"12px",width:"100%",maxWidth:"620px" }}>
        {STAFF.map(name => {
          const voted = !!allVotes[name];
          const wasWinner = prevWinners.includes(name);
          return (
            <button key={name}
              onMouseEnter={() => !voted && setHovered(name)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(name)}
              style={{
                background: voted ? "rgba(48,231,209,0.08)" : hovered===name ? "#30E7D1" : "rgba(255,255,255,0.05)",
                border:`1px solid ${voted?"#30E7D130":hovered===name?"#30E7D1":"rgba(255,255,255,0.1)"}`,
                borderRadius:"12px",padding:"18px 16px 14px",
                color: voted?"#30E7D1":hovered===name?"#0a1628":"#fff",
                fontSize:"15px",fontWeight:600,cursor:voted?"default":"pointer",
                transition:"all 0.2s ease",
                transform:hovered===name&&!voted?"translateY(-2px)":"none",
                fontFamily:"'DM Sans',sans-serif",position:"relative",
                width:"140px",
              }}>
              {voted ? "✓ " : ""}{name}

            </button>
          );
        })}
      </div>

      <p style={{ color:"#3a4d6b",fontSize:"13px",marginTop:"28px" }}>
        Voting is anonymous — we just use this to prevent duplicates
      </p>

      <button onClick={onAdminClick} style={{
        marginTop:"40px",background:"none",border:"none",
        color:"#2a3a52",fontSize:"12px",cursor:"pointer",
        fontFamily:"'DM Sans',sans-serif",letterSpacing:"1px",
      }}>Admin access</button>
    </div>
  );
}

// ── VOTING SCREEN ─────────────────────────────────────────────────────────────
function VotingScreen({ voter, onComplete }) {
  const [step, setStep] = useState(0);
  const [votes, setVotes] = useState({});
  const [reasons, setReasons] = useState({});
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);
  const cat = CATEGORIES[step];
  const available = STAFF.filter(s => s !== voter);

  function handleNext() {
    if (!selected) return;
    setAnimating(true);
    const nv = { ...votes, [cat.id]: selected };
    const nr = { ...reasons, [cat.id]: reasons[cat.id] || "" };
    setTimeout(() => {
      if (step < CATEGORIES.length - 1) {
        setVotes(nv); setReasons(nr);
        setStep(step + 1); setSelected(null); setAnimating(false);
      } else { onComplete(nv, nr); }
    }, 300);
  }

  return (
    <div style={{ ...baseWrap, transition:"opacity 0.3s", opacity:animating?0:1 }}>
      <style>{`${fonts} textarea{resize:none;outline:none} textarea::placeholder{color:#3a4d6b}`}</style>
      <div style={{ display:"flex",gap:"8px",marginBottom:"40px" }}>
        {CATEGORIES.map((c,i) => (
          <div key={c.id} style={{ width:"40px",height:"4px",borderRadius:"2px",background:i<=step?c.color:"rgba(255,255,255,0.1)",transition:"background 0.3s" }}/>
        ))}
      </div>
      <div style={{ background:`linear-gradient(135deg,${cat.bg},rgba(10,22,40,0.8))`,border:`1px solid ${cat.color}30`,borderRadius:"20px",padding:"32px",width:"100%",maxWidth:"560px",marginBottom:"24px",textAlign:"center" }}>
        <div style={{ fontSize:"48px",marginBottom:"12px" }}>{cat.emoji}</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:"28px",color:cat.color,marginBottom:"8px" }}>{cat.title}</h2>
        <p style={{ color:"#6b7fa3",fontSize:"15px" }}>{cat.description}</p>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",width:"100%",maxWidth:"560px",marginBottom:"20px" }}>
        {available.map(name => (
          <button key={name} onClick={() => setSelected(name)} style={{
            background:selected===name?cat.color:"rgba(255,255,255,0.04)",
            border:`2px solid ${selected===name?cat.color:"rgba(255,255,255,0.08)"}`,
            borderRadius:"12px",padding:"16px 10px",
            color:selected===name?"#0a1628":"#fff",
            fontSize:"15px",fontWeight:selected===name?700:500,
            cursor:"pointer",transition:"all 0.15s ease",
            transform:selected===name?"scale(1.03)":"scale(1)",
            fontFamily:"'DM Sans',sans-serif",
          }}>{selected===name?"✓ ":""}{name}</button>
        ))}
      </div>
      {selected && (
        <div style={{ width:"100%",maxWidth:"560px",marginBottom:"20px" }}>
          <textarea
            placeholder={`Why does ${selected} deserve this? (one sentence)`}
            value={reasons[cat.id]||""}
            onChange={e => setReasons({...reasons,[cat.id]:e.target.value})}
            rows={2}
            style={{ width:"100%",background:"rgba(255,255,255,0.04)",border:`1px solid ${cat.color}40`,borderRadius:"12px",padding:"14px 16px",color:"#fff",fontSize:"14px",fontFamily:"'DM Sans',sans-serif" }}
          />
        </div>
      )}
      <button onClick={handleNext} disabled={!selected} style={{
        background:selected?cat.color:"rgba(255,255,255,0.05)",border:"none",borderRadius:"12px",padding:"16px 48px",
        color:selected?"#0a1628":"#3a4d6b",fontSize:"16px",fontWeight:700,
        cursor:selected?"pointer":"not-allowed",transition:"all 0.2s",
        fontFamily:"'DM Sans',sans-serif",width:"100%",maxWidth:"560px",
      }}>
        {step < CATEGORIES.length-1 ? `Next: ${CATEGORIES[step+1].title} →` : "Submit my votes 🎉"}
      </button>
      <p style={{ color:"#3a4d6b",fontSize:"13px",marginTop:"16px" }}>Voting as {voter} · {step+1} of {CATEGORIES.length}</p>
    </div>
  );
}

// ── THANKS SCREEN ─────────────────────────────────────────────────────────────
function ThanksScreen({ voter, onBack }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);
  return (
    <div style={{ ...baseWrap, textAlign:"center" }}>
      <style>{fonts}</style>
      <div style={{ opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all 0.6s ease" }}>
        <div style={{ fontSize:"72px",marginBottom:"24px" }}>🎉</div>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:"clamp(28px,6vw,44px)",color:"#fff",marginBottom:"16px" }}>Votes submitted!</h1>
        <p style={{ color:"#6b7fa3",fontSize:"18px",marginBottom:"8px" }}>Thanks {voter}. Your nominations are in.</p>
        <p style={{ color:"#3a4d6b",fontSize:"14px",marginBottom:"48px" }}>Results will be revealed at the end of the month.</p>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px",padding:"14px 32px",color:"#fff",fontSize:"15px",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>← Back to home</button>
      </div>
    </div>
  );
}

// ── NOMINATION WALL ───────────────────────────────────────────────────────────
function NominationWall({ allVotes, onBack }) {
  const all = [];
  CATEGORIES.forEach(cat => {
    Object.entries(allVotes).forEach(([voter, { votes, reasons }]) => {
      if (reasons[cat.id]) {
        all.push({ cat, reason: reasons[cat.id] });
      }
    });
  });

  // Shuffle
  const shuffled = [...all].sort(() => Math.random() - 0.5);

  return (
    <div style={{ minHeight:"100vh",background:"#0a1628",padding:"40px 24px",fontFamily:"'DM Sans',sans-serif" }}>
      <style>{fonts}</style>
      <div style={{ maxWidth:"680px",margin:"0 auto" }}>
        <div style={{ textAlign:"center",marginBottom:"40px" }}>
          <Label>Kind Words</Label>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:"32px",color:"#fff",marginBottom:"8px" }}>Nomination Wall</h1>
          <p style={{ color:"#6b7fa3",fontSize:"15px" }}>What the team said this month — names kept private</p>
        </div>

        {shuffled.length === 0 ? (
          <div style={{ textAlign:"center",color:"#3a4d6b",fontSize:"16px",marginTop:"60px" }}>
            <div style={{ fontSize:"48px",marginBottom:"16px" }}>💬</div>
            <p>No nominations yet. Check back once voting opens.</p>
          </div>
        ) : (
          <div style={{ columns:"1",gap:"16px" }}>
            {shuffled.map((item, i) => (
              <div key={i} style={{
                background:"rgba(255,255,255,0.03)",
                border:`1px solid ${item.cat.color}20`,
                borderRadius:"16px",padding:"24px",marginBottom:"16px",
                borderLeft:`4px solid ${item.cat.color}`,
                animation:`fadeUp 0.4s ${i*0.08}s both ease-out`,
              }}>
                <style>{`@keyframes fadeUp{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}`}</style>
                <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px" }}>
                  <span style={{ fontSize:"16px" }}>{item.cat.emoji}</span>
                  <span style={{ fontSize:"11px",color:item.cat.color,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase" }}>{item.cat.title}</span>
                </div>
                <p style={{ color:"#fff",fontSize:"16px",lineHeight:1.6,fontStyle:"italic" }}>"{item.reason}"</p>
              </div>
            ))}
          </div>
        )}

        <button onClick={onBack} style={{ background:"none",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",padding:"12px",width:"100%",color:"#6b7fa3",fontSize:"14px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:"24px" }}>← Back</button>
      </div>
    </div>
  );
}

// ── ADMIN LOGIN ───────────────────────────────────────────────────────────────
function AdminLogin({ onSuccess, onBack }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  function attempt() {
    if (pw === ADMIN_PASSWORD) { onSuccess(); }
    else { setError(true); setTimeout(() => setError(false), 1500); }
  }
  return (
    <div style={{ ...baseWrap, textAlign:"center" }}>
      <style>{`${fonts} input{outline:none}`}</style>
      <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",padding:"40px",width:"100%",maxWidth:"360px" }}>
        <div style={{ fontSize:"32px",marginBottom:"16px" }}>🔒</div>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:"22px",color:"#fff",marginBottom:"8px" }}>Admin Access</h2>
        <p style={{ color:"#6b7fa3",fontSize:"14px",marginBottom:"28px" }}>For results and announcements only</p>
        <input type="password" placeholder="Password" value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key==="Enter" && attempt()}
          style={{ width:"100%",background:"rgba(255,255,255,0.06)",border:`1px solid ${error?"#ff6b6b":"rgba(255,255,255,0.1)"}`,borderRadius:"10px",padding:"12px 16px",color:"#fff",fontSize:"15px",fontFamily:"'DM Sans',sans-serif",marginBottom:"12px",transition:"border 0.2s" }}
        />
        {error && <p style={{ color:"#ff6b6b",fontSize:"13px",marginBottom:"12px" }}>Incorrect password</p>}
        <button onClick={attempt} style={{ background:"#30E7D1",border:"none",borderRadius:"10px",padding:"12px",width:"100%",color:"#0a1628",fontSize:"15px",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"12px" }}>Enter</button>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"#3a4d6b",fontSize:"13px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>← Back</button>
      </div>
    </div>
  );
}

// ── ADMIN DASHBOARD ───────────────────────────────────────────────────────────
function AdminDashboard({ allVotes, history, onBack, onSaveMonth }) {
  const [view, setView] = useState("results");
  const [copied, setCopied] = useState(false);
  const [celebCat, setCelebCat] = useState(null);
  const [revealQueue, setRevealQueue] = useState([]);
  const [revealDone, setRevealDone] = useState([]);

  // Tally
  const catTotals = {};
  const reasonsByCategory = {};
  CATEGORIES.forEach(cat => {
    catTotals[cat.id] = {};
    reasonsByCategory[cat.id] = [];
    STAFF.forEach(s => { catTotals[cat.id][s] = 0; });
  });
  Object.entries(allVotes).forEach(([, { votes, reasons }]) => {
    CATEGORIES.forEach(cat => {
      const nominee = votes[cat.id];
      if (nominee) {
        catTotals[cat.id][nominee] = (catTotals[cat.id][nominee]||0) + 1;
        if (reasons[cat.id]) reasonsByCategory[cat.id].push({ nominee, reason: reasons[cat.id] });
      }
    });
  });
  const winners = {};
  CATEGORIES.forEach(cat => {
    const sorted = Object.entries(catTotals[cat.id]).sort((a,b) => b[1]-a[1]);
    winners[cat.id] = sorted[0]&&sorted[0][1]>0 ? sorted[0][0] : null;
  });

  const totalVoters = Object.keys(allVotes).length;

  function startReveal() {
    setRevealQueue([...CATEGORIES]);
    setRevealDone([]);
  }

  function handleCelebDone() {
    const current = revealQueue[0];
    setRevealDone(prev => [...prev, current.id]);
    setRevealQueue(prev => prev.slice(1));
    setCelebCat(null);
  }

  useEffect(() => {
    if (revealQueue.length > 0 && !celebCat) {
      const next = revealQueue[0];
      if (winners[next.id]) {
        setTimeout(() => setCelebCat(next), 600);
      } else {
        setRevealDone(prev => [...prev, next.id]);
        setRevealQueue(prev => prev.slice(1));
      }
    }
  }, [revealQueue, celebCat]);

  function buildText() {
    let t = `Hey team,\n\nThe votes are in for ${currentMonth}. Thank you to everyone who nominated. Here are your winners:\n\n`;
    CATEGORIES.forEach(cat => {
      const w = winners[cat.id];
      const wr = w ? reasonsByCategory[cat.id].filter(r => r.nominee===w) : [];
      t += `${cat.emoji} ${cat.title.toUpperCase()}\n${w||"No votes yet"}\n`;
      if (wr.length>0) wr.forEach(r => { t += `"${r.reason}"\n`; });
      t += "\n";
    });
    t += `Congratulations to all three. Your rewards are on their way.\n\nNominations open again next month. Keep an eye out.`;
    return t;
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildText()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  const tabs = ["results","announcement","history"];

  return (
    <div style={{ minHeight:"100vh",background:"#0a1628",padding:"40px 24px",fontFamily:"'DM Sans',sans-serif" }}>
      <style>{fonts}</style>

      {celebCat && winners[celebCat.id] && (
        <CelebrationOverlay winner={winners[celebCat.id]} category={celebCat} onDone={handleCelebDone} />
      )}

      <div style={{ maxWidth:"700px",margin:"0 auto" }}>
        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"28px",flexWrap:"wrap",gap:"16px" }}>
          <div>
            <Label>Admin View</Label>
            <h1 style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:"26px",color:"#fff",margin:"0 0 4px" }}>{currentMonth} Awards</h1>
            <p style={{ color:"#6b7fa3",fontSize:"14px" }}>{totalVoters} of {STAFF.length} votes in</p>
          </div>
          <div style={{ display:"flex",gap:"6px",flexWrap:"wrap" }}>
            {tabs.map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                background:view===v?"#30E7D1":"rgba(255,255,255,0.05)",
                border:`1px solid ${view===v?"#30E7D1":"rgba(255,255,255,0.1)"}`,
                borderRadius:"8px",padding:"7px 14px",
                color:view===v?"#0a1628":"#fff",
                fontSize:"12px",fontWeight:600,cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",textTransform:"capitalize",
              }}>{v}</button>
            ))}
          </div>
        </div>

        {/* Who's voted */}
        <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"14px",padding:"18px",marginBottom:"20px" }}>
          <p style={{ color:"#6b7fa3",fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",marginBottom:"10px" }}>Who's voted</p>
          <div style={{ display:"flex",flexWrap:"wrap",gap:"8px" }}>
            {STAFF.map(name => {
              const has = !!allVotes[name];
              return (
                <div key={name} style={{ padding:"4px 12px",borderRadius:"100px",background:has?"#30E7D120":"rgba(255,255,255,0.04)",border:`1px solid ${has?"#30E7D140":"rgba(255,255,255,0.06)"}`,color:has?"#30E7D1":"#3a4d6b",fontSize:"13px",fontWeight:has?600:400 }}>
                  {has?"✓ ":""}{name}
                </div>
              );
            })}
          </div>
        </div>

        {/* RESULTS */}
        {view==="results" && (
          <>
            {CATEGORIES.map(cat => {
              const vs = catTotals[cat.id];
              const max = Math.max(...Object.values(vs), 1);
              const sorted = Object.entries(vs).sort((a,b)=>b[1]-a[1]).filter(([,v])=>v>0);
              return (
                <div key={cat.id} style={{ background:"rgba(255,255,255,0.03)",border:`1px solid ${cat.color}20`,borderRadius:"18px",padding:"22px",marginBottom:"16px" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"18px",flexWrap:"wrap" }}>
                    <span style={{ fontSize:"20px" }}>{cat.emoji}</span>
                    <h3 style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:"17px",color:cat.color,margin:0 }}>{cat.title}</h3>
                    {winners[cat.id] && (
                      <span style={{ marginLeft:"auto",background:`${cat.color}20`,border:`1px solid ${cat.color}40`,borderRadius:"100px",padding:"2px 10px",color:cat.color,fontSize:"12px",fontWeight:600 }}>
                        Winner: {winners[cat.id]}
                      </span>
                    )}
                  </div>
                  {sorted.length===0 ? <p style={{ color:"#3a4d6b",fontSize:"14px" }}>No votes yet</p> : sorted.map(([name,count]) => (
                    <div key={name} style={{ marginBottom:"10px" }}>
                      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"4px" }}>
                        <span style={{ color:name===winners[cat.id]?"#fff":"#8899aa",fontSize:"14px",fontWeight:name===winners[cat.id]?700:400 }}>{name}</span>
                        <span style={{ color:cat.color,fontSize:"14px",fontWeight:700 }}>{count}</span>
                      </div>
                      <div style={{ background:"rgba(255,255,255,0.06)",borderRadius:"4px",height:"6px",overflow:"hidden" }}>
                        <div style={{ background:cat.color,height:"100%",width:`${(count/max)*100}%`,borderRadius:"4px" }}/>
                      </div>
                    </div>
                  ))}
                  {reasonsByCategory[cat.id].length>0 && (
                    <div style={{ marginTop:"14px",borderTop:`1px solid ${cat.color}15`,paddingTop:"12px" }}>
                      <p style={{ color:"#6b7fa3",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"8px" }}>All nominations</p>
                      {reasonsByCategory[cat.id].map((r,i) => (
                        <div key={i} style={{ borderLeft:`3px solid ${cat.color}`,borderRadius:"0 8px 8px 0",padding:"7px 12px",marginBottom:"6px",background:`${cat.color}08` }}>
                          <p style={{ color:"#fff",fontSize:"13px",marginBottom:"3px" }}>"{r.reason}"</p>
                          <p style={{ color:"#6b7fa3",fontSize:"11px" }}>For {r.nominee}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ANNOUNCEMENT */}
        {view==="announcement" && (
          <div>
            <div style={{ background:"rgba(48,231,209,0.05)",border:"1px solid #30E7D120",borderRadius:"12px",padding:"14px 18px",marginBottom:"20px" }}>
              <p style={{ color:"#30E7D1",fontSize:"13px",lineHeight:1.5 }}>
                Hit "Reveal winners" for a dramatic one-by-one reveal you can run in your team meeting. Or just copy the text below.
              </p>
            </div>

            <button onClick={startReveal} style={{
              background:"linear-gradient(135deg,#30E7D1,#6093eb)",border:"none",borderRadius:"14px",
              padding:"18px",width:"100%",color:"#0a1628",fontSize:"17px",fontWeight:700,
              cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"16px",letterSpacing:"0.5px",
            }}>
              🎬 Reveal winners
            </button>

            <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",padding:"32px",marginBottom:"16px" }}>
              <p style={{ color:"#fff",fontSize:"16px",marginBottom:"8px",fontWeight:600 }}>Hey team,</p>
              <p style={{ color:"#8899aa",fontSize:"15px",marginBottom:"28px",lineHeight:1.7 }}>
                The votes are in for {currentMonth}. Thank you to everyone who nominated. Here are your winners:
              </p>
              {CATEGORIES.map(cat => {
                const w = winners[cat.id];
                const wr = w ? reasonsByCategory[cat.id].filter(r => r.nominee===w) : [];
                return (
                  <div key={cat.id} style={{ borderLeft:`4px solid ${cat.color}`,paddingLeft:"20px",marginBottom:"28px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px" }}>
                      <span style={{ fontSize:"16px" }}>{cat.emoji}</span>
                      <span style={{ color:cat.color,fontSize:"11px",fontWeight:700,textTransform:"uppercase",letterSpacing:"2px" }}>{cat.title}</span>
                    </div>
                    {w ? (
                      <>
                        <p style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:"24px",color:"#fff",marginBottom:"8px" }}>{w}</p>
                        {wr.length>0 ? wr.map((r,i) => (
                          <p key={i} style={{ color:"#8899aa",fontSize:"14px",fontStyle:"italic",lineHeight:1.7 }}>"{r.reason}"</p>
                        )) : <p style={{ color:"#3a4d6b",fontSize:"14px",fontStyle:"italic" }}>No reason left</p>}
                      </>
                    ) : <p style={{ color:"#3a4d6b",fontSize:"15px" }}>No votes yet</p>}
                  </div>
                );
              })}
              <p style={{ color:"#8899aa",fontSize:"15px",lineHeight:1.7 }}>Congratulations to all three. Your rewards are on their way.</p>
              <p style={{ color:"#8899aa",fontSize:"15px",marginTop:"8px" }}>Nominations open again next month. Keep an eye out.</p>

            </div>

            <button onClick={handleCopy} style={{
              background:copied?"#1a5c54":"#30E7D1",border:"none",borderRadius:"12px",padding:"14px",
              width:"100%",color:copied?"#30E7D1":"#0a1628",fontSize:"15px",fontWeight:700,
              cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"12px",transition:"all 0.3s",
            }}>
              {copied?"✓ Copied to clipboard":"Copy announcement text"}
            </button>

            <button onClick={onSaveMonth} style={{
              background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px",padding:"13px",
              width:"100%",color:"#6b7fa3",fontSize:"14px",fontWeight:600,
              cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
            }}>
              Archive this month to history →
            </button>
          </div>
        )}

        {/* HISTORY */}
        {view==="history" && (
          <div>
            {history.length===0 ? (
              <div style={{ textAlign:"center",color:"#3a4d6b",fontSize:"16px",marginTop:"40px" }}>
                <div style={{ fontSize:"48px",marginBottom:"16px" }}>📅</div>
                <p>No history yet. Archive a month from the Announcement tab to start tracking.</p>
              </div>
            ) : [...history].reverse().map((entry, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"18px",padding:"24px",marginBottom:"16px" }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px" }}>
                  <div>
                    <p style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:"18px",color:"#fff",margin:0 }}>{entry.month}</p>
                    <p style={{ color:"#6b7fa3",fontSize:"12px" }}>{entry.year}</p>
                  </div>
                  {i===0 && <span style={{ background:"#30E7D120",border:"1px solid #30E7D140",borderRadius:"100px",padding:"3px 10px",color:"#30E7D1",fontSize:"11px",fontWeight:600 }}>Last month</span>}
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"10px" }}>
                  {CATEGORIES.map(cat => (
                    <div key={cat.id} style={{ background:`${cat.color}08`,border:`1px solid ${cat.color}20`,borderRadius:"12px",padding:"12px 14px" }}>
                      <div style={{ fontSize:"16px",marginBottom:"4px" }}>{cat.emoji}</div>
                      <p style={{ color:cat.color,fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"4px" }}>{cat.title}</p>
                      <p style={{ color:"#fff",fontSize:"15px",fontWeight:600 }}>{entry.winners[cat.id]||"—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={onBack} style={{ background:"none",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",padding:"12px",width:"100%",color:"#6b7fa3",fontSize:"14px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:"16px" }}>← Back to voting home</button>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("voter");
  const [voter, setVoter] = useState(null);
  const [allVotes, setAllVotes] = useState({});
  const [history, setHistory] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Load data from Supabase on mount ───────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // Fetch votes for current month
      const { data: votesData, error: votesErr } = await supabase
        .from("votes")
        .select("*")
        .eq("month", currentMonth)
        .eq("year", new Date().getFullYear());

      if (!votesErr && votesData) {
        const rebuilt = {};
        votesData.forEach(row => {
          if (!rebuilt[row.voter_name]) {
            rebuilt[row.voter_name] = { votes: {}, reasons: {} };
          }
          rebuilt[row.voter_name].votes[row.category_id] = row.nominee;
          rebuilt[row.voter_name].reasons[row.category_id] = row.reason || "";
        });
        setAllVotes(rebuilt);
      }

      // Fetch history
      const { data: historyData, error: histErr } = await supabase
        .from("history")
        .select("*")
        .order("created_at", { ascending: true });

      if (!histErr && historyData) {
        setHistory(historyData.map(h => ({
          month: h.month,
          year: h.year,
          winners: h.winners,
        })));
      }

      setLoading(false);
    }
    loadData();
  }, []);

  function handleVoterSelect(name) {
    if (allVotes[name]) { alert(`${name} has already voted this month.`); return; }
    setVoter(name); setScreen("voting");
  }

  async function handleVotingComplete(votes, reasons) {
    const rows = CATEGORIES.map(cat => ({
      voter_name: voter,
      month: currentMonth,
      year: new Date().getFullYear(),
      category_id: cat.id,
      nominee: votes[cat.id],
      reason: reasons[cat.id] || "",
    }));

    const { error } = await supabase.from("votes").insert(rows);
    if (error) { alert("Error saving votes — please try again."); return; }

    setAllVotes(prev => ({ ...prev, [voter]: { votes, reasons } }));
    setShowConfetti(true);
    setScreen("thanks");
    setTimeout(() => setShowConfetti(false), 4000);
  }

  async function handleSaveMonth() {
    // Build winners from current votes
    const catTotals = {};
    CATEGORIES.forEach(cat => {
      catTotals[cat.id] = {};
      STAFF.forEach(s => { catTotals[cat.id][s] = 0; });
    });
    Object.entries(allVotes).forEach(([, { votes }]) => {
      CATEGORIES.forEach(cat => {
        const n = votes[cat.id];
        if (n) catTotals[cat.id][n] = (catTotals[cat.id][n]||0) + 1;
      });
    });
    const winners = {};
    CATEGORIES.forEach(cat => {
      const sorted = Object.entries(catTotals[cat.id]).sort((a,b)=>b[1]-a[1]);
      winners[cat.id] = sorted[0]&&sorted[0][1]>0 ? sorted[0][0] : null;
    });

    const { error: histErr } = await supabase.from("history").insert([{
      month: currentMonth,
      year: new Date().getFullYear(),
      winners,
    }]);
    if (histErr) { alert("Error archiving month — please try again."); return; }

    await supabase.from("votes")
      .delete()
      .eq("month", currentMonth)
      .eq("year", new Date().getFullYear());

    setHistory(prev => [...prev, { month: currentMonth, year: new Date().getFullYear(), winners }]);
    setAllVotes({});
    alert(`${currentMonth} archived to history. Votes have been reset for next month.`);
  }

  if (loading) {
    return (
      <div style={{ minHeight:"100vh",background:"#0a1628",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"40px",marginBottom:"16px" }}>🏆</div>
          <p style={{ color:"#6b7fa3",fontSize:"15px" }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Confetti active={showConfetti} />
      {screen==="voter" && <VoterScreen onSelect={handleVoterSelect} allVotes={allVotes} onAdminClick={() => setScreen("adminlogin")} history={history} />}
      {screen==="voting" && <VotingScreen voter={voter} onComplete={handleVotingComplete} />}
      {screen==="thanks" && <ThanksScreen voter={voter} onBack={() => setScreen("voter")} />}
      {screen==="wall" && <NominationWall allVotes={allVotes} onBack={() => setScreen("voter")} />}
      {screen==="adminlogin" && <AdminLogin onSuccess={() => setScreen("admin")} onBack={() => setScreen("voter")} />}
      {screen==="admin" && <AdminDashboard allVotes={allVotes} history={history} onBack={() => setScreen("voter")} onSaveMonth={handleSaveMonth} />}
    </>
  );
}
