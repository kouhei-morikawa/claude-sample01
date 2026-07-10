# サンプル 16：多言語対応（i18n）

**レベル：Lv.5** ｜ **ライブラリ：react-i18next（i18next）**

---

## 📖 このサンプルで学ぶこと

| テーマ | 使用 API |
|---|---|
| 翻訳テキストの取得 | `useTranslation` / `t()` |
| 言語の切り替え | `i18n.changeLanguage()` |
| 動的な値の埋め込み | 変数補間 `{{変数名}}` |
| 複数形の処理 | `_zero / _one / _other` サフィックス |
| JSX を含む翻訳 | `<Trans>` コンポーネント |
| 翻訳ファイルの分割 | ネームスペース（`common` / `todo`） |

---

## 🔧 使用ライブラリ

### react-i18next を選んだ理由

| 比較項目 | react-i18next | react-intl | lingui |
|---|---|---|---|
| 週間 DL 数 | **約 1,200 万** | 約 300 万 | 約 20 万 |
| TypeScript 対応 | ◎ | ◎ | ◎ |
| Hooks API | ◎ `useTranslation` | ○ | ◎ |
| 学習コスト | 低〜中 | 中 | 中 |
| 実務採用率 | **業界標準** | 高 | 普及中 |

- **業界標準**として最も広く採用されており、実務で役立つ知識が身につく
- `useTranslation` hook が React の思想と相性よく、直感的に学べる
- 変数補間・複数形・ネームスペース・遅延ロードなど実用機能が揃っている
- React 18 + TypeScript + Vite との相性が良く、追加設定が不要

---

## 📂 ファイル構成

```
16_i18n/
├── index.tsx               # サンプルのエントリーポイント
├── i18n.ts                 # i18next 初期化モジュール
├── README.md               # このファイル
└── locales/
    ├── ja/
    │   ├── common.json     # 共通テキスト（日本語）
    │   └── todo.json       # Todo UI テキスト（日本語）
    └── en/
        ├── common.json     # 共通テキスト（英語）
        └── todo.json       # Todo UI テキスト（英語）
```

---

## 🗂 翻訳ファイルの構造

翻訳ファイルは **JSON 形式** で記述します。キーはアプリ側（コード）が参照する識別子です。

```json
// locales/ja/common.json
{
  "appTitle": "多言語対応サンプル",
  "hello": "こんにちは、{{name}}さん！",
  "itemCount_zero": "アイテムなし",
  "itemCount_one": "{{count}}件のアイテム",
  "itemCount_other": "{{count}}件のアイテム",
  "buttons": {
    "add": "追加"
  }
}
```

### ネストされたキー

ドット記法でネストしたキーにアクセスできます。

```tsx
t('buttons.add')  // → "追加"
```

---

## 🚀 主要 API の解説

### 1. `useTranslation(namespace)`

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t, i18n } = useTranslation('common')

  return <p>{t('appTitle')}</p>
}
```

| 戻り値 | 説明 |
|---|---|
| `t` | 翻訳関数。`t('キー')` でテキストを取得 |
| `i18n` | i18next インスタンス。言語取得・切替などに使用 |

---

### 2. `t()` 関数

```tsx
// シンプルなキー参照
t('appTitle')

// 変数補間（{{name}} に値を埋め込む）
t('hello', { name: '山田' })  // → "こんにちは、山田さん！"

// 複数形（count に応じて _zero/_one/_other が選択される）
t('itemCount', { count: 0 })  // → "アイテムなし"
t('itemCount', { count: 1 })  // → "1件のアイテム"
t('itemCount', { count: 5 })  // → "5件のアイテム"

// ネームスペース付きキー（ns:key 形式）
t('todo:title')

// ネストされたキー
t('buttons.add')
```

---

### 3. `i18n.changeLanguage()`

```tsx
const { i18n } = useTranslation()

// 言語を英語に切り替える
// → 全コンポーネントが自動で再レンダリングされる
i18n.changeLanguage('en')

// 現在の言語を取得
console.log(i18n.language)  // "ja" or "en"
```

---

### 4. `<Trans>` コンポーネント

`t()` はプレーンテキストしか返せません。翻訳テキストの中に `<strong>` や `<a>` などの JSX タグを含めたい場合は `<Trans>` を使います。

```tsx
import { Trans } from 'react-i18next'

// 翻訳ファイル: "description": "これは <0>重要な</0> テキストです"
<Trans
  i18nKey="description"
  ns="common"
  components={{ 0: <strong className="text-red-600" /> }}
/>
// → これは <strong class="text-red-600">重要な</strong> テキストです
```

---

## 🛠 i18n 初期化（i18n.ts）

```tsx
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import jaCommon from './locales/ja/common.json'
import enCommon from './locales/en/common.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ja: { common: jaCommon },
      en: { common: enCommon },
    },
    lng: 'ja',           // デフォルト言語
    fallbackLng: 'en',   // キーが見つからない場合のフォールバック
    defaultNS: 'common', // デフォルトのネームスペース
    interpolation: {
      escapeValue: false, // React が XSS 対策済みのため不要
    },
  })

export default i18n
```

> ⚠️ **注意**: `i18n.ts` は `index.tsx` で**最初にインポート**する必要があります。
> i18n の初期化が完了する前に `useTranslation` が呼ばれるとエラーになります。

---

## 📝 実務でよく使うパターン

### パターン 1：ブラウザの言語設定を自動検出

```bash
npm install i18next-browser-languagedetector
```

```tsx
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)  // ← 追加
  .use(initReactI18next)
  .init({ /* ... */ })
```

### パターン 2：翻訳ファイルの遅延ロード（大規模アプリ向け）

```bash
npm install i18next-http-backend
```

```tsx
import Backend from 'i18next-http-backend'

i18n
  .use(Backend)  // ← public/locales/ から動的読み込み
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  })
```

### パターン 3：TypeScript で翻訳キーを型安全に使う

```tsx
// i18n.d.ts（型定義ファイル）
import jaCommon from './locales/ja/common.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof jaCommon
    }
  }
}
// → t() に存在しないキーを渡すと TypeScript エラーになる
```

---

## 🔗 参考リンク

- [react-i18next 公式ドキュメント](https://react.i18next.com/)
- [i18next 公式ドキュメント](https://www.i18next.com/)
- [i18next Pluralization ガイド](https://www.i18next.com/translation-function/plurals)
