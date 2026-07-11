# Azure Communication Services チャットアプリ システム構成

## 概要

Azure Communication Services (ACS) を活用したリアルタイムチャットアプリケーションの構成検討。
現行プロジェクト（React + TypeScript + Vite、localStorage ベースの Todo 管理アプリ）をベースに、チャット機能を統合する方針で設計する。

---

## システム構成図

```
┌─────────────────────────────────────────────────────────────────┐
│                        クライアント (React)                       │
│                                                                   │
│  ┌───────────────┐   ┌────────────────┐   ┌──────────────────┐  │
│  │   AuthPage    │   │   ChatPage     │   │   Board (Todo)   │  │
│  │ (既存サインイン) │   │ (新規追加)      │   │   (既存画面)      │  │
│  └───────────────┘   └────────────────┘   └──────────────────┘  │
│           │                  │                                    │
│           └──────────────────┴──── useAuth / useTodos (既存)     │
│                              │                                    │
│                     @azure/communication-chat SDK                 │
└──────────────────────────────┼──────────────────────────────────┘
                               │ HTTPS / WebSocket (SignalR)
┌──────────────────────────────┼──────────────────────────────────┐
│              Azure Communication Services                         │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    ACS Chat Service                         │  │
│  │  ・スレッド管理 (ChatThread)                                 │  │
│  │  ・メッセージ送受信                                           │  │
│  │  ・参加者管理                                                 │  │
│  │  ・リアルタイム通知 (Event Grid / SignalR)                    │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               │ REST API
┌──────────────────────────────┼──────────────────────────────────┐
│                    バックエンド API (Azure Functions / Node.js)   │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │ Token API        │  │  User管理 API     │  │ Thread管理API │  │
│  │ (ACS アクセス     │  │ (登録 / 認証)     │  │ (作成/削除)   │  │
│  │  トークン発行)    │  │                  │  │               │  │
│  └──────────────────┘  └──────────────────┘  └───────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────┐
│                         データストア                               │
│                                                                   │
│  ┌───────────────────┐   ┌─────────────────────────────────────┐ │
│  │  Azure Cosmos DB  │   │         Azure Blob Storage          │ │
│  │  ・ユーザー情報    │   │  ・画像・ファイル添付                  │ │
│  │  ・スレッドメタ    │   │                                     │ │
│  └───────────────────┘   └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## コンポーネント詳細

### 1. フロントエンド（既存 React アプリを拡張）

| コンポーネント | 役割 | 備考 |
|---|---|---|
| `AuthPage` | サインイン / 新規登録 | 既存を流用、ACS ID 取得処理を追加 |
| `ChatPage` | チャット画面 | 新規作成 |
| `ChatThreadList` | スレッド一覧 | 参加中のスレッドを表示 |
| `ChatMessageList` | メッセージ一覧 | リアルタイム更新 |
| `ChatInput` | メッセージ入力 | テキスト・絵文字・ファイル対応 |
| `useACSChat` | ACS Chat SDK のラッパー Hook | 新規作成 |

**使用 SDK:**
```
@azure/communication-chat
@azure/communication-common
@azure/communication-identity  ← トークン取得用
```

### 2. バックエンド API

**推奨:** Azure Functions (TypeScript) または Azure App Service (Node.js + Express)

| エンドポイント | メソッド | 役割 |
|---|---|---|
| `/api/auth/register` | POST | ユーザー登録、ACS Identity 作成 |
| `/api/auth/login` | POST | 認証、ACS アクセストークン発行 |
| `/api/token/refresh` | POST | ACS トークンの更新（有効期限: 最大 24 時間） |
| `/api/threads` | POST | チャットスレッド作成 |
| `/api/threads/:id/participants` | POST | 参加者追加 |

**重要:** ACS の接続文字列・キーはバックエンドのみで保持し、フロントエンドには **アクセストークンのみ** を渡す。

### 3. Azure Communication Services

| 機能 | 用途 |
|---|---|
| Chat | テキストメッセージのリアルタイム送受信 |
| Identity | ユーザー ID・アクセストークン管理 |
| Event Grid 連携 | メッセージ着信通知、Webhook |

### 4. データストア

| ストア | 用途 | 理由 |
|---|---|---|
| Azure Cosmos DB | ユーザー情報、スレッドのメタデータ（名前・参加者など） | ACS はメタデータを持たないため補完が必要 |
| Azure Blob Storage | 画像・ファイル添付 | ACS の添付ファイルは URL 参照方式 |
| localStorage (既存) | 認証セッション保持（暫定） | 本番では Azure AD B2C または Cookie ベースに移行推奨 |

---

## チャットルームの管理単位

ACS の Chat では **ChatThread（チャットスレッド）** が管理の基本単位。  
参加者を何人追加するかによって 1:1 / 1:N / N:N を表現する（ACS 側の構造上の違いはない）。

### 管理単位の比較

| 管理単位 | 参加者数 | スレッド構造 | 主な用途 | 注意点 |
|---|---|---|---|---|
| **1対1** | 2名固定 | 1 スレッド = 2 participants | DM・個人間チャット | ACS はスレッドを「DM専用」として区別しない。参加者2名のスレッドを慣例的に DM として扱う |
| **1対N** | 1名 + N名（合計 N+1 名） | 1 スレッド = 複数 participants | アナウンス・サポートチャット | 特定ユーザーに「送信のみ」権限を制限する機能はないため、アプリ側でUX制御が必要 |
| **N対N** | N名（上限 250名） | 1 スレッド = N participants | グループチャット・チームチャット | 1スレッドの最大参加者数は 250名。それ以上は複数スレッドに分割する |

### スレッドライフサイクル

```
作成 (createChatThread)
  │
  ├─ 参加者追加 (addParticipants)    ← 1:1 / 1:N / N:N はここで決まる
  │
  ├─ メッセージ送受信 (進行中)
  │
  ├─ 参加者削除 (removeParticipant)  ← 途中退出も可能
  │
  └─ スレッド削除 (deleteChatThread) ← 管理者のみ
```

---

## シーケンス図

### 1. 初回接続・チャット開始フロー（1対1 DM の例）

```
ユーザーA           フロントエンド        バックエンド API      ACS
(ブラウザ)           (React)             (Azure Functions)   (Chat Service)
    │                    │                    │                   │
    │ ログイン操作         │                    │                   │
    │──────────────────>│                    │                   │
    │                    │ POST /api/auth/login                   │
    │                    │───────────────────>│                   │
    │                    │                    │ ACS Identity:     │
    │                    │                    │ createUser()      │
    │                    │                    │──────────────────>│
    │                    │                    │<──────────────────│
    │                    │                    │ (ACS UserID)      │
    │                    │                    │                   │
    │                    │                    │ issueToken()      │
    │                    │                    │──────────────────>│
    │                    │                    │<──────────────────│
    │                    │                    │ (accessToken)     │
    │                    │                    │                   │
    │                    │<───────────────────│                   │
    │                    │ { userId, token }  │                   │
    │                    │                    │                   │
    │                    │ ChatClient 初期化   │                   │
    │                    │ startRealtimeNotifications()           │
    │                    │────────────────────────────────────── >│
    │                    │<──────────────────────────────────────│
    │                    │ (WebSocket / SignalR 確立)             │
    │                    │                    │                   │
    │ 相手ユーザーを選択    │                    │                   │
    │──────────────────>│                    │                   │
    │                    │ POST /api/threads  │                   │
    │                    │ (participants: [A, B])                 │
    │                    │───────────────────>│                   │
    │                    │                    │ createChatThread()│
    │                    │                    │──────────────────>│
    │                    │                    │<──────────────────│
    │                    │                    │ (threadId)        │
    │                    │<───────────────────│                   │
    │                    │ { threadId }       │                   │
    │                    │                    │                   │
    │ チャット画面表示      │                    │                   │
    │<──────────────────│                    │                   │
```

---

### 2. メッセージ送受信フロー

```
ユーザーA           フロントエンドA       ACS (Chat Service)   フロントエンドB      ユーザーB
(送信者)             (React)                                    (React)            (受信者)
    │                    │                    │                    │                  │
    │ メッセージ入力・送信  │                    │                    │                  │
    │──────────────────>│                    │                    │                  │
    │                    │ sendMessage(       │                    │                  │
    │                    │  threadId, text)   │                    │                  │
    │                    │───────────────────>│                    │                  │
    │                    │<───────────────────│                    │                  │
    │                    │ (messageId)        │                    │                  │
    │ 送信完了表示         │                    │                    │                  │
    │<──────────────────│                    │                    │                  │
    │                    │                    │ SignalR Push       │                  │
    │                    │                    │ chatMessageReceived│                  │
    │                    │                    │───────────────────>│                  │
    │                    │                    │                    │ UI 更新           │
    │                    │                    │                    │─────────────────>│
    │                    │                    │                    │                  │
    │                    │                    │ (自分自身のイベントは│                  │
    │                    │                    │  SDK で自動フィルタ) │                  │
```

---

### 3. トークンリフレッシュフロー

```
フロントエンド        バックエンド API      ACS (Identity)
    │                    │                    │
    │ (トークン期限の      │                    │
    │  5分前にタイマー発火) │                    │
    │                    │                    │
    │ POST /api/token/refresh                 │
    │───────────────────>│                    │
    │                    │ refreshToken(      │
    │                    │  acsUserId)        │
    │                    │───────────────────>│
    │                    │<───────────────────│
    │                    │ (新 accessToken)    │
    │<───────────────────│                    │
    │ ChatClient に       │                    │
    │ 新トークンをセット    │                    │
    │ (接続は維持したまま)  │                    │
```

---

### 4. グループチャット（N対N）スレッド作成フロー

```
管理者ユーザー        フロントエンド        バックエンド API      ACS
    │                    │                    │                   │
    │ グループ作成操作     │                    │                   │
    │ (メンバー: A,B,C,D) │                    │                   │
    │──────────────────>│                    │                   │
    │                    │ POST /api/threads  │                   │
    │                    │ { topic: "Team",   │                   │
    │                    │   participants:    │                   │
    │                    │   [A,B,C,D] }      │                   │
    │                    │───────────────────>│                   │
    │                    │                    │ createChatThread()│
    │                    │                    │──────────────────>│
    │                    │                    │<──────────────────│
    │                    │                    │ (threadId)        │
    │                    │                    │                   │
    │                    │                    │ addParticipants() │
    │                    │                    │ [B, C, D]         │
    │                    │                    │──────────────────>│
    │                    │                    │<──────────────────│
    │                    │                    │ (成功)             │
    │                    │<───────────────────│                   │
    │                    │ { threadId }       │                   │
    │ グループ画面表示      │                    │                   │
    │<──────────────────│                    │                   │
    │                    │                    │                   │
    │                    │ (全メンバーに        │                   │
    │                    │  participantsAdded │                   │
    │                    │  イベントが届く)     │                   │
```

---

## 認証・トークンフロー

```
1. ユーザーがメール/パスワードでログイン
       ↓
2. バックエンド API が認証を検証
       ↓
3. ACS Identity SDK で CommunicationUserIdentifier + アクセストークンを発行
       ↓
4. トークンをフロントエンドに返却（有効期限付き）
       ↓
5. フロントエンドが ACS Chat SDK にトークンをセット
       ↓
6. ACS Chat API を直接呼び出してチャット操作
       ↓
7. トークン期限切れ前に /api/token/refresh で更新
```

---

## リアルタイム通知の仕組み

ACS Chat SDK は **SignalR ベースのリアルタイム通知** を内蔵している。

```typescript
// イベントリスナー例
chatClient.startRealtimeNotifications();
chatClient.on('chatMessageReceived', (e) => {
  // 新着メッセージをUIに反映
});
chatClient.on('typingIndicatorReceived', (e) => {
  // 入力中インジケーター表示
});
```

対応イベント:
- `chatMessageReceived` — 新着メッセージ
- `chatMessageEdited` — メッセージ編集
- `chatMessageDeleted` — メッセージ削除
- `typingIndicatorReceived` — 入力中通知
- `participantsAdded` / `participantsRemoved` — 参加者変化

---

## 段階的な実装ロードマップ

### Phase 1: MVP（最小構成）
- [ ] Azure Communication Services リソースを Azure Portal で作成
- [ ] バックエンド API（Azure Functions）: トークン発行エンドポイント
- [ ] `useACSChat` Hook の実装
- [ ] 1対1チャット画面（`ChatPage`）の実装
- [ ] リアルタイムメッセージ受信

### Phase 2: 機能拡充
- [ ] グループチャット（スレッド作成・参加者追加）
- [ ] 既読確認・タイピングインジケーター
- [ ] ファイル・画像添付（Azure Blob Storage 連携）
- [ ] スレッド一覧・検索

### Phase 3: 本番対応
- [ ] Azure AD B2C による認証強化
- [ ] Azure Front Door / CDN によるパフォーマンス最適化
- [ ] 監視: Application Insights 導入
- [ ] Cosmos DB へのメッセージアーカイブ（ACS の保持期間: 90日）

---

## コスト概算（参考）

| サービス | 無料枠 | 課金単位 |
|---|---|---|
| ACS Chat | 無料枠あり（毎月一定のメッセージ数） | 送受信メッセージ数 |
| ACS Identity | 無料 | トークン発行数（大量でなければ無料） |
| Azure Functions | 月 100 万回無料 | 実行回数・実行時間 |
| Cosmos DB | 1,000 RU/s・25GB 無料 (serverless) | RU消費量・ストレージ |
| Azure Blob Storage | 5GB 無料 | ストレージ容量・操作数 |

> PoC・開発段階では実質無料に近いコストで運用可能。

---

## セキュリティ考慮事項

- **ACS 接続文字列はバックエンドのみに保持**。フロントエンドへの漏洩禁止
- アクセストークンの有効期限を適切に設定（推奨: 1 時間）
- CORS 設定を適切なオリジンに限定
- HTTPS 通信の強制（ACS SDK はデフォルト HTTPS）
- Cosmos DB / Blob Storage へのアクセスは Managed Identity を利用

---

## 参考リンク

- [Azure Communication Services ドキュメント](https://learn.microsoft.com/ja-jp/azure/communication-services/)
- [ACS Chat SDK for JavaScript](https://learn.microsoft.com/ja-jp/azure/communication-services/quickstarts/chat/get-started?tabs=windows&pivots=programming-language-javascript)
- [ACS 料金](https://azure.microsoft.com/ja-jp/pricing/details/communication-services/)
