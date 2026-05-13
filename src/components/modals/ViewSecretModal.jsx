import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Copy, Eye, EyeOff, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';
import { toast } from '../../components/ui/Toast';

export default function ViewSecretModal({ secret, onClose }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { setVisible(false); clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(secret.value);
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
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-md glass-bright rounded-2xl overflow-hidden border border-[var(--border-bright)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-dim)] bg-[var(--bg-panel)]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-900/40 border border-emerald-700/20">
                <ShieldCheck size={14} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-prime)]">{t('secrets.secretValue')}</h2>
                <p className="text-xs text-[var(--text-dim)] font-mono">{secret.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Countdown */}
            <div className={`flex items-center gap-2 p-3 rounded-lg border text-xs transition-all ${
              countdown <= 3 ? 'border-red-500/30 bg-red-950/30 text-red-400' : 'border-amber-500/30 bg-amber-950/20 text-amber-400'
            }`}>
              <Clock size={12} />
              <span>{t('secrets.blurWarning')} — <strong>{countdown}s</strong></span>
              {countdown <= 3 && <AlertTriangle size={12} className="ml-auto" />}
            </div>

            {/* Value */}
            <div className="space-y-2">
              <div className="relative p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dim)] min-h-[80px]">
                <div
                  className="font-mono text-sm text-[var(--text-prime)] break-all transition-all duration-500"
                  style={{ filter: visible ? 'none' : 'blur(8px)' }}
                >
                  {secret.value}
                </div>

                {/* Countdown ring */}
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

              {/* Actions */}
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
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-dim)]">
              {[
                { label: t('secrets.createdAt'), val: new Date(secret.createdAt).toLocaleDateString() },
                { label: t('secrets.updatedAt'), val: new Date(secret.updatedAt).toLocaleDateString() },
                { label: t('secrets.category'), val: secret.category },
                { label: t('secrets.status'), val: secret.status },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p className="text-xs text-[var(--text-dim)] mb-0.5">{label}</p>
                  <p className="text-xs text-[var(--text-muted)] font-mono">{val}</p>
                </div>
              ))}
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
