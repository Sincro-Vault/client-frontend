import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ShieldCheck, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/mockService';
import { toast } from '../components/ui/Toast';
import ParticleBackground from '../components/ui/ParticleBackground';
import LanguageSelector from '../components/ui/LanguageSelector';

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

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setError('');
    try {
      const { user, token } = await authService.login(data);
      login(user, token);
      toast.success(t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch (e) {
      setError(t('auth.loginError'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-void)' }}>
      <ParticleBackground />

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(var(--electric) 1px, transparent 1px), linear-gradient(90deg, var(--electric) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Glow orbs de fondo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--electric) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--green-safe) 0%, transparent 70%)' }} />

      {/* Lang selector top right */}
      <div className="fixed top-5 right-5 z-50">
        <LanguageSelector />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6 relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500 to-emerald-500 blur-2xl opacity-50" />
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shadow-2xl">
              <ShieldCheck size={42} className="text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-[var(--text-prime)] mb-2 tracking-tight">
            SecureSplit Vault
          </h1>
          <p className="text-[var(--text-muted)] text-sm font-mono tracking-widest">
            ENTERPRISE CREDENTIAL MANAGEMENT
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
          {/* Card header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-sky-900/40 border border-sky-700/30">
              <Lock size={16} className="text-[var(--electric)]" />
            </div>
            <span className="text-base font-semibold text-[var(--text-prime)]">{t('auth.login')}</span>
            <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-700/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-mono font-medium">SECURE</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2 font-medium">
                {t('auth.username')}
              </label>
              <div className="relative">
                {/* Icono con fondo separado del input */}
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-dim)] flex items-center justify-center ml-1">
                    <User size={15} className="text-[var(--electric)]" />
                  </div>
                </div>
                <input
                  {...register('username')}
                  type="text"
                  placeholder="admin"
                  className="w-full pl-14 pr-4 rounded-xl text-sm font-medium"
                  style={{ padding: '14px 16px 14px 56px' }}
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-red-400">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2 font-medium">
                {t('auth.password')}
              </label>
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
                  style={{ padding: '14px 48px 14px 56px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors p-1"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Remember */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  {...register('remember')}
                  type="checkbox"
                  className="w-4 h-4 rounded accent-sky-500"
                />
                <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-prime)] transition-colors">
                  {t('auth.rememberMe')}
                </span>
              </label>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-sm"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 glow-electric mt-2"
              style={{ padding: '15px' }}
            >
              {isSubmitting
                ? <><Loader2 size={18} className="animate-spin" />{t('auth.loggingIn')}</>
                : t('auth.login')
              }
            </button>
          </form>

          {/* Footer links */}
          <p className="text-center text-sm text-[var(--text-dim)] mt-7">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-[var(--electric)] hover:text-[var(--electric-bright)] transition-colors font-medium">
              {t('auth.register')}
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-4 p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dim)] flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--electric)]" />
            <p className="text-sm text-[var(--text-dim)] font-mono">Demo: <span className="text-[var(--text-muted)]">admin</span> / <span className="text-[var(--text-muted)]">Admin123!</span></p>
          </div>
        </motion.div>

        <p className="text-center text-xs text-[var(--text-dim)] mt-5 font-mono tracking-wider">
          JWT · AES-256 · TLS 1.3 · ZERO TRUST
        </p>
      </div>
    </div>
  );
}
