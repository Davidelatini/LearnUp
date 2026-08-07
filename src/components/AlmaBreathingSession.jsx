import { useEffect, useRef, useState } from 'react';

const EXERCISES = [
  {
    id: 'libero',
    label: 'Respiro Libero',
    rhythm: '4 · 2 · 5 s',
    description: 'Ritmo fluido per avvicinarsi al respiro. Ideale per iniziare o per un momento di pausa.',
    steps: [
      { key: 'inhale',  label: 'Inspira',   duration: 4000 },
      { key: 'hold',    label: 'Trattieni', duration: 2000 },
      { key: 'exhale',  label: 'Espira',    duration: 5000 },
    ],
  },
  {
    id: '478',
    label: '4 · 7 · 8',
    rhythm: '4 · 7 · 8 s',
    description: 'Tecnica per il rilassamento profondo. Indicata prima del sonno o in momenti di forte stress.',
    steps: [
      { key: 'inhale',  label: 'Inspira',   duration: 4000 },
      { key: 'hold',    label: 'Trattieni', duration: 7000 },
      { key: 'exhale',  label: 'Espira',    duration: 8000 },
    ],
  },
  {
    id: 'quadrata',
    label: 'Quadrata',
    rhythm: '4 · 4 · 4 · 4 s',
    description: 'Quattro fasi simmetriche per bilanciare e centrare mente e corpo.',
    steps: [
      { key: 'inhale',   label: 'Inspira',   duration: 4000 },
      { key: 'hold',     label: 'Trattieni', duration: 4000 },
      { key: 'exhale',   label: 'Espira',    duration: 4000 },
      { key: 'hold-out', label: 'Pausa',     duration: 4000 },
    ],
  },
];

const DURATIONS = [
  { label: '1 min',  secs: 60  },
  { label: '3 min',  secs: 180 },
  { label: '5 min',  secs: 300 },
  { label: '10 min', secs: 600 },
];

function fmtTime(s) {
  const m   = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

/* Mini bar-chart preview showing relative phase durations */
function RhythmPreview({ steps }) {
  return (
    <div className="alma-bs-preview" aria-hidden="true">
      {steps.map((s, i) => (
        <div
          key={i}
          className={`alma-bs-preview-bar is-${s.key}`}
          style={{ flex: s.duration / 1000 }}
          title={`${s.label} ${s.duration / 1000}s`}
        />
      ))}
    </div>
  );
}

/* ── Schermata di selezione ────────────────────────────────── */
function SelectionView({ onStart, onClose }) {
  const [exId, setExId]       = useState('libero');
  const [durSecs, setDurSecs] = useState(300);
  const exercise = EXERCISES.find((e) => e.id === exId);

  return (
    <div className="alma-bs-modal" role="dialog" aria-modal="true" aria-label="Selezione meditazione">
      <div className="alma-bs-header">
        <span className="alma-bs-title">Meditazione</span>
        <button type="button" className="ag-close-btn" onClick={onClose} aria-label="Chiudi">×</button>
      </div>

      <div className="alma-bs-body">
        <div className="alma-bs-section-label">Esercizio</div>

        <div className="alma-bs-cards">
          {EXERCISES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`alma-bs-card${exId === item.id ? ' is-selected' : ''}`}
              onClick={() => setExId(item.id)}
            >
              <div className="alma-bs-card-top">
                <span className="alma-bs-card-title">{item.label}</span>
                <span className="alma-bs-card-rhythm">{item.rhythm}</span>
              </div>
              <div className="alma-bs-card-desc">{item.description}</div>
              <RhythmPreview steps={item.steps} />
            </button>
          ))}
        </div>

        <div className="alma-bs-section-label">Durata sessione</div>

        <div className="alma-bs-dur-row">
          {DURATIONS.map((d) => (
            <button
              key={d.secs}
              type="button"
              className={`alma-bs-dur-btn${durSecs === d.secs ? ' is-selected' : ''}`}
              onClick={() => setDurSecs(d.secs)}
            >
              {d.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="primary-button alma-bs-start-btn"
          onClick={() => onStart(exercise, durSecs)}
        >
          Inizia
        </button>
      </div>
    </div>
  );
}

/* ── Sessione attiva ────────────────────────────────────────── */
function ActiveView({ exercise, durationSecs, onPhaseChange, onDone, onStop }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [elapsed,   setElapsed]   = useState(0);
  const onPhaseRef  = useRef(onPhaseChange);
  const onDoneRef   = useRef(onDone);
  const doneCalledRef = useRef(false);

  onPhaseRef.current = onPhaseChange;
  onDoneRef.current  = onDone;

  /* Avanzamento fase */
  useEffect(() => {
    const step = exercise.steps[stepIndex];
    const id = setTimeout(() => {
      const next = (stepIndex + 1) % exercise.steps.length;
      setStepIndex(next);
      onPhaseRef.current(exercise.steps[next].key);
    }, step.duration);
    return () => clearTimeout(id);
  }, [stepIndex, exercise]);

  /* Contatore secondi */
  useEffect(() => {
    const id = setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);

  /* Fine sessione */
  useEffect(() => {
    if (!doneCalledRef.current && elapsed >= durationSecs) {
      doneCalledRef.current = true;
      onDoneRef.current();
    }
  }, [elapsed, durationSecs]);

  const step      = exercise.steps[stepIndex];
  const remaining = Math.max(0, durationSecs - elapsed);
  const fillScale = remaining / durationSecs;

  return (
    <div className="alma-bs-active">
      {/* Barra progresso sottile in cima */}
      <div className="alma-bs-progress-track">
        <div
          className="alma-bs-progress-fill"
          style={{ transform: `scaleX(${fillScale})` }}
        />
      </div>

      {/* Countdown discreto in alto a destra */}
      <div className="alma-bs-remaining" aria-live="polite" aria-atomic="true">
        {fmtTime(remaining)}
      </div>

      {/* Etichetta fase — key forza re-render per rianimare */}
      <div className="alma-bs-phase-area">
        <div className="alma-bs-phase-label" key={step.key}>{step.label}</div>
        <div className="alma-bs-phase-hint">segui il ritmo delle onde</div>
      </div>

      <button type="button" className="ghost-button alma-bs-stop-btn" onClick={onStop}>
        Stop
      </button>
    </div>
  );
}

/* ── Schermata di chiusura ─────────────────────────────────── */
function DoneView({ onClose }) {
  return (
    <div className="alma-bs-modal alma-bs-done-modal" role="dialog" aria-modal="true">
      <div className="alma-bs-done-content">
        <div className="alma-bs-done-icon" aria-hidden="true">◎</div>
        <div className="alma-bs-done-title">Sessione completata</div>
        <p className="alma-bs-done-msg">Come ti senti ora?</p>
        <button type="button" className="primary-button" onClick={onClose}>Chiudi</button>
      </div>
    </div>
  );
}

/* ── Componente principale ─────────────────────────────────── */
export default function AlmaBreathingSession({ onBreathingChange, onClose }) {
  const [uiPhase,      setUiPhase]      = useState('select');
  const [exercise,     setExercise]     = useState(null);
  const [durationSecs, setDurationSecs] = useState(300);

  const notify = (breathingPhase, isActive) =>
    onBreathingChange({ breathingPhase, isActive });

  const handleStart = (ex, dur) => {
    setExercise(ex);
    setDurationSecs(dur);
    setUiPhase('active');
    notify(ex.steps[0].key, true);
  };

  const handlePhaseChange = (phase) => notify(phase, true);

  const handleDone = () => {
    setUiPhase('done');
    notify('', false);
  };

  const handleClose = () => {
    notify('', false);
    onClose();
  };

  return (
    <div className={`alma-bs-overlay${uiPhase === 'active' ? ' is-active-mode' : ''}`}>
      {uiPhase === 'select' && (
        <SelectionView onStart={handleStart} onClose={handleClose} />
      )}
      {uiPhase === 'active' && exercise && (
        <ActiveView
          exercise={exercise}
          durationSecs={durationSecs}
          onPhaseChange={handlePhaseChange}
          onDone={handleDone}
          onStop={handleDone}
        />
      )}
      {uiPhase === 'done' && (
        <DoneView onClose={handleClose} />
      )}
    </div>
  );
}
