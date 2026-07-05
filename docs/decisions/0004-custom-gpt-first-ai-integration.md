# ADR 0004: MVPのAI連携はCustom GPTを優先する

## Status

Accepted。

## Context

MVPでは、アプリ内にAI基盤を作り込まずに、AI支援のアクティブリコール体験を実現したいです。

初期のAI利用は、Custom GPTが深掘り質問と要約生成を担当し、Custom GPT Actions経由でWebアプリに学習ログを保存する形です。

## Decision

MVPでは、Webアプリ外のCustom GPTをAI支援役として使用し、保存時のみCustom GPT ActionsからWebアプリのRoute Handlerを呼び出します。

MVP中は、Webアプリからの直接のOpenAI API呼び出し、アプリ内チャット、問題生成、自動復習スケジュールを追加しません。

## Consequences

- アプリはGPT生成コンテンツを保存しやすいAPIと入力項目を提供する。
- Custom GPT用プロンプトは、`recall_logs` のデータ構造に合う出力を促す。
- AI生成コンテンツは、ユーザーが編集できるドラフトとして扱う。
- Custom GPT Actions向けRoute HandlerはBearer APIキーで保護する。
- 将来のアプリ内AI機能は、新しいADRを作成してから導入する。
