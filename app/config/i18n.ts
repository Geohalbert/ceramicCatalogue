import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../lang/en.json';
import es from '../lang/es.json';

// Initialize i18next
i18n
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources: {
      en: {
        translation: en
      },
      es: {
        translation: es
      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language if translation is missing
    interpolation: {
      escapeValue: false // React already escapes values
    },
    compatibilityJSON: 'v4' // Use i18next v4 JSON format
  });

export default i18n;

