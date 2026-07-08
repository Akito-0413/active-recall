# ADR 0006: Supabase AuthとRLSで学習ログをユーザー所有にする

## Status

Accepted。

## Context

Active Recall は当初、認証なしの単一ユーザー前提で中核フローを確認する方針でした。

その後、保存した学習ログを自分専用で扱いたい要件と、Googleログインを含む認証導線の要望が明確になりました。

既存の `recall_logs` は service role を通した共有データとして扱われており、このままではユーザー単位の分離や将来の認可ルールを安全に拡張できません。

## Decision

認証基盤として Supabase Auth を採用します。

- 通常ログインはメールアドレスとパスワードを Supabase Auth で扱う。
- Googleログインは Supabase Auth の OAuth プロバイダ連携で扱う。
- アプリDBには `public.user_profiles` を持ち、`auth.users` と 1:1 で同期する。
- `public.recall_logs.owner_id` を追加し、ログインユーザー所有のデータに移行する。
- 画面系の学習ログ操作は publishable key + Cookie セッション + RLS で保護する。
- Custom GPT Actions の Bearer API は当面維持し、外部保存ログは `owner_id = null` とする。

## Consequences

- 認証画面、ログアウト、アカウント設定がアプリの標準導線に加わる。
- 学習ログData Accessは service role 中心ではなく、認証済み server client 中心へ移る。
- `recall_logs` と `user_profiles` に RLS policy を定義する必要がある。
- `docs/requirements.md`、`docs/architecture.md`、`docs/specification.md` の認証前提を更新する。
- ADR 0003 の「MVPでは認証を後回しにする」は、この判断で実質的に superseded となる。
