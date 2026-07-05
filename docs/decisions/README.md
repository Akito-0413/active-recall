# Architecture Decision Records

このディレクトリには、Active RecallのADRを保存します。

ADRは、将来のAIエージェントや開発者が「なぜその技術・設計を選んだのか」を追跡するための記録です。

## ADRを書く対象

次のような判断はADRに残してください。

- アーキテクチャ方針。
- 技術選定。
- データ所有や認証方針。
- 外部API連携。
- 長期的なプロダクト方向に影響する設計判断。

## フォーマット

各ADRには次を含めます。

- Status。
- Context。
- Decision。
- Consequences。

## 命名規則

数値プレフィックスと短いkebab-caseタイトルを使います。

- `0001-use-nextjs-app-router.md`。
- `0002-use-supabase-postgresql.md`。

## Status

- Proposed。
- Accepted。
- Superseded。
- Deprecated。
