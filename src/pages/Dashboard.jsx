import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { KeyRound, ShieldCheck, Clock, Activity, TrendingUp, Database, Cpu, Wifi, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { secretsService } from '../services/mockService';
import { SkeletonCard } from '../components/ui/Skeleton';

const PALETTE = {
  electric: { text:'#38bdf8', border:'rgba(56,189,248,0.2)', bg:'linear-gradient(135deg,rgba(56,189,248,0.08),rgba(14,165,233,0.03))', glow:'0 0 24px rgba(56,189,248,0.12)' },
  green:    { text:'#34d399', border:'rgba(52,211,153,0.2)',  bg:'linear-gradient(135deg,rgba(52,211,153,0.08),rgba(16,185,129,0.03))',  glow:'0 0 24px rgba(52,211,153,0.10)'  },
  amber:    { text:'#fbbf24', border:'rgba(251,191,36,0.2)',  bg:'linear-gradient(135deg,rgba(251,191,36,0.08),rgba(245,158,11,0.03))',  glow:'0 0 24px rgba(251,191,36,0.08)'  },
};

const StatCard = ({ icon: Icon, label, value, sub, color='electric', index }) => {
  const c = PALETTE[color] ?? PALETTE.electric;
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      transition={{ delay: index*0.09, ease:[0.4,0,0.2,1] }}
      style={{ position:'relative', overflow:'hidden', borderRadius:16, border:`1px solid ${c.border}`,
        background:c.bg, padding:'22px 20px',
        boxShadow:`${c.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`, backdropFilter:'blur(12px)' }}
    >
      <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:1,
        background:`linear-gradient(90deg,transparent,${c.text}66,transparent)` }} />
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:10, color:'var(--text-dim)', fontWeight:600, textTransform:'uppercase',
            letterSpacing:'0.14em', marginBottom:10, fontFamily:'JetBrains Mono,monospace' }}>{label}</p>
          <p style={{ fontSize:32, fontWeight:800, color:c.text, lineHeight:1, letterSpacing:'-0.02em' }}>{value}</p>
          {sub && <p style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:6 }}>{sub}</p>}
        </div>
        <div style={{ padding:10, borderRadius:12, background:'rgba(255,255,255,0.04)',
          border:`1px solid ${c.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={18} style={{ color:c.text }} />
        </div>
      </div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2,
        background:`linear-gradient(90deg,transparent,${c.text}4D,transparent)` }} />
    </motion.div>
  );
};

const panel = {
  borderRadius:16, backdropFilter:'blur(12px)',
  background:'linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))',
  border:'1px solid rgba(255,255,255,0.07)', padding:'22px 20px',
  boxShadow:'inset 0 1px 0 rgba(255,255,255,0.04)',
};

const PanelHeader = ({ icon: Icon, title, badge }) => (
  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
    <div style={{ width:28, height:28, borderRadius:8, background:'rgba(56,189,248,0.12)',
      border:'1px solid rgba(56,189,248,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <Icon size={14} style={{ color:'#38bdf8' }} />
    </div>
    <h3 style={{ fontSize:13, fontWeight:700, color:'var(--text-prime)', letterSpacing:'0.01em' }}>{title}</h3>
    {badge && <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5,
      padding:'2px 8px', borderRadius:999, background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.2)' }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:'#34d399', display:'inline-block' }} className="animate-pulse" />
      <span style={{ fontSize:9, color:'#34d399', fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.1em' }}>{badge}</span>
    </div>}
  </div>
);

const SystemStatus = () => {
  const { t } = useTranslation();
  const items = [
    { label:t('dashboard.components.encryptionEngine'), value:'AES-256-GCM', pct:100 },
    { label:t('dashboard.components.keyDerivation'),    value:'PBKDF2',       pct:100 },
    { label:t('dashboard.components.tlsLayer'),         value:'TLS 1.3',      pct:100 },
    { label:t('dashboard.components.vaultCore'),        value:'v2.4.1',       pct:98  },
  ];
  return (
    <div style={panel}>
      <PanelHeader icon={Cpu} title={t('dashboard.system')} badge="NOMINAL" />
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {items.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.3+i*0.07 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#34d399', display:'inline-block', flexShrink:0 }} />
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>{item.label}</span>
              </div>
              <span style={{ fontSize:11, color:'rgba(56,189,248,0.7)', fontFamily:'JetBrains Mono,monospace' }}>{item.value}</span>
            </div>
            <div style={{ height:3, borderRadius:99, background:'rgba(255,255,255,0.05)' }}>
              <motion.div initial={{ width:0 }} animate={{ width:`${item.pct}%` }}
                transition={{ delay:0.5+i*0.08, duration:0.6, ease:'easeOut' }}
                style={{ height:'100%', borderRadius:99,
                  background: item.pct===100 ? 'linear-gradient(90deg,#34d399,#0ea5e9)' : 'linear-gradient(90deg,#fbbf24,#f59e0b)' }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ActivityFeed = () => {
  const { t } = useTranslation();
  const events = [
    { action:'SECRET_READ',    name:'AWS_ACCESS_KEY',       time:'2 min ago', icon:KeyRound,    color:'#38bdf8', bg:'rgba(56,189,248,0.1)'  },
    { action:'SECRET_CREATED', name:'REDIS_PASSWORD',       time:'1 hr ago',  icon:ShieldCheck, color:'#34d399', bg:'rgba(52,211,153,0.1)'  },
    { action:'SECRET_UPDATED', name:'DATABASE_URL',         time:'3 hrs ago', icon:Activity,    color:'#fbbf24', bg:'rgba(251,191,36,0.1)'  },
    { action:'LOGIN',          name:'admin@securesplit.io', time:'5 hrs ago', icon:Wifi,        color:'#a78bfa', bg:'rgba(167,139,250,0.1)' },
  ];
  return (
    <div style={panel}>
      <PanelHeader icon={Activity} title={t('dashboard.recentActivity')} />
      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
        {events.map((e, i) => (
          <motion.div key={i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.35+i*0.08 }}
            style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:10,
              borderBottom: i<events.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <div style={{ flexShrink:0, width:30, height:30, borderRadius:8,
              background:e.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <e.icon size={13} style={{ color:e.color }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', color:e.color, margin:0, letterSpacing:'0.04em' }}>{e.action}</p>
              <p style={{ fontSize:12, color:'var(--text-muted)', margin:'2px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{e.name}</p>
            </div>
            <span style={{ fontSize:10.5, color:'var(--text-dim)', flexShrink:0, fontFamily:'JetBrains Mono,monospace' }}>{e.time}</span>
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

  const localeMap = { es:'es-ES', en:'en-US', fr:'fr-FR' };
  const locale = localeMap[i18n.language] || 'es-ES';

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:28, maxWidth:1280 }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
          <div>
            <h1 style={{ fontSize:26, fontWeight:800, color:'var(--text-prime)', margin:0, letterSpacing:'-0.02em' }}>
              {t('dashboard.welcome')},{' '}
              <span style={{ background:'linear-gradient(90deg,#38bdf8,#34d399)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                {user?.username}
              </span>
            </h1>
            <p style={{ fontSize:11.5, color:'var(--text-dim)', marginTop:6,
              fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.08em' }}>
              {new Date().toLocaleDateString(locale, { weekday:'long', year:'numeric', month:'long', day:'numeric' }).toUpperCase()}
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:10,
            background:'rgba(52,211,153,0.07)', border:'1px solid rgba(52,211,153,0.18)' }}>
            <Zap size={13} style={{ color:'#34d399' }} />
            <span style={{ fontSize:11, color:'#34d399', fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.08em' }}>VAULT ONLINE</span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={KeyRound}    label={t('dashboard.totalSecrets')}   value={stats?.total}          sub={t('dashboard.inVault')}       color="electric" index={0} />
          <StatCard icon={ShieldCheck} label={t('dashboard.activeSecrets')}  value={stats?.active}         sub={t('dashboard.protected')}     color="green"    index={1} />
          <StatCard icon={Clock}       label={t('dashboard.lastAccess')}     value={t('common.now')}       sub={t('dashboard.activeSession')} color="amber"    index={2} />
          <StatCard icon={TrendingUp}  label={t('dashboard.securityStatus')} value={t('dashboard.secure')} sub={t('dashboard.noThreats')}    color="green"    index={3} />
        </div>
      )}

      {/* Activity + System */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><ActivityFeed /></div>
        <div><SystemStatus /></div>
      </div>

      {/* Category breakdown */}
      {stats?.categories && (
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }} style={panel}>
          <PanelHeader icon={Database} title={t('dashboard.categoryBreakdown')} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(stats.categories).map(([cat, count], i) => (
              <motion.div key={cat}
                initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                transition={{ delay:0.55+i*0.06 }}
                style={{ textAlign:'center', padding:'16px 10px', borderRadius:12,
                  background:'rgba(255,255,255,0.03)', border:'1px solid rgba(56,189,248,0.1)' }}>
                <div style={{ fontSize:24, fontWeight:800, color:'#38bdf8', letterSpacing:'-0.02em' }}>{count}</div>
                <div style={{ fontSize:9.5, color:'var(--text-dim)', marginTop:6,
                  fontFamily:'JetBrains Mono,monospace', textTransform:'uppercase', letterSpacing:'0.1em' }}>{cat}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
