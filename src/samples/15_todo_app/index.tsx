/**
 * サンプル15: Todo アプリ（総合演習）
 *
 * このサンプルで学んだことの統合：
 * - useState：ローカル UI 状態
 * - useReducer：Todo の状態管理
 * - useEffect：ローカルストレージとの同期
 * - useCallback：ハンドラーの最適化
 * - useMemo：フィルター・統計計算
 * - カスタムフック：ロジック分離
 * - TypeScript：厳密な型定義
 * - Tailwind CSS：スタイリング
 */
import { useReducer, useState, useEffect, useCallback, useMemo } from 'react'

// =================================================
// 型定義
// =================================================

type Category = 'work' | 'personal' | 'shopping' | 'learning'

type Todo = {
  id: number
  title: string
  description: string
  category: Category
  completed: boolean
  createdAt: string  // ISO 8601
}

type Filter = 'all' | 'active' | 'completed'

type State = {
  todos: Todo[]
  nextId: number
}

type Action =
  | { type: 'LOAD'; payload: State }
  | { type: 'ADD'; todo: Omit<Todo, 'id' | 'createdAt'> }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number }
  | { type: 'CLEAR_COMPLETED' }

// =================================================
// 定数
// =================================================

const STORAGE_KEY = 'sample15_todos'

const CATEGORIES: { value: Category; label: string; color: string; icon: string }[] = [
  { value: 'work', label: '仕事', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '💼' },
  { value: 'personal', label: '個人', color: 'bg-green-100 text-green-700 border-green-200', icon: '🌿' },
  { value: 'shopping', label: '買い物', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '🛒' },
  { value: 'learning', label: '学習', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '📚' },
]

const INITIAL_TODOS: Todo[] = [
  { id: 1, title: 'React の基礎を復習する', description: 'useState と useEffect を重点的に', category: 'learning', completed: true, createdAt: new Date().toISOString() },
  { id: 2, title: '週次レポートを提出する', description: '金曜日の 17:00 まで', category: 'work', completed: false, createdAt: new Date().toISOString() },
  { id: 3, title: '牛乳と卵を買う', description: 'スーパーで', category: 'shopping', completed: false, createdAt: new Date().toISOString() },
]

const INITIAL_STATE: State = { todos: INITIAL_TODOS, nextId: 4 }

// =================================================
// Reducer
// =================================================

function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD':
      return action.payload

    case 'ADD':
      return {
        todos: [
          ...state.todos,
          {
            id: state.nextId,
            ...action.todo,
            createdAt: new Date().toISOString(),
          },
        ],
        nextId: state.nextId + 1,
      }

    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, completed: !t.completed } : t
        ),
      }

    case 'DELETE':
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.id),
      }

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(t => !t.completed),
      }

    default:
      return state
  }
}

// =================================================
// カスタムフック：ローカルストレージ連携
// =================================================

function usePersistentTodos() {
  const [state, dispatch] = useReducer(todoReducer, INITIAL_STATE)
  const [loaded, setLoaded] = useState(false)

  // 初回マウント：ローカルストレージから読み込む
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: State = JSON.parse(saved)
        dispatch({ type: 'LOAD', payload: parsed })
      }
    } catch {
      // 読み込み失敗時は初期値を使用
    } finally {
      setLoaded(true)
    }
  }, [])

  // state が変わるたびに保存（読み込み完了後のみ）
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // 保存失敗時は無視
    }
  }, [state, loaded])

  return { state, dispatch, loaded }
}

// =================================================
// カテゴリーバッジ
// =================================================

function CategoryBadge({ category }: { category: Category }) {
  const cat = CATEGORIES.find(c => c.value === category)!
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cat.color}`}
    >
      {cat.icon} {cat.label}
    </span>
  )
}

// =================================================
// Todo フォーム
// =================================================

function TodoForm({ onAdd }: { onAdd: (todo: Omit<Todo, 'id' | 'createdAt'>) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('work')
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), description: description.trim(), category, completed: false })
    setTitle('')
    setDescription('')
    setCategory('work')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-blue-400 hover:text-blue-500 cursor-pointer transition-colors text-sm"
      >
        ＋ 新しいタスクを追加
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      <input
        autoFocus
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="タスクのタイトル（必須）"
        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
      />
      <input
        type="text"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="詳細（任意）"
        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setCategory(cat.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-colors ${
              category === cat.value
                ? cat.color + ' ring-2 ring-offset-1 ring-current'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          追加
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 text-slate-500 rounded-lg text-sm hover:bg-slate-100 cursor-pointer transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}

// =================================================
// Todo アイテム
// =================================================

function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
}) {
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${
        todo.completed
          ? 'bg-slate-50 opacity-70'
          : 'bg-white border border-slate-200 shadow-sm'
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        className="w-4 h-4 mt-0.5 accent-blue-600 cursor-pointer flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-snug ${
            todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
          }`}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{todo.description}</p>
        )}
        <div className="mt-1.5">
          <CategoryBadge category={todo.category} />
        </div>
      </div>
      <button
        onClick={onDelete}
        className="text-slate-300 hover:text-red-400 cursor-pointer transition-colors text-base leading-none flex-shrink-0 mt-0.5"
        aria-label="削除"
      >
        ✕
      </button>
    </div>
  )
}

// =================================================
// メインアプリ
// =================================================

function TodoAppMain() {
  const { state, dispatch, loaded } = usePersistentTodos()
  const [filter, setFilter] = useState<Filter>('all')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')

  const handleAdd = useCallback(
    (todo: Omit<Todo, 'id' | 'createdAt'>) => {
      dispatch({ type: 'ADD', todo })
    },
    [dispatch]
  )

  const handleToggle = useCallback(
    (id: number) => {
      dispatch({ type: 'TOGGLE', id })
    },
    [dispatch]
  )

  const handleDelete = useCallback(
    (id: number) => {
      dispatch({ type: 'DELETE', id })
    },
    [dispatch]
  )

  // フィルタリング（useMemo でキャッシュ）
  const filtered = useMemo(() => {
    return state.todos.filter(todo => {
      const matchesStatus =
        filter === 'all' ||
        (filter === 'active' && !todo.completed) ||
        (filter === 'completed' && todo.completed)
      const matchesCategory =
        categoryFilter === 'all' || todo.category === categoryFilter
      return matchesStatus && matchesCategory
    })
  }, [state.todos, filter, categoryFilter])

  // 統計（useMemo でキャッシュ）
  const stats = useMemo(() => ({
    total: state.todos.length,
    active: state.todos.filter(t => !t.completed).length,
    completed: state.todos.filter(t => t.completed).length,
  }), [state.todos])

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-10 text-slate-500 text-sm">
        読み込み中...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 統計 */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: '合計', value: stats.total, color: 'bg-slate-100 text-slate-700' },
          { label: '未完了', value: stats.active, color: 'bg-blue-50 text-blue-700' },
          { label: '完了', value: stats.completed, color: 'bg-green-50 text-green-700' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-lg py-2 px-3 ${stat.color}`}>
            <p className="text-xl font-bold tabular-nums">{stat.value}</p>
            <p className="text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* タスク追加フォーム */}
      <TodoForm onAdd={handleAdd} />

      {/* ステータスフィルター */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        {(['all', 'active', 'completed'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${
              filter === f
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f === 'all' ? 'すべて' : f === 'active' ? '未完了' : '完了済み'}
          </button>
        ))}
      </div>

      {/* カテゴリーフィルター */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors border ${
            categoryFilter === 'all'
              ? 'bg-slate-700 text-white border-slate-700'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          🗂 すべて
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors border ${
              categoryFilter === cat.value
                ? cat.color + ' ring-1 ring-current'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* リスト */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            <p className="text-3xl mb-2">🎉</p>
            <p>該当するタスクがありません</p>
          </div>
        ) : (
          filtered.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => handleToggle(todo.id)}
              onDelete={() => handleDelete(todo.id)}
            />
          ))
        )}
      </div>

      {/* フッター */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
        <span>表示中：{filtered.length} 件</span>
        {stats.completed > 0 && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
            className="hover:text-red-400 cursor-pointer transition-colors underline"
          >
            完了済みをすべて削除
          </button>
        )}
      </div>
    </div>
  )
}

// =================================================
// メインコンポーネント
// =================================================

function TodoAppDemo() {
  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">📋 Todo アプリ（総合演習）</h2>

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-6 leading-relaxed">
        これまでのサンプルで学んだ概念を組み合わせた<strong>総合演習</strong>です。
        実際に動作する Todo アプリをひとつのコンポーネントツリーで実装しています。
        データは <strong>localStorage</strong> に保存されるため、ページを再読み込みしても消えません。
      </p>

      {/* 使用技術一覧 */}
      <section className="mb-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-3">🛠 使用している技術</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { tech: 'useReducer', desc: 'Todo の追加・切替・削除' },
            { tech: 'useEffect', desc: 'localStorage との同期' },
            { tech: 'useState', desc: 'フィルター・フォームの UI 状態' },
            { tech: 'useCallback', desc: 'ハンドラー関数のメモ化' },
            { tech: 'useMemo', desc: 'フィルタリング・統計の計算' },
            { tech: 'カスタムフック', desc: 'usePersistentTodos で分離' },
          ].map(({ tech, desc }) => (
            <div key={tech} className="flex items-start gap-2 p-2 bg-white rounded-lg border border-slate-100">
              <code className="text-xs font-mono font-medium text-blue-600 flex-shrink-0">{tech}</code>
              <span className="text-xs text-slate-500">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Todo アプリ本体 */}
      <section className="mb-6 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4 text-slate-800">🎮 Todo アプリ</h3>
        <TodoAppMain />
      </section>

      {/* まとめ */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="font-semibold mb-2">📌 学習のまとめ</p>
        <p className="text-sm text-slate-700 leading-relaxed mb-3">
          このサンプルはサンプル01〜14で学んだ内容を統合しています。
          実際のアプリ開発では、これらの概念を組み合わせて問題を解決します。
        </p>
        <ul className="leading-loose pl-5 mb-0 text-sm">
          <li>状態の種類によって <strong>useState / useReducer</strong> を使い分ける</li>
          <li>重いロジックは <strong>カスタムフック</strong> に分離する</li>
          <li>不要な再計算は <strong>useMemo</strong> でキャッシュする</li>
          <li>永続化は <strong>useEffect</strong> で外部ストレージと同期する</li>
        </ul>
      </div>

      {/* 確認問題 */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="font-semibold mb-2">✅ 確認問題（発展）</p>
        <ol className="leading-loose pl-5 mb-0 text-sm">
          <li>Todo の編集機能を追加するには、どんな Action と Reducer が必要ですか？</li>
          <li>複数ユーザーで Todo を共有するには、localStorage の代わりに何を使いますか？</li>
          <li>タスクの数が 1000 件を超えた場合、パフォーマンスを改善するにはどうしますか？</li>
        </ol>
      </div>
    </div>
  )
}

export default TodoAppDemo
