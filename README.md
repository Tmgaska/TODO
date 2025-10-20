<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======
# typescript-package-starter

TypeScript で npm パッケージを作成するためのスターターテンプレートです。 Docker 対応です。

- [typescript-package-starter](#typescript-package-starter)
  - [スターターテンプレートを用いた TypeScript のパッケージ開発](#スターターテンプレートを用いた-typescript-のパッケージ開発)
    - [1. リポジトリーの作成](#1-リポジトリーの作成)
    - [2. Docker 設定変更](#2-docker-設定変更)
    - [3. `packages.json` の編集](#3-packagesjson-の編集)
    - [4. `npm install`](#4-npm-install)
    - [5. 実装](#5-実装)
      - [注意事項](#注意事項)
    - [6. コンパイル](#6-コンパイル)
      - [Storybook](#storybook)
    - [7. npm パッケージ公開](#7-npm-パッケージ公開)
    - [付録: パッケージを使う側の設定](#付録-パッケージを使う側の設定)
      - [参考リンク（Tips）](#参考リンクtips)
        - [Working with the npm registry](#working-with-the-npm-registry)
        - [package.json の exports フィールドについて](#packagejson-の-exports-フィールドについて)
  - [Copyrights](#copyrights)

## スターターテンプレートを用いた TypeScript のパッケージ開発

### 1. リポジトリーの作成

リポジトリー作成時、`Repository template` は 以下を使用してください。

- REACT 部品を用いないピュアスクリプトの場合は `uni-face/typescript-package-starter` を選択してください。
- REACT 部品を実装する場合は `uni-face/react-package-starter` を選択してください。

### 2. Docker 設定変更

※ Docker を使用しない場合は不要です。

`docker-compose.yml` の `container_name` を、他のコンテナ名と重複しないように編集します。
（例）「`uniface-<<github のリポジトリー名>>`」

### 3. `packages.json` の編集

| 項目             | 修正内容                               | 備考 |
| :--------------- | :------------------------------------- | :--- |
| `name`           | `@uniface/<<github のリポジトリー名>>` |      |
| `version`        | パッケージの初期バージョン             |      |
| `description`    | パッケージの説明                       |      |
| `repository.url` | github の URL                          |      |

### 4. `npm install`

`npm install` で関連パッケージをインストールします。
プロジェクト固有で必要なパッケージがあれば追加でインストールします。

必要に応じて `peerDependencies` を使用してください。
パッケージが参照するライブラリーの指定バージョンより、親となるアプリケーションの指定バージョンを優先したい場合に使います。

<https://qiita.com/cognitom/items/acc3ffcbca4c56cf2b95>

### 5. 実装

コードを実装します。

#### 注意事項

`import TimeSpan from '~/TimeSpan'` のように「~」で始まるパス表記をしたとき、親アプリケーションの `tsconfig.json` の設定によってはビルド時にエラーになることがあります。
`import TimeSpan from '../TimeSpan'` のように通常の相対パスとすることを推奨します。

### 6. コンパイル

`npm run build` でコンパイルします。エラーがなければ、`dist` フォルダーにファイルが出力されます。

#### Storybook

`uni-face/react-package-starter` から作成したプロジェクトの場合、Storybook を使用できます。
`npm run storybook` で実行できます。

### 7. npm パッケージ公開

`npm publish` でパッケージを公開します。
成功すると、github 上からパッケージを参照できます。

### 付録: パッケージを使う側の設定

プロジェクトのルートに `.npmrc` というファイルを作成し、以下の内容を記述します。

```text
@uni-face:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<<ACCESS_TOKEN>>
legacy-peer-deps=true
```

`<<ACCESS_TOKEN>>` は認証用のアクセストークンで、2022/12/06 時点では以下の値です。

```text
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
```

ファイル作成後は、通常のパッケージと同様に `npm install @uni-face/<<PACKAGE_NAME>>` でパッケージをインストールできます。

※`legacy-peer-deps=true` は、npm@8 で `npm install` するとバージョン競合でエラーとなるため追加しているオプションです。（Docker 環境で確認済み）

#### 参考リンク（Tips）

##### Working with the npm registry

<https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry>

##### package.json の exports フィールドについて

<https://zenn.dev/makotot/articles/5edb504ef7d2e6>

## Copyrights

Copyright© 2022 uni-face.co.,ltd All Rights Reserved.
>>>>>>> c597a1a31c8f5e9444db62c566c3dec8c13dea66
