import 'i18next';
import translationNS from '@/assets/locales/ru/translation.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof translationNS;
    };
  }
}
