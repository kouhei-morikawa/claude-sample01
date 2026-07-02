# サンプル03：useState でカウンター

## 何を学ぶか

- **useState** で状態（state）を管理する方法
- state が変わると **再レンダリング** される仕組み
- 複数の **state を組み合わせる** 方法

---

## コードの解説

### useState とは？

コンポーネント内でデータを「記憶」させるための React フックです。  
通常の変数（`let count = 0`）を変更しても画面は更新されませんが、  
`useState` を使うと値が変わるたびに自動で再レンダリングされます。

```tsx
import { useState } from 'react'

function Counter() {
  // [現在の値, 値を変える関数] = useState(初期値)
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>＋</button>
    </div>
  )
}
```

### 再レンダリングの仕組み

1. ユーザーがボタンをクリック
2. `setCount(count + 1)` が呼ばれる
3. React が新しい値を記憶する
4. コンポーネントが再実行される（再レンダリング）
5. 画面が最新の値で更新される

### 注意点：state を直接書き換えてはいけない

```tsx
// ❌ NG：直接書き換えても再レンダリングされない
count = count + 1

// ✅ OK：セッター関数を使う
setCount(count + 1)
```

### フックの制約

- フックはコンポーネントの **トップレベルだけ** で呼び出せます
- `if` 文や `for` ループの中では使えません

```tsx
// ❌ NG
if (someCondition) {
  const [value, setValue] = useState(0)
}

// ✅ OK（トップレベルに書く）
const [value, setValue] = useState(0)
```

---

## 確認問題

1. カウンターに「最大値（例：10）を超えないようにする」制限を追加してみましょう
2. カウンターが 0 未満にならないようにしてみましょう
3. `Counter` コンポーネントを2つ並べて、それぞれの state が独立していることを確認しましょう
