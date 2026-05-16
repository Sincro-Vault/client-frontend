import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Shield, Bell, Palette, Key, Save, Check } from 'lucide-react';
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
    toast.success(t('settings.saved'));
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-[var(--text-prime)]">{t('nav.settings')}</h1>
        <p className="text-xs text-[var(--text-dim)] font-mono mt-0.5">{t('settings.subtitle')}</p>
      </motion.div>

      <Section icon={User} title={t('settings.profile')} index={0}>
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
              <label className="block text-xs text-[var(--text-dim)] mb-1.5">{t('auth.username')}</label>
              <input defaultValue={user?.username} className="w-full px-3 py-2 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-dim)] mb-1.5">{t('auth.email')}</label>
              <input defaultValue={user?.email} className="w-full px-3 py-2 rounded-lg text-sm" />
            </div>
          </div>
        </div>
      </Section>

      <Section icon={Palette} title={t('settings.languageRegion')} index={1}>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-[var(--text-prime)]">{t('settings.interfaceLanguage')}</p>
            <p className="text-xs text-[var(--text-dim)] mt-0.5">{t('settings.interfaceLanguageDesc')}</p>
          </div>
          <LanguageSelector />
        </div>
      </Section>

      <Section icon={Shield} title={t('settings.security')} index={2}>
        <Toggle label={t('settings.autoLogout')} desc={t('settings.autoLogoutDesc')} defaultChecked />
        <Toggle label={t('settings.autoBlur')} desc={t('settings.autoBlurDesc')} defaultChecked />
        <Toggle label={t('settings.twoFactor')} desc={t('settings.twoFactorDesc')} />
        <Toggle label={t('settings.suspiciousAccess')} desc={t('settings.suspiciousAccessDesc')} defaultChecked />
      </Section>

      <Section icon={Bell} title={t('settings.notifications')} index={3}>
        <Toggle label={t('settings.sessionNotifications')} desc={t('settings.sessionNotificationsDesc')} defaultChecked />
        <Toggle label={t('settings.securityAlerts')} defaultChecked />
        <Toggle label={t('settings.weeklyDigest')} desc={t('settings.weeklyDigestDesc')} />
      </Section>

      <Section icon={Key} title={t('settings.apiIntegrations')} index={4}>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dim)]">
            <div>
              <p className="text-sm text-[var(--text-muted)]">{t('settings.apiKey')}</p>
              <p className="text-xs font-mono text-[var(--text-dim)] mt-0.5">ssv_••••••••••••••••3f9a</p>
            </div>
            <button className="text-xs text-[var(--electric)] hover:text-[var(--electric-bright)] transition-colors font-medium">{t('common.regenerate')}</button>
          </div>
          <p className="text-xs text-[var(--text-dim)]">{t('settings.endpoint')}: <span className="font-mono text-[var(--text-muted)]">https://api.securesplit.io/v1</span></p>
        </div>
      </Section>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-medium text-sm transition-all glow-electric">
          {saved ? <><Check size={15} />{t('common.saved')}</> : <><Save size={15} />{t('common.save')}</>}
        </button>
      </motion.div>
    </div>
  );
}
