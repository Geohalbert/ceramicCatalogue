import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../lang/en.json';

// Initialize i18next
i18n
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources: {
      en: {
        translation: en
      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language if translation is missing
    interpolation: {
      escapeValue: false // React already escapes values
    },
    compatibilityJSON: 'v3' // Use i18next v3 JSON format
  });

export default i18n;

