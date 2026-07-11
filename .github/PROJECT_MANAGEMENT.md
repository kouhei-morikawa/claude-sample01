# プロジェクト管理ガイド（GitHub Issues / Projects）

このドキュメントは、GitHub Issues / Projects を使ったプロジェクト管理の運用方針をまとめたものです。

## 背景・課題

- Issue はお客様が作成したユーザーストーリーをもとに起票している
- 起票時点では細かな仕様が決まっていないことが多い
- 仕様がたびたび変更になり、進捗に大きく影響している

上記を踏まえ、**「仕様が未確定・変更されやすい」という前提で進捗と変更履歴を可視化する**ことを目的に、テンプレートとProjectsの運用ルールを以下のように定める。

## 1. Issueテンプレート

`.github/ISSUE_TEMPLATE/` に4種類のテンプレート（Issue Forms）を用意した。

| ファイル | 用途 |
|---|---|
| [01_user_story.yml](ISSUE_TEMPLATE/01_user_story.yml) | お客様のユーザーストーリーをもとに起票する親Issue |
| [02_task.yml](ISSUE_TEMPLATE/02_task.yml) | ユーザーストーリーから分解した実装タスク |
| [03_spec_change.yml](ISSUE_TEMPLATE/03_spec_change.yml) | 仕様の追加・変更が発生した際に記録する |
| [04_bug_report.yml](ISSUE_TEMPLATE/04_bug_report.yml) | 不具合報告 |

### ポイント

- **User Story** には「仕様確定状況」（未確定 / 一部確定 / 確定）の入力を必須にし、仕様が固まっていない状態を起票時点から明示する。
- **Task** は必ず親Storyへのリンクを持たせ、Sub-issue機能で親子関係を構造化する。着手前チェックとして「親の仕様確定状況が確定であること」を確認する項目を入れている。
- **仕様変更（Spec Change）** を独立したIssue種別として起票できるようにした。これにより、
  - 仕様変更の理由・出所（どのMTG/発言に基づくか）
  - 影響を受けるIssue番号
  - 影響度（軽微 / 手戻りあり / 大幅な手戻り）

  が記録され、「なぜ遅延したか」を後からお客様に説明する材料になる。仕様変更をコメントで済ませず、必ずこのテンプレートで起票する運用とする。

## 2. 見える化（Projects のカスタムフィールド・View・フィルター）

以下はGitHub Projects（v2）側で設定する運用ルール。Projects自体のフィールド/View作成はリポジトリ設定のためコードでは管理できず、プロジェクト画面から手動セットアップが必要。

### カスタムフィールド

| フィールド | 型 | 選択肢 / 用途 |
|---|---|---|
| Status | Single select | Todo / In Progress / In Review / Done |
| **仕様確定状況** | Single select | 未確定 / 一部確定 / 確定（課題対応の要） |
| Priority | Single select | P0 / P1 / P2 / P3 |
| Type | Single select | Story / Task / Bug / SpecChange（テンプレートのlabelと連動） |
| Iteration | Iteration | スプリント管理 |
| Size | Single select | XS / S / M / L / XL |

### 推奨View

1. **カンバン（Status別）** — 日常の進捗確認用の標準ボード
2. **仕様確定状況別ボード** — 「未確定のまま止まっているIssueが何件あるか」を可視化する。仕様待ちで滞留しているタスクを毎朝一目で把握できる
3. **テーブルビュー（Priority + Updated順）** — 定例レビュー・棚卸し用
4. **ロードマップ（タイムライン）ビュー** — Iteration/Milestone横断でお客様への進捗説明用

### 保存フィルター例

- `is:open label:"type: spec-change" updated:>=@today-7d` — 直近1週間で発生した仕様変更
- `is:open "仕様確定状況":未確定` — 仕様待ちで着手できないIssue一覧

### ラベル運用

- `type: story` / `type: task` / `type: bug` / `type: spec-change`（テンプレートに設定済み）
- `blocked` — 仕様以外の理由で止まっているもの

ラベルは横断的な属性、Projectsのカスタムフィールドはワークフロー状態、と役割を分けて二重管理を避ける。

### その他の推奨事項

- **Sub-issues機能**でUser Story→Taskの親子関係を明示する。テーブルビューで進捗率が自動集計される。
- **Workflow自動化**（Projectsのビルトインワークフロー）：PRがリンクされたら自動でStatusを変更、Issueクローズで自動アーカイブなど。
- **仕様変更の影響ログ**：`type: spec-change` Issueが増えてきたら月次で件数・影響工数を集計し、振り返り資料にする。仕様確定プロセス自体の改善材料になる。
- **グルーミング（定例）**：仕様未確定のUser Storyを詳細タスクに分解しすぎない。確定してから分解する方が手戻りが少ない。

## 3. 日次の稼働キャパシティ確認

「1日6h稼働できる開発者に、その日3件のタスクが割り当てられている場合、その日のうちに消化できるか」を判断するための仕組み。

### 追加フィールド

| フィールド | 型 | 入力者・タイミング |
|---|---|---|
| **Estimate (h)** | Number | 担当者が着手前に1回、ざっくり時間で入力（例: 2 / 4 / 6） |
| **予定日** | Date（組み込みのStart dateを流用可） | プランニング時にPM/担当者が「この日にやる」を設定 |

開発者の追加作業は「タスクごとに時間を1つ入力する」だけ。

### 見える化（標準機能・コード不要）

Projectsの **Table view** で以下を設定する。

- フィルター：`予定日 = today`
- グループ化：`Assignee`

グループ化するとNumber型フィールドの **Sum（合計）** が各グループの下に自動表示されるため、「田中さん：本日の合計 7h」のように一目で分かる。6hの上限に対してPM・本人が朝会で調整判断を行う。

### 自動アラート（任意）

人が見て判断する代わりに、毎朝自動で「6h超過の担当者」を検知して通知することもできる。[`daily-capacity-check.yml`](workflows/daily-capacity-check.yml) を参照。

- 毎朝、Projectsの `Estimate (h)` ・`Status`（値が `本日作業` のものだけ）を集計し、担当者ごとの合計時間を算出
- 上限（既定 6h）を超えていたら、その日のうちに `[Capacity Alert]` Issueを自動作成
- 開発者の追加作業はゼロ（入力するのは相変わらず `Estimate (h)` の1項目のみ。`Status`はカンバン運用で普段から更新している値をそのまま利用）
- 当初は `予定日 = today` も条件にしていたが、`Status = 本日作業` だけで「朝会でその日やると決めたタスク」を過不足なく表せるため、`予定日` の条件は廃止した（`予定日`フィールド自体は見える化のTable viewでは引き続き利用できる）

利用するには以下の設定が必要（GitHub UI上での手動作業）。

1. `read:project` と `repo`（Publicリポジトリのみなら `public_repo` で可）スコープを持つPAT（Classic）を発行し、リポジトリのSecretsに `PROJECTS_TOKEN` として登録
   - `read:project` はProjectsのデータ取得に、`repo`/`public_repo` はアラートIssueの作成に必要
2. リポジトリのVariablesに以下を設定
   - `PROJECT_NUMBER`（対象ProjectsのURLに表示される番号）
   - `PROJECT_OWNER`（Projectの所有者。未設定時はリポジトリオーナーを使用）
   - `PROJECT_OWNER_TYPE`（`org` または `user`。既定は `org`）
   - `CAPACITY_HOURS`（1日の上限時間。既定は `6`）

## 運用フロー（まとめ）

```
お客様のユーザーストーリー
        │
        ▼
[01_user_story] 起票（仕様確定状況: 未確定 で開始）
        │
        │  仕様確定 or 一部確定
        ▼
[02_task] へ分解（Sub-issue化）
        │
        │  仕様変更が発生したら都度
        ▼
[03_spec_change] を起票 → 影響Issueにリンク・コメント
        │
        ▼
実装 → PR → レビュー → Done
```
