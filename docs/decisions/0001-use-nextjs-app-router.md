# ADR 0001: Next.js App Routerを使用する

## Status

Accepted。

## Context

このプロジェクトはNext.js 16.2.10で初期化されており、すでに `src/app` ディレクトリがあります。

また、プロジェクトの指示として、このNext.jsバージョンは古い知識と異なる可能性があるため、実装前にローカルのNext.jsドキュメントを読む必要があります。

## Decision

ルーティングとレンダリングの基盤としてNext.js App Routerを使用します。

AIエージェントは、Next.js固有の挙動を実装する前に `node_modules/next/dist/docs/` 配下の関連ドキュメントを確認します。

## Consequences

- 読み取り中心のUIはServer Componentsを基本にする。
- Client Componentsはブラウザ側インタラクションが必要な箇所に限定する。
- ルーティング、loading、error、metadata、Route Handlerの挙動はインストール済みNext.jsドキュメントに従う。
- 将来のADRで明示的に変更されない限り、Pages Routerのパターンを導入しない。
