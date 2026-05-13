import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Eye, EyeOff, Loader2, ShieldCheck, Clock } from 'lucide-react';

const CATEGORIES = ['api', 'database', 'certificate', 'password', 'token', 'other'];

export default function EditSecretModal({ secret, onClose, onSave }) {
  const { t } = useTranslation();
  const [showValue, setShowValue] = useState(false);

  const schema = z.object({
    name: z.string().min(1, t('validation.required')),
    value: z.string().min(1, t('validation.required')),
    category: z.string().min(1, t('validation.required')),
    description: z.string().optional(),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: secret.name, value: secret.value, category: secret.category, description: secret.description },
  });

  const onSubmit = async (data) => {
    await onSave(secret.id, data);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-md glass-bright rounded-2xl overflow-hidden border border-[var(--border-bright)]"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-dim)] bg-[var(--bg-panel)]">
            <h2 className="text-sm font-semibold text-[var(--text-prime)]">{t('secrets.editTitle')}</h2>
            <button onClick={onClose} className="text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors"><X size={18} /></button>
          </div>

          {/* Change history indicator */}
          <div className="px-6 pt-4">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dim)] text-xs text-[var(--text-dim)]">
              <Clock size={12} className="text-[var(--electric)]" />
              <span>Última modificación: {new Date(secret.updatedAt).toLocaleDateString()} · {new Date(secret.updatedAt).toLocaleTimeString()}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5">{t('secrets.name')} *</label>
              <input {...register('name')} className="w-full px-4 py-2.5 rounded-lg text-sm font-mono" />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5">{t('secrets.category')} *</label>
              <select {...register('category')} className="w-full px-4 py-2.5 rounded-lg text-sm appearance-none cursor-pointer">
                {CATEGORIES.map(c => <option key={c} value={c}>{t(`secrets.categories.${c}`)}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5">{t('secrets.value')} *</label>
              <div className="relative">
                <textarea {...register('value')} rows={3} className="w-full px-4 pr-10 py-2.5 rounded-lg text-sm font-mono resize-none"
                  style={{ filter: showValue ? 'none' : 'blur(3px)', transition: 'filter 0.2s' }} />
                <button type="button" onClick={() => setShowValue(!showValue)}
                  className="absolute right-3 top-3 text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors">
                  {showValue ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.value && <p className="mt-1 text-xs text-red-400">{errors.value.message}</p>}
            </div>

            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5">{t('secrets.description')}</label>
              <textarea {...register('description')} rows={2} className="w-full px-4 py-2.5 rounded-lg text-sm resize-none" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[var(--border-dim)] text-[var(--text-muted)] text-sm">{t('common.cancel')}</button>
              <button type="submit" disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 text-white font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60 glow-electric">
                {isSubmitting ? <><Loader2 size={14} className="animate-spin" /></> : <><ShieldCheck size={14} />{t('common.save')}</>}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
