import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Upload, CheckCircle, XCircle, Loader2, File, Lock, User, AlertTriangle } from 'lucide-react';
import { certificateService } from '../services/mockService';
import { toast } from '../components/ui/Toast';

const VALID_EXT = ['.pem', '.crt', '.key'];

export default function Certificate() {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | scanning | success | error
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const validateFile = (f) => {
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    return VALID_EXT.includes(ext);
  };

  const handleFile = (f) => {
    if (!f) return;
    if (!validateFile(f)) { toast.error(t('validation.invalidExtension')); return; }
    setFile(f);
    setStatus('idle');
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const onSubmit = async (data) => {
    if (!file) { toast.error('Selecciona un archivo'); return; }
    setStatus('scanning');
    try {
      const res = await certificateService.upload(file, data.username, data.password);
      setResult(res);
      setStatus('success');
      toast.success(t('certificate.success'));
    } catch (e) {
      setStatus('error');
      toast.error(e.message);
    }
  };

  return (
    <div className="max-w-xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-[var(--text-prime)] mb-1">{t('certificate.title')}</h1>
        <p className="text-xs text-[var(--text-dim)] font-mono">{t('certificate.securityZone')}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="mt-6 glass-bright rounded-2xl border border-[var(--border-bright)] overflow-hidden">

        {/* Header bar */}
        <div className="flex items-center gap-3 px-6 py-4 bg-[var(--bg-panel)] border-b border-[var(--border-dim)]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[var(--electric)] opacity-20 blur-md" />
            <Shield size={20} className="text-[var(--electric)] relative z-10" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--text-prime)]">{t('certificate.subtitle')}</p>
            <p className="text-xs text-[var(--text-dim)] font-mono">X.509 · PEM · DER</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-mono">SECURE</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`relative overflow-hidden border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
              dragOver ? 'border-[var(--electric)] bg-sky-950/30' :
              file ? 'border-emerald-500/50 bg-emerald-950/20' :
              'border-[var(--border-bright)] hover:border-[var(--electric)]/50 hover:bg-[var(--bg-panel)]'
            }`}
          >
            {/* Scan animation */}
            {status === 'scanning' && (
              <motion.div
                animate={{ top: ['-2px', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-0.5 bg-[var(--electric)] opacity-70 pointer-events-none"
                style={{ boxShadow: '0 0 10px var(--electric)' }}
              />
            )}

            <input ref={fileRef} type="file" accept=".pem,.crt,.key" className="hidden"
              onChange={(e) => handleFile(e.target.files[0])} />

            <AnimatePresence mode="wait">
              {file ? (
                <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-700/20 flex items-center justify-center mx-auto">
                    <File size={20} className="text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-emerald-400 font-mono">{file.name}</p>
                  <p className="text-xs text-[var(--text-dim)]">{(file.size / 1024).toFixed(1)} KB</p>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-bright)] flex items-center justify-center mx-auto">
                    <Upload size={20} className="text-[var(--text-dim)]" />
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">{t('certificate.dragDrop')}</p>
                  <p className="text-xs text-[var(--text-dim)]">{t('certificate.orBrowse')}</p>
                  <p className="text-xs text-[var(--text-dim)] font-mono">{t('certificate.validExtensions')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Credentials */}
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1.5">{t('certificate.username')}</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
              <input {...register('username', { required: t('validation.required') })} placeholder="cert_admin" className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm" />
            </div>
            {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1.5">{t('certificate.password')}</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
              <input {...register('password', { required: t('validation.required') })} type="password" placeholder="••••••••" className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm" />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          {/* Status */}
          <AnimatePresence>
            {status === 'scanning' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg border border-sky-500/30 bg-sky-950/30 text-sky-400 text-sm">
                <Loader2 size={15} className="animate-spin" />
                {t('certificate.scanning')}
              </motion.div>
            )}
            {status === 'success' && result && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
                  <CheckCircle size={16} />{t('certificate.valid')}
                </div>
                <div className="text-xs text-[var(--text-dim)] font-mono space-y-1">
                  <p>Fingerprint: {result.fingerprint}</p>
                  <p>Valid until: {result.validUntil}</p>
                </div>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-2 p-3 rounded-lg border border-red-500/30 bg-red-950/30 text-red-400 text-sm">
                <XCircle size={15} />{t('certificate.invalid')}
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" disabled={isSubmitting || status === 'scanning'}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all glow-electric">
            {(isSubmitting || status === 'scanning')
              ? <><Loader2 size={15} className="animate-spin" />{t('certificate.scanning')}</>
              : <><Shield size={15} />{t('certificate.submit')}</>
            }
          </button>
        </form>
      </motion.div>
    </div>
  );
}
