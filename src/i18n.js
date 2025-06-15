// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend) // 从 public/locales 加载翻译文件
    .use(LanguageDetector) // 自动检测浏览器语言
    .use(initReactI18next) // 将 i18next 与 React 绑定
    .init({
        debug: process.env.NODE_ENV === 'development',
        fallbackLng: 'zh',
        interpolation: {
            escapeValue: false, // React 已经自动转义
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },
    });

export default i18n;
