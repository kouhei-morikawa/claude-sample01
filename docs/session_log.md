# セッションログ

**日付:** 2026-04-20  
**プロジェクト:** C:\LocalDesktop\workspace\claude\sample01

---

## 作業概要

空のディレクトリに対して、React + TypeScript + Vite によるTODOアプリを段階的に構築した。

---

## やり取りの記録

### 1. CLAUDE.md の初期作成 (`/init`)

- ディレクトリが空だったため、プレースホルダーとして最小限の CLAUDE.md を作成。

---

### 2. TODOアプリの初期実装

**要求:** TODOアプリを作成してください。

**実装内容:**

| ファイル | 役割 |
|---------|------|
| `src/types/todo.ts` | `Todo` 型・`FilterType` 型 |
| `src/hooks/useTodos.ts` | CRUD操作・localStorage永続化 |
| `src/components/TodoInput.tsx` | タスク入力欄（Enterで追加） |
| `src/components/TodoItem.tsx` | タスク行（チェック・編集・削除） |
| `src/components/TodoList.tsx` | タスク一覧 |
| `src/components/TodoFilter.tsx` | フィルター（全て/未完了/完了済み）・カウント表示 |
| `src/App.tsx` | アプリルート |
| `src/App.css` | スタイル（アクセントカラー: #d87070） |

**機能:**
- タスクの追加（Enter）・完了トグル・インライン編集（ダブルクリック）・削除
- フィルター: すべて / 未完了 / 完了済み
- 完了済みの一括削除
- localStorage による永続化

**技術的な注意:**
- Node.js がインストールされていないため `npm install` は未実行
- 起動コマンド: `npm install && npm run dev`

---

### 3. 仕様追加（ステータス別表示・詳細フォーム）

**要求:** 各ステータス毎に一覧表示し、タスクを登録する時は詳細内容や期限を入力すること

**変更内容:**

#### データモデル変更

```ts
// 変更前
interface Todo {
  id, text, completed, createdAt
}

// 変更後
type Status = 'todo' | 'in_progress' | 'done'  // 未着手・進行中・完了

interface Todo {
  id, title, description, dueDate, status, createdAt
}
```

#### コンポーネント刷新

| 削除 | 追加 |
|------|------|
| TodoInput.tsx | TodoForm.tsx（モーダルフォーム） |
| TodoList.tsx | StatusColumn.tsx（ステータス列） |
| TodoItem.tsx | TodoCard.tsx（タスクカード） |
| TodoFilter.tsx | — |

#### 新機能

- カンバンボード形式（3列: 未着手 / 進行中 / 完了）
- タスク登録フォーム: タイトル（必須）・詳細内容・期限・ステータス
- カードのステータスメニューで他のステータスへ移動
- 期限カラー: 期限切れ=赤、3日以内=オレンジ
- タイトルクリックで編集フォームを再表示

---

### 4. サインイン・サインアップ機能の追加

**要求:** サインイン・サインアップ機能も追加してください。

**方式:** バックエンドなし・localStorage + Web Crypto API (SHA-256) によるブラウザ内完結認証

**追加ファイル:**

| ファイル | 役割 |
|---------|------|
| `src/types/auth.ts` | `User` 型 |
| `src/hooks/useAuth.ts` | 認証状態管理・signUp・signIn・signOut |
| `src/components/AuthPage.tsx` | サインイン/新規登録フォーム（タブ切替） |
| `src/components/AuthPage.css` | 認証画面スタイル |

**データモデル変更:**

```ts
// Todo に userId を追加
interface Todo {
  id, userId, title, description, dueDate, status, createdAt
}
```

**localStorage のキー構成:**

| キー | 内容 |
|------|------|
| `users` | 登録ユーザー一覧（passwordHash含む） |
| `currentUserId` | サインイン中のユーザーID（セッション） |
| `todos` | 全ユーザーのタスク（userIdで紐付け） |

**認証フロー:**
1. アプリ起動時に `currentUserId` を確認
2. 未サインインなら `AuthPage` を表示
3. サインイン成功後にカンバンボードを表示
4. `useTodos(userId)` が全Todoをフィルタリングして現ユーザーのタスクのみ返す

**セキュリティ注意事項:**
- パスワードは SHA-256 でハッシュ化（ソルトなし）
- あくまでデモ用途。本番環境には認証バックエンドが必要

---

### 5. CLAUDE.md テンプレートの作成

**要求:** 精度の高いシステム構築を行うためのClaude.mdのテンプレートを作成して

**成果物:** `CLAUDE_template.md`

**テンプレートのセクション構成:**

1. プロジェクト概要（目的・ユーザー・スコープ外）
2. 開発コマンド（単一テスト実行コマンドを必須化）
3. アーキテクチャ（データフロー・設計判断の背景）
4. 技術スタック（バージョン・プロジェクト固有の注意点）
5. コーディング規約（命名・モジュール構成・状態管理・エラー処理）
6. 重要な制約・不変条件（理由付き）
7. テスト戦略（モック方針・注意事項）
8. 既知の落とし穴（ライブラリの癖・環境依存）
9. 外部依存・連携サービス
10. セキュリティ上の注意
11. 参照リソース

**精度を上げるための原則:**
- 「理由」を1行添えることで、エッジケースでも Claude が判断できる
- コードを読めば分かることは書かない
- 過去のインシデント・失敗則が最も価値が高い

---

## 現在のファイル構成

```
sample01/
├── CLAUDE.md                     # プロジェクトガイド
├── CLAUDE_template.md            # 汎用テンプレート
├── docs/
│   └── session_log.md            # 本ファイル
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── index.css
    ├── App.tsx
    ├── App.css
    ├── types/
    │   ├── auth.ts
    │   └── todo.ts
    ├── hooks/
    │   ├── useAuth.ts
    │   └── useTodos.ts
    └── components/
        ├── AuthPage.tsx
        ├── AuthPage.css
        ├── StatusColumn.tsx
        ├── TodoCard.tsx
        └── TodoForm.tsx
```

---

## 未完了事項

- Node.js 未インストールのため動作未確認
- `npm install && npm run dev` で起動後、ブラウザ動作確認が必要
