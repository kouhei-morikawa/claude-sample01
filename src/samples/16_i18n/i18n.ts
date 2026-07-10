/**
 * i18n.ts: react-i18next の初期化モジュール
 *
 * このファイルでは i18next の設定を行います。
 * - デフォルト言語：日本語 (ja)
 * - フォールバック言語：英語 (en)
 * - 翻訳リソースをインラインで定義（外部ファイル読み込み不要）
 * - ネームスペース：common（共通）・todo（Todoリスト専用）
 */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// 翻訳ファイルをインポート
import jaCommon from './locales/ja/common.json'
import jaTodo   from './locales/ja/todo.json'
import enCommon from './locales/en/common.json'
import enTodo   from './locales/en/todo.json'

// i18next の初期化
i18n
  // react-i18next プラグインを使用
  .use(initReactI18next)
  .init({
    // 翻訳リソースをインラインで定義
    resources: {
      ja: {
        common: jaCommon,
        todo:   jaTodo,
      },
      en: {
        common: enCommon,
        todo:   enTodo,
      },
    },

    // デフォルト言語
    lng: 'ja',

    // 翻訳キーが見つからない場合のフォールバック言語
    fallbackLng: 'en',

    // デフォルトのネームスペース
    defaultNS: 'common',

    interpolation: {
      // React は XSS 対策を自前で行うため、i18next 側のエスケープは不要
      escapeValue: false,
    },
  })

export default i18n
