# Codex Project Files

このリポジトリは Codex を前提に開発します。

- プロジェクト内 Skill の正本は `.codex/skills/`
- Codex 実行環境向けのインストール先は `~/.codex/skills/`

プロジェクト内 Skill を反映するには次を実行します。

```bash
npm run sync:codex-skills
```

不要になったローカルインストール済み Skill も削除したい場合:

```bash
npm run sync:codex-skills -- --clean
```

実体の同期スクリプトは `.codex/sync-skills.sh` にあります。
