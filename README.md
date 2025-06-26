# 献立自動作成アプリ

## 概要

このアプリケーションは、ユーザーの身体情報や好みに基づいて、1週間分の献立を自動で提案し、買い物リストを生成するWebアプリケーションです。

## 機能要件

### 1. ユーザー管理・認証機能

- **目的**: ユーザーアカウントを管理し、パーソナライズされた体験を提供するための基本機能。
- **要件**:
  - **新規登録**:
    - ユーザーはメールアドレスとパスワードを使用して新規アカウントを登録できる。
    - 登録時に`users`テーブルにユーザー情報が、`meal_plans`テーブルに初期プランのレコードが作成される。
  - **ログイン**:
    - 登録済みのユーザーはメールアドレスとパスワードでログインできる。
    - セッション管理を行い、ログイン状態を維持する。
  - **データ連携**:
    - 以降のすべての機能（献立、買い物リスト等）は、ログインしているユーザーIDに紐づけてデータを管理する。

### 2. マイページ・身体情報管理機能

- **目的**: 献立作成の基礎となるユーザーの身体情報を管理する。
- **要件**:
  - **情報登録・更新**:
    - ユーザーはマイページ編集画面で、以下の情報を入力・更新できる。
      - 年齢
      - 性別
      - 身長 (cm)
      - 体重 (kg)
      - 体脂肪率 (%)
  - **データ永続化**:
    - 入力された情報は`currentphysical_infos`テーブルに保存される。
    - ユーザーごとに常に1つの最新レコードを保持するため、初回保存時は`INSERT`、2回目以降は`UPDATE`処理を行う（`upsert`ロジック）。

### 3. 献立提案機能

- **目的**: ユーザーに対して1週間分の食事プランを提示し、日々の食生活をサポートする。
- **要件**:
  - **週次メニュー表示 (1wsgtdmenu)**:
    - ログイン後、1週間分（月〜日）の「朝食」「昼食」「夕食」のメニュー名一覧を表示する。
    - 各日の総摂取カロリー（kcal）を算出して表示する。
    - 新規ユーザーには空のメニューが表示され、「メニュー生成」ボタンを押すことで献立がランダムに生成される。
    - 既存ユーザーは「メニューリセット」ボタンで献立を再生成できる。
  - **日次メニュー詳細表示 (1dsgtdmenu)**:
    - 週次メニュー画面で特定の日付をクリックすると、その日の詳細画面へ遷移する。
    - 朝・昼・晩の各食事について、以下の詳細情報を表示する。
      - レシピ名
      - 材料一覧（食材名、数量、単位）
      - 作り方の手順（番号付きテキスト）
      - 摂取カロリー

### 4. 買い物リスト機能

- **目的**: 提案された1週間の献立に基づいて、必要な買い物を効率化する。
- **要件**:
  - **リスト自動生成・表示 (1wlist)**:
    - 1週間分の献立から必要な全ての食材を自動で集計し、`shopping_list`テーブルに保存する。
    - 集計した買い物リストを一覧で表示する。
    - 各項目にはチェックボックスを設け、ユーザーは購入済みのアイテムをマークできる。この状態は永続化する。
  - **リスト編集 (1wlistedit)**:
    - ユーザーは買い物リストの各アイテムに対して、以下の編集操作ができる。
      - 数量の変更（直接入力）
      - アイテムの削除
    - 編集内容は`shopping_list`テーブルに即時反映される。

## 仕様設計

- https://docs.google.com/spreadsheets/d/1msx5gVZ0pvZp7j415ktE5ewMw2zvCkBNXt4rgQzte-Y/edit?gid=577430712#gid=577430712

## 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/)
- **バックエンド/DB**: [Supabase](https://supabase.com/)
- **UIライブラリ**: (今回は基本的なスタイルのみ使用)
- **認証**: [NextAuth.js](https://next-auth.js.org/)
- **デプロイ**: [Vercel](https://vercel.com/)
-

## Figmaデザイン

https://www.figma.com/design/EaAs7sB4RjdhUJPBavAgas/Untitled?node-id=0-1&t=P3Z5abqCTZsxflgK-1

## supabaseER図

![alt text](<supabase-schema-kdtwtajwlcuodjevrwxq (4).png>)

## デモURL

https://genu-pjt-ynod.vercel.app/signin

## デモ用アカウント

- ID：test2@gmail.com
- PASS：123456

---

このプロジェクトは、[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) を使って作成された [Next.js](https://nextjs.org) プロジェクトです。

## はじめに

まず、開発サーバーを起動します:

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションの画面が表示されます。

`app/page.tsx` を編集することでページの内容を変更できます。ファイルを保存すると、ページは自動的にリロードされます。

このプロジェクトでは [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) を使用して、[Geist](https://vercel.com/font) フォントを自動的に最適化・読み込みしています。

## さらに学ぶ

Next.jsについて詳しく知りたい場合は、以下のリソースをご覧ください。

- [Next.js ドキュメント](https://nextjs.org/docs) - Next.jsの機能やAPIについて学べます。
- [Learn Next.js](https://nextjs.org/learn) - インタラクティブなNext.jsチュートリアル。

[Next.jsのGitHubリポジトリ](https://github.com/vercel/next.js) もご覧いただけます。フィードバックやコントリビューションも歓迎です！

## Vercelでのデプロイ

Next.jsアプリをデプロイする最も簡単な方法は、Next.jsの開発元である[Vercelプラットフォーム](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)を利用することです。

デプロイの詳細については、[Next.jsのデプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying)をご覧ください。
