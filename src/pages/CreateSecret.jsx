import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Copy, Check, ArrowLeft, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { secretsService } from '../services/mockService';
import { toast } from '../components/ui/Toast';

const CATEGORIES = ['api', 'database', 'certificate', 'password', 'token', 'other'];

export default function CreateSecret() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showValue, setShowValue] = useState(false);
  const [copied, setCopied] = useState(false);

  const schema = z.object({
    name: z.string().min(1, t('validation.required')).max(60),
    value: z.string().min(1, t('validation.required')),
    category: z.string().min(1, t('validation.required')),
    description: z.string().optional(),
  });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const value = watch('value', '');

  const onSubmit = async (data) => {
    try {
      await secretsService.create(data);
      toast.success(t('secrets.createSuccess'));
      navigate('/secrets');
    } catch {
      toast.error(t('common.error'));
    }
  };

  const copyValue = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(t('common.copied'));
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/secrets')} className="p-2 rounded-lg border border-[var(--border-dim)] text-[var(--text-muted)] hover:border-[var(--electric)] hover:text-[var(--electric)] transition-all">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-prime)]">{t('secrets.createTitle')}</h1>
          <p className="text-xs text-[var(--text-dim)] font-mono mt-0.5">VAULT ENCRYPTION FORM</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-bright rounded-2xl p-6 border border-[var(--border-dim)]">

        {/* Security badge */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/30 border border-emerald-700/20 mb-6">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span className="text-xs text-emerald-400">El valor será cifrado con AES-256-GCM antes de almacenarse</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">{t('secrets.name')} *</label>
            <input {...register('name')} placeholder="AWS_SECRET_KEY" className="w-full px-4 py-2.5 rounded-lg text-sm font-mono" />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">{t('secrets.category')} *</label>
            <select {...register('category')} className="w-full px-4 py-2.5 rounded-lg text-sm appearance-none cursor-pointer">
              <option value="">Selecciona una categoría</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{t(`secrets.categories.${c}`)}</option>)}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>}
          </div>

          {/* Value */}
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">{t('secrets.value')} *</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3 text-[var(--text-dim)]" />
              <textarea
                {...register('value')}
                rows={3}
                placeholder="sk_live_xxxx..."
                className="w-full pl-9 pr-20 py-2.5 rounded-lg text-sm font-mono resize-none"
                style={{ filter: showValue ? 'none' : 'blur(4px)', transition: 'filter 0.2s' }}
              />
              <div className="absolute right-3 top-2.5 flex items-center gap-1">
                <button type="button" onClick={copyValue}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-dim)] hover:text-[var(--electric)] transition-colors">
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
                <button type="button" onClick={() => setShowValue(!showValue)}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-dim)] hover:text-[var(--electric)] transition-colors">
                  {showValue ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            {errors.value && <p className="mt-1 text-xs text-red-400">{errors.value.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">{t('secrets.description')}</label>
            <textarea {...register('description')} rows={2} placeholder="Descripción opcional del secreto..." className="w-full px-4 py-2.5 rounded-lg text-sm resize-none" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/secrets')}
              className="flex-1 py-2.5 rounded-lg border border-[var(--border-dim)] text-[var(--text-muted)] hover:border-[var(--border-bright)] text-sm transition-all">
              {t('common.cancel')}
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 glow-electric">
              {isSubmitting ? <><Loader2 size={15} className="animate-spin" />{t('common.loading')}</> : <><ShieldCheck size={15} />{t('common.create')}</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
