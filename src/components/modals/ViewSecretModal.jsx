import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  X, Copy, Eye, EyeOff, ShieldCheck, Clock, AlertTriangle,
  Database, Server, Cpu, Unlock, Loader2, AlertOctagon, MapPin,
} from 'lucide-react';
import { toast } from '../../components/ui/Toast';
import { secretsService } from '../../services/mockService';

const STEPS = [
  { id: 'f1',    icon: Database, labelEs: 'Leyendo F1 desde SQL Server local',      delay: 700 },
  { id: 'conn',  icon: Server,   labelEs: 'Conectando con servidor central (REST/gRPC)', delay: 700 },
  { id: 'f2',    icon: Server,   labelEs: 'Descargando F2 desde el servidor',       delay: 800 },
  { id: 'recon', icon: Cpu,      labelEs: 'Reconstruyendo con Shamir + AES-256-GCM', delay: 700 },
];

export default function ViewSecretModal({ secret, onClose }) {
  const { t } = useTranslation();

  const [stage, setStage] = useState('loading'); // loading | revealed | error
  const [stepIdx, setStepIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [revealedValue, setRevealedValue] = useState('');
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const startedRef = useRef(false);

  // Reveal real (animación + llamada al backend).
  // Sobreviven al doble-mount de React Strict Mode: NO retornamos cleanup
  // que limpie los timers — sino la animación nunca se ejecutaría y los
  // 4 pasos saltarían en verde de golpe.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const startTime = Date.now();
    const totalAnimMs = STEPS.reduce((acc, s) => acc + s.delay, 0);

    // Animación de pasos uno por uno
    let accDelay = 0;
    STEPS.forEach((step, i) => {
      accDelay += step.delay;
      setTimeout(() => setStepIdx(i + 1), accDelay);
    });

    (async () => {
      try {
        // Geolocalización del navegador (no bloqueante, timeout 800ms)
        const geoData = await new Promise((resolve) => {
          if (!navigator.geolocation) return resolve(null);
          const tid = setTimeout(() => resolve(null), 800);
          navigator.geolocation.getCurrentPosition(
            (pos) => { clearTimeout(tid); resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracyMeters: pos.coords.accuracy,
            }); },
            () => { clearTimeout(tid); resolve(null); },
            { timeout: 700, maximumAge: 60_000 }
          );
        });

        const result = await secretsService.reveal(secret.id, geoData || {});

        // Esperar a que la animación termine antes de mostrar el valor.
        // Si el backend respondió rápido, esperamos los 2.9s completos.
        const elapsed = Date.now() - startTime;
        const wait = Math.max(0, totalAnimMs - elapsed);
        setTimeout(() => {
          setRevealedValue(result.value || '');
          setStage('revealed');
        }, wait);
      } catch (e) {
        const status = e.response?.status;
        const data = e.response?.data;
        const msg =
          status === 403 ? (data?.error || 'Acceso denegado por geofencing')
          : status === 404 ? 'Secreto no encontrado'
          : status === 500 ? `Servidor no pudo reconstruir: ${data?.error || 'error interno'}`
          : e.message || 'Error desconocido al revelar';
        // También esperar a que la animación termine para que se vea el error en contexto
        const elapsed = Date.now() - startTime;
        const wait = Math.max(0, totalAnimMs - elapsed);
        setTimeout(() => {
          setErrorMsg(msg);
          setStage('error');
        }, wait);
      }
    })();
  }, [secret.id]);

  // Countdown de borrado tras reveal
  useEffect(() => {
    if (stage !== 'revealed') return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { setVisible(false); clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [stage]);

  const copy = () => {
    navigator.clipboard.writeText(revealedValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(t('common.copied'));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-lg glass-bright rounded-2xl overflow-hidden border border-[var(--border-bright)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-dim)] bg-[var(--bg-panel)]">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg border ${
                stage === 'revealed' ? 'bg-emerald-900/40 border-emerald-700/30'
                : stage === 'error' ? 'bg-red-900/40 border-red-700/30'
                : 'bg-sky-900/40 border-sky-700/30'
              }`}>
                {stage === 'revealed' ? <Unlock size={14} className="text-emerald-400" />
                  : stage === 'error' ? <AlertOctagon size={14} className="text-red-400" />
                  : <Loader2 size={14} className="text-sky-400 animate-spin" />}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-prime)]">{secret.name}</h2>
                <p className="text-xs text-[var(--text-dim)] font-mono">
                  {stage === 'loading' && 'Reconstrucción distribuida en curso'}
                  {stage === 'revealed' && 'Secreto reconstruido en RAM volátil'}
                  {stage === 'error' && 'Acceso denegado'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Distributed flow visualization */}
            {stage !== 'error' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[var(--text-dim)] font-mono uppercase tracking-wider mb-1">
                  <span>Flujo de reconstrucción</span>
                  <span>{stage === 'revealed' ? '4/4' : `${Math.min(stepIdx + 1, STEPS.length)}/${STEPS.length}`}</span>
                </div>
                <div className="space-y-1.5">
                  {STEPS.map((step, i) => {
                    const completed = stepIdx > i || stage === 'revealed';
                    const active = stepIdx === i && stage === 'loading';
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: completed ? 1 : active ? 1 : 0.4 }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                          completed ? 'border-emerald-700/30 bg-emerald-950/20'
                            : active ? 'border-sky-700/30 bg-sky-950/20'
                            : 'border-[var(--border-dim)] bg-[var(--bg-panel)]'
                        }`}
                      >
                        <div className={`p-1 rounded ${
                          completed ? 'text-emerald-400' : active ? 'text-sky-400' : 'text-[var(--text-dim)]'
                        }`}>
                          {completed ? <ShieldCheck size={14} /> : active ? <Loader2 size={14} className="animate-spin" /> : <step.icon size={14} />}
                        </div>
                        <span className={`text-xs flex-1 ${completed || active ? 'text-[var(--text-prime)]' : 'text-[var(--text-dim)]'}`}>
                          {step.labelEs}
                        </span>
                        {completed && <span className="text-xs text-emerald-400 font-mono">OK</span>}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error state */}
            {stage === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 space-y-2"
              >
                <div className="flex items-center gap-2 text-red-400">
                  <MapPin size={14} />
                  <span className="text-sm font-semibold">Reconstrucción bloqueada</span>
                </div>
                <p className="text-xs text-red-300/80 font-mono leading-relaxed">{errorMsg}</p>
              </motion.div>
            )}

            {/* Revealed value */}
            {stage === 'revealed' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <div className={`flex items-center gap-2 p-3 rounded-lg border text-xs ${
                  countdown <= 3 ? 'border-red-500/30 bg-red-950/30 text-red-400'
                    : 'border-amber-500/30 bg-amber-950/20 text-amber-400'
                }`}>
                  <Clock size={12} />
                  <span>{t('secrets.blurWarning')} — <strong>{countdown}s</strong></span>
                  {countdown <= 3 && <AlertTriangle size={12} className="ml-auto" />}
                </div>

                <div className="relative p-4 rounded-xl bg-[var(--bg-panel)] border border-emerald-700/30 min-h-[80px]">
                  <div
                    className="font-mono text-sm text-[var(--text-prime)] break-all transition-all duration-500"
                    style={{ filter: visible ? 'none' : 'blur(8px)' }}
                  >
                    {revealedValue || '(vacío)'}
                  </div>
                  <div className="absolute top-3 right-3">
                    <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" fill="none" stroke="var(--border-dim)" strokeWidth="2" />
                      <circle cx="12" cy="12" r="9" fill="none" strokeWidth="2"
                        stroke={countdown <= 3 ? '#ef4444' : '#f59e0b'}
                        strokeDasharray={`${2 * Math.PI * 9}`}
                        strokeDashoffset={`${2 * Math.PI * 9 * (1 - countdown / 10)}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={copy}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-[var(--border-dim)] hover:border-sky-500/50 hover:text-sky-400 text-[var(--text-muted)] text-xs transition-all">
                    <Copy size={13} />{copied ? t('common.copied') : t('common.copy')}
                  </button>
                  <button onClick={() => setVisible(!visible)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-[var(--border-dim)] hover:border-amber-500/50 hover:text-amber-400 text-[var(--text-muted)] text-xs transition-all">
                    {visible ? <><EyeOff size={13} />{t('secrets.hideValue')}</> : <><Eye size={13} />{t('secrets.showValue')}</>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border-dim)]">
              <div>
                <p className="text-xs text-[var(--text-dim)] mb-0.5">{t('secrets.createdAt')}</p>
                <p className="text-xs text-[var(--text-muted)] font-mono">{new Date(secret.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-dim)] mb-0.5">Fragmentos</p>
                <p className="text-xs text-[var(--text-muted)] font-mono">{secret.fragmentCount ?? 2} (Shamir 2-de-2)</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-5">
            <button onClick={onClose} className="w-full py-2.5 rounded-lg border border-[var(--border-dim)] text-[var(--text-muted)] hover:border-[var(--border-bright)] text-sm transition-all">
              {t('common.close')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
