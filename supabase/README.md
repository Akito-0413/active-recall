# Supabase

このディレクトリには、Active Recall の Supabase 関連ファイルを置きます。

## Contents

- `config.toml`: Supabase ローカル設定
- `migrations/`: SQL マイグレーション

## Migration

初期テーブル定義は `supabase/migrations/20260705161000_create_recall_logs.sql` にあります。

認証とユーザー所有の追加は `supabase/migrations/20260708120000_add_auth_and_user_ownership.sql` にあります。

## Type Generation

Supabase の型定義を生成する場合は、プロジェクトルートで次を実行します。

```bash
npx supabase gen types typescript --local > src/lib/supabase/database.types.ts
```

## Notes

- Supabase の接続情報やシークレットはリポジトリに含めません。
- `public.user_profiles` は `auth.users` と 1:1 で同期します。
- `public.recall_logs.owner_id` はログインユーザー所有のために使います。
- Custom GPT から保存されるログは当面 `owner_id = null` で入り、ログイン画面からは見えません。

## Google OAuth Local Setup

1. Google Cloud Console で OAuth Client を作成します。
2. Authorized redirect URI に `http://127.0.0.1:54321/auth/v1/callback` を追加します。
3. `supabase/config.toml` の `[auth.external.google]` を有効化し、`client_id` を設定します。
4. `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` をローカル環境へ設定します。
5. Supabase Dashboard またはローカル設定の redirect URL に `http://127.0.0.1:3000/auth/callback` と `http://localhost:3000/auth/callback` を含めます。
