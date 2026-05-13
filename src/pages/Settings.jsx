import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, User, Shield, Bell, Palette, Key, Save, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import LanguageSelector from '../components/ui/LanguageSelector';
import { toast } from '../components/ui/Toast';

const Section = ({ icon: Icon, title, children, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="glass rounded-xl border border-[var(--border-dim)] overflow-hidden"
  >
    <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-dim)] bg-[var(--bg-panel)]">
      <div className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-dim)]">
        <Icon size={14} className="text-[var(--electric)]" />
      </div>
      <h3 className="text-sm font-semibold text-[var(--text-prime)]">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </motion.div>
);

const Toggle = ({ label, desc, defaultChecked = false }) => {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border-dim)] last:border-0">
      <div>
        <p className="text-sm text-[var(--text-prime)]">{label}</p>
        {desc && <p className="text-xs text-[var(--text-dim)] mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0 ${on ? 'bg-[var(--electric)]' : 'bg-[var(--border-bright)]'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${on ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
};

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success('Configuración guardada');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-[var(--text-prime)]">{t('nav.settings')}</h1>
        <p className="text-xs text-[var(--text-dim)] font-mono mt-0.5">PREFERENCIAS DEL SISTEMA</p>
      </motion.div>

      <Section icon={User} title="Perfil" index={0}>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-[var(--text-prime)]">{user?.username}</p>
              <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
              <p className="text-xs text-[var(--text-dim)] font-mono mt-0.5">{user?.company} · {user?.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--text-dim)] mb-1.5">Usuario</label>
              <input defaultValue={user?.username} className="w-full px-3 py-2 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-dim)] mb-1.5">Email</label>
              <input defaultValue={user?.email} className="w-full px-3 py-2 rounded-lg text-sm" />
            </div>
          </div>
        </div>
      </Section>

      <Section icon={Palette} title="Idioma y Región" index={1}>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-[var(--text-prime)]">Idioma de la interfaz</p>
            <p className="text-xs text-[var(--text-dim)] mt-0.5">Español, English, Français</p>
          </div>
          <LanguageSelector />
        </div>
      </Section>

      <Section icon={Shield} title="Seguridad" index={2}>
        <Toggle label="Auto-logout al cerrar pestaña" desc="Cierra sesión automáticamente" defaultChecked />
        <Toggle label="Blur automático de secretos" desc="Oculta valores después de 10s" defaultChecked />
        <Toggle label="Autenticación de dos factores" desc="2FA por TOTP (próximamente)" />
        <Toggle label="Notificar accesos sospechosos" desc="Alertas por email" defaultChecked />
      </Section>

      <Section icon={Bell} title="Notificaciones" index={3}>
        <Toggle label="Notificaciones de sesión" desc="Avisos antes de que expire la sesión" defaultChecked />
        <Toggle label="Alertas de seguridad" defaultChecked />
        <Toggle label="Resumen semanal" desc="Email con estadísticas de uso" />
      </Section>

      <Section icon={Key} title="API & Integraciones" index={4}>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dim)]">
            <div>
              <p className="text-sm text-[var(--text-muted)]">API Key</p>
              <p className="text-xs font-mono text-[var(--text-dim)] mt-0.5">ssv_••••••••••••••••3f9a</p>
            </div>
            <button className="text-xs text-[var(--electric)] hover:text-[var(--electric-bright)] transition-colors font-medium">Regenerar</button>
          </div>
          <p className="text-xs text-[var(--text-dim)]">Endpoint: <span className="font-mono text-[var(--text-muted)]">https://api.securesplit.io/v1</span></p>
        </div>
      </Section>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-medium text-sm transition-all glow-electric">
          {saved ? <><Check size={15} />Guardado</> : <><Save size={15} />{t('common.save')}</>}
        </button>
      </motion.div>
    </div>
  );
}
