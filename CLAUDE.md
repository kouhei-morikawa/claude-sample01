# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # 初回セットアップ
npm run dev      # 開発サーバー起動 (http://localhost:5173)
npm run build    # プロダクションビルド (tsc + vite build)
npm run preview  # ビルド結果をプレビュー
npm run lint     # ESLint チェック
```

## Architecture

**Stack:** React 18 + TypeScript + Vite

**Storage:** すべてのデータを `localStorage` に保存。キーは `users`・`currentUserId`・`todos`。

**Auth:** `useAuth` hook (`src/hooks/useAuth.ts`) が管理。パスワードは Web Crypto API (SHA-256) でハッシュ化。セッションは `currentUserId` で保持。未サインイン時は `AuthPage` を表示。

**Data model:**
- `User`: `id / email / name / passwordHash`
- `Todo`: `id / userId / title / description / dueDate / status / createdAt`。`useTodos(userId)` は全Todoを保持しつつ、現ユーザーのものだけを返す。

**Layout:** `App` → 未認証なら `AuthPage`、認証済みなら `Board` (内部コンポーネント)。Board は `StatusColumn` × 3 → `TodoCard` の階層。タスク追加・編集は `TodoForm` モーダル。

**Component roles:**
- `AuthPage` — サインイン/新規登録フォーム（タブ切替）
- `StatusColumn` — 各ステータスの列。ヘッダーにカラーバーとカウントを表示
- `TodoCard` — タスクカード。タイトルクリックで編集、ステータスメニューで移動
- `TodoForm` — 追加・編集モーダル。タイトル(必須)・詳細・期限・ステータスを入力

**Due date styling:** 期限切れ→赤、3日以内→オレンジ (`getDueDateClass` in `TodoCard.tsx`)
