# 007: GitHub Actionsによる品質担保

## 背景

PRごとにlint、build、主要テストを自動実行して、品質を継続的に担保したいです。

## やりたいこと

- GitHub Actionsでlintを自動実行する。
- GitHub Actionsで本番buildを自動実行する。
- E2Eテストを導入・自動実行する。
- Vercel PreviewとGitHub Actionsの役割を整理する。

## 受け入れ条件

- PR作成時にlintとbuildが自動実行される。
- 失敗した場合にPR上で検知できる。
- E2Eテスト対象の主要フローが定義されている。
- Vercel Preview DeployとCIの責務がREADMEまたはdocsに記載されている。

## 注意点

- E2Eは最初から広げすぎない。
- 環境変数やSupabase接続情報をGitHub Secretsで安全に扱う。
- Custom GPT Actionsの実通信テストは、CIで行うか手動確認にするか分けて考える。
