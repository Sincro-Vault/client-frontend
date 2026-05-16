import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldOff, LogIn, Clock } from 'lucide-react';
import ParticleBackground from '../components/ui/ParticleBackground';

export default function SessionExpired() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-void)' }}>
      <ParticleBackground />
      <div className="relative z-10 text-center space-y-6 px-4 max-w-sm">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative inline-flex items-center justify-center w-20 h-20 mx-auto"
        >
          <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-pulse" />
          <div className="w-20 h-20 rounded-full bg-amber-950/60 border border-amber-500/30 flex items-center justify-center">
            <Clock size={32} className="text-amber-400" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-2xl font-bold text-[var(--text-prime)]">{t('auth.sessionExpired')}</h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">{t('auth.sessionExpiredDesc')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-medium transition-all glow-electric"
          >
            <LogIn size={16} />
            {t('auth.login')}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
