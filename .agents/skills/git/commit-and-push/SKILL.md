---
name: commit-and-push
description: Gitの変更を安全に確認、ステージ、コミット、プッシュする。ユーザーが「コミットして」「コミット&プッシュして」「編集したファイルをpushして」「今の作業をGitに保存して」など、Gitで現在の変更を公開する作業を依頼したときに使用する。
---

# Commit And Push

## 概要

このSkillは、現在のリポジトリ変更を確認し、適切なコミットとしてまとめ、現在のリモートブランチへpushするために使用します。

安全性を優先してください。作業ツリーを確認し、無関係な変更を巻き込まず、必要な検証を行い、最後にpushしたコミットを明確に報告します。

## 手順

### 1. リポジトリ状態を確認する

次を実行します。

```bash
git status --short
git branch --show-current
git remote -v
```

変更がない場合は、コミット対象がないことをユーザーに伝えて停止します。

ブランチまたはremoteが存在しない場合は、何が不足しているかを説明して停止します。

### 2. 差分を確認する

次を実行します。

```bash
git diff --stat
git diff --cached --stat
```

未追跡ファイルがある場合は、次で確認します。

```bash
git ls-files --others --exclude-standard
```

ユーザーの現在の依頼と無関係なファイルが差分に含まれる場合、自動でstageしないでください。安全に範囲を切れない場合は、確認を求めます。

### 3. stage対象を決める

依頼された作業に属するファイルだけをstageします。

原則として明示的なパス指定を使います。

```bash
git add path/to/file path/to/dir
```

`git add .` は、ユーザーが明示的に「すべてコミットして」と依頼した場合、または確認済みの作業ツリーに意図した変更しかない場合だけ使用します。

stage後に次を実行して確認します。

```bash
git diff --cached --stat
git status --short
```

### 4. 検証を実行する

変更内容とリポジトリルールに応じた検証を実行します。

まず `AGENTS.md` などのプロジェクト指示を優先してください。代表例は次の通りです。

```bash
npm run lint
npm run build
```

ドキュメントのみの変更で、リポジトリルール上問題ない場合は、buildやtestを省略しても構いません。その場合は「docs-onlyのため省略した」と明示します。

検証が失敗した場合、ユーザーが明示的に失敗状態でのコミットを依頼していない限り、コミット前に停止して失敗内容を要約します。

### 5. コミットする

可能な限り、簡潔なConventional Commit形式のメッセージを使います。

例:

- `docs: update active recall specifications`
- `feat: add recall log creation flow`
- `chore: add commit and push skill`

次の形式でコミットします。

```bash
git commit -m "type: concise summary"
```

stage済み変更がないとGitが報告した場合は、停止して説明します。

### 6. pushする

upstreamが設定されている場合は、次を実行します。

```bash
git push
```

upstreamがない場合は、現在のブランチ名を確認して明示的にpushします。

```bash
git push -u origin <current-branch>
```

ユーザーが明示的に依頼し、リスクを確認した場合を除き、force pushは行いません。

### 7. 結果を報告する

push後に次を実行します。

```bash
git status --short
git log -1 --oneline
```

最終報告には次を含めます。

- コミットハッシュとメッセージ。
- push先。
- 作業ツリーがcleanかどうか。
- 実行した検証、または省略した検証。

最終回答は短くまとめます。

## ガードレール

- ユーザーが明示的に依頼しない限り、`git reset --hard`、`git checkout --`、その他の破壊的な取り消し操作を行わない。
- デフォルトで履歴を書き換えない。force pushしない。
- secret、`.env`、ローカル認証情報、ビルド成果物、依存フォルダは、リポジトリが意図的に追跡している場合を除きコミットしない。
- 無関係なユーザー変更をコミットに含めない。
- pre-commit hookがある場合は実行させる。hookがファイルを変更した場合は、差分を確認してから再stageし、コミットを続ける。
