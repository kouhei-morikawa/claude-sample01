/**
 * i18n.ts: このサンプル専用の i18next インスタンス初期化
 *
 * サンプル16はアプリ全体で共有される「デフォルトインスタンス」（'i18next' の default export）
 * を初期化しています。同じデフォルトインスタンスに対してこのサンプルも init() を呼んでしまうと、
 * どちらか一方の翻訳リソースが上書きされてしまいます。
 *
 * そこで createInstance() で独立したインスタンスを作成し、index.tsx 側で
 * <I18nextProvider i18n={i18nInstance}> によりこのサンプルの範囲だけに適用します。
 * （実務では通常インスタンスは1つで十分ですが、埋め込みウィジェットなど
 *   「アプリの一部だけを別の i18n 設定で動かしたい」場面でも同じ手法が使えます）
 */
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import jaCommon from './locales/ja/common.json'
import jaValidation from './locales/ja/validation.json'
import jaErrors from './locales/ja/errors.json'
import enCommon from './locales/en/common.json'
import enValidation from './locales/en/validation.json'
import enErrors from './locales/en/errors.json'

const i18nInstance = i18next.createInstance()

i18nInstance
  .use(initReactI18next)
  .init({
    resources: {
      ja: { common: jaCommon, validation: jaValidation, errors: jaErrors },
      en: { common: enCommon, validation: enValidation, errors: enErrors },
    },

    lng: 'ja',
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'validation', 'errors'],

    react: { useSuspense: false },

    interpolation: {
      escapeValue: false,
    },

    // 翻訳キーが見つからなかった場合にコンソールへ警告を出す（実運用パターン5: 翻訳漏れ検知）
    saveMissing: true,
    missingKeyHandler: (languages, namespace, key) => {
      console.warn(
        `[i18n] 未翻訳キーを検出しました: ns="${namespace}" key="${key}" (lng: ${languages.join(', ')})`
      )
    },
  })

export default i18nInstance
