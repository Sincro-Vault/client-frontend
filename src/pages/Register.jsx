import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Eye, EyeOff, ShieldCheck, Lock, User, Mail, Building2, Loader2, ArrowRight,
} from 'lucide-react';
import { authService } from '../services/mockService';
import { toast } from '../components/ui/Toast';
import PasswordStrength from '../components/ui/PasswordStrength';
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

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const schema = z.object({
    companyName: z.string().min(2, t('validation.required')),
    username: z.string().min(3, t('validation.minLength', { min: 3 })),
    email: z.string().email(t('validation.invalidEmail')),
    password: z.string()
      .min(8, t('validation.minLength', { min: 8 }))
      .regex(/[A-Z]/, t('validation.weakPassword'))
      .regex(/[a-z]/, t('validation.weakPassword'))
      .regex(/[0-9]/, t('validation.weakPassword'))
      .regex(/[^A-Za-z0-9]/, t('validation.weakPassword')),
    confirmPassword: z.string(),
  }).refine((d) => d.password === d.confirmPassword, {
    message: t('validation.passwordMismatch'),
    path: ['confirmPassword'],
  });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });
  const password = watch('password', '');

  const onSubmit = async (data) => {
    try {
      await authService.register(data);
      toast.success(t('auth.loginSuccess'));
      navigate('/login');
    } catch {
      toast.error(t('common.error'));
    }
  };

  const Field = ({ name, label, icon: Icon, type = 'text', placeholder, autoComplete }) => (
    <div>
      <label style={LABEL_STYLE}>{label}</label>
      <div style={{ position: 'relative' }}>
        <Icon size={14} style={ICON_STYLE} />
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={INPUT_STYLE}
        />
      </div>
      {errors[name] && <p style={{ marginTop: 6, fontSize: 11, color: '#f87171' }}>{errors[name].message}</p>}
    </div>
  );

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
      <div style={{ flex: '1.1 1 0', minWidth: 0 }} className="hidden lg:block">
        <AuthBrandingPanel />
      </div>

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

        <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
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
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-prime)', letterSpacing: '-0.02em', margin: 0 }}>
              {t('auth.register')}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>
              Crea una cuenta y comienza a proteger tus credenciales.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field name="companyName" label={t('auth.companyName')} icon={Building2} placeholder="Aldeamo S.A.S." autoComplete="organization" />
            <Field name="username" label={t('auth.username')} icon={User} placeholder="jperez" autoComplete="username" />
            <Field name="email" label={t('auth.email')} icon={Mail} type="email" placeholder="j.perez@aldeamo.com" autoComplete="email" />

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ ...LABEL_STYLE, marginBottom: 0 }}>{t('auth.password')}</label>
                <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>PBKDF2 · 100k</span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={ICON_STYLE} />
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={INPUT_STYLE_WITH_TOGGLE}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} tabIndex={-1}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 0, padding: 4, color: 'var(--text-dim)', cursor: 'pointer',
                  }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p style={{ marginTop: 6, fontSize: 11, color: '#f87171' }}>{errors.password.message}</p>}
              <PasswordStrength password={password} />
            </div>

            {/* Confirm */}
            <div>
              <label style={LABEL_STYLE}>{t('auth.confirmPassword')}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={ICON_STYLE} />
                <input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={INPUT_STYLE_WITH_TOGGLE}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 0, padding: 4, color: 'var(--text-dim)', cursor: 'pointer',
                  }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && <p style={{ marginTop: 6, fontSize: 11, color: '#f87171' }}>{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%', padding: '12px', marginTop: 4,
                borderRadius: 8, border: 0,
                background: 'linear-gradient(90deg, #0284c7, #0ea5e9)',
                color: 'white', fontWeight: 600, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1,
                boxShadow: '0 10px 15px -3px rgba(2,132,199,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" />{t('common.loading')}</>
              ) : (
                <>{t('auth.register')}<ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-dim)' }}>
            {t('auth.hasAccount')}{' '}
            <Link to="/login" style={{ color: 'var(--electric)', textDecoration: 'none', fontWeight: 500 }}>
              {t('auth.login')} →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
