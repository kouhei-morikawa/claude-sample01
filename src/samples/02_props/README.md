# サンプル02：Props（プロパティ）の基本

## 何を学ぶか

- **Props** を使って親から子へデータを渡す方法
- TypeScript での **Props の型定義**
- Props を活用した **コンポーネントの再利用**

---

## コードの解説

### Props とは？

コンポーネントに渡すデータのことを **Props（プロパティ）** と呼びます。  
関数の引数と同じ仕組みで、HTML 属性のように記述します。

```tsx
// 子コンポーネントの定義
function ProfileCard({ name, role }: { name: string; role: string }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  )
}

// 親コンポーネントから Props を渡す
function App() {
  return <ProfileCard name="田中 花子" role="エンジニア" />
}
```

### TypeScript での型定義

`type` または `interface` で Props の型を宣言すると、  
型の間違いをコンパイル時に検出できます。

```tsx
type ProfileCardProps = {
  name: string   // 必須
  role: string   // 必須
  color?: string // 省略可能（? をつける）
}
```

### デフォルト値の設定

省略可能な Props にはデフォルト値を設定できます。

```tsx
function ProfileCard({ color = '#f8f9fa' }: ProfileCardProps) {
  // color が渡されなければ '#f8f9fa' が使われる
}
```

### Props の注意点

- Props は **読み取り専用** です — 子コンポーネントで書き換えることはできません
- データは **親 → 子** の一方向にしか流れません（単方向データフロー）

---

## 確認問題

1. `ProfileCard` に `age: number` の Props を追加して表示してみましょう
2. `color` を省略したときに何が起きるか確認してみましょう
3. Props に存在しないキーを渡したら TypeScript がどんなエラーを出すか確認してみましょう
