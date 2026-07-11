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
