import i18next, { CustomTypeOptions } from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { DeepestPaths } from '@/utils/helpers';
import ru from '@/assets/locales/ru/translation.json';
import en from '@/assets/locales/en/translation.json';

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    resources: { ru: { translation: ru }, en: { Translation: en } },
  });

export type CustomTKeys = DeepestPaths<
  CustomTypeOptions['resources']['translation']
>;

export default i18next;
