import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, ShieldCheck, Clock, Database, Server, Info } from 'lucide-react';

const CATEGORIES = ['api', 'database', 'certificate', 'password', 'token', 'other'];

export default function EditSecretModal({ secret, onClose, onSave }) {
  const { t } = useTranslation();

  const schema = z.object({
    name: z.string().min(1, t('validation.required')),
    category: z.string().min(1, t('validation.required')),
    description: z.string().optional(),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: secret.name, category: secret.category, description: secret.description },
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

            {/* Aviso sobre el valor */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-sky-950/20 border border-sky-700/20">
              <Info size={13} className="text-sky-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-[var(--text-muted)] space-y-1">
                <p>El valor cifrado no se puede editar directamente.</p>
                <p className="text-[var(--text-dim)]">Para cambiarlo: elimina el secreto y créalo de nuevo (se re-fragmenta).</p>
              </div>
            </div>

            {/* Estado distribuido actual */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-emerald-700/20 bg-emerald-950/10">
                <Database size={11} className="text-emerald-400" />
                <span className="text-xs text-[var(--text-muted)]">F1 cliente</span>
                <ShieldCheck size={11} className="text-emerald-400 ml-auto" />
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-emerald-700/20 bg-emerald-950/10">
                <Server size={11} className="text-emerald-400" />
                <span className="text-xs text-[var(--text-muted)]">F2 servidor</span>
                <ShieldCheck size={11} className="text-emerald-400 ml-auto" />
              </div>
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
