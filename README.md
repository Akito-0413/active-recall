# Active Recall

読書の学びを保存し、あとから復習しやすくするミニマルな学習アプリです。

## ディレクトリ設計

このリポジトリは、Next.js App Router を前提に、役割ごとに近い場所へ置く構成にしています。

- `src/app`: ルーティングの入口です。`page.tsx` を中心に、`loading.tsx`、`error.tsx`、`not-found.tsx`、`route.ts` などを置き、画面全体の組み立てだけを担当します。
- `src/features/<feature>`: 機能単位の実装を集める場所です。`recall-logs` では、画面部品、Server Actions、DB まわりの service、入力バリデーション、型定義をひとまとめにします。機能に閉じたロジックはここに寄せると、画面と処理の対応関係が追いやすくなります。
- `src/lib`: どの機能からも使う共通基盤です。Supabase クライアント、環境変数の読み取り、共通ユーティリティなど、機能横断の処理を置きます。特定機能に属さない処理をまとめることで、重複を減らしやすくなります。

学習ログ機能は、`src/app/logs` と `src/app/review` が画面の入口になり、実処理は `src/features/recall-logs` に集約します。

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

## Codex Skills

このリポジトリのローカル Skill 定義は `.codex/skills/` で管理しています。

Codex が読む `~/.codex/skills/` へ同期するには:

```bash
npm run sync:codex-skills
```

同期スクリプト本体は `.codex/sync-skills.sh` にあります。
