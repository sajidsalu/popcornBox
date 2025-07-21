import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from "./en.json";
import fr from "./fr.json";
import es from "./es.json";

const savedLang = localStorage.getItem('preferredLanguage') || 'en';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        fr: { translation: fr },
        es: { translation: es },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
});

export default i18n;


