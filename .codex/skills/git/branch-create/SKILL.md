---
name: branch-create
description: mainブランチとの差分や作業内容を確認し、Git運用に沿った作業ブランチを作成する。ユーザーが「ブランチ作って」「作業ブランチを切って」「mainとの差分を見てブランチ名を決めて」「featureかhotfixか判断して」など、作業開始用のGitブランチ作成を依頼したときに使用する。
---

# Branch Create

## 概要

このSkillは、現在の状態と `main` との差分を確認し、作業内容に合ったブランチ種別と名前を決めて作業ブランチを作成するために使用します。

ブランチ名は短く、英数字とハイフン中心で、目的が分かる名前にします。

## 手順

### 1. 現在状態を確認する

次を実行します。

```bash
git status --short
git branch --show-current
git remote -v
git fetch origin main
```

未コミット変更がある場合でも、Gitはその変更を保持したままブランチ作成できます。ただし、無関係な変更が混ざっていないか確認してください。

### 2. mainとの差分を確認する

現在ブランチと `main` の関係を確認します。

```bash
git diff --stat origin/main...HEAD
git log --oneline origin/main..HEAD
```

現在 `main` にいる場合、差分がなくても問題ありません。これから始める作業内容をもとにブランチ名を決めます。

すでに作業コミットがある場合は、差分内容からブランチ種別と名前を判断します。

### 3. ブランチ種別を選ぶ

原則として次のprefixを使います。

- `feature/`: 新機能、ユーザー価値の追加、画面やAPIの追加。
- `fix/`: 通常の不具合修正。
- `hotfix/`: 本番障害や緊急修正。ユーザーが緊急性を明示した場合に使う。
- `docs/`: ドキュメントのみ。
- `chore/`: 設定、依存、開発環境、雑務。
- `refactor/`: 外部仕様を変えない内部改善。
- `test/`: テスト追加・修正が中心。

判断に迷う場合は、変更の主目的を優先します。

### 4. ブランチ名を作る

形式:

```text
<type>/<short-kebab-summary>
```

例:

- `feature/recall-log-api`
- `fix/reviewed-at-update`
- `hotfix/gpt-action-auth`
- `docs/update-design-specs`
- `chore/add-git-skills`

ルール:

- 英小文字、数字、ハイフン、スラッシュを使う。
- 日本語は使わない。
- 長すぎる名前を避ける。
- チケット番号がユーザーから与えられている場合は末尾か先頭に含める。

### 5. ブランチを作成する

現在 `main` にいる場合は、最新の `origin/main` から作成します。

```bash
git switch main
git pull --ff-only origin main
git switch -c <branch-name>
```

未コミット変更がある場合に `git switch main` が危険または失敗しそうなら、現在の状態を説明し、ユーザー確認を取ってから進めます。

現在すでに作業ブランチにいる場合は、状況に応じて判断します。

- 既存ブランチ名が適切なら、新規作成せずそのまま使う。
- 名前が不適切でコミット前なら、必要に応じて `git branch -m <branch-name>` でリネームする。
- 別作業が混ざっている場合は停止し、分離方針を確認する。

### 6. 結果を確認する

次を実行します。

```bash
git branch --show-current
git status --short
```

最終報告には次を含めます。

- 作成または選択したブランチ名。
- ブランチ種別を選んだ理由。
- 未コミット変更があるかどうか。
- 次に推奨する作業。

## ガードレール

- ユーザーが明示的に依頼しない限り、作業変更を破棄しない。
- `git reset --hard`、`git checkout --` は使わない。
- `main` へ直接コミットする前提で進めない。
- 緊急性が明確でない作業に `hotfix/` を使わない。
- ブランチ名にsecret、個人情報、長い日本語、曖昧な `work` や `temp` だけの名前を使わない。
