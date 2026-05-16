import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from './Toast';

const LANGS = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export default function LanguageSelector({ compact = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGS.find(l => l.code === i18n.language) || LANGS[0];

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const change = async (code) => {
    if (code === i18n.language) {
      setOpen(false);
      return;
    }
    await i18n.changeLanguage(code);
    localStorage.setItem('ssv_lang', code);
    setOpen(false);
    // Notificación en el idioma recién seleccionado
    toast.success(i18n.t('settings.languageChanged', { lng: code }));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-dim)] bg-[var(--bg-panel)] hover:border-[var(--electric)] hover:text-[var(--electric)] transition-all duration-200 text-sm text-[var(--text-muted)]"
      >
        <Globe size={14} />
        {compact ? (
          <span>{current.flag}</span>
        ) : (
          <span>{current.flag} {current.label}</span>
        )}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ zIndex: 9999 }}
            className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden shadow-2xl border border-[var(--border-bright)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[var(--bg-card)] backdrop-blur-xl">
              {LANGS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => change(lang.code)}
                  className="flex items-center justify-between w-full px-4 py-3 text-sm hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-prime)] border-b border-[var(--border-dim)] last:border-0"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                  {i18n.language === lang.code && (
                    <Check size={13} className="text-[var(--electric)]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
