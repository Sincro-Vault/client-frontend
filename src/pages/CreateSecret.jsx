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
    <div className="max-w-2xl mx-auto w-full py-4 md:py-8">
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

      <div className="relative">
        {/* Glow behind form */}
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-500 rounded-[1.5rem] blur-xl opacity-20 pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="relative bg-[#0a0e17]/80 backdrop-blur-2xl rounded-2xl p-8 border border-white/10 shadow-2xl">

          {/* Security badge */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-900/40 to-transparent border border-emerald-500/20 mb-8 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,1)]" />
            <ShieldCheck size={18} className="text-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-emerald-300 tracking-wide">El valor será cifrado con AES-256-GCM a nivel militar</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Name */}
            <div className="group">
              <label className="block text-xs text-sky-400/80 mb-2 font-semibold tracking-wider uppercase">{t('secrets.name')} *</label>
              <div className="relative">
                <input {...register('name')} placeholder="AWS_SECRET_KEY" 
                  className="w-full px-4 py-3 rounded-xl text-sm font-mono bg-black/40 border border-white/5 text-[var(--text-prime)] focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 outline-none transition-all placeholder:text-white/20 group-hover:border-white/10" />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400"/> {errors.name.message}</p>}
            </div>

            {/* Category */}
            <div className="group">
              <label className="block text-xs text-sky-400/80 mb-2 font-semibold tracking-wider uppercase">{t('secrets.category')} *</label>
              <div className="relative">
                <select {...register('category')} 
                  className="w-full px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer bg-black/40 border border-white/5 text-[var(--text-prime)] focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 outline-none transition-all group-hover:border-white/10">
                  <option value="" className="bg-[var(--bg-deep)]">Selecciona una categoría</option>
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[var(--bg-deep)]">{t(`secrets.categories.${c}`)}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-sky-400/50">▼</div>
              </div>
              {errors.category && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400"/> {errors.category.message}</p>}
            </div>

            {/* Value */}
            <div className="group">
              <label className="block text-xs text-sky-400/80 mb-2 font-semibold tracking-wider uppercase">{t('secrets.value')} *</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-4 text-sky-400/50" />
                <textarea
                  {...register('value')}
                  rows={4}
                  placeholder="sk_live_xxxx..."
                  className="w-full pl-11 pr-24 py-3 rounded-xl text-sm font-mono resize-none bg-black/40 border border-white/5 text-emerald-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 outline-none transition-all placeholder:text-white/20 group-hover:border-white/10"
                  style={{ filter: showValue ? 'none' : 'blur(5px)', transition: 'filter 0.3s ease' }}
                />
                <div className="absolute right-3 top-3 flex items-center gap-1.5 p-1 bg-black/60 rounded-lg backdrop-blur-md border border-white/5">
                  <button type="button" onClick={copyValue}
                    className="p-2 rounded-md hover:bg-white/10 text-[var(--text-dim)] hover:text-sky-400 transition-colors">
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                  <div className="w-px h-4 bg-white/10" />
                  <button type="button" onClick={() => setShowValue(!showValue)}
                    className="p-2 rounded-md hover:bg-white/10 text-[var(--text-dim)] hover:text-sky-400 transition-colors">
                    {showValue ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              {errors.value && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400"/> {errors.value.message}</p>}
            </div>

            {/* Description */}
            <div className="group">
              <label className="block text-xs text-sky-400/80 mb-2 font-semibold tracking-wider uppercase">{t('secrets.description')}</label>
              <textarea {...register('description')} rows={2} placeholder="Descripción opcional del secreto..." 
                className="w-full px-4 py-3 rounded-xl text-sm resize-none bg-black/40 border border-white/5 text-[var(--text-prime)] focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 outline-none transition-all placeholder:text-white/20 group-hover:border-white/10" />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 mt-8 border-t border-white/5">
              <button type="button" onClick={() => navigate('/secrets')}
                className="flex-1 py-3 rounded-xl border border-white/10 text-[var(--text-muted)] hover:bg-white/5 hover:text-white text-sm font-medium transition-all">
                {t('common.cancel')}
              </button>
              <button type="submit" disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-slate-900 font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]">
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" />{t('common.loading')}</> : <><ShieldCheck size={16} />ENCRYPT & SAVE</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
