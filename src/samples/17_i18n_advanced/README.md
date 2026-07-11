# サンプル 17：多言語対応（実践編）

**レベル：Lv.5** ｜ **ライブラリ：react-i18next（i18next）** ｜ **前提：[サンプル16](../16_i18n/README.md) の基礎知識**

---

## 📖 このサンプルで学ぶこと

サンプル16では `useTranslation` / `t()` / `changeLanguage()` など react-i18next の **API そのもの** を学びました。
サンプル17では、実務のアプリで i18n を導入する際に必要になる**設計・運用の観点**を扱います。

| テーマ | 内容 |
|---|---|
| 初期化手順 | ライブラリ導入からアプリへの組み込みまでの手順 |
| 推奨フォルダ構成 | 機能が増えても破綻しない翻訳ファイルの配置 |
| 言語テンプレートの構成 | 全言語でキー構造を揃えるためのテンプレート |
| フォームバリデーションの多言語化 | エラーメッセージを翻訳キー経由で組み立てる |
| APIエラーコードの多言語化 | エラーコード→翻訳キーのマッピングとフォールバック |
| リスト表示の多言語化 | `Intl.ListFormat` による自然な連結表現 |
| 日付・数値のロケール対応 | `Intl.DateTimeFormat` / `Intl.NumberFormat` との併用 |
| 翻訳キー欠落の検知 | 訳し忘れを開発中・CIで発見する仕組み |

---

## 🛠 i18n の初期化手順

実際のプロジェクトに react-i18next を導入する際の標準的な手順です（このサンプル内の [`i18n.ts`](./i18n.ts) も同じ考え方に基づいています）。

1. **ライブラリを追加する**

   ```bash
   npm install i18next react-i18next
   # 必要に応じて：
   npm install i18next-browser-languagedetector   # ブラウザの言語設定を自動検出
   npm install i18next-http-backend                # 翻訳ファイルの遅延ロード
   ```

2. **翻訳ファイルを用意する**（後述の「推奨フォルダ構成」を参照）

3. **初期化モジュール（`i18n.ts` など）を作成する**

   ```tsx
   import i18n from 'i18next'
   import { initReactI18next } from 'react-i18next'
   import jaCommon from './locales/ja/common.json'
   import enCommon from './locales/en/common.json'

   i18n
     .use(initReactI18next)
     .init({
       resources: { ja: { common: jaCommon }, en: { common: enCommon } },
       lng: 'ja',
       fallbackLng: 'en',
       defaultNS: 'common',
       interpolation: { escapeValue: false },
     })

   export default i18n
   ```

4. **アプリのエントリーポイントで一番最初にインポートする**

   ```tsx
   // main.tsx
   import './i18n'   // ← 他の import より前に実行されるようにする
   import App from './App'
   ```

   `useTranslation` が呼ばれる前に初期化が終わっている必要があるため、
   `i18n.ts` の import 順が最初になるように注意します。

> ⚠️ **このサンプル固有の事情**：このリポジトリではサンプル16がアプリ起動時にデフォルトの
> i18next インスタンスを初期化済みです。同じインスタンスに対して本サンプルも `init()` すると
> どちらかの翻訳リソースが上書きされてしまうため、[`i18n.ts`](./i18n.ts) では
> `i18next.createInstance()` で独立したインスタンスを作成し、`<I18nextProvider i18n={instance}>`
> でこのサンプルの範囲だけに適用しています。**通常のアプリでは1つのインスタンスで十分**です。
> このパターンが必要になるのは、埋め込みウィジェットなど「アプリの一部だけを別設定で動かしたい」場合です。

---

## 📂 推奨フォルダ構成（実務向け）

サンプル16のように機能が少ないうちはフラットな構成で十分ですが、画面数が増えてきたら
「共通」と「機能別」でネームスペースを分け、翻訳ファイルの肥大化を防ぎます。

```
src/
├── i18n/
│   ├── index.ts              # 初期化（init 呼び出し）
│   ├── config.ts             # 対応言語一覧・デフォルト言語などの定数
│   └── locales/
│       ├── ja/
│       │   ├── common.json       # ボタン・ナビ等、画面をまたいで使う文言
│       │   ├── errors.json       # APIエラーコード・例外メッセージ
│       │   ├── validation.json   # フォームバリデーションメッセージ
│       │   ├── dashboard.json    # 機能（画面）単位のネームスペース
│       │   └── settings.json
│       └── en/
│           └── （ja と同じファイル名・同じキー構造）
└── features/
    ├── dashboard/…            # dashboard.json を参照するコンポーネント群
    └── settings/…             # settings.json を参照するコンポーネント群
```

**ポイント**

- `errors` / `validation` は**横断的な関心事**なので独立したネームスペースにする
- 機能（画面）ごとのネームスペースは、その機能のコードと同じ場所で管理してもよい（コロケーション）
- 言語フォルダ（`ja/` `en/`）の中は**必ず同じファイル名・同じキー構造**にする（後述のテンプレート参照）

---

## 🗂 言語テンプレートの推奨構成

新しい言語を追加するとき、または新しいキーを追加するときに**キーの過不足**が起きやすいのが
多言語対応の典型的なトラブルです。防ぐために、翻訳対象のテンプレートを1つ決め、
すべての言語ファイルをそこから複製する運用にします。

```json
// locales/_template/common.json（テンプレート。実際には読み込まれない）
{
  "buttons": {
    "submit": "TODO",
    "cancel": "TODO"
  },
  "nav": {
    "home": "TODO",
    "settings": "TODO"
  }
}
```

- `"TODO"` を目印にすることで、未翻訳のキーが残っていないかを検索・レビューしやすくする
- キーの**ネスト構造・順序**をテンプレートと完全に一致させる（`common.json` などファイル単位で統一）
- CI で `ja/*.json` と `en/*.json` のキー集合を比較し、差分があれば失敗させる（後述）ことで
  「日本語だけ追加してあるが英語に反映し忘れた」を機械的に検出できる

このリポジトリのサンプル（[`locales/ja/`](./locales/ja) と [`locales/en/`](./locales/en)）も、
`common.json` / `validation.json` / `errors.json` の3ファイルでこの構成に揃えています。

---

## 📝 実運用パターン

### パターン1：フォームバリデーションの多言語化（[`ValidationSection`](./index.tsx)）

バリデーション**ルール**（必須・文字数・形式）はコードで判定し、**表示メッセージ**は
翻訳キーから組み立てます。ロジックとメッセージ文言を分離するのがポイントです。

```tsx
if (!email.trim()) {
  errors.email = t('validation:required', { field: t('validation:fields.email') })
} else if (!isValidEmail(email)) {
  errors.email = t('validation:email')
}
```

```json
// validation.json
{
  "required": "{{field}}は必須です",
  "minLength": "{{field}}は{{min}}文字以上で入力してください"
}
```

Zod や Yup などのバリデーションライブラリを使う場合も、ライブラリ側は
「どのルールに違反したか（エラーコード）」だけを返し、メッセージへの変換は
i18next 側に任せる設計にすると多言語対応がしやすくなります。

### パターン2：APIエラーコードの多言語化（[`ApiErrorSection`](./index.tsx)）

サーバーが返す `errorCode`（`"NETWORK_ERROR"` などの文字列）をそのまま翻訳キーとして扱い、
翻訳ファイルに存在しないコードは共通の `UNKNOWN` にフォールバックします。

```tsx
const key = `errors:${errorCode}`
const message = i18n.exists(key)
  ? t(key)
  : t('errors:UNKNOWN', { code: errorCode })
```

サーバー側とクライアント側でエラーコードの命名規則を合わせておくと、
新しいエラーコードが追加されてもクライアントの改修なしに翻訳ファイルの追加だけで対応できます。

### パターン3：リスト表示の多言語化（[`ListSection`](./index.tsx)）

配列の各要素は `t()` で翻訳し、要素同士のつなぎ方（日本語の「、」「と」、英語の `", "` `"and"`）は
`Array.join()` などの自前実装ではなく `Intl.ListFormat` に任せます。

```tsx
const items = selectedKeys.map(key => t(`fruits.${key}`))
new Intl.ListFormat(i18n.language, { style: 'long', type: 'conjunction' }).format(items)
// ja → "りんご、バナナ、オレンジ"
// en → "apple, banana, and orange"
```

### パターン4：日付・数値のロケール対応（[`FormatSection`](./index.tsx)）

i18next は**テキストの翻訳**に特化したライブラリです。日付・通貨・数値の書式は
ブラウザ標準の `Intl` API（`i18n.language` をロケールとして渡す）と組み合わせるのが定石です。

```tsx
new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long' }).format(date)
new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'JPY' }).format(amount)
```

### パターン5：翻訳キー欠落の検知（[`MissingKeySection`](./index.tsx)）

存在しないキーを `t()` に渡すと、既定ではキー文字列がそのまま画面に表示されます。
気づかれないまま本番に出やすいため、開発時に検知できるようにしておきます。

```tsx
i18n.init({
  saveMissing: true,
  missingKeyHandler: (lngs, ns, key) => {
    console.warn(`未翻訳キー: ns="${ns}" key="${key}"`)
  },
})
```

CI では [`i18next-parser`](https://github.com/i18next/i18next-parser) 等でソースコードから
使用されているキーを抽出し、翻訳ファイルとの過不足を検出する運用が有効です。

---

## ⚠️ 留意事項

- **キーの命名規則を決める**：`namespace.category.key` のように階層を統一する。
  動詞や文脈だけの曖昧なキー（`msg1` `text2`）は避け、意味のある名前にする。
- **文字列連結を避ける**：`t('foo') + userName + t('bar')` のような組み立ては、
  語順が異なる言語（例：主語・目的語・動詞の順序が違う）で破綻する。変数補間（`{{name}}`）を使う。
- **複数形ルールは言語ごとに異なる**：英語は `one` / `other` の2種類だが、
  アラビア語は6種類、日本語は複数形の区別がなく常に `other` 相当になる。
  `_zero/_one/_other` サフィックスは i18next が言語ごとの複数形ルール（CLDR）に従って自動選択するため、
  「英語だけ動作確認して終わり」にせず対応言語ごとに確認する。
- **`<Trans>` に渡すコンポーネントは許可リスト化する**：翻訳ファイルの内容が外部（翻訳者・CMS）から
  差し込まれる場合、任意のコンポーネントを埋め込めるようにすると意図しないマークアップが混入しうる。
  `components` には想定したタグだけを明示的に渡す。
- **ネームスペースの遅延ロード**：機能別ネームスペースが増えてきたら `i18next-http-backend` で
  画面遷移時にネームスペースを動的読み込みし、初期バンドルサイズを抑える。
- **翻訳ワークフロー**：キーの追加・削除はコードレビューの対象にし、翻訳者への依頼は
  「テンプレートとの差分（追加されたキー）」単位で行うと抜け漏れが減る。

---

## 🔗 参考リンク

- [react-i18next 公式ドキュメント](https://react.i18next.com/)
- [i18next 公式ドキュメント](https://www.i18next.com/)
- [Intl.ListFormat（MDN）](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/ListFormat)
- [Intl.NumberFormat（MDN）](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)
- [i18next-parser（翻訳キー抽出ツール）](https://github.com/i18next/i18next-parser)
