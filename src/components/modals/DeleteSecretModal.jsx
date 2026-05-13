import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, AlertTriangle, Trash2, Loader2 } from 'lucide-react';

export default function DeleteSecretModal({ secret, onClose, onConfirm }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try { await onConfirm(); } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-sm glass-bright rounded-2xl overflow-hidden border border-red-500/30 glow-danger"
        >
          <div className="p-6 text-center space-y-4">
            {/* Icon with pulse */}
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

            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/30 border border-red-700/20">
              <AlertTriangle size={13} className="text-red-400 flex-shrink-0" />
              <span className="text-xs text-red-400">{t('secrets.deleteWarning')}</span>
            </div>
          </div>

          <div className="flex gap-3 px-6 pb-6">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[var(--border-dim)] text-[var(--text-muted)] text-sm transition-all hover:border-[var(--border-bright)]">
              {t('common.cancel')}
            </button>
            <button onClick={handleConfirm} disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all glow-danger">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <><Trash2 size={14} />{t('common.delete')}</>}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
