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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-6 border-b border-[var(--border-dim)] ${collapsed ? 'justify-center' : ''}`}>
        <div className="relative w-8 h-8 flex-shrink-0">
          <div className="absolute inset-0 bg-[var(--electric)] rounded-lg opacity-20 blur-sm" />
          <div className="relative w-8 h-8 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center glow-electric">
            <ShieldCheck size={16} className="text-white" />
          </div>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="text-sm font-bold text-[var(--text-prime)] whitespace-nowrap">SecureSplit</div>
              <div className="text-xs text-[var(--text-dim)] font-mono">VAULT v2.4</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ key, icon: Icon, path }) => (
          <NavLink
            key={key}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? 'bg-[var(--bg-hover)] text-[var(--electric)] border border-[var(--electric)]/20'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-prime)]'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[var(--electric)] rounded-r-full" />}
                <Icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {t(`nav.${key}`)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-[var(--border-dim)] p-3 space-y-1">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--bg-panel)]"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <User size={12} className="text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-[var(--text-prime)] truncate">{user?.username}</div>
                <div className="text-xs text-[var(--text-dim)] truncate font-mono">{user?.role}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[var(--text-muted)] hover:bg-red-950/30 hover:text-red-400 transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm"
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
      {/* Desktop Sidebar — sin animación de entrada para evitar parpadeo */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden md:flex flex-col flex-shrink-0 bg-[var(--bg-deep)] border-r border-[var(--border-dim)] relative z-20"
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full border border-[var(--border-bright)] bg-[var(--bg-panel)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--electric)] hover:border-[var(--electric)] transition-all z-30"
        >
          <ChevronRight size={12} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
        <SidebarContent />
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
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area — SIN animación de entrada para evitar parpadeo al cambiar ruta */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[var(--border-dim)] bg-[var(--bg-deep)] z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-[var(--text-muted)] hover:text-[var(--text-prime)]"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-[var(--text-muted)] font-mono">SISTEMA SEGURO</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SessionTimer />
            <LanguageSelector compact />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
          </div>
        </header>

        {/* Contenido — sin motion.div para evitar el parpadeo entre rutas */}
        <main className="flex-1 overflow-auto bg-[var(--bg-void)] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-950/5 via-transparent to-emerald-950/5 pointer-events-none" />
          <div className="relative z-10 p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
