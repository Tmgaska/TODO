# Contribution Guide

本プロジェクトでは新機能、不具合修正、ドキュメント修正などの貢献して頂ける方を歓迎しています。  

## クイックスタート

新しい機能の提案、不具合の報告、ドキュメントの修正などがある場合は、プルリクエストもしくはIssueにて報告してください。  
どこに報告していいかわからない場合も、Issueにて報告してください。  

## プルリクエストのガイドライン

迅速なレビューが行えるように、以下のガイドラインに従ってください。

- 1つのプルリクエストに対して、複数の目的は含めないでください。
- 理由もなく空白や改行文字を変更することはやめてください。
- 可能な限り`Conventional Commits`のルールに従い、コミットしてください。  
https://www.conventionalcommits.org/ja/v1.0.0/

## スタイルガイド

### 推奨

本プロジェクトでは、特別な理由がない限り`VSCode`の利用を推奨します。
`VSCode`を利用している方は、`prettier`・`ESLint`を拡張機能としてインストールすることで、保存する度にフォーマットされます。  
その他のエディタを利用している方は、コミット時に`ESLint`で検証が行われるため、エラーがないことを確認し、プルリクエストを発行してください。  

### 推奨するVSCodeの拡張機能

- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### ルール

`ESLint`の`recommended`に基づいています。  
- https://eslint.org/docs/rules/
