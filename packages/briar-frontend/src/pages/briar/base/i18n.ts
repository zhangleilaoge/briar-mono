import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import EN from '@/pages/briar/constants/locales/en';
import ZH from '@/pages/briar/constants/locales/zh';

import { Language } from '../constants/env';

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: Language.Zh,
		interpolation: {
			escapeValue: false
		},
		resources: {
			[Language.En]: {
				translation: EN
			},
			[Language.Zh]: {
				translation: ZH
			}
		}
	});

export default i18n;
