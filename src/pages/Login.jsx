import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Eye, EyeOff, ShieldCheck, Lock, User, Loader2, AlertCircle, ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/mockService';
import { toast } from '../components/ui/Toast';
import LanguageSelector from '../components/ui/LanguageSelector';
import AuthBrandingPanel from '../components/ui/AuthBrandingPanel';

const INPUT_STYLE = {
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '16px',
  paddingTop: '12px',
  paddingBottom: '12px',
  borderRadius: '8px',
  fontSize: '14px',
  background: 'var(--bg-panel)',
  border: '1px solid var(--border-dim)',
  color: 'var(--text-prime)',
  outline: 'none',
  transition: 'all 0.2s',
};

const INPUT_STYLE_WITH_TOGGLE = { ...INPUT_STYLE, paddingRight: '44px' };

const LABEL_STYLE = {
  display: 'block',
  fontSize: '11px',
  color: 'var(--text-dim)',
  marginBottom: '6px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

const ICON_STYLE = {
  position: 'absolute',
  left: '14px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--text-dim)',
  pointerEvents: 'none',
};

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const schema = z.object({
    username: z.string().min(1, t('validation.required')),
    password: z.string().min(1, t('validation.required')),
    remember: z.boolean().optional(),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

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

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-void)',
        flexDirection: 'row',
      }}
      className="flex-col lg:flex-row"
    >
      {/* Panel izquierdo */}
      <div style={{ flex: '1.1 1 0', minWidth: 0 }} className="hidden lg:block">
        <AuthBrandingPanel />
      </div>

      {/* Panel derecho */}
      <div
        style={{
          flex: '1 1 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '40px 24px',
          minHeight: '100vh',
        }}
      >
        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 50 }}>
          <LanguageSelector compact />
        </div>

        {/* Logo mobile */}
        <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
          }}>
            <ShieldCheck size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-prime)' }}>SecureSplit Vault</div>
            <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.2em' }}>ENTERPRISE</div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ width: '100%', maxWidth: 380 }}
        >
          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-prime)', margin: 0 }}>
                {t('auth.login')}
              </h2>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '2px 8px', borderRadius: 999,
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#34d399', display: 'inline-block',
                }} className="animate-pulse" />
                <span style={{ fontSize: 9, color: '#34d399', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500, letterSpacing: '0.1em' }}>SECURE</span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
              Accede a tu bóveda corporativa. Sesión JWT de 10 minutos.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Username */}
            <div>
              <label style={LABEL_STYLE}>{t('auth.username')}</label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={ICON_STYLE} />
                <input
                  {...register('username')}
                  type="text"
                  placeholder="admin"
                  autoComplete="username"
                  style={INPUT_STYLE}
                />
              </div>
              {errors.username && <p style={{ marginTop: 6, fontSize: 11, color: '#f87171' }}>{errors.username.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ ...LABEL_STYLE, marginBottom: 0 }}>{t('auth.password')}</label>
                <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>PBKDF2-SHA256</span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={ICON_STYLE} />
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={INPUT_STYLE_WITH_TOGGLE}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute',
                    right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 0, padding: 4,
                    color: 'var(--text-dim)', cursor: 'pointer',
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p style={{ marginTop: 6, fontSize: 11, color: '#f87171' }}>{errors.password.message}</p>}
            </div>

            {/* Remember */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
              <input {...register('remember')} type="checkbox" style={{ width: 14, height: 14, accentColor: '#0ea5e9' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('auth.rememberMe')}</span>
            </label>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(127, 29, 29, 0.4)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171', fontSize: 12,
                }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%', padding: '12px',
                borderRadius: 8, border: 0,
                background: 'linear-gradient(90deg, #0284c7, #0ea5e9)',
                color: 'white', fontWeight: 600, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1,
                boxShadow: '0 10px 15px -3px rgba(2, 132, 199, 0.3)',
                transition: 'all 0.2s',
              }}
            >
              {isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" />{t('auth.loggingIn')}</>
              ) : (
                <>{t('auth.login')}<ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-dim)', margin: 0 }}>
              {t('auth.noAccount')}{' '}
              <Link to="/register" style={{ color: 'var(--electric)', textDecoration: 'none', fontWeight: 500 }}>
                {t('auth.register')} →
              </Link>
            </p>

            <div style={{
              padding: 12, borderRadius: 8,
              background: 'rgba(10, 22, 40, 0.5)',
              border: '1px dashed var(--border-dim)',
            }}>
              <p style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Demo</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', margin: 0 }}>
                <span style={{ color: 'var(--text-prime)' }}>admin</span>{' · '}<span style={{ color: 'var(--text-prime)' }}>Admin123!</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
