# claude-sample01

React 18 + TypeScript + Vite で構築された、React 学習用サンプル集を含むリポジトリです。
Claude Code（claude.ai/code）と協働しながら開発しています。

🔗 公開ページ: https://kouhei-morikawa.github.io/claude-sample01/（`master` への push で自動デプロイ）

---

## 📖 このリポジトリの構成

このリポジトリには性質の異なる2つのアプリケーションが含まれています。

| アプリ | 内容 | エントリーポイント |
|---|---|---|
| **React 学習サンプル集** | 01〜17 の段階的なサンプル集。現在の既定表示。 | `src/main.tsx` → `src/samples/SamplesApp.tsx` |
| **Todo ボードアプリ** | localStorage 認証付きの Todo 管理アプリ本体。 | `src/App.tsx`（現在は `main.tsx` から未マウント） |

学習サンプル集の詳細なカリキュラム（各サンプルの学習テーマ・習得目標）は [LEARNING.md](./LEARNING.md) を参照してください。
Todo ボードアプリのアーキテクチャ（データモデル・認証方式など）は [CLAUDE.md](./CLAUDE.md) を参照してください。

Todo ボードアプリを表示したい場合は、`src/main.tsx` の `SamplesApp` を `App` に差し替えてください。

```tsx
// src/main.tsx
import App from './App.tsx'
// import SamplesApp from './samples/SamplesApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

## 🔧 技術スタック

- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite 5
- **スタイリング**: Tailwind CSS
- **ルーティング**: React Router（サンプル14でのみ使用）
- **国際化**: react-i18next / i18next（サンプル16・17で使用。初期化手順は [I18N_SETUP.md](./I18N_SETUP.md) を参照）
- **永続化**: `localStorage`（Todo ボードアプリのみ）

---

## 🚀 セットアップ

```bash
npm install      # 初回セットアップ
npm run dev      # 開発サーバー起動 (http://localhost:5173)
npm run build    # プロダクションビルド (tsc + vite build)
npm run preview  # ビルド結果をプレビュー
npm run lint     # ESLint チェック
```

---

## 📂 ディレクトリ構成

```
src/
├── main.tsx              # エントリーポイント
├── App.tsx                # Todo ボードアプリ本体
├── hooks/                  useAuth・useTodos
├── components/             AuthPage・TodoForm・StatusColumn・TodoCard
├── types/                  User・Todo の型定義
└── samples/                React 学習サンプル集（01〜17）
    ├── 01_hello_world/ … 15_todo_app/   # 基礎〜総合演習
    ├── 16_i18n/                          # 多言語対応（基礎編）
    ├── 17_i18n_advanced/                 # 多言語対応（実践編）
    └── SamplesApp.tsx                    # サンプル一覧ナビゲーター
```

---

## 📝 ドキュメント一覧

| ファイル | 内容 |
|---|---|
| [CLAUDE.md](./CLAUDE.md) | Claude Code 向けのプロジェクトガイド（アーキテクチャ・コマンド） |
| [LEARNING.md](./LEARNING.md) | React 学習カリキュラム全体（サンプル一覧・習得目標） |
| [I18N_SETUP.md](./I18N_SETUP.md) | react-i18next の初期化手順 |
| [src/samples/16_i18n/README.md](./src/samples/16_i18n/README.md) | i18n 基礎編（API 解説） |
| [src/samples/17_i18n_advanced/README.md](./src/samples/17_i18n_advanced/README.md) | i18n 実践編（実運用パターン） |

---

## 🚢 デプロイ

`master` ブランチへの push をトリガーに GitHub Actions（[.github/workflows/deploy.yml](./.github/workflows/deploy.yml)）が
`npm run build` を実行し、GitHub Pages へ自動デプロイします。
