---
name: pr-create
description: mainブランチとの差分を確認し、GitHub Pull Requestを安全に作成する。ユーザーが「PRを作って」「mainとの差分でPR作成」「プルリク作成」「ghでPRを開いて」など、現在の作業ブランチからmain向けのPR作成を依頼したときに使用する。
---

# PR Create

## 概要

このSkillは、現在の作業ブランチと `main` の差分を確認し、適切なタイトル・本文でGitHub Pull Requestを作成するために使用します。

PR作成前に、ブランチ状態、未コミット変更、push状態、差分内容を確認してください。

## 手順

### 1. 前提を確認する

次を実行します。

```bash
git status --short
git branch --show-current
git remote -v
git fetch origin main
```

現在ブランチが `main` の場合は、PR作成前に作業ブランチが必要であることを伝えて停止します。

未コミット変更がある場合は、PR作成前にコミットが必要です。ユーザーが希望するなら `$commit-and-push` 相当の手順で先にコミット・pushします。

### 2. mainとの差分を確認する

次を実行します。

```bash
git diff --stat origin/main...HEAD
git log --oneline origin/main..HEAD
```

差分がない場合は、PRに含める変更がないことを伝えて停止します。

差分が大きい場合は、主要な変更ファイルとコミットを要約してからPR本文に反映します。

### 3. push状態を確認する

upstreamがあるか確認します。

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{u}
```

upstreamがない場合は、現在ブランチをpushします。

```bash
git push -u origin <current-branch>
```

upstreamがある場合は、必要に応じて通常pushします。

```bash
git push
```

force pushは、ユーザーが明示的に依頼し、リスクを確認した場合を除き行いません。

### 4. PR本文を作成する

PRタイトルは、変更内容に合う簡潔な日本語または既存リポジトリの慣習に合わせた英語にします。

PR本文には原則として次を含めます。

```markdown
## 概要
- 

## 変更内容
- 

## 確認
- [ ] lint
- [ ] build
- [ ] 手動確認
```

実際に実行済みの確認は `[x]` にし、未実行の場合は理由を書きます。

### 5. PRを作成する

GitHub CLIが使える場合は `gh` を使います。

```bash
gh pr create --base main --head <current-branch> --title "<title>" --body "<body>"
```

`gh` が未インストール、または未認証の場合は停止し、必要な状態を説明します。無理にWeb操作で代替しないでください。

### 6. 結果を確認する

作成後に次を実行します。

```bash
gh pr view --web=false
```

最終報告には次を含めます。

- PR URL。
- baseブランチとheadブランチ。
- PRタイトル。
- 確認済みチェック。

## ガードレール

- `main` から直接PRを作成しない。
- 未コミット変更を残したままPRを作成しない。
- mainとの差分がないPRを作らない。
- secret、`.env`、ローカル認証情報が差分に含まれていないか注意する。
- 既存PRがある可能性がある場合は `gh pr status` または `gh pr list --head <current-branch>` で確認する。
