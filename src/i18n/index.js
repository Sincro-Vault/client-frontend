import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from '../translations/es';
import en from '../translations/en';
import fr from '../translations/fr';

const savedLang = localStorage.getItem('ssv_lang') || 'es';

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: savedLang,
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
});

export default i18n;
