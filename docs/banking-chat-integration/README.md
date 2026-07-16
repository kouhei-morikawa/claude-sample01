# バンキングアプリ ↔ チャットアプリ 連携設計書

## 概要

本ドキュメントは、Azure上に構築されたバンキングWebアプリケーションから、自社開発チャットアプリケーションへの連携方式を定義するものです。

### 前提条件

| 項目 | 内容 |
|---|---|
| インフラ | 両アプリともAzure（Japan East）上で構築 |
| ドメイン | 異なるドメイン |
| 連携方向 | バンキングアプリ → チャットアプリ（一方向） |
| 連携データ | 取引データ・残高等の金融情報を含む |
| チャットアプリ | 自社開発 |
| チャット利用者 | エンドユーザー + オペレーター（担当者） |
| 規制 | FISC安全対策基準・金融庁ガイドライン準拠 |
| データ所在 | 日本国内（Japan East）限定 |
| バンキング認証 | Azure AD B2C |
| セキュリティ要件 | 高 |

---

## システム全体図

```
┌─────────────────── Azure Japan East ─────────────────────────────┐
│                                                                    │
│  [Azure AD B2C]  ←────────────────────────────────────────────┐  │
│       │ (認証・oidトークン発行)                                  │  │
│       │                                                        │  │
│  ┌────▼───────────┐   ワンタイムToken    ┌─────────────────┐   │  │
│  │ バンキングApp   │ ──────────────────▶ │  チャットApp     │   │  │
│  │ (App Service)  │                     │  (App Service)  │   │  │
│  └────┬───────────┘                     └────────┬────────┘   │  │
│       │                                          │            │  │
│  ┌────▼───────────┐   Client Credentials  ┌──────▼────────┐  │  │
│  │  Banking API   │ ◀──────────────────── │   Chat API    │  │  │
│  │  (APIM + VNet) │                        │  (APIM+VNet)  │  │  │
│  └────────────────┘                        └───────────────┘  │  │
│                                                                │  │
│  [Service Bus]  [Redis Cache]  [Key Vault]  [Log Analytics]   │  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 認証設計

### 基本方針

- **Azure AD B2C を両アプリ共通のIdPとして使用する**
- ユーザーは `oid`（オブジェクトID）クレームで統一識別する
- チャットアプリの認証基盤も Azure AD B2C を採用することを推奨

### B2Cテナント設定

| 設定項目 | 内容 |
|---|---|
| テナントリージョン | Japan East |
| バンキングアプリ登録 | B2Cアプリ登録 #1 |
| チャットアプリ登録 | B2Cアプリ登録 #2 |
| カスタムスコープ | `chat.read.balance` / `chat.read.transactions` |

---

## 連携フロー詳細

### パターン1：手動連携（ユーザーがボタン押下でチャットへ遷移）

```
① ユーザーがバンキングApp内「チャットで相談」ボタンを押下
② バンキングサーバーが以下を実行：
   - ユーザーのoidをキーにRedis（TTL:60秒）にセッション情報を保存
   - ワンタイムトークン（UUID）を発行
③ チャットAppへリダイレクト（URLにはワンタイムトークンのみ）
   https://chat.example.com/start?t={uuid}
④ チャットAppがワンタイムトークンをバンキングサーバーに送信して検証
⑤ 検証OK → チャットAppが独自セッションを発行
⑥ チャット中に金融情報が必要な場合 → Banking APIをClient Credentialsで都度取得
```

> ⚠️ **URLにアクセストークンや金融情報を直接乗せない**（ブラウザログ・Refererヘッダーで漏洩するため）

### パターン2：自動連携（バックグラウンド通知）

```
① バンキング側でイベント発生（送金完了・異常検知等）
② Azure Service Busにメッセージをエンキュー
   ※ メッセージには金融情報本体を含めない
   例: { "event": "transfer_completed", "userId": "oid-xxxx", "eventId": "evt-001" }
③ チャットAppのバックエンドがService Busからメッセージ受信
④ チャットAppがBanking APIにeventIdを渡して詳細を取得（都度取得）
⑤ ユーザー or オペレーターへ通知表示
```

> ⚠️ **Service Busのメッセージに金融情報を含めない**（キューのアクセス権は広くなりがちなため）

---

## アクセス制御設計

### ロール定義

| ロール | 説明 | アクセス範囲 |
|---|---|---|
| `customer` | 一般ユーザー | 自分の情報のみ参照可 |
| `operator` | 担当オペレーター | 担当顧客の情報のみ参照可 |
| `supervisor` | 管理者 | 監査ログ閲覧可、データ変更不可 |

### 金融情報の表示ルール（オペレーター向け）

```
✅ 口座番号：末尾4桁のみ表示（xxxx-xxxx-1234）
✅ 残高：表示するが操作不可
✅ 取引履歴：直近N件のみ、CSVダウンロード不可
✅ Banking APIはoidと「オペレーター-顧客紐付けテーブル」で認可チェック
✅ 担当外の顧客情報には403を返す（存在確認もさせない）
```

---

## セキュリティ設計

### 通信セキュリティ

| 項目 | 設定 |
|---|---|
| 通信暗号化 | TLS 1.2以上必須（APIMで強制） |
| CORS | チャットApp側でバンキングAppドメインのみ許可 |
| ネットワーク | VNet統合 + Private Endpoint（インターネット直接接続禁止） |

### トークン管理

| 項目 | 設定 |
|---|---|
| アクセストークン有効期限 | 15〜60分 |
| ワンタイムトークンTTL | 60秒（Redis） |
| トークン保存場所 | HTTPOnly Cookie or メモリ（localStorageは使用しない） |
| 秘密情報管理 | Azure Key Vault |

### データ保護

```
✅ 金融情報はチャットアプリのDBに永続保存しない
✅ バンキングAPIから都度取得（キャッシュは短期のみ）
✅ 保存データはAES-256で暗号化
✅ データ所在はJapan East限定
```

---

## FISC安全対策基準への対応

| FISCカテゴリ | 対応内容 |
|---|---|
| アクセス管理（統制基準14〜16） | B2C + RBACによる最小権限。ロール別アクセス制御 |
| 通信の暗号化（技術基準58〜60） | TLS 1.2以上必須。APIMで強制 |
| ログ・証跡管理（統制基準62〜67） | 全API呼び出しをLog Analyticsに記録。Immutable Storageで保護 |
| 外部接続管理（統制基準37〜40） | VNet統合 + Private Endpoint |
| データ保護 | Japan East限定。Key Vault暗号鍵管理。AES-256暗号化 |
| 障害・BCP対応 | Availability Zone対応。Geo-redundant未使用（国内限定） |

### 監査ログ要件

```
✅ 記録項目：誰が・いつ・どの顧客の・何の情報を閲覧したか
✅ 保存先：Log Analytics + Immutable Blob Storage（WORM設定）
✅ 保持期間：FISC推奨に従い7年以上
```

---

## 採用Azureサービス一覧

| サービス | 用途 | リージョン |
|---|---|---|
| Azure AD B2C | 共通認証基盤 | Japan East |
| App Service | アプリホスティング | Japan East |
| API Management (APIM) | APIゲートウェイ・レート制限 | Japan East |
| Azure Cache for Redis | ワンタイムトークン管理（TTL付き） | Japan East・暗号化有効 |
| Azure Service Bus | 非同期イベント連携 | Japan East |
| Azure Key Vault | 秘密情報・暗号鍵管理 | Japan East |
| Log Analytics | 監査ログ収集・分析 | Japan East |
| Immutable Blob Storage | 監査ログ長期保存（WORM） | Japan East |
| Virtual Network + Private Endpoint | ネットワーク分離 | Japan East |
| Application Insights | アプリ監視・パフォーマンス追跡 | Japan East |

---

## サービス間認証

```
バンキングAPI ← チャットAPI呼び出し時
  → Managed Identity + Client Credentials フローを使用
  → APIキーや固定パスワードは使用しない
  → 認証情報は Key Vault で管理
```

---

## 今後の実装ステップ

1. **Azure AD B2C のカスタムポリシー設計**（チャットアプリ用スコープ追加）
2. **Banking APIのOAuthスコープ定義**（`chat.read.balance` / `chat.read.transactions` 等を細分化）
3. **オペレーター-顧客紐付けマスタの設計**（どのDBに持つか決定）
4. **FISC準拠チェックリストの作成**（システム監査対応）
5. **ログ保持ポリシーの決定と実装**（7年以上の保持設定）
6. **VNet・Private Endpoint構成の設計**
7. **Redis・Service Busの暗号化設定**
8. **セキュリティテスト（ペネトレーションテスト）の実施**

---

## 参考資料

- [Azure AD B2C ドキュメント](https://learn.microsoft.com/ja-jp/azure/active-directory-b2c/)
- [FISC 安全対策基準（第11版）](https://www.fisc.or.jp/)
- [金融庁 クラウドサービスに関するガイドライン](https://www.fsa.go.jp/)
- [Azure セキュリティベースライン](https://learn.microsoft.com/ja-jp/security/benchmark/azure/)
- [Microsoft ID プラットフォームの On-Behalf-Of フロー](https://learn.microsoft.com/ja-jp/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow)
