# Supabase

このディレクトリには、Active Recall の Supabase 関連ファイルを置きます。

## Contents

- `config.toml`: Supabase ローカル設定
- `migrations/`: SQL マイグレーション

## Migration

初期テーブル定義は `supabase/migrations/20260705161000_create_recall_logs.sql` にあります。

## Type Generation

Supabase の型定義を生成する場合は、プロジェクトルートで次を実行します。

```bash
npx supabase gen types typescript --local > src/lib/supabase/database.types.ts
```

## Notes

- Supabase の接続情報やシークレットはリポジトリに含めません。
- 認証や RLS を追加する段階では、別途ドキュメントと ADR を更新します。
