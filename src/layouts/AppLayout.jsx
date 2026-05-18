import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, KeyRound, Plus, Shield, Settings, LogOut,
  Menu, ChevronRight, User, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import SessionTimer from '../components/ui/SessionTimer';
import LanguageSelector from '../components/ui/LanguageSelector';
import { toast } from '../components/ui/Toast';

const NAV_ITEMS = [
  { key: 'dashboard',     icon: LayoutDashboard, path: '/dashboard' },
  { key: 'secrets',       icon: KeyRound,        path: '/secrets' },
  { key: 'createSecret',  icon: Plus,            path: '/secrets/create' },
  { key: 'certificate',   icon: Shield,          path: '/certificate' },
  { key: 'settings',      icon: Settings,        path: '/settings' },
];

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info(t('auth.logoutSuccess'));
    navigate('/login');
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className={`flex items-center gap-4 px-5 py-7 border-b border-[var(--border-dim)]/60 ${collapsed ? 'justify-center px-3' : ''}`}>
        <div className="relative w-9 h-9 flex-shrink-0">
          <div className="absolute inset-0 bg-sky-400 rounded-xl opacity-25 blur-md" />
          <div className="relative w-9 h-9 bg-gradient-to-br from-sky-400 via-cyan-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30">
            <ShieldCheck size={17} className="text-white drop-shadow" />
          </div>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18 }}
            >
              <div className="text-sm font-extrabold tracking-wide text-[var(--text-prime)] whitespace-nowrap">SecureSplit</div>
              <div className="text-[10px] text-sky-400/70 font-mono tracking-widest uppercase mt-0.5">VAULT v2.4</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 overflow-y-auto">
        {NAV_ITEMS.map(({ key, icon: Icon, path }) => (
          <NavLink
            key={key}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 mx-3 my-2 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500/15 via-cyan-500/10 to-transparent text-sky-300 border border-sky-500/25 shadow-sm shadow-sky-500/10'
                  : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-prime)] border border-transparent'
              } ${collapsed ? 'justify-center px-0 mx-2' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active glow bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-sky-400 to-cyan-500 rounded-r-full shadow-[0_0_8px_2px_rgba(56,189,248,0.5)]" />
                )}
                {/* Hover shimmer */}
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.03] to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out pointer-events-none" />

                <div className={`flex-shrink-0 relative ${ isActive ? 'text-sky-400' : '' }`}>
                  {isActive && <span className="absolute inset-0 bg-sky-400/20 blur-sm rounded-md" />}
                  <Icon size={18} className="relative z-10" />
                </div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.15 }}
                      className={`text-sm font-medium whitespace-nowrap tracking-wide ${ isActive ? 'text-sky-300' : '' }`}
                    >
                      {t(`nav.${key}`)}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active corner accent */}
                {isActive && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_2px_rgba(56,189,248,0.7)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-[var(--border-dim)]/60 p-3 pt-4 space-y-2">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-gradient-to-r from-white/[0.04] to-transparent border border-white/[0.06]"
            >
              <div className="relative w-8 h-8 flex-shrink-0">
                <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-sm" />
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
                  <User size={13} className="text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[var(--text-prime)] truncate">{user?.username}</div>
                <div className="text-[10px] text-[var(--text-dim)] truncate font-mono tracking-wider mt-0.5">{user?.role}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3.5 w-full px-3.5 py-3 rounded-xl text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-200 group ${ collapsed ? 'justify-center' : '' }`}
        >
          <LogOut size={17} className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-200" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-medium tracking-wide"
              >
                {t('auth.logout')}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[var(--bg-void)] overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 256 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex flex-col flex-shrink-0 bg-[var(--bg-deep)] border-r border-[var(--border-dim)]/60 relative z-20"
        style={{ background: 'linear-gradient(180deg, var(--bg-deep) 0%, color-mix(in srgb, var(--bg-deep) 95%, #0ea5e9 5%) 100%)' }}
      >
        {/* Sidebar inner glow line */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-sky-500/20 to-transparent pointer-events-none" />

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-10 w-7 h-7 rounded-full border border-sky-500/30 bg-[var(--bg-panel)] flex items-center justify-center text-[var(--text-muted)] hover:text-sky-400 hover:border-sky-400/60 hover:shadow-[0_0_10px_2px_rgba(56,189,248,0.2)] transition-all duration-200 z-30"
        >
          <ChevronRight size={13} className={`transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
        </button>
        {renderSidebarContent()}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-60 bg-[var(--bg-deep)] border-r border-[var(--border-dim)] z-40 md:hidden"
            >
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area — SIN animación de entrada para evitar parpadeo al cambiar ruta */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-3.5 flex-shrink-0 z-50 relative"
          style={{
            borderBottom: '1px solid rgba(var(--border-dim-rgb, 255,255,255), 0.06)',
            background: 'linear-gradient(90deg, var(--bg-deep) 0%, color-mix(in srgb, var(--bg-deep) 97%, #0ea5e9 3%) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Topbar bottom glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent pointer-events-none" />

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-sky-400 hover:bg-sky-500/10 border border-transparent hover:border-sky-500/20 transition-all duration-200"
            >
              <Menu size={19} />
            </button>
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] text-emerald-400/80 font-mono tracking-widest uppercase">
                {t('nav.systemSecure')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SessionTimer />
            <LanguageSelector compact />
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-md" />
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/30 border border-white/10">
                <User size={14} color="white" />
              </div>
            </div>
          </div>
        </header>

        {/* Contenido — sin motion.div para evitar el parpadeo entre rutas */}
        <main className="flex-1 overflow-auto bg-[var(--bg-void)] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-950/8 via-transparent to-indigo-950/8 pointer-events-none" />
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-sky-500/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 p-5 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
