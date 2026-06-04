import React, { useState, useEffect } from 'react';
import { Check, X, Trash2 } from 'lucide-react';

const PROGRAM = {
  pull: {
    name: 'Pull',
    subtitle: 'Posterior chain + posture',
    color: '#c4a574',
    accent: '#8b6f3f',
    icon: '↑',
    exercises: [
      { id: 'lat-pulldown', name: 'Lat pulldown', sets: 3, reps: '10', target: 'RPE 6-7', notes: 'Pull elbows DOWN, not bar to chest. Chest up.' },
      { id: 'db-row', name: 'One-arm DB row', sets: 3, reps: '10/side', target: 'RPE 6-7', notes: 'Initiate from shoulder blade. No shrug.' },
      { id: 'face-pulls', name: 'Face pulls', sets: 3, reps: '12-15', target: 'RPE 6', notes: 'Pull rope to forehead, elbows wide. THE posture fix.' },
      { id: 'band-pullaparts', name: 'Band pull-aparts', sets: 2, reps: '15', target: 'Light', notes: 'Chest up, squeeze shoulder blades.' },
      { id: 'chin-tucks-loaded', name: 'Chin tucks (slow)', sets: 2, reps: '10', target: 'Quality', notes: 'Same as home routine, extra dose.' },
      { id: 'dead-bug-pull', name: 'Dead bug', sets: 2, reps: '8/side', target: 'Quality', notes: 'Lower back glued to floor.' },
    ],
  },
  legs: {
    name: 'Legs + Hips',
    subtitle: 'Glutes, hip extension, mobility',
    color: '#b8956a',
    accent: '#7d5e2e',
    icon: '↓',
    exercises: [
      { id: 'hip-thrust', name: 'Hip thrust (barbell)', sets: 3, reps: '10', target: 'RPE 7', notes: 'Your main lift. Squeeze glutes hard. 2-sec hold at top.' },
      { id: 'goblet-squat', name: 'Goblet squat', sets: 3, reps: '8', target: 'RPE 6-7', notes: 'Heels down. Knees out. Upright torso.' },
      { id: 'walking-lunge', name: 'DB walking lunge', sets: 3, reps: '8/leg', target: 'RPE 6-7', notes: 'Big step. Knee tracks over toe.' },
      { id: 'pull-through', name: 'Cable pull-through', sets: 2, reps: '12', target: 'RPE 6', notes: 'Hinge, drive hips forward. Reinforces pattern.' },
      { id: 'hip-9090', name: '90/90 hip mobility', sets: 2, reps: '8/side', target: 'Slow', notes: 'Extra rep on stiff right side.' },
      { id: 'plank-legs', name: 'Plank', sets: 2, reps: '30-45 sec', target: 'Quality', notes: 'Glutes squeezed, ribs down.' },
    ],
  },
  push: {
    name: 'Push',
    subtitle: 'Chest, shoulders, anti-rounding',
    color: '#a88456',
    accent: '#6b4d20',
    icon: '→',
    exercises: [
      { id: 'db-bench', name: 'DB bench press', sets: 3, reps: '8', target: 'RPE 6-7', notes: 'DBs (not bar). Slow 2-sec eccentric.' },
      { id: 'db-press', name: 'DB shoulder press', sets: 3, reps: '8', target: 'RPE 6-7', notes: 'Ribs DOWN, chin tucked. No lower back arch.' },
      { id: 'lateral-raise', name: 'DB lateral raise', sets: 3, reps: '12', target: 'RPE 6', notes: 'Slight forward lean. Lead with elbows.' },
      { id: 'wall-slides', name: 'Wall slides', sets: 2, reps: '10', target: 'Quality', notes: 'W to Y position. Posture money move.' },
      { id: 'tricep-pushdown', name: 'Triceps pushdown', sets: 2, reps: '12', target: 'RPE 6', notes: 'Optional. Elbows pinned.' },
      { id: 'side-plank', name: 'Side plank', sets: 2, reps: '20-30 sec/side', target: 'Quality', notes: 'Anti-rotation support.' },
    ],
  },
  posture: {
    name: 'Posture + Hip Mobility',
    subtitle: 'Lighter, mobility-focused',
    color: '#9c7a4a',
    accent: '#5a3f15',
    icon: '↻',
    exercises: [
      { id: 'hip-thrust-light', name: 'Hip thrust (light)', sets: 3, reps: '12', target: 'RPE 5-6', notes: 'Reinforcement, not progression.' },
      { id: 'banded-bridge', name: 'Glute bridge w/ band', sets: 2, reps: '15', target: 'Quality', notes: 'Band around knees. Glute med activation.' },
      { id: 'reverse-lunge', name: 'Reverse lunge w/ rotation', sets: 2, reps: '8/side', target: 'Slow', notes: 'Mobility + stability.' },
      { id: 'face-pulls-2', name: 'Face pulls', sets: 3, reps: '15', target: 'RPE 6', notes: 'Extra posture dose.' },
      { id: 'deep-squat', name: 'Deep squat hold (loaded)', sets: 3, reps: '30-60 sec', target: 'Quality', notes: 'Hip + ankle + groin opener.' },
      { id: 'cobra', name: 'Cobra / sphinx hold', sets: 2, reps: '30 sec', target: 'Quality', notes: 'T-spine extension. Counters flexion.' },
    ],
  },
};

const HOME_MOBILITY = [
  { id: 'chin-tucks-1', name: 'Chin tucks #1 (morning)', detail: '10 reps, slow, 2-sec hold' },
  { id: 'chin-tucks-2', name: 'Chin tucks #2 (mid-day)', detail: '10 reps, slow, 2-sec hold' },
  { id: 'chin-tucks-3', name: 'Chin tucks #3 (evening)', detail: '10 reps, slow, 2-sec hold' },
  { id: 'upper-trap', name: 'Upper trap stretch', detail: '30 sec/side' },
  { id: 'thread-needle', name: 'Thread the needle', detail: '6 reps/side' },
  { id: 'glute-bridge-home', name: 'Glute bridge', detail: '10 reps, 2-sec hold' },
  { id: 'hip-flexor', name: 'Half-kneeling hip flexor stretch', detail: '30 sec/side' },
  { id: 'dead-bug-home', name: 'Dead bug', detail: '6 reps/side, slow' },
];

const SESSION_KEYS = Object.keys(PROGRAM);

function loadJSON(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Save failed', e);
  }
}

export default function App() {
  const [view, setView] = useState('today');
  const [currentSession, setCurrentSession] = useState(null);
  const [logs, setLogs] = useState(() => loadJSON('all-logs', {}));
  const [todayDate] = useState(new Date().toISOString().split('T')[0]);
  const [mobilityToday, setMobilityToday] = useState(() => loadJSON(`mobility-${new Date().toISOString().split('T')[0]}`, {}));

  useEffect(() => { saveJSON('all-logs', logs); }, [logs]);
  useEffect(() => { saveJSON(`mobility-${todayDate}`, mobilityToday); }, [mobilityToday, todayDate]);

  function getLastLog(sessionKey, exerciseId) {
    const sessionLogs = Object.entries(logs)
      .filter(([key]) => key.startsWith(`${sessionKey}-`))
      .filter(([key]) => !key.endsWith(todayDate))
      .sort(([a], [b]) => b.localeCompare(a));
    for (const [, data] of sessionLogs) {
      if (data.exercises && data.exercises[exerciseId]) return data.exercises[exerciseId];
    }
    return null;
  }

  return (
    <>
      <style>{`
        :root {
          --bg: #f4efe6;
          --bg-warm: #ebe3d4;
          --ink: #1a1714;
          --ink-muted: #6b5d4a;
          --line: #d4c8b0;
          --line-strong: #b8a586;
          --accent: #8b6f3f;
          --accent-dark: #5a4520;
          --paper: #faf6ed;
          --font-display: 'Fraunces', Georgia, serif;
          --font-mono: 'JetBrains Mono', 'Courier New', monospace;
          --font-body: 'Inter', system-ui, sans-serif;
        }
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800;9..144,900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .container {
          min-height: 100vh;
          background: var(--bg);
          background-image:
            radial-gradient(circle at 20% 20%, rgba(139, 111, 63, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(90, 69, 32, 0.03) 0%, transparent 50%);
          font-family: var(--font-body);
          color: var(--ink);
          padding-bottom: 100px;
        }
        .header { padding: 32px 24px 16px; border-bottom: 1px solid var(--line); position: relative; }
        .header-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 8px; }
        .header-title { font-family: var(--font-display); font-size: 42px; font-weight: 600; line-height: 0.95; letter-spacing: -0.02em; font-style: italic; }
        .header-date { font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); margin-top: 12px; }
        .nav { display: flex; gap: 0; border-bottom: 1px solid var(--line); background: var(--bg); position: sticky; top: 0; z-index: 10; }
        .nav-btn { flex: 1; padding: 16px 12px; background: transparent; border: none; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-muted); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }
        .nav-btn.active { color: var(--ink); border-bottom-color: var(--accent-dark); }
        .content { padding: 24px; max-width: 720px; margin: 0 auto; }
        .mobility-section { background: var(--paper); border: 1px solid var(--line); border-radius: 2px; padding: 20px; margin-bottom: 32px; position: relative; }
        .mobility-section::before { content: ''; position: absolute; top: -1px; left: -1px; right: -1px; height: 3px; background: linear-gradient(90deg, var(--accent) 0%, var(--accent-dark) 100%); }
        .section-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 8px; }
        .section-title { font-family: var(--font-display); font-size: 24px; font-weight: 600; margin-bottom: 16px; font-style: italic; }
        .mobility-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-top: 1px solid var(--line); cursor: pointer; user-select: none; }
        .mobility-item:first-of-type { border-top: none; }
        .checkbox { width: 22px; height: 22px; border: 1.5px solid var(--line-strong); border-radius: 2px; display: flex; align-items: center; justify-content: center; background: var(--bg); flex-shrink: 0; transition: all 0.15s; }
        .checkbox.checked { background: var(--accent-dark); border-color: var(--accent-dark); }
        .mobility-item.checked .mobility-name { color: var(--ink-muted); text-decoration: line-through; }
        .mobility-name { font-weight: 500; font-size: 15px; }
        .mobility-detail { font-family: var(--font-mono); font-size: 11px; color: var(--ink-muted); }
        .session-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .session-card { background: var(--paper); border: 1px solid var(--line); padding: 24px 20px; border-radius: 2px; cursor: pointer; position: relative; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
        .session-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26, 23, 20, 0.08); }
        .session-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--card-color); }
        .session-icon { font-family: var(--font-display); font-size: 48px; font-weight: 300; color: var(--card-color); line-height: 1; margin-bottom: 8px; font-style: italic; }
        .session-name { font-family: var(--font-display); font-size: 20px; font-weight: 600; line-height: 1.1; font-style: italic; }
        .session-subtitle { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ink-muted); margin-top: 6px; }
        .session-meta { font-family: var(--font-mono); font-size: 10px; color: var(--ink-muted); margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--line); }
        .exercise-detail { background: var(--paper); border: 1px solid var(--line); padding: 20px; border-radius: 2px; margin-bottom: 16px; }
        .exercise-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; gap: 12px; }
        .exercise-name { font-family: var(--font-display); font-size: 22px; font-weight: 600; font-style: italic; }
        .exercise-prescribed { font-family: var(--font-mono); font-size: 11px; color: var(--ink-muted); letter-spacing: 0.05em; text-align: right; flex-shrink: 0; }
        .exercise-notes { font-size: 13px; color: var(--ink-muted); font-style: italic; padding: 10px 12px; background: var(--bg-warm); border-left: 2px solid var(--accent); margin-bottom: 16px; line-height: 1.5; }
        .last-time { font-family: var(--font-mono); font-size: 11px; color: var(--accent-dark); margin-bottom: 12px; padding: 8px 10px; background: rgba(139, 111, 63, 0.08); border-radius: 2px; }
        .input-row { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 8px; margin-bottom: 12px; }
        .input-group { display: flex; flex-direction: column; }
        .input-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 4px; }
        .input { padding: 10px 12px; border: 1px solid var(--line-strong); border-radius: 2px; background: var(--bg); font-family: var(--font-mono); font-size: 14px; color: var(--ink); outline: none; transition: border-color 0.15s; width: 100%; }
        .input:focus { border-color: var(--accent-dark); }
        .set-complete { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 14px; background: var(--bg-warm); border: 1px solid var(--line); border-radius: 2px; cursor: pointer; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ink-muted); transition: all 0.15s; }
        .set-complete.done { background: var(--accent-dark); color: var(--paper); border-color: var(--accent-dark); }
        .back-btn { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: none; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-muted); cursor: pointer; padding: 0; margin-bottom: 16px; }
        .progress-bar { height: 3px; background: var(--line); border-radius: 0; margin: 16px 0 24px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent) 0%, var(--accent-dark) 100%); transition: width 0.3s ease; }
        .progress-row { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 11px; color: var(--ink-muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
        .history-item { padding: 14px 0; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; }
        .history-date { font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); }
        .history-session { font-family: var(--font-display); font-size: 18px; font-weight: 600; font-style: italic; }
        .empty-state { padding: 60px 24px; text-align: center; color: var(--ink-muted); }
        .empty-title { font-family: var(--font-display); font-size: 22px; font-style: italic; margin-bottom: 8px; }
        .delete-btn { background: transparent; border: none; color: var(--ink-muted); cursor: pointer; padding: 4px; opacity: 0.5; }
        .delete-btn:hover { opacity: 1; color: #8b3a3a; }
        .quote { font-family: var(--font-display); font-style: italic; font-size: 14px; color: var(--ink-muted); text-align: center; padding: 32px 24px 0; line-height: 1.6; }
        @media (max-width: 480px) {
          .session-grid { grid-template-columns: 1fr; }
          .header-title { font-size: 36px; }
          .input-row { grid-template-columns: 1.2fr 1fr 1fr; gap: 6px; }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <div className="header-eyebrow">Zaid · Posture + Hip Performance</div>
          <div className="header-title">Program <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontStyle: 'normal', letterSpacing: '0.1em' }}>v2</span></div>
          <div className="header-date">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>

        <div className="nav">
          <button className={`nav-btn ${view === 'today' ? 'active' : ''}`} onClick={() => { setView('today'); setCurrentSession(null); }}>Today</button>
          <button className={`nav-btn ${view === 'history' ? 'active' : ''}`} onClick={() => { setView('history'); setCurrentSession(null); }}>History</button>
        </div>

        <div className="content">
          {view === 'today' && !currentSession && (
            <>
              <MobilitySection mobilityToday={mobilityToday} setMobilityToday={setMobilityToday} />
              <div>
                <div className="section-label">Choose Session</div>
                <div className="section-title">What are you training?</div>
                <div className="session-grid">
                  {SESSION_KEYS.map(key => {
                    const s = PROGRAM[key];
                    return (
                      <div key={key} className="session-card" style={{ '--card-color': s.color }} onClick={() => setCurrentSession(key)}>
                        <div className="session-icon">{s.icon}</div>
                        <div className="session-name">{s.name}</div>
                        <div className="session-subtitle">{s.subtitle}</div>
                        <div className="session-meta">{s.exercises.length} exercises · 45 min cap</div>
                      </div>
                    );
                  })}
                </div>
                <div className="quote">
                  &ldquo;Submaximal and consistent.<br/>Lower ceiling, higher floor.&rdquo;
                </div>
              </div>
            </>
          )}

          {view === 'today' && currentSession && (
            <SessionDetail
              sessionKey={currentSession}
              onBack={() => setCurrentSession(null)}
              logs={logs}
              setLogs={setLogs}
              getLastLog={getLastLog}
              todayDate={todayDate}
            />
          )}

          {view === 'history' && <HistoryView logs={logs} setLogs={setLogs} />}
        </div>
      </div>
    </>
  );
}

function MobilitySection({ mobilityToday, setMobilityToday }) {
  const completedCount = HOME_MOBILITY.filter(m => mobilityToday[m.id]).length;
  const pct = (completedCount / HOME_MOBILITY.length) * 100;

  function toggle(id) {
    setMobilityToday({ ...mobilityToday, [id]: !mobilityToday[id] });
  }

  return (
    <div className="mobility-section">
      <div className="section-label">Daily — Home Mobility</div>
      <div className="section-title">Today's mobility</div>
      <div className="progress-row">
        <span>{completedCount}/{HOME_MOBILITY.length} done</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }}></div>
      </div>
      {HOME_MOBILITY.map(item => (
        <div key={item.id} className={`mobility-item ${mobilityToday[item.id] ? 'checked' : ''}`} onClick={() => toggle(item.id)}>
          <div className={`checkbox ${mobilityToday[item.id] ? 'checked' : ''}`}>
            {mobilityToday[item.id] && <Check size={14} color="white" strokeWidth={3} />}
          </div>
          <div style={{ flex: 1 }}>
            <div className="mobility-name">{item.name}</div>
            <div className="mobility-detail">{item.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SessionDetail({ sessionKey, onBack, logs, setLogs, getLastLog, todayDate }) {
  const session = PROGRAM[sessionKey];
  const logKey = `${sessionKey}-${todayDate}`;
  const todayLog = logs[logKey] || { exercises: {} };

  function updateExercise(exId, setIdx, field, value) {
    const updated = { ...logs };
    if (!updated[logKey]) updated[logKey] = { date: todayDate, sessionKey, exercises: {} };
    if (!updated[logKey].exercises[exId]) updated[logKey].exercises[exId] = { sets: [] };
    const sets = [...(updated[logKey].exercises[exId].sets || [])];
    if (!sets[setIdx]) sets[setIdx] = {};
    sets[setIdx] = { ...sets[setIdx], [field]: value };
    updated[logKey].exercises[exId] = { ...updated[logKey].exercises[exId], sets };
    setLogs(updated);
  }

  function toggleSetDone(exId, setIdx) {
    const updated = { ...logs };
    if (!updated[logKey]) updated[logKey] = { date: todayDate, sessionKey, exercises: {} };
    if (!updated[logKey].exercises[exId]) updated[logKey].exercises[exId] = { sets: [] };
    const sets = [...(updated[logKey].exercises[exId].sets || [])];
    if (!sets[setIdx]) sets[setIdx] = {};
    sets[setIdx] = { ...sets[setIdx], done: !sets[setIdx].done };
    updated[logKey].exercises[exId] = { ...updated[logKey].exercises[exId], sets };
    setLogs(updated);
  }

  const totalSets = session.exercises.reduce((a, e) => a + e.sets, 0);
  const doneSets = session.exercises.reduce((a, e) => {
    const exLog = todayLog.exercises[e.id];
    if (!exLog) return a;
    return a + (exLog.sets || []).filter(s => s && s.done).length;
  }, 0);
  const pct = (doneSets / totalSets) * 100;

  return (
    <div>
      <button className="back-btn" onClick={onBack}>
        <X size={14} /> Back
      </button>
      <div className="section-label">{session.subtitle}</div>
      <div className="section-title" style={{ color: session.accent }}>{session.name}</div>

      <div className="progress-row">
        <span>{doneSets}/{totalSets} sets complete</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }}></div>
      </div>

      {session.exercises.map(ex => {
        const lastLog = getLastLog(sessionKey, ex.id);
        const exLog = todayLog.exercises[ex.id] || { sets: [] };
        const lastSummary = lastLog && lastLog.sets && lastLog.sets.length > 0
          ? lastLog.sets.filter(s => s && (s.weight || s.reps)).map(s => `${s.weight || '—'}kg × ${s.reps || '—'}${s.rpe ? ` @${s.rpe}` : ''}`).join(' · ')
          : null;

        return (
          <div key={ex.id} className="exercise-detail">
            <div className="exercise-header">
              <div className="exercise-name">{ex.name}</div>
              <div className="exercise-prescribed">{ex.sets} × {ex.reps}<br/>{ex.target}</div>
            </div>
            <div className="exercise-notes">{ex.notes}</div>

            {lastSummary && (
              <div className="last-time">Last time: {lastSummary}</div>
            )}

            {Array.from({ length: ex.sets }).map((_, setIdx) => {
              const setData = (exLog.sets && exLog.sets[setIdx]) || {};
              return (
                <div key={setIdx}>
                  <div className="input-row">
                    <div className="input-group">
                      <label className="input-label">Set {setIdx + 1} · Weight (kg)</label>
                      <input className="input" type="number" inputMode="decimal" value={setData.weight || ''} onChange={e => updateExercise(ex.id, setIdx, 'weight', e.target.value)} placeholder="—" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Reps</label>
                      <input className="input" type="number" inputMode="numeric" value={setData.reps || ''} onChange={e => updateExercise(ex.id, setIdx, 'reps', e.target.value)} placeholder="—" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">RPE</label>
                      <input className="input" type="number" inputMode="decimal" step="0.5" value={setData.rpe || ''} onChange={e => updateExercise(ex.id, setIdx, 'rpe', e.target.value)} placeholder="—" />
                    </div>
                  </div>
                  <div className={`set-complete ${setData.done ? 'done' : ''}`} onClick={() => toggleSetDone(ex.id, setIdx)} style={{ marginBottom: '8px' }}>
                    {setData.done ? <><Check size={14} /> Set Done</> : 'Mark Complete'}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function HistoryView({ logs, setLogs }) {
  const sortedLogs = Object.entries(logs).sort(([a], [b]) => b.localeCompare(a));

  function deleteLog(key) {
    if (!window.confirm('Delete this session log?')) return;
    const updated = { ...logs };
    delete updated[key];
    setLogs(updated);
  }

  if (sortedLogs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-title">No sessions yet</div>
        <div>Your training history will appear here.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-label">All Sessions</div>
      <div className="section-title">History</div>

      {sortedLogs.map(([key, data]) => {
        const session = PROGRAM[data.sessionKey];
        if (!session) return null;
        const totalLogged = Object.values(data.exercises || {}).reduce((a, e) => a + (e.sets || []).filter(s => s && s.done).length, 0);
        const totalSets = session.exercises.reduce((a, e) => a + e.sets, 0);
        const dateObj = new Date(data.date);
        const dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' });

        return (
          <div key={key} className="history-item">
            <div>
              <div className="history-session" style={{ color: session.accent }}>{session.name}</div>
              <div className="history-date">{dateStr} · {totalLogged}/{totalSets} sets</div>
            </div>
            <button className="delete-btn" onClick={() => deleteLog(key)}>
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
