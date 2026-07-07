# サンプル15：Todo アプリ（総合演習）

## このプロジェクトで学んだことの総まとめ

このサンプルは、サンプル01〜14で学んだ React の概念を組み合わせた**総合演習**です。
実際に動作する Todo アプリを通じて、複数の概念がどのように連携するかを学びます。

---

## 使用している技術と役割

| 技術 | 役割 |
|-----|-----|
| `useReducer` | Todo の追加・切替・削除の状態管理 |
| `useEffect` | localStorage との同期（永続化） |
| `useState` | フィルター・フォームの UI 状態管理 |
| `useCallback` | ハンドラー関数のメモ化（パフォーマンス最適化） |
| `useMemo` | フィルタリング・統計計算のキャッシュ |
| カスタムフック | `usePersistentTodos` でロジックを分離 |
| TypeScript | 型定義による安全な開発 |
| Tailwind CSS | スタイリング |

---

## 複数の概念の組み合わせ方

### 1. 状態設計

```tsx
// 複雑な状態は useReducer で管理
type State = {
  todos: Todo[]
  nextId: number
}

// 操作は Action として表現
type Action =
  | { type: 'ADD'; todo: Omit<Todo, 'id' | 'createdAt'> }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number }
  | { type: 'CLEAR_COMPLETED' }
```

### 2. 永続化（useEffect + localStorage）

```tsx
function usePersistentTodos() {
  const [state, dispatch] = useReducer(todoReducer, INITIAL_STATE)
  const [loaded, setLoaded] = useState(false)

  // 初回：localStorage から読み込む
  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      dispatch({ type: 'LOAD', payload: JSON.parse(saved) })
    }
    setLoaded(true)
  }, [])

  // state が変わるたびに保存
  useEffect(() => {
    if (!loaded) return  // 読み込み前は保存しない
    localStorage.setItem('todos', JSON.stringify(state))
  }, [state, loaded])

  return { state, dispatch }
}
```

### 3. パフォーマンス最適化

```tsx
// useMemo：フィルタリングは毎回計算せずキャッシュ
const filtered = useMemo(() => {
  return todos.filter(todo => {
    const matchesStatus = filter === 'all' || ...
    const matchesCategory = categoryFilter === 'all' || ...
    return matchesStatus && matchesCategory
  })
}, [todos, filter, categoryFilter])

// useCallback：dispatch をラップしたハンドラーを安定化
const handleToggle = useCallback((id: number) => {
  dispatch({ type: 'TOGGLE', id })
}, [dispatch])
```

---

## 機能一覧

### タスク追加

```tsx
function handleAdd(todo: Omit<Todo, 'id' | 'createdAt'>) {
  dispatch({ type: 'ADD', todo })
}
```

### タスク完了/未完了（トグル）

```tsx
function handleToggle(id: number) {
  dispatch({ type: 'TOGGLE', id })
}
```

### タスク削除

```tsx
function handleDelete(id: number) {
  dispatch({ type: 'DELETE', id })
}
```

### フィルター機能

```tsx
// ステータスフィルター：all / active / completed
const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

// カテゴリーフィルター：all / work / personal / shopping / learning
const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')
```

### ローカルストレージでの永続化

```tsx
// 保存
localStorage.setItem('todos', JSON.stringify(state))

// 読み込み
const saved = localStorage.getItem('todos')
if (saved) {
  const parsed = JSON.parse(saved)
  // state を復元
}
```

---

## アーキテクチャ図

```
TodoAppMain（コンポーネント）
│
├── usePersistentTodos（カスタムフック）
│   ├── useReducer → state（todos, nextId）
│   └── useEffect × 2 → localStorage との同期
│
├── useState → filter, categoryFilter（UI 状態）
│
├── useMemo → filtered（フィルタリング結果）
├── useMemo → stats（統計）
│
├── useCallback → handleAdd, handleToggle, handleDelete
│
├── <TodoForm />  ← onAdd を受け取る
└── <TodoItem />  ← onToggle, onDelete を受け取る
     └── <CategoryBadge />
```

---

## 発展課題

1. **編集機能**：タスクのタイトルや詳細を編集できるようにする
2. **並べ替え**：作成日時・カテゴリー・完了状態で並べ替える
3. **期限**：タスクに期限を追加し、期限切れを警告表示する
4. **サブタスク**：タスクに子タスクを追加できるようにする
5. **共有**：サーバーと同期して複数デバイスで共有できるようにする

---

## 確認問題

1. Todo の編集機能を追加するには、どんな Action と Reducer が必要ですか？
2. 複数ユーザーで Todo を共有するには、localStorage の代わりに何を使いますか？
3. タスクの数が 1000 件を超えた場合、パフォーマンスを改善するにはどうしますか？
4. `usePersistentTodos` をカスタムフックに分離することで得られるメリットは何ですか？

---

## 関連サンプル

- [サンプル14：React Router](../14_router/README.md)（前のステップ）
- [LEARNING.md](../../../LEARNING.md) — カリキュラム全体
