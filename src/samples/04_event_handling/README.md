# サンプル04：イベントハンドリング

## 何を学ぶか

- **onClick / onChange / onSubmit** などのイベント属性の使い方
- **イベントオブジェクト（e）** からデータを取得する方法
- イベントハンドラ関数の書き方パターン

---

## コードの解説

### イベントハンドラの基本

React では `on〇〇` という属性に**関数**を渡します。  
注意：関数を**呼び出さず**、**参照**を渡すことが重要です。

```tsx
// ✅ OK：関数の参照を渡す
<button onClick={handleClick}>クリック</button>

// ❌ NG：関数を即座に呼び出してしまう（レンダリング時に実行される）
<button onClick={handleClick()}>クリック</button>
```

### 引数を渡したいとき

アロー関数で包みます。

```tsx
function handleDelete(id: number) {
  // id を使った処理
}

// id を渡すためにアロー関数で包む
<button onClick={() => handleDelete(item.id)}>削除</button>
```

### onChange で入力値を取得

```tsx
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  // e.target.value に入力されたテキストが入っています
  console.log(e.target.value)
}

<input onChange={handleChange} />
```

### フォームの送信（onSubmit）

```tsx
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  // これを呼ばないとページがリロードされる
  e.preventDefault()

  // フォームの処理...
}

<form onSubmit={handleSubmit}>
  <button type="submit">送信</button>
</form>
```

---

## 主なイベント一覧

| イベント属性 | 発火するタイミング |
|------------|-----------------|
| `onClick` | クリックされたとき |
| `onChange` | 入力値が変わったとき |
| `onSubmit` | フォームが送信されたとき |
| `onFocus` | フォーカスが当たったとき |
| `onBlur` | フォーカスが外れたとき |
| `onMouseMove` | マウスが動いたとき |
| `onKeyDown` | キーが押されたとき |

---

## 確認問題

1. キーボードの Enter キーが押されたとき（`onKeyDown`）にログを表示してみましょう
2. ボタンに `onMouseEnter` / `onMouseLeave` を追加して、ホバー時に色が変わるようにしてみましょう
3. テキストボックスの入力が 10 文字を超えたらエラーメッセージを表示してみましょう
