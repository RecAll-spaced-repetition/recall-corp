import i18next, { CustomTypeOptions } from 'i18next';
import localesBackend from 'i18next-http-backend';
import languageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { DeepestPaths } from '@/utils/helpers';

i18next.use(languageDetector).use(localesBackend).use(initReactI18next).init({
  fallbackLng: 'ru',
});

export type CustomTKeys = DeepestPaths<
  CustomTypeOptions['resources']['translation']
>;

export default i18next;
