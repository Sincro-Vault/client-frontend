import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Eye, EyeOff, ShieldCheck, Lock, User, Loader2, AlertCircle, ArrowRight,
  Fingerprint, ServerCrash, Download, RefreshCw, Monitor, Apple, Terminal,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/mockService';
import { toast } from '../components/ui/Toast';
import LanguageSelector from '../components/ui/LanguageSelector';
import AuthBrandingPanel from '../components/ui/AuthBrandingPanel';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const RELEASES_URL = 'https://github.com/Sincro-Vault/cliente/releases';

function detectOS() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mac'))   return 'mac';
  if (ua.includes('win'))   return 'windows';
  if (ua.includes('linux')) return 'linux';
  return 'unknown';
}

const OS_META = {
  mac:     { label: 'macOS',   Icon: Apple,   ext: '.dmg / .pkg' },
  windows: { label: 'Windows', Icon: Monitor, ext: '.exe / .msi' },
  linux:   { label: 'Linux',   Icon: Terminal, ext: '.deb / .AppImage' },
  unknown: { label: 'tu sistema', Icon: Download, ext: '' },
};

// ── Server offline banner ──────────────────────────────────────────────────
function ServerOfflineBanner({ onRetry, retrying }) {
  const os = detectOS();
  const { Icon: OsIcon, label: osLabel, ext } = OS_META[os];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      style={{
        width: '100%', maxWidth: 480,
        borderRadius: 20,
        background: 'linear-gradient(145deg,rgba(239,68,68,0.08),rgba(127,29,29,0.12))',
        border: '1px solid rgba(239,68,68,0.25)',
        boxShadow: '0 0 40px rgba(239,68,68,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top accent */}
      <div style={{ position:'absolute', top:0, left:'15%', right:'15%', height:1,
        background:'linear-gradient(90deg,transparent,rgba(239,68,68,0.6),transparent)' }} />

      <div style={{ padding: '32px 28px' }}>
        {/* Icon + heading */}
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
          <div style={{
            width:48, height:48, borderRadius:14, flexShrink:0,
            background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 20px rgba(239,68,68,0.15)',
          }}>
            <ServerCrash size={22} style={{ color:'#f87171' }} />
          </div>
          <div>
            <h2 style={{ fontSize:17, fontWeight:800, color:'#fca5a5', margin:0, letterSpacing:'-0.01em' }}>
              Servidor no disponible
            </h2>
            <p style={{ fontSize:12, color:'rgba(248,113,113,0.65)', margin:'3px 0 0',
              fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.04em' }}>
              {BASE_URL.replace('/api','')} · SIN RESPUESTA
            </p>
          </div>
        </div>

        {/* Explanation */}
        <p style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.65, margin:'0 0 22px' }}>
          El cliente local de <span style={{ color:'var(--text-prime)', fontWeight:600 }}>SecureSplit Vault</span> no
          está corriendo en tu máquina. Es necesario instalarlo para que la aplicación pueda
          cifrar y gestionar secretos de forma local.
        </p>

        {/* OS card */}
        <div style={{
          display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
          borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
          marginBottom:20,
        }}>
          <OsIcon size={18} style={{ color:'rgba(56,189,248,0.8)', flexShrink:0 }} />
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:11, color:'var(--text-dim)', margin:0,
              fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.1em', textTransform:'uppercase' }}>Sistema detectado</p>
            <p style={{ fontSize:13.5, color:'var(--text-prime)', fontWeight:600, margin:'3px 0 0' }}>
              {osLabel} {ext && <span style={{ fontSize:11, color:'var(--text-dim)', fontWeight:400 }}>({ext})</span>}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <a
            href={RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              padding:'13px 16px', borderRadius:12,
              background:'linear-gradient(135deg,#0284c7,#0ea5e9)',
              border:'1px solid rgba(56,189,248,0.3)',
              color:'white', fontWeight:700, fontSize:14, textDecoration:'none',
              boxShadow:'0 8px 24px rgba(2,132,199,0.3), inset 0 1px 0 rgba(255,255,255,0.12)',
              letterSpacing:'0.01em',
            }}
          >
            <Download size={15} />
            Descargar servidor para {osLabel}
          </a>

          <button
            onClick={onRetry}
            disabled={retrying}
            style={{
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              padding:'11px 16px', borderRadius:12,
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)',
              color:'var(--text-muted)', fontWeight:600, fontSize:13.5,
              cursor: retrying ? 'not-allowed' : 'pointer',
              opacity: retrying ? 0.6 : 1,
              transition:'all 0.2s',
            }}
          >
            <RefreshCw size={14} style={{ animation: retrying ? 'spin 1s linear infinite' : 'none' }} />
            {retrying ? 'Verificando...' : 'Ya lo instalé, reintentar'}
          </button>
        </div>

        {/* Steps */}
        <div style={{ marginTop:22, paddingTop:18, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize:10.5, color:'var(--text-dim)', fontFamily:'JetBrains Mono,monospace',
            textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 10px' }}>Pasos de instalación</p>
          {[
            '1. Descarga el instalador para tu OS desde el enlace anterior.',
            '2. Ejecuta el instalador y sigue las instrucciones.',
            '3. El servidor iniciará automáticamente en el puerto 5000.',
            '4. Vuelve aquí y haz clic en «Reintentar».',
          ].map((step, i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
              <span style={{ color:'rgba(56,189,248,0.5)', fontFamily:'JetBrains Mono,monospace', fontSize:11, flexShrink:0 }}>{`0${i+1}`}</span>
              <span style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.5 }}>{step.slice(3)}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const schema = z.object({
    username: z.string().min(1, t('validation.required')),
    password: z.string().min(1, t('validation.required')),
    remember: z.boolean().optional(),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  // ── Health check ──────────────────────────────────────────────────────────
  const checkHealth = async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    try {
      const res = await fetch(`${BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timer);
      setServerStatus(res.ok ? 'online' : 'offline');
    } catch {
      clearTimeout(timer);
      setServerStatus('offline');
    }
  };

  useEffect(() => { checkHealth(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = async () => {
    setRetrying(true);
    setServerStatus('checking');
    await checkHealth();
    setRetrying(false);
  };

  const onSubmit = async (data) => {
    setError('');
    try {
      const { user, token } = await authService.login(data);
      login(user, token);
      toast.success(t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch {
      setError(t('auth.loginError'));
    }
  };

  const inputBase = {
    width: '100%',
    paddingLeft: '44px',
    paddingRight: '16px',
    paddingTop: '13px',
    paddingBottom: '13px',
    borderRadius: '12px',
    fontSize: '14px',
    background: 'rgba(255,255,255,0.03)',
    color: 'var(--text-prime)',
    outline: 'none',
    transition: 'all 0.25s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const getInputStyle = (field) => ({
    ...inputBase,
    paddingRight: field === 'password' ? '46px' : '16px',
    border: focusedField === field
      ? '1px solid rgba(56,189,248,0.6)'
      : errors[field]
        ? '1px solid rgba(248,113,113,0.5)'
        : '1px solid rgba(255,255,255,0.07)',
    boxShadow: focusedField === field
      ? '0 0 0 3px rgba(56,189,248,0.08), inset 0 1px 2px rgba(0,0,0,0.2)'
      : 'inset 0 1px 2px rgba(0,0,0,0.2)',
  });

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-void)',
      }}
      className="flex-col lg:flex-row"
    >
      {/* Panel izquierdo — branding */}
      <div style={{ flex: '1.1 1 0', minWidth: 0 }} className="hidden lg:block">
        <AuthBrandingPanel />
      </div>

      {/* Panel derecho — formulario */}
      <div
        style={{
          flex: '1 1 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '48px 28px',
          minHeight: '100vh',
          background: 'linear-gradient(160deg, var(--bg-void) 0%, color-mix(in srgb, var(--bg-void) 92%, #0ea5e9 8%) 100%)',
        }}
      >
        {/* Ambient glow blobs */}
        <div style={{
          position: 'absolute', top: '10%', right: '15%',
          width: 320, height: 320,
          background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', left: '10%',
          width: 240, height: 240,
          background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Language selector */}
        <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 50 }}>
          <LanguageSelector compact />
        </div>

        {/* Logo mobile */}
        <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(56,189,248,0.3)', borderRadius: 14,
              filter: 'blur(8px)',
            }} />
            <div style={{
              position: 'relative',
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(14,165,233,0.35)',
            }}>
              <ShieldCheck size={22} color="white" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-prime)', letterSpacing: '-0.01em' }}>SecureSplit Vault</div>
            <div style={{ fontSize: 9, color: 'rgba(56,189,248,0.6)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.22em', marginTop: 2 }}>ENTERPRISE</div>
          </div>
        </div>

        {/* ── Server status gate ── */}
        <AnimatePresence mode="wait">

          {/* CHECKING */}
          {serverStatus === 'checking' && (
            <motion.div key="checking"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}
            >
              <div style={{
                width:52, height:52, borderRadius:14,
                background:'rgba(56,189,248,0.1)', border:'1px solid rgba(56,189,248,0.2)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Loader2 size={24} style={{ color:'#38bdf8', animation:'spin 1s linear infinite' }} />
              </div>
              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:13, color:'var(--text-muted)', margin:0 }}>Verificando servidor local…</p>
                <p style={{ fontSize:10.5, color:'var(--text-dim)', margin:'4px 0 0',
                  fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.06em' }}>
                  {BASE_URL.replace('/api','')}
                </p>
              </div>
              <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
            </motion.div>
          )}

          {/* OFFLINE */}
          {serverStatus === 'offline' && (
            <motion.div key="offline"
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }}
              transition={{ duration:0.35 }}
            >
              <ServerOfflineBanner onRetry={handleRetry} retrying={retrying} />
            </motion.div>
          )}

          {/* ONLINE — login form */}
          {serverStatus === 'online' && (
            <motion.div key="online"
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              transition={{ duration:0.35 }}
              style={{ width:'100%', maxWidth:420 }}
            >
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: '100%',
            maxWidth: 420,
            padding: '36px 32px',
            borderRadius: '20px',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
            position: 'relative',
          }}
        >
          {/* Card top gradient border */}
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.5), transparent)',
            borderRadius: '50%',
          }} />

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ position: 'relative' }}>
                <Fingerprint size={22} style={{ color: 'rgba(56,189,248,0.9)' }} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-prime)', margin: 0, letterSpacing: '-0.01em' }}>
                {t('auth.login')}
              </h2>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 9px', borderRadius: 999,
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.25)',
                marginLeft: 2,
              }}>
                <span style={{
                  position: 'relative', display: 'inline-flex', width: 7, height: 7,
                }}>
                  <span style={{
                    position: 'absolute', inset: 0,
                    background: '#34d399', borderRadius: '50%',
                    animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
                    opacity: 0.6,
                  }} />
                  <span style={{ position: 'relative', width: 7, height: 7, background: '#34d399', borderRadius: '50%', display: 'inline-block' }} />
                </span>
                <span style={{ fontSize: 9, color: '#34d399', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, letterSpacing: '0.1em' }}>SECURE</span>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Accede a tu bóveda corporativa.{' '}
              <span style={{ color: 'rgba(56,189,248,0.6)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>JWT · 10 min</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Username */}
            <div>
              <label style={{
                display: 'block', fontSize: 10.5, color: 'var(--text-dim)',
                marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em',
              }}>
                {t('auth.username')}
              </label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{
                  position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)',
                  color: focusedField === 'username' ? 'rgba(56,189,248,0.8)' : 'var(--text-dim)',
                  pointerEvents: 'none', transition: 'color 0.2s',
                }} />
                <input
                  {...register('username')}
                  type="text"
                  placeholder="admin"
                  autoComplete="username"
                  style={getInputStyle('username')}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              <AnimatePresence>
                {errors.username && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ marginTop: 6, fontSize: 11, color: '#f87171', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={11} />{errors.username.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{
                  fontSize: 10.5, color: 'var(--text-dim)',
                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em',
                }}>
                  {t('auth.password')}
                </label>
                <span style={{ fontSize: 9, color: 'rgba(56,189,248,0.45)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}>
                  PBKDF2-SHA256
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{
                  position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)',
                  color: focusedField === 'password' ? 'rgba(56,189,248,0.8)' : 'var(--text-dim)',
                  pointerEvents: 'none', transition: 'color 0.2s',
                }} />
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={getInputStyle('password')}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 0, padding: 4,
                    color: 'var(--text-dim)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 6, transition: 'color 0.2s',
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ marginTop: 6, fontSize: 11, color: '#f87171', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={11} />{errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Remember */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
              <input
                {...register('remember')}
                type="checkbox"
                style={{ width: 15, height: 15, accentColor: '#0ea5e9', borderRadius: 4, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{t('auth.rememberMe')}</span>
            </label>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: -8 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', borderRadius: 10,
                    background: 'rgba(127,29,29,0.35)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    color: '#f87171', fontSize: 12.5,
                  }}
                >
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                position: 'relative',
                width: '100%',
                padding: '13px 16px',
                borderRadius: 12,
                border: '1px solid rgba(56,189,248,0.3)',
                background: isSubmitting
                  ? 'rgba(2,132,199,0.4)'
                  : 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #06b6d4 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.02em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: isSubmitting ? 'none' : '0 8px 24px rgba(2,132,199,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
                transition: 'all 0.25s ease',
                overflow: 'hidden',
              }}
            >
              {/* Shimmer overlay */}
              {!isSubmitting && (
                <span style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                  animation: 'shimmer 2.5s infinite',
                  pointerEvents: 'none',
                }} />
              )}
              {isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" style={{ marginRight: 2 }} />{t('auth.loggingIn')}</>
              ) : (
                <><span>{t('auth.login')}</span><ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-dim)', margin: 0 }}>
              {t('auth.noAccount')}{' '}
              <Link to="/register" style={{ color: 'rgba(56,189,248,0.85)', textDecoration: 'none', fontWeight: 600 }}>
                {t('auth.register')} →
              </Link>
            </p>

            {/* Demo credentials */}
            <div style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(56,189,248,0.04)',
              border: '1px dashed rgba(56,189,248,0.18)',
            }}>
              <p style={{
                fontSize: 9, color: 'rgba(56,189,248,0.5)', fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 6px 0', fontWeight: 600,
              }}>
                ◈ Demo credentials
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', margin: 0 }}>
                <span style={{ color: 'var(--text-prime)', fontWeight: 600 }}>admin</span>
                <span style={{ color: 'rgba(56,189,248,0.4)', margin: '0 6px' }}>·</span>
                <span style={{ color: 'var(--text-prime)', fontWeight: 600 }}>Admin123!</span>
              </p>
            </div>
          </div>

          {/* Keyframes */}
          <style>{`
            @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
            @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }
            @keyframes spin { to{transform:rotate(360deg)} }
          `}</style>
        </motion.div>
        </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
