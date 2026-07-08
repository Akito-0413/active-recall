# ADR 0003: MVPでは認証を後回しにする

## Status

Superseded by ADR 0006。

## Context

MVPの目的は、読書内容から作られたGPT生成コンテンツを保存し、見返す中核フローを検証することです。

認証を入れると、主要フローの検証前にセットアップ、ポリシー、UIの複雑さが増えます。

## Decision

MVPではユーザー認証を実装しません。

ただし、将来的にSupabase Authを追加できるよう、ユーザー所有を追加しにくくなる決め打ちは避けます。

## Consequences

- MVP画面にログイン、ログアウト、アカウント設定、プロフィール導線を含めない。
- DB設計では将来のユーザー所有を考慮する。
- Data Access層は後からユーザー絞り込みを追加できる形にする。
- Supabase Auth移行とRow Level Security方針は、将来のADRで定義する。
