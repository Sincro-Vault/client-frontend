import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ShieldCheck, Lock, User, Mail, Building2, Loader2 } from 'lucide-react';
import { authService } from '../services/mockService';
import { toast } from '../components/ui/Toast';
import ParticleBackground from '../components/ui/ParticleBackground';
import PasswordStrength from '../components/ui/PasswordStrength';
import LanguageSelector from '../components/ui/LanguageSelector';

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
  }).refine(d => d.password === d.confirmPassword, {
    message: t('validation.passwordMismatch'),
    path: ['confirmPassword'],
  });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const password = watch('password', '');

  const onSubmit = async (data) => {
    try {
      await authService.register(data);
      toast.success('Cuenta creada. Inicia sesión.');
      navigate('/login');
    } catch (e) {
      toast.error(t('common.error'));
    }
  };

  // Componente reutilizable de campo con icono tipo cajita
  const Field = ({ name, label, icon: Icon, type = 'text', placeholder }) => (
    <div>
      <label className="block text-sm text-[var(--text-muted)] mb-2 font-medium">{label}</label>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-dim)] flex items-center justify-center ml-1">
            <Icon size={15} className="text-[var(--electric)]" />
          </div>
        </div>
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          className="w-full rounded-xl text-sm font-medium"
          style={{ padding: '13px 16px 13px 56px' }}
        />
      </div>
      {errors[name] && <p className="mt-1.5 text-xs text-red-400">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8"
      style={{ background: 'var(--bg-void)' }}>
      <ParticleBackground />

      {/* Grid de fondo */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(var(--electric) 1px, transparent 1px), linear-gradient(90deg, var(--electric) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--electric) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--green-safe) 0%, transparent 70%)' }} />

      <div className="fixed top-5 right-5 z-50"><LanguageSelector /></div>

      <div className="relative z-10 w-full max-w-lg px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-5 relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500 to-emerald-500 blur-2xl opacity-50" />
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shadow-2xl">
              <ShieldCheck size={42} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[var(--text-prime)] mb-2 tracking-tight">SecureSplit Vault</h1>
          <p className="text-[var(--text-muted)] text-sm font-mono tracking-widest">
            {t('auth.register').toUpperCase()} · ENTERPRISE
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="glass-bright rounded-3xl p-10"
          style={{ border: '1px solid var(--border-bright)' }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <Field name="companyName" label={t('auth.companyName')} icon={Building2} placeholder="Acme Corp" />
            <Field name="username"    label={t('auth.username')}    icon={User}      placeholder="johndoe" />
            <Field name="email"       label={t('auth.email')}       icon={Mail}      type="email" placeholder="john@acme.com" />

            {/* Password con toggle */}
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2 font-medium">{t('auth.password')}</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-dim)] flex items-center justify-center ml-1">
                    <Lock size={15} className="text-[var(--electric)]" />
                  </div>
                </div>
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-xl text-sm font-medium"
                  style={{ padding: '13px 48px 13px 56px' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors p-1">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
              <PasswordStrength password={password} />
            </div>

            {/* Confirm password con toggle */}
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2 font-medium">{t('auth.confirmPassword')}</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-dim)] flex items-center justify-center ml-1">
                    <Lock size={15} className="text-[var(--electric)]" />
                  </div>
                </div>
                <input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-xl text-sm font-medium"
                  style={{ padding: '13px 48px 13px 56px' }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors p-1">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 glow-electric mt-2"
              style={{ padding: '15px' }}
            >
              {isSubmitting
                ? <><Loader2 size={18} className="animate-spin" />{t('common.loading')}</>
                : t('auth.register')
              }
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-dim)] mt-7">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-[var(--electric)] hover:text-[var(--electric-bright)] transition-colors font-medium">
              {t('auth.login')}
            </Link>
          </p>
        </motion.div>

        <p className="text-center text-xs text-[var(--text-dim)] mt-5 font-mono tracking-wider">
          JWT · AES-256 · TLS 1.3 · ZERO TRUST
        </p>
      </div>
    </div>
  );
}
