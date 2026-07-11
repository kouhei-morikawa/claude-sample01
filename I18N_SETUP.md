# i18n 初期化ガイド（react-i18next）

このプロジェクトに多言語対応（i18n）を導入する際の標準的な初期化手順をまとめたドキュメントです。
実際に動くデモとより詳しい実運用パターンは以下のサンプルを参照してください。

- [src/samples/16_i18n](./src/samples/16_i18n) — 基礎編（`useTranslation` / `t()` / 複数形 / `<Trans>` などの API 解説）
- [src/samples/17_i18n_advanced](./src/samples/17_i18n_advanced) — 実践編（フォームバリデーション・APIエラー・リスト表示・日付/数値フォーマット・翻訳漏れ検知）

---

## 1. ライブラリを追加する

このリポジトリには `i18next` / `react-i18next` が既に依存関係として含まれています（`package.json` 参照）。
新規プロジェクトに導入する場合は以下を実行します。

```bash
npm install i18next react-i18next
```

必要に応じて以下のプラグインも検討します。

```bash
npm install i18next-browser-languagedetector   # ブラウザの言語設定を自動検出
npm install i18next-http-backend                # 翻訳ファイルの遅延ロード
```

---

## 2. 翻訳ファイルを用意する

言語ごとにフォルダを分け、ネームスペース（機能や関心事の単位）ごとに JSON ファイルを分割します。

```
locales/
├── ja/
│   ├── common.json      # 共通テキスト（ボタン・ナビなど）
│   └── errors.json      # エラーメッセージなど
└── en/
    ├── common.json       # ja と同じキー構造で用意する
    └── errors.json
```

```json
// locales/ja/common.json
{
  "appTitle": "アプリ名",
  "buttons": { "submit": "送信" }
}
```

> 言語間でキー構造（ネスト・キー名）を揃えることが重要です。ずれるとフォールバック言語のテキストが
> 意図せず表示されたり、型安全な `t()` 呼び出し（後述）が破綻します。

---

## 3. 初期化モジュールを作成する

```tsx
// src/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import jaCommon from './locales/ja/common.json'
import enCommon from './locales/en/common.json'

i18n
  .use(initReactI18next)      // react-i18next プラグインを登録
  .init({
    resources: {
      ja: { common: jaCommon },
      en: { common: enCommon },
    },
    lng: 'ja',                // デフォルト言語
    fallbackLng: 'en',        // キーが見つからない場合のフォールバック
    defaultNS: 'common',      // デフォルトのネームスペース
    interpolation: {
      escapeValue: false,     // React が XSS 対策済みのため不要
    },
  })

export default i18n
```

ブラウザの言語設定を自動検出したい場合は `LanguageDetector` を、
翻訳ファイルを外部から動的に読み込みたい場合は `Backend` を `.use()` に追加します。

```tsx
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

i18n
  .use(Backend)            // public/locales/{{lng}}/{{ns}}.json から動的読み込み
  .use(LanguageDetector)   // ブラウザの言語設定を自動検出
  .use(initReactI18next)
  .init({ /* ... */ })
```

---

## 4. アプリのエントリーポイントで最初にインポートする

```tsx
// main.tsx
import './i18n'   // ← 他の import より前に実行されるようにする
import App from './App'
```

`useTranslation` が呼ばれるより前に初期化が完了している必要があるため、
`i18n.ts`（あるいは `i18n/index.ts`）の import が一番最初に実行されるようにします。

---

## 5. コンポーネントで使用する

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t, i18n } = useTranslation('common')

  return (
    <div>
      <p>{t('appTitle')}</p>
      <button onClick={() => i18n.changeLanguage('en')}>English</button>
    </div>
  )
}
```

---

## ⚠️ 複数の i18n インスタンスが必要な場合

同一アプリ内で独立した設定の i18n を並行稼働させたい場合（埋め込みウィジェットなど、
または本リポジトリのようにサンプルごとに翻訳リソースを分離したい場合）は、
デフォルトのグローバルインスタンスに対して重ねて `init()` すると
既存の翻訳リソースが上書きされてしまいます。`createInstance()` で独立したインスタンスを作成し、
`<I18nextProvider>` でスコープしてください（[src/samples/17_i18n_advanced/i18n.ts](./src/samples/17_i18n_advanced/i18n.ts) 参照）。

```tsx
import i18next from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'

const instance = i18next.createInstance()
instance.use(initReactI18next).init({ /* ... */ })

function Widget() {
  return (
    <I18nextProvider i18n={instance}>
      {/* この配下だけがこの instance の翻訳を使う */}
    </I18nextProvider>
  )
}
```

---

## 🔗 参考リンク

- [react-i18next 公式ドキュメント](https://react.i18next.com/)
- [i18next 公式ドキュメント](https://www.i18next.com/)
- 推奨フォルダ構成・言語テンプレート・実運用パターン・留意事項の詳細は
  [src/samples/17_i18n_advanced/README.md](./src/samples/17_i18n_advanced/README.md) を参照
