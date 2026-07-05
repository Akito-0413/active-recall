# Active Recall アーキテクチャ

## 現在の技術スタック

- Next.js 16.2.10。
- React 19.2.4。
- TypeScript。
- Tailwind CSS 4。
- Supabase PostgreSQL。

コードを書く前に、AIエージェントは `node_modules/next/dist/docs/` 配下の関連するNext.jsガイドを必ず確認してください。

最新のNext.js 16とSupabaseの公式ドキュメントを参照し、推奨されていない設計やAPIは採用しないでください。

## アーキテクチャ目標

- MVPを小さく、読みやすく保つ。
- App Routerの規約に従う。
- データ読み書きは可能な限りサーバー側に寄せる。
- 永続化ロジックをUIコンポーネントから分離する。
- 将来的にSupabase Authを追加しやすくする。

## レイヤー構成

責務を次のように分けます。

- Route層: Next.jsのルート、レイアウト、読み込み状態、エラー状態。
- Feature UI層: 学習ログ一覧、詳細、手動登録、復習画面。
- Domain層: 型定義、エンティティ、バリデーション。
- Data Access層: Supabaseへのデータ操作。
- Integration層: Custom GPT Actionsから呼ばれるRoute Handler。

## ルーティング方針

App Routerを使用します。

MVPで想定する画面領域:

- 学習ログ一覧。
- 学習ログ詳細。
- 学習ログ手動登録。
- 未復習ログ一覧。
- Custom GPT Actions向けRoute Handler。

具体的なルート名は、実装時に現在のNext.js規約を確認して決めます。

## Server Components / Client Components 方針

次はServer Componentsを基本にします。

- データ取得。
- ページ構成。
- 読み取り中心の一覧・詳細表示。

次のみClient Componentsを使用します。

- インタラクティブなフォーム。
- ローカルUI状態。
- 必要な場合の楽観的フィードバック。
- ブラウザAPIが必要な操作。

Client Componentは小さく保ち、関連する機能の近くに配置します。

## データ永続化

Supabase PostgreSQLを主な永続化レイヤーにします。

Supabaseに関する設計や実装では、公式ドキュメントで現在推奨されているAPI、クライアント構成、セキュリティ方針を優先します。

MVPでは認証なしですが、スキーマ設計では将来のユーザー所有を考慮します。

- MVPを複雑にしない範囲で、将来の所有者情報を追加しやすくする。
- 「永遠に単一ユーザー」と決め打ちしない。
- データアクセス関数を通して、後からユーザー条件を追加できるようにする。

## データモデル方針

MVPの中核エンティティ:

- RecallLog。

将来、ソース種別や学習単位が複雑になった場合は、ADRを作成したうえで `LearningSource` と `LearningEntry` へ分離します。

将来のエンティティ:

- LearningSource。
- LearningEntry。
- UserProfile。
- RecallQuestion。
- ReviewSession。
- ReviewSchedule。
- SourceImport。

## 認証方針

MVP:

- ログインなし。
- ユーザーフローにSupabase Authを含めない。

将来:

- Supabase Authを追加する。
- 学習ログにユーザー所有を追加する。
- Row Level Securityを適用する。
- Data Access層で現在ユーザーによる絞り込みを行う。

## Custom GPT連携方針

MVPではCustom GPT ActionsからRoute Handlerへ学習ログを保存します。

- Custom GPTが深掘り質問を行う。
- Custom GPTが3から4個の要約ポイントを作る。
- ユーザーが保存を承認する。
- Custom GPT Actionsが `POST /api/recall-logs` を呼ぶ。
- Route HandlerがBearer APIキーと入力データを検証する。
- Webアプリが要約ログだけを保存する。
- WebアプリからOpenAI APIを直接呼ばない。
- GPTとの会話全文は保存しない。

将来的には次を検討できます。

- アプリ内OpenAI API連携。
- AIによるリコール問題生成。
- AIによる回答評価。
- Supabase AuthとユーザーごとのGPT連携保護。

## スタイリング方針

- Tailwind CSS 4を使用する。
- ミニマルで落ち着いた、コンテンツ優先のUIにする。
- 学習画面をマーケティングページのようにしない。
- 余白、タイポグラフィ、フォームのパターンを統一する。

## エラーハンドリング

- 書き込み前に入力を検証する。
- ユーザー向けエラーは該当フォームや領域の近くに表示する。
- サーバー側の失敗は実装に応じて記録する。
- UIにシークレットや生のDBエラーを出さない。

## テスト方針

最初は重要箇所に絞ってテストします。

- バリデーション。
- データアクセス関数。
- 主要ページのレンダリング。
- 作成・編集・削除の主要フロー。

認証、AI連携、復習スケジュールを追加する段階でテスト範囲を広げます。

## デプロイ前提

- ホスティングはVercelを想定します。
- PostgreSQLはSupabaseを想定します。
- 環境変数を導入したら必ずドキュメント化します。
- デプロイ前に本番ビルドを通します。
