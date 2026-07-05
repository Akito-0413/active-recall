# ADR 0002: Supabase PostgreSQLを使用する

## Status

Accepted。

## Context

Active Recallでは、学習ソースとGPT生成の学習エントリーを永続化する必要があります。

データ保存先としてSupabase PostgreSQLを使用する方針です。MVPでは認証を実装しませんが、将来的にSupabase Authを導入できるようにします。

## Decision

主な永続化レイヤーとしてSupabase PostgreSQLを使用します。

Data Access層は、将来のユーザー所有、Supabase Auth、Row Level Securityを追加しやすい形にします。

Supabaseの設計・実装では、公式ドキュメントで現在推奨されているAPIと構成を優先し、非推奨の設計やAPIは採用しません。

## Consequences

- ソースとエントリーのDB向けデータモデルを定義する。
- DBアクセスは専用の関数またはモジュールに分離する。
- 将来の認証追加時は、既存モデルにユーザー所有を追加する。
- Row Level SecurityなどSupabase固有の判断は、実装時に別ADRとして記録する。
