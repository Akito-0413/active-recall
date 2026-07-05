# Active Recall

読書の学びを保存し、あとから復習しやすくするミニマルな学習アプリです。

## 開発

```bash
npm install
npm run dev
```

## 必須の環境変数

`.env.local` に次を設定します。

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
ACTIVE_RECALL_API_KEY=...
```

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase プロジェクトURL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: 将来の SSR/Auth 拡張も見据えた公開キー
- `SUPABASE_SECRET_KEY`: サーバー専用の Supabase secret key
- `ACTIVE_RECALL_API_KEY`: Custom GPT Actions から `POST /api/recall-logs` を呼ぶための Bearer API キー

## Supabase

初期マイグレーションは `supabase/migrations/20260705161000_create_recall_logs.sql` にあります。

今後型生成を追加する場合の例:

```bash
npx supabase gen types typescript --local > src/lib/supabase/database.types.ts
```

## Codex Skills

このリポジトリのローカル Skill 定義は `.codex/skills/` で管理しています。

Codex が読む `~/.codex/skills/` へ同期するには:

```bash
npm run sync:codex-skills
```

同期スクリプト本体は `.codex/sync-skills.sh` にあります。
