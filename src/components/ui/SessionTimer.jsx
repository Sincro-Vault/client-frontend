import { useAuthStore } from '../../store/authStore';
import { Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function SessionTimer() {
  const { sessionTimeLeft } = useAuthStore();
  const { t } = useTranslation();

  const mins = Math.floor(sessionTimeLeft / 60);
  const secs = sessionTimeLeft % 60;
  const isWarning = sessionTimeLeft < 120;
  const isCritical = sessionTimeLeft < 30;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 ${
      isCritical ? 'border-red-500/50 bg-red-950/40 text-red-400 glow-danger' :
      isWarning ? 'border-amber-500/50 bg-amber-950/40 text-amber-400' :
      'border-[var(--border-dim)] bg-[var(--bg-panel)] text-[var(--text-muted)]'
    }`}>
      <AnimatePresence mode="wait">
        {isWarning ? (
          <motion.div key="warn" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
            <AlertTriangle size={12} className={isCritical ? 'text-red-400' : 'text-amber-400'} />
          </motion.div>
        ) : (
          <Clock size={12} />
        )}
      </AnimatePresence>
      <span>
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
