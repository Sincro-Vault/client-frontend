import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function SessionWarningBanner() {
  const { sessionTimeLeft, resetTimer, logout } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const show = sessionTimeLeft > 0 && sessionTimeLeft <= 120;
  const isCritical = sessionTimeLeft <= 30;

  const handleExtend = () => {
    resetTimer();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 py-3 text-sm shadow-2xl ${
            isCritical
              ? 'bg-red-950 border-b border-red-500/50'
              : 'bg-amber-950 border-b border-amber-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={16} className={isCritical ? 'text-red-400' : 'text-amber-400'} />
            <span className={isCritical ? 'text-red-300' : 'text-amber-300'}>
              {t('auth.sessionWarning')} — <strong className="font-mono">{sessionTimeLeft}s</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExtend}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isCritical
                  ? 'bg-red-700 hover:bg-red-600 text-white'
                  : 'bg-amber-700 hover:bg-amber-600 text-white'
              }`}
            >
              <RefreshCw size={12} />
              Extender sesión
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              {t('auth.logout')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
