# サンプル10：カスタムフック

## カスタムフックとは？

カスタムフックは、**`use` で始まる関数**で、内部で他の React フックを呼び出します。
コンポーネントからロジックを分離し、複数のコンポーネントで**再利用**できるようにします。

```tsx
// カスタムフックの最小例
function useCounter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset = () => setCount(0)

  return { count, increment, decrement, reset }
}

// 使う側
function CounterComponent() {
  const { count, increment, decrement } = useCounter()

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

---

## ロジックの分離と再利用

### なぜカスタムフックが必要か？

コンポーネント内にロジックを直接書くと：
- コンポーネントが肥大化して読みにくくなる
- 同じロジックを別のコンポーネントでも使いたいとき、コードが重複する
- テストがしにくい

カスタムフックを使うと：
- コンポーネントはUIの描画に集中できる
- ロジックを複数のコンポーネントで共有できる
- ロジックを独立してテストできる

---

## カスタムフックのルール

1. **`use` で始める名前をつける**（例：`useCounter`、`useForm`、`useFetch`）
2. **フックのルールに従う**：コンポーネントのトップレベルでのみ呼び出す
3. **値と関数を返す**：state と操作関数をまとめてオブジェクトや配列で返す

---

## 実装例

### useCounter

```tsx
type UseCounterOptions = {
  initial?: number
  min?: number
  max?: number
  step?: number
}

function useCounter(options: UseCounterOptions = {}) {
  const { initial = 0, min = -Infinity, max = Infinity, step = 1 } = options
  const [count, setCount] = useState(initial)

  const increment = () => setCount(c => Math.min(c + step, max))
  const decrement = () => setCount(c => Math.max(c - step, min))
  const reset = () => setCount(initial)

  return {
    count,
    increment,
    decrement,
    reset,
    isMin: count <= min,
    isMax: count >= max,
  }
}
```

### useForm

```tsx
function useForm<T extends Record<string, string>>(
  initialValues: T,
  validate?: (values: T) => Record<string, string>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    if (validate) {
      const newErrors = validate(values)
      setErrors(prev => ({ ...prev, [name]: newErrors[name] ?? '' }))
    }
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return { values, errors, touched, handleChange, handleBlur, reset }
}
```

### useFetch

```tsx
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: T = await res.json()
        setData(json)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'エラー')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [url])

  return { data, loading, error }
}

// 使い方
function PostComponent({ id }: { id: number }) {
  const { data, loading, error } = useFetch<Post>(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  )

  if (loading) return <p>読み込み中...</p>
  if (error) return <p>エラー: {error}</p>
  if (!data) return null

  return <p>{data.title}</p>
}
```

---

## 注意点：状態は共有されない

同じカスタムフックを 2 つのコンポーネントで使っても、**状態はそれぞれ独立**しています。

```tsx
// ComponentA と ComponentB はそれぞれ独立したカウンターを持つ
function ComponentA() {
  const { count } = useCounter() // 独立した state
}

function ComponentB() {
  const { count } = useCounter() // 独立した state（ComponentA と共有されない）
}
```

状態を共有したい場合は **Context API** や状態管理ライブラリを使います。

---

## 確認問題

1. カスタムフックの命名規則は何ですか？その理由は？
2. `useCounter` を 2 つのコンポーネントで使った場合、状態は共有されますか？
3. `useFetch` で同じ URL を渡した複数コンポーネントがあるとき、リクエストは何回発生しますか？
4. カスタムフックをテストするにはどうすればよいですか？

---

## 関連サンプル

- [サンプル09：API フェッチ](../09_fetch_api/README.md)（前のステップ）
- [サンプル11：Context API](../11_context/README.md)（次のステップ）
