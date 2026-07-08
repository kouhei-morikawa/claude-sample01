/**
 * サンプル12: useReducer
 *
 * 学習テーマ：
 * - useState vs useReducer の違い
 * - Action / Reducer パターン
 * - 複雑な状態管理への応用
 * - フィルター機能付き Todo リスト
 */
import { useReducer, useState } from 'react'

// =================================================
// 型定義
// =================================================

type TodoItem = {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

type Filter = 'all' | 'active' | 'completed'

type TodoState = {
  todos: TodoItem[]
  nextId: number
}

// Action の種別（Union 型で列挙）
type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number }
  | { type: 'CLEAR_COMPLETED' }

// =================================================
// Reducer（純粋関数：state + action → 新しい state）
// =================================================

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: state.nextId,
            text: action.text,
            completed: false,
            createdAt: new Date(),
          },
        ],
        nextId: state.nextId + 1,
      }

    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      }

    case 'DELETE':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id),
      }

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      }

    default:
      return state
  }
}

const INITIAL_STATE: TodoState = {
  todos: [
    { id: 1, text: 'React の useReducer を学ぶ', completed: true, createdAt: new Date() },
    { id: 2, text: 'Action と Reducer パターンを理解する', completed: false, createdAt: new Date() },
    { id: 3, text: 'Context と組み合わせて使ってみる', completed: false, createdAt: new Date() },
  ],
  nextId: 4,
}

// =================================================
// UI コンポーネント
// =================================================

// フィルタータブ
function FilterTabs({
  current,
  counts,
  onChange,
}: {
  current: Filter
  counts: { all: number; active: number; completed: number }
  onChange: (f: Filter) => void
}) {
  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: `すべて (${counts.all})` },
    { key: 'active', label: `未完了 (${counts.active})` },
    { key: 'completed', label: `完了済み (${counts.completed})` },
  ]

  return (
    <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${
            current === tab.key
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// Todo アイテム
function TodoItemRow({
  todo,
  onToggle,
  onDelete,
}: {
  todo: TodoItem
  onToggle: () => void
  onDelete: () => void
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        todo.completed ? 'bg-slate-50' : 'bg-white border border-slate-200'
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        className="w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
      />
      <span
        className={`flex-1 text-sm leading-relaxed ${
          todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={onDelete}
        className="text-slate-300 hover:text-red-400 cursor-pointer transition-colors text-lg leading-none"
        aria-label="削除"
      >
        ✕
      </button>
    </div>
  )
}

// =================================================
// メインデモコンポーネント
// =================================================

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, INITIAL_STATE)
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  // フィルター済みリスト
  const filtered = state.todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const counts = {
    all: state.todos.length,
    active: state.todos.filter(t => !t.completed).length,
    completed: state.todos.filter(t => t.completed).length,
  }

  const handleAdd = () => {
    const text = input.trim()
    if (!text) return
    dispatch({ type: 'ADD', text })
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="space-y-3">
      {/* 入力エリア */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="新しいタスクを入力..."
          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          追加
        </button>
      </div>

      {/* フィルタータブ */}
      <FilterTabs current={filter} counts={counts} onChange={setFilter} />

      {/* リスト */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-6">
            {filter === 'completed' ? '完了済みのタスクはありません' : 'タスクがありません'}
          </p>
        ) : (
          filtered.map(todo => (
            <TodoItemRow
              key={todo.id}
              todo={todo}
              onToggle={() => dispatch({ type: 'TOGGLE', id: todo.id })}
              onDelete={() => dispatch({ type: 'DELETE', id: todo.id })}
            />
          ))
        )}
      </div>

      {/* フッター */}
      {counts.completed > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
            className="text-xs text-slate-400 hover:text-red-400 cursor-pointer transition-colors underline"
          >
            完了済みをすべて削除
          </button>
        </div>
      )}
    </div>
  )
}

// =================================================
// メインコンポーネント
// =================================================

function ReducerDemo() {
  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">🔄 useReducer</h2>

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-6 leading-relaxed">
        <strong>useReducer</strong> は、複雑な状態遷移を管理するためのフックです。
        <strong>Action（何をするか）</strong>と{' '}
        <strong>Reducer（どう変わるか）</strong>を分離することで、
        状態管理のロジックを整理できます。
      </p>

      {/* useState vs useReducer の比較 */}
      <section className="mb-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-3">🔑 useState vs useReducer</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-200">
                <th className="px-3 py-2 text-left border border-slate-300">比較項目</th>
                <th className="px-3 py-2 text-left border border-slate-300">useState</th>
                <th className="px-3 py-2 text-left border border-slate-300">useReducer</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['向いている場面', 'シンプルな値', '複数の状態が絡む更新'],
                ['状態更新', 'setXxx(新しい値)', 'dispatch({ type: ... })'],
                ['ロジックの場所', 'コンポーネント内', 'Reducer 関数に集約'],
                ['テストのしやすさ', '普通', '純粋関数なので容易'],
                ['デバッグ', '普通', 'Action ログで追いやすい'],
              ].map(([item, useState, useReducer]) => (
                <tr key={item} className="even:bg-slate-50">
                  <td className="px-3 py-2 border border-slate-300 font-medium">{item}</td>
                  <td className="px-3 py-2 border border-slate-300 text-slate-600">{useState}</td>
                  <td className="px-3 py-2 border border-slate-300 text-slate-600">{useReducer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reducer の基本パターン */}
      <section className="mb-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-2">Reducer の基本パターン</h3>
        <div className="overflow-auto rounded-lg bg-slate-800 text-slate-100 p-4 text-sm font-mono leading-relaxed">
          <pre>{`// Action の型定義
type Action =
  | { type: 'INCREMENT' }
  | { type: 'ADD'; amount: number }
  | { type: 'RESET' }

// Reducer（純粋関数：同じ入力なら必ず同じ出力）
function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'INCREMENT': return state + 1
    case 'ADD':       return state + action.amount
    case 'RESET':     return 0
    default:          return state
  }
}

// コンポーネントで使う
const [count, dispatch] = useReducer(reducer, 0)

dispatch({ type: 'INCREMENT' })     // +1
dispatch({ type: 'ADD', amount: 5 }) // +5
dispatch({ type: 'RESET' })          // 0 に戻す`}</pre>
        </div>
      </section>

      {/* Todo アプリ */}
      <section className="mb-6 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4 text-slate-800">📋 Todo リスト（useReducer 実装）</h3>
        <TodoApp />
      </section>

      {/* まとめ */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="font-semibold mb-2">📌 ポイント</p>
        <ul className="leading-loose pl-5 mb-0 text-sm">
          <li>
            <strong>Reducer は純粋関数</strong>：副作用なし・同じ入力なら同じ出力
          </li>
          <li>
            <strong>Action の Union 型</strong>：TypeScript で型安全に dispatch できる
          </li>
          <li>
            <strong>dispatch</strong>：Action を送ると Reducer が新しい state を返す
          </li>
          <li>
            <strong>使いどころ</strong>：関連する複数の state や複雑な遷移ロジックがある場合
          </li>
        </ul>
      </div>

      {/* 確認問題 */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="font-semibold mb-2">✅ 確認問題</p>
        <ol className="leading-loose pl-5 mb-0 text-sm">
          <li>Reducer が「純粋関数」である必要があるのはなぜですか？</li>
          <li>Action に <code>type</code> プロパティを必ず含める慣習はなぜですか？</li>
          <li><code>useReducer</code> と Context を組み合わせるとどんな利点がありますか？</li>
        </ol>
      </div>
    </div>
  )
}

export default ReducerDemo
