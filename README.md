# Active Recall

読書の学びを保存し、あとから復習しやすくするミニマルな学習アプリです。

## 開発

```bash
npm install
npm run dev
```

ユニットテスト:

```bash
npm run test
npm run test:coverage
```

E2Eテスト:

```bash
npx playwright install chromium
npm run test:e2e
```

`npm run test:e2e` は Playwright が自動で Next.js 開発サーバーを起動して実行します。

## CI

GitHub Actionsで、`main` 向けPull Requestと `main` へのpush時に次を実行します。

```bash
npm ci
npm run lint
npm run test
npm run test:coverage
npm run test:e2e
npm run build
```

Vercel Previewはデプロイ結果の確認、GitHub Actionsはコード品質・ユニットテスト・カバレッジレポート生成・E2Eテスト・本番ビルドの確認を担当します。

カバレッジは `src` 配下の未実行ファイルも含めて集計し、Pull Request ではサマリーコメントも自動投稿します。

カバレッジはレポート生成のみで、まだしきい値ゲートは設けていません。

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
