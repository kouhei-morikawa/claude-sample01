# サンプル13：React.memo / useCallback / useMemo

## 不要な再レンダリングとは

React では、コンポーネントの **state や props が変わる**と再レンダリングが発生します。
さらに、**親が再レンダリングされると、子コンポーネントも再レンダリング**されます。

```
親が再レンダリング
  ↓
子コンポーネントも全て再レンダリング（props が変わっていなくても！）
```

これが「不要な再レンダリング」です。

---

## React.memo でのコンポーネント最適化

`React.memo` でラップすると、**props が変わらない限り再レンダリングをスキップ**します。

```tsx
import { memo } from 'react'

// ❌ memo なし：親が再レンダリングされると常に再レンダリング
function ChildComponent({ value }: { value: number }) {
  return <div>{value}</div>
}

// ✅ memo あり：props が変わらない限りスキップ
const ChildComponent = memo(function ChildComponent({ value }: { value: number }) {
  return <div>{value}</div>
})
```

### 注意点

```tsx
// ❌ 毎回新しいオブジェクトを渡すと memo が意味をなさない
<MemoComponent style={{ color: 'red' }} />  // 毎回新しいオブジェクト

// ✅ 安定した参照を渡す
const style = { color: 'red' }  // コンポーネント外で定義
<MemoComponent style={style} />
```

---

## useCallback での関数の最適化

関数は毎レンダリングで新しく作られるため、`memo` で包んだ子コンポーネントに
関数を渡すと毎回再レンダリングが発生します。
`useCallback` で関数をメモ化することで解決できます。

```tsx
function ParentComponent() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)

  // ❌ useCallback なし：other が変わっても毎回新しい関数が作られる
  const handleClick = () => setCount(c => c + 1)

  // ✅ useCallback あり：依存配列が変わらない限り同じ関数参照
  const memoizedClick = useCallback(() => {
    setCount(c => c + 1)
  }, [])  // 依存なし → 常に同じ関数

  return (
    <>
      <MemoChild onClick={handleClick} />    {/* other が変わると再レンダリング */}
      <MemoChild onClick={memoizedClick} />  {/* other が変わっても再レンダリングしない */}
      <button onClick={() => setOther(o => o + 1)}>other +1</button>
    </>
  )
}
```

---

## useMemo での値の最適化

重い計算処理を毎回実行せず、**依存する値が変わったときだけ再計算**します。

```tsx
function ExpensiveComponent({ items, filter }: Props) {
  // ❌ useMemo なし：items や filter と無関係の state が変わっても毎回計算
  const filtered = items.filter(item => item.includes(filter))

  // ✅ useMemo あり：items か filter が変わったときだけ再計算
  const filtered = useMemo(() => {
    return items.filter(item => item.includes(filter))
  }, [items, filter])  // 依存配列に再計算のトリガーを指定

  return <ul>{filtered.map(item => <li key={item}>{item}</li>)}</ul>
}
```

---

## 3 つの API まとめ

| API | 対象 | 使い方 |
|-----|-----|-------|
| `React.memo` | コンポーネント | `memo(Component)` でラップ |
| `useCallback` | 関数 | `useCallback(fn, [deps])` |
| `useMemo` | 計算結果（値） | `useMemo(() => 計算, [deps])` |

---

## 過剰な最適化に注意

```tsx
// ❌ 過剰な最適化：軽い計算には不要
const value = useMemo(() => count * 2, [count])  // これは意味がない

// ✅ 適切な最適化：重い計算にのみ使う
const sortedList = useMemo(() => {
  return largeArray.sort((a, b) => expensiveCompare(a, b))
}, [largeArray])
```

**原則：最初から最適化しない。パフォーマンス問題が実際に発生してから対処する。**

---

## 確認問題

1. React.memo でメモ化されたコンポーネントが再レンダリングされるのはどんな場合ですか？
2. useCallback を使っても memo の子コンポーネントが再レンダリングされる場合があります。どんな場合ですか？
3. useMemo の依存配列が空（`[]`）の場合、どんな挙動になりますか？
4. 毎回 `{ color: 'red' }` のようなオブジェクトを props に渡した場合、memo は効果がありますか？

---

## 関連サンプル

- [サンプル12：useReducer](../12_reducer/README.md)（前のステップ）
- [サンプル14：React Router](../14_router/README.md)（次のステップ）
