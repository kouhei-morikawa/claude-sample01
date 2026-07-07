# サンプル07：useEffect

## useEffect とは？

`useEffect` は React のフックで、コンポーネントがレンダリングされた **後** に実行したい処理を記述します。

```tsx
import { useEffect } from 'react'

useEffect(() => {
  // レンダリング後に実行したい処理
})
```

### どんなときに使う？

- **DOM の操作**（document.title の更新など）
- **API からデータを取得**するとき
- **タイマー**（setTimeout / setInterval）の設定
- **イベントリスナー**の登録（resize, scroll など）
- **外部ライブラリ**の初期化

---

## 依存配列（dependency array）

`useEffect` の第二引数に配列を渡すことで、実行タイミングを制御できます。

### パターン1：依存配列なし — 毎レンダリング後に実行

```tsx
useEffect(() => {
  document.title = `カウント: ${count}`
}) // ← 第二引数なし
```

毎回のレンダリング後に実行されます。パフォーマンスの観点から、基本的には使用を避けます。

---

### パターン2：空の配列 `[]` — マウント時のみ実行

```tsx
useEffect(() => {
  console.log('コンポーネントが表示されました')
}, []) // ← 空の配列
```

コンポーネントが画面に表示された最初の1回だけ実行されます。  
データの初回取得や外部ライブラリの初期化に使います。

---

### パターン3：値あり — 特定の値が変わったときだけ実行

```tsx
useEffect(() => {
  // query が変わるたびに検索を実行
  fetchData(query)
}, [query]) // ← query が変化したときに実行
```

依存配列に指定した値が変わるたびに実行されます。  
複数の値を指定することもできます：`[userId, page]`

---

## クリーンアップ関数

`useEffect` 内で **関数を返す** と、それがクリーンアップ関数になります。

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1)
  }, 1000)

  // ← クリーンアップ関数を return する
  return () => {
    clearInterval(timer) // タイマーを止める
  }
}, [isRunning])
```

### クリーンアップ関数が呼ばれるタイミング

1. **アンマウント時** — コンポーネントが画面から消えるとき
2. **次のエフェクト実行前** — 依存配列の値が変わって再実行される前

---

## よくある使用パターン

### API フェッチ（デバウンス付き）

```tsx
useEffect(() => {
  if (!query) return

  setIsLoading(true)
  const timer = setTimeout(async () => {
    const data = await fetch(`/api/search?q=${query}`)
    setResult(await data.json())
    setIsLoading(false)
  }, 500) // 500ms 後に実行（入力中は待機）

  return () => clearTimeout(timer) // 前のタイマーをキャンセル
}, [query])
```

### イベントリスナーの登録

```tsx
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth)
  window.addEventListener('resize', handleResize)

  return () => window.removeEventListener('resize', handleResize) // 解除
}, [])
```

### ローカルストレージとの同期

```tsx
useEffect(() => {
  localStorage.setItem('todos', JSON.stringify(todos))
}, [todos]) // todos が変わるたびに保存
```

---

## 注意点

```tsx
// ❌ NG：useEffect 内で直接 state を更新すると無限ループになる
useEffect(() => {
  setCount(count + 1) // count が変わる → 再レンダリング → useEffect 実行 → ...
}, [count])

// ✅ OK：セッター関数を使うか、依存配列を適切に設定する
useEffect(() => {
  document.title = `${count}` // count を読むだけ（更新しない）
}, [count])
```

---

## 確認問題

1. `useEffect` の第二引数（依存配列）を省略するとどうなりますか？
2. 依存配列を `[]` にすると、エフェクトはいつ実行されますか？
3. クリーンアップ関数はどのように書きますか？また、いつ実行されますか？
4. タイマー（`setInterval`）を使うとき、クリーンアップ関数が必要な理由は何ですか？
5. `useEffect` 内で API フェッチをするときに `async/await` を直接使えない理由と、代替の書き方を説明してください。

---

## 関連サンプル

- [サンプル03：useState](../03_state_counter/README.md)
- [サンプル08：フォームバリデーション](../08_form_validation/README.md)（次のステップ）
