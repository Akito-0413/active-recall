<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Active Recall プロジェクト指示

## 実装前に必ず読むもの

コード変更前に、次の順番で読んでください。

1. `docs/vision.md`
2. `docs/requirements.md`
3. `docs/architecture.md`
4. `docs/specification.md`
5. `docs/development-rules.md`
6. `docs/decisions/` 配下の関連ADR
7. `node_modules/next/dist/docs/` 配下の関連Next.jsガイド

## プロダクト境界

Active Recallは、アクティブリコール用の学習内容を保存・復習するためのミニマルな学習アプリです。

MVPでは読書ベースの学習から始めます。

MVPに含めるもの:

- 本ベースの学習ログ。
- 手動登録。
- Custom GPT ActionsからGPT生成の要約ポイントを保存する機能。
- 未復習ログ一覧と復習済みフラグ。
- Supabase PostgreSQLへの永続化。
- シンプルで集中しやすい復習UI。

MVPに含めないもの:

- 認証。
- アプリ内OpenAI API呼び出し。
- 自動問題生成。
- 間隔反復スケジューリング。
- 会話全文保存。
- 動画、講義、記事、PDFの取り込み。

## アーキテクチャルール

- 最新のNext.js 16とSupabaseの公式ドキュメントを参照し、推奨されていない設計やAPIは採用しない。
- Next.js App Routerを使用する。
- Server Componentsをデフォルトにする。
- Client Componentsは必要なブラウザ側インタラクションに限定する。
- DBアクセスをUIコンポーネントから分離する。
- ユーザー入力は永続化前に検証する。
- Supabase Authを後から追加できるData Access設計にする。

## ドキュメントルール

- 主要なアーキテクチャ判断と技術選定は `docs/decisions/` にADRとして記録する。
- MVPスコープ、データモデル、外部API、認証前提が変わる場合はドキュメントを更新する。

## 検証

実装開始後は、完了報告前に適切なチェックを実行してください。

- `npm run lint`
- `npm run build`
