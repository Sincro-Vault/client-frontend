import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { KeyRound, ShieldCheck, Clock, Activity, TrendingUp, Database, Cpu, Wifi } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { secretsService } from '../services/mockService';
import { SkeletonCard } from '../components/ui/Skeleton';

const StatCard = ({ icon: Icon, label, value, sub, color = 'electric', index }) => {
  const colors = {
    electric: { text: 'text-sky-400', bg: 'from-sky-500/10 to-sky-600/5', border: 'border-sky-500/20', glow: 'glow-electric' },
    green: { text: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-600/5', border: 'border-emerald-500/20', glow: 'glow-green' },
    amber: { text: 'text-amber-400', bg: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/20', glow: '' },
    indigo: { text: 'text-indigo-400', bg: 'from-indigo-500/10 to-indigo-600/5', border: 'border-indigo-500/20', glow: '' },
  };
  const c = colors[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`relative overflow-hidden rounded-xl border ${c.border} bg-gradient-to-br ${c.bg} p-5 glass`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--text-dim)] font-medium uppercase tracking-wider mb-2">{label}</p>
          <p className={`text-3xl font-bold ${c.text}`}>{value}</p>
          {sub && <p className="text-xs text-[var(--text-muted)] mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg bg-[var(--bg-panel)] border ${c.border}`}>
          <Icon size={18} className={c.text} />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 ${c.text}`} />
    </motion.div>
  );
};

const SystemStatus = () => {
  const { t } = useTranslation();
  const items = [
    { label: t('dashboard.components.encryptionEngine'), status: 'online', value: 'AES-256-GCM' },
    { label: t('dashboard.components.keyDerivation'), status: 'online', value: 'PBKDF2' },
    { label: t('dashboard.components.tlsLayer'), status: 'online', value: 'TLS 1.3' },
    { label: t('dashboard.components.vaultCore'), status: 'online', value: 'v2.4.1' },
  ];

  return (
    <div className="glass rounded-xl p-5 border border-[var(--border-dim)]">
      <div className="flex items-center gap-2 mb-4">
        <Cpu size={15} className="text-[var(--electric)]" />
        <h3 className="text-sm font-semibold text-[var(--text-prime)]">{t('dashboard.system')}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
            className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-[var(--text-muted)]">{item.label}</span>
            </div>
            <span className="text-xs text-[var(--text-dim)] font-mono">{item.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ActivityFeed = () => {
  const { t } = useTranslation();
  const events = [
    { action: 'SECRET_READ', name: 'AWS_ACCESS_KEY', time: '2 min ago', icon: KeyRound, color: 'text-sky-400' },
    { action: 'SECRET_CREATED', name: 'REDIS_PASSWORD', time: '1 hr ago', icon: ShieldCheck, color: 'text-emerald-400' },
    { action: 'SECRET_UPDATED', name: 'DATABASE_URL', time: '3 hrs ago', icon: Activity, color: 'text-amber-400' },
    { action: 'LOGIN', name: 'admin@securesplit.io', time: '5 hrs ago', icon: Wifi, color: 'text-indigo-400' },
  ];

  return (
    <div className="glass rounded-xl p-5 border border-[var(--border-dim)]">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={15} className="text-[var(--electric)]" />
        <h3 className="text-sm font-semibold text-[var(--text-prime)]">{t('dashboard.recentActivity')}</h3>
      </div>
      <div className="space-y-3">
        {events.map((e, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.07 }}
            className="flex items-center gap-3 py-2 border-b border-[var(--border-dim)] last:border-0">
            <div className={`p-1.5 rounded-lg bg-[var(--bg-panel)]`}>
              <e.icon size={12} className={e.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-[var(--text-muted)] truncate">{e.action}</p>
              <p className="text-xs text-[var(--text-dim)] truncate">{e.name}</p>
            </div>
            <span className="text-xs text-[var(--text-dim)] flex-shrink-0">{e.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    secretsService.getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  const localeMap = { es: 'es-ES', en: 'en-US', fr: 'fr-FR' };
  const locale = localeMap[i18n.language] || 'es-ES';

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-[var(--text-prime)]">
          {t('dashboard.welcome')}, <span className="text-[var(--electric)]">{user?.username}</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1 font-mono">
          {new Date().toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
        </p>
      </motion.div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={KeyRound} label={t('dashboard.totalSecrets')} value={stats?.total} sub={t('dashboard.inVault')} color="electric" index={0} />
          <StatCard icon={ShieldCheck} label={t('dashboard.activeSecrets')} value={stats?.active} sub={t('dashboard.protected')} color="green" index={1} />
          <StatCard icon={Clock} label={t('dashboard.lastAccess')} value={t('common.now')} sub={t('dashboard.activeSession')} color="amber" index={2} />
          <StatCard icon={TrendingUp} label={t('dashboard.securityStatus')} value={t('dashboard.secure')} sub={t('dashboard.noThreats')} color="green" index={3} />
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><ActivityFeed /></div>
        <div><SystemStatus /></div>
      </div>

      {/* Category breakdown */}
      {stats?.categories && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass rounded-xl p-5 border border-[var(--border-dim)]">
          <div className="flex items-center gap-2 mb-4">
            <Database size={15} className="text-[var(--electric)]" />
            <h3 className="text-sm font-semibold text-[var(--text-prime)]">{t('dashboard.categoryBreakdown')}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(stats.categories).map(([cat, count], i) => (
              <div key={cat} className="text-center p-3 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dim)]">
                <div className="text-xl font-bold text-[var(--electric)]">{count}</div>
                <div className="text-xs text-[var(--text-dim)] mt-1 font-mono uppercase">{cat}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
