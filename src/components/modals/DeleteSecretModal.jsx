import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, AlertTriangle, Trash2, Loader2, Database, Server, Check } from 'lucide-react';

export default function DeleteSecretModal({ secret, onClose, onConfirm }) {
  const { t } = useTranslation();
  const [stage, setStage] = useState('confirm'); // confirm | deleting | done
  const [progress, setProgress] = useState({ client: false, server: false });

  const handleConfirm = async () => {
    setStage('deleting');
    try {
      // Animación de borrado distribuido (cliente primero, luego servidor)
      setTimeout(() => setProgress((p) => ({ ...p, client: true })), 400);
      setTimeout(() => setProgress((p) => ({ ...p, server: true })), 900);
      await onConfirm();
      setStage('done');
      setTimeout(onClose, 700);
    } catch {
      setStage('confirm');
      setProgress({ client: false, server: false });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && stage === 'confirm' && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-sm glass-bright rounded-2xl overflow-hidden border border-red-500/30 glow-danger"
        >
          {stage === 'confirm' && (
            <>
              <div className="p-6 text-center space-y-4">
                <div className="relative inline-flex items-center justify-center w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                  <div className="relative w-16 h-16 rounded-full bg-red-950/60 border border-red-500/30 flex items-center justify-center">
                    <AlertTriangle size={24} className="text-red-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-prime)]">{t('secrets.deleteTitle')}</h2>
                  <p className="text-sm text-[var(--text-muted)] mt-1">{t('secrets.deleteConfirm')}</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dim)]">
                  <p className="text-xs font-mono text-red-400 font-medium">{secret.name}</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-700/20 text-left space-y-1.5">
                  <p className="text-xs text-amber-400 font-mono uppercase tracking-wider">Eliminación distribuida</p>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Database size={10} className="text-sky-400" />
                    <span>F1 será borrado de SQLite local</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Server size={10} className="text-sky-400" />
                    <span>F2 será borrado del servidor central</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/30 border border-red-700/20">
                  <AlertTriangle size={13} className="text-red-400 flex-shrink-0" />
                  <span className="text-xs text-red-400">{t('secrets.deleteWarning')}</span>
                </div>
              </div>
              <div className="flex gap-3 px-6 pb-6">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[var(--border-dim)] text-[var(--text-muted)] text-sm transition-all hover:border-[var(--border-bright)]">
                  {t('common.cancel')}
                </button>
                <button onClick={handleConfirm}
                  className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all glow-danger">
                  <Trash2 size={14} />{t('common.delete')}
                </button>
              </div>
            </>
          )}

          {(stage === 'deleting' || stage === 'done') && (
            <div className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-950/60 border border-red-500/30 mx-auto">
                  {stage === 'done'
                    ? <Check size={26} className="text-emerald-400" />
                    : <Loader2 size={22} className="text-red-400 animate-spin" />}
                </div>
                <h2 className="text-sm font-semibold text-[var(--text-prime)]">
                  {stage === 'done' ? 'Eliminado correctamente' : 'Eliminando fragmentos…'}
                </h2>
              </div>

              <div className="space-y-1.5">
                <motion.div
                  initial={{ opacity: 0.5 }} animate={{ opacity: progress.client ? 1 : 0.5 }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
                    progress.client ? 'border-emerald-700/30 bg-emerald-950/20' : 'border-[var(--border-dim)] bg-[var(--bg-panel)]'
                  }`}
                >
                  {progress.client ? <Check size={14} className="text-emerald-400" /> : <Loader2 size={14} className="text-sky-400 animate-spin" />}
                  <Database size={12} className="text-sky-400" />
                  <span className="text-xs flex-1 text-[var(--text-muted)]">F1 borrado de SQLite local</span>
                  {progress.client && <span className="text-xs text-emerald-400 font-mono">OK</span>}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0.5 }} animate={{ opacity: progress.server ? 1 : 0.5 }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
                    progress.server ? 'border-emerald-700/30 bg-emerald-950/20' : 'border-[var(--border-dim)] bg-[var(--bg-panel)]'
                  }`}
                >
                  {progress.server ? <Check size={14} className="text-emerald-400" /> : <Loader2 size={14} className="text-sky-400 animate-spin" />}
                  <Server size={12} className="text-sky-400" />
                  <span className="text-xs flex-1 text-[var(--text-muted)]">F2 borrado del servidor central</span>
                  {progress.server && <span className="text-xs text-emerald-400 font-mono">OK</span>}
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
