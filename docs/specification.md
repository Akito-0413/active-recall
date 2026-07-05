# Active Recall 仕様設計

## 1. 技術構成

```text
Next.js 16 App Router
├─ UI: App Router pages / Server Components / Client Components
├─ Actions: 手動フォーム向けServer Actionsまたは同等のサーバー処理
└─ API: Custom GPT Actions向けRoute Handlers

DB: Supabase PostgreSQL
連携: Custom GPT Actions
```

実装前に、Next.js 16とSupabaseの公式ドキュメントを確認し、推奨されていない設計やAPIは採用しません。

Next.js 16のRoute Handlersは `app` ディレクトリ内の `route.ts` で定義します。`page.tsx` と同じルートセグメント階層に `route.ts` を置くことはできません。

## 2. 実装方針

- UIの読み取り画面はServer Componentsを基本にする。
- フォーム、確認ダイアログ、復習済み操作など、ブラウザ側の状態が必要な箇所のみClient Componentsを使う。
- 手動登録・画面内更新は、Next.js公式推奨に沿ってServer Actionsまたはサーバー側処理を優先する。
- Custom GPT Actionsからの外部HTTP連携にはRoute Handlersを使用する。
- WebアプリからOpenAI APIを直接呼ばない。
- SupabaseへのDBアクセスはUIから分離し、Data Access層に集約する。

## 3. ディレクトリ構成案

```text
src/
  app/
    page.tsx
    logs/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
    review/
      page.tsx
    api/
      recall-logs/
        route.ts
        [id]/
          route.ts

  features/
    recall-logs/
      actions/
      components/
      services/
      types.ts
      validation.ts

  lib/
    supabase/
    security/
```

方針:

- `page.tsx` はルーティングとページ構成を担当する。
- 実装の中心は `features/recall-logs/` に分離する。
- Supabaseクライアント生成やDB操作は `lib/` と `features/recall-logs/services/` に閉じ込める。
- `lib/auth/` はMVPでは作らない。将来Supabase Authを導入するときに追加する。

## 4. データベース設計

MVPでは単一の `recall_logs` テーブルを主データとします。

### recall_logs

| カラム | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| id | uuid | yes | 主キー |
| book_title | text | yes | 本タイトル |
| summary_points | jsonb | yes | 要約ポイント配列。3から4件を基本とする |
| reflection | text | no | 自分の気づき |
| reviewed | boolean | yes | 復習済みフラグ。初期値はfalse |
| reviewed_at | timestamptz | no | 復習済みにした日時 |
| source | text | yes | `manual` または `custom_gpt` |
| source_type | text | yes | MVPでは `book` |
| created_at | timestamptz | yes | 作成日時 |
| updated_at | timestamptz | yes | 更新日時 |

### summary_points例

```json
["学び1", "学び2", "学び3"]
```

### 将来拡張

将来的にソース管理が複雑になった場合は、`learning_sources` と `learning_entries` へ分離するADRを作成してから移行します。

候補:

- `learning_sources`: 本、記事、動画、講義などの元資料。
- `learning_entries`: ソースから作られた学習単位。
- `review_sessions`: 復習履歴。
- `recall_questions`: AI生成のリコール問題。

## 5. Route Handlers

Route HandlersはCustom GPT Actionsから呼ばれる外部公開APIを担当します。

MVPで必須の外部公開API:

- `POST /api/recall-logs`

画面表示や手動フォームからの操作は、必要がない限り外部公開APIに寄せません。Next.js公式推奨に従い、Server ComponentsやServer Actionsで扱える処理はサーバー側アプリケーションフローとして実装します。

ただし、実装単純化のために同一のData Access層をRoute Handlersと画面処理で共有します。

### POST /api/recall-logs

目的:

- Custom GPT Actionsから学習ログを作成する。

認証:

- `Authorization: Bearer <API_KEY>` を必須にする。
- APIキーは環境変数に保存する。
- APIキーがない、または一致しない場合は `401 Unauthorized`。

リクエスト:

```json
{
  "bookTitle": "string",
  "summaryPoints": ["string"],
  "reflection": "string",
  "source": "custom_gpt"
}
```

処理:

- Bearer APIキーを検証する。
- リクエストボディを検証する。
- `source` が `custom_gpt` であることを確認する。
- `summaryPoints` が3から4件であることを確認する。
- `source_type` はMVPでは `book` として保存する。
- `reviewed` は `false` で保存する。
- 作成された学習ログを返す。

成功レスポンス:

```json
{
  "data": {
    "id": "uuid",
    "bookTitle": "string",
    "summaryPoints": ["string"],
    "reflection": "string",
    "reviewed": false,
    "source": "custom_gpt",
    "sourceType": "book",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

失敗レスポンス:

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

### GET /api/recall-logs

MVPでは外部公開APIとして必須ではありません。

必要になった場合のみ、ログ一覧取得用に追加します。追加する場合もBearer APIキーまたは将来の認証方針に従って保護します。

### GET /api/recall-logs/[id]

MVPでは外部公開APIとして必須ではありません。

必要になった場合のみ、ログ詳細取得用に追加します。

### PATCH /api/recall-logs/[id]

MVPでは外部公開APIとして必須ではありません。

画面からの復習済み更新は、Server Actionsまたはサーバー側処理を優先します。Route Handlerとして公開する場合は、`reviewed=true` のとき `reviewed_at` を現在日時に更新します。

### DELETE /api/recall-logs/[id]

MVPでは外部公開APIとして必須ではありません。

画面からの削除は、Server Actionsまたはサーバー側処理を優先します。Route Handlerとして公開する場合は、認証・認可方針を明確にしてから追加します。

## 6. External API

MVPの外部API連携はCustom GPT Actionsのみです。

Custom GPTの役割:

- ユーザーに学習内容を説明させる。
- 深掘り質問を行う。
- 内容を3から4個の要約ポイントに整理する。
- 保存前にユーザーへ確認する。
- ユーザー承認後、`POST /api/recall-logs` を呼び出す。

Webアプリ側のルール:

- OpenAI APIを直接呼ばない。
- GPTとの会話全文を保存しない。
- GPT出力は信頼せず、通常の外部入力として検証する。
- Bearer APIキーはサーバー環境変数で管理する。

OpenAPI定義はCustom GPT Actions設定時に別途作成します。

## 7. Validation Rules

### recall_logs作成

- `bookTitle` は必須。
- `bookTitle` は空白のみ不可。
- `bookTitle` には適切な最大長を設ける。
- `summaryPoints` は必須。
- `summaryPoints` は配列。
- `summaryPoints` は3から4件を基本とする。
- 各summary pointは空文字不可。
- 各summary pointには適切な最大長を設ける。
- `reflection` は任意。
- `reflection` には適切な最大長を設ける。
- `source` は `manual` または `custom_gpt`。
- Custom GPT Actions経由の作成では `source` は `custom_gpt` のみ許可する。
- `source_type` はMVPでは `book`。

### 復習状態更新

- `reviewed` はboolean。
- `reviewed=true` の場合、`reviewed_at` を現在日時にする。
- `reviewed=false` に戻す場合、`reviewed_at` はnullに戻す。

### 削除

- `id` はuuid形式。
- 存在しないidの場合はnot foundとして扱う。

## 8. UI仕様

### `/`

目的:

- 初期導線として `/logs` へ誘導する。

実装方針:

- MVPでは `/logs` へリダイレクト、またはログ一覧をそのまま表示する。

### `/logs`

目的:

- 学習ログ一覧を表示する。

表示内容:

- 本タイトル。
- 要約ポイントの先頭または短いプレビュー。
- 復習状態。
- 作成日時または更新日時。
- データ生成元。

操作:

- 新規手動登録へ移動。
- 詳細画面へ移動。
- 未復習ログのみの表示導線。

状態:

- 空状態。
- 読み込み中。
- エラー。
- データあり。

### `/logs/new`

目的:

- 学習ログを手動登録する。

入力項目:

- 本タイトル。
- 要約ポイント3から4件。
- 自分の気づき。

保存時:

- `source` は `manual`。
- `source_type` は `book`。
- `reviewed` は `false`。

### `/logs/[id]`

目的:

- 学習ログ詳細を表示する。

表示内容:

- 本タイトル。
- 要約ポイント。
- 自分の気づき。
- 復習状態。
- 復習済み日時。
- データ生成元。
- 作成日時・更新日時。

操作:

- 復習済みにする。
- 未復習に戻す。
- 削除する。

### `/review`

目的:

- 未復習ログを一覧表示し、復習処理を行う。

表示内容:

- 未復習の学習ログ。
- 本タイトル。
- 要約ポイントのプレビュー。
- 作成日時。

操作:

- 詳細画面へ移動。
- 復習済みにする。

## 9. Custom GPT連携仕様

### GPT側フロー

```text
ユーザー説明
↓
深掘り質問
↓
3から4個の要約ポイント作成
↓
保存確認
↓
Custom GPT ActionでAPI呼び出し
```

### API呼び出し条件

- ユーザーが保存を明示的に承認している。
- 本タイトルが取得できている。
- 要約ポイントが3から4件ある。
- Bearer APIキーが設定されている。

### 保存しないもの

- GPTとの会話全文。
- 深掘り質問の全履歴。
- ユーザーの未整理な長文説明全文。

## 10. セキュリティ仕様

- Custom GPT Actions向けAPIはBearer APIキーで保護する。
- APIキーは環境変数で管理し、クライアントへ露出しない。
- サーバー側のみでSupabaseへの書き込みを行う。
- Supabaseのsecret keyまたはservice role相当のキーを使う場合は、必ずサーバー専用に閉じ込める。
- SupabaseのData API、権限、RLS、APIキー種別は公式ドキュメントの最新推奨に従う。
- 将来Supabase Authを導入する場合は、CookieベースSSR構成とRLSを前提に別ADRを作成する。

## 11. 実装優先順位

1. `recall_logs` のDB設計とマイグレーション。
2. バリデーション定義。
3. Data Access層。
4. `POST /api/recall-logs`。
5. UI: `/logs`。
6. UI: `/logs/new`。
7. UI: `/logs/[id]`。
8. 復習状態更新。
9. UI: `/review`。
10. Custom GPT Actions用OpenAPI定義。

## 12. アクセシビリティ

- セマンティックな見出しを使う。
- フォームにはラベルとアクセシブルなエラー文を付ける。
- すべての操作をキーボードで扱えるようにする。
- 十分なコントラストを保つ。
- 色だけで復習状態を伝えない。
