# サンプル12：useReducer

## useState vs useReducer

どちらも状態管理のフックですが、適した場面が異なります。

| 比較項目 | useState | useReducer |
|---------|---------|-----------|
| 向いている場面 | シンプルな値 | 複数の状態が絡む更新 |
| 状態更新 | `setXxx(新しい値)` | `dispatch({ type: ... })` |
| ロジックの場所 | コンポーネント内 | Reducer 関数に集約 |
| テストのしやすさ | 普通 | 純粋関数なので容易 |
| デバッグ | 普通 | Action ログで追いやすい |

```tsx
// useState の場合
const [count, setCount] = useState(0)
setCount(c => c + 1)

// useReducer の場合
const [count, dispatch] = useReducer(reducer, 0)
dispatch({ type: 'INCREMENT' })
```

---

## Action / Reducer パターン

### Action（何をするか）

```tsx
// Action の型：Union 型で全種別を列挙する
type CountAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'ADD'; amount: number }
  | { type: 'RESET' }
```

### Reducer（どう変わるか）

```tsx
// Reducer は純粋関数（副作用なし、同じ入力なら同じ出力）
function countReducer(state: number, action: CountAction): number {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ADD':
      return state + action.amount
    case 'RESET':
      return 0
    default:
      return state  // 未知のアクションはそのまま返す
  }
}
```

### useReducer での使用

```tsx
function Counter() {
  // useReducer(reducer関数, 初期値)
  const [count, dispatch] = useReducer(countReducer, 0)

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'ADD', amount: 10 })}>+10</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>リセット</button>
    </div>
  )
}
```

---

## オブジェクト型の State 管理

複数のプロパティを持つ state の場合は、イミュータブル（不変）に更新します。

```tsx
type TodoState = {
  todos: TodoItem[]
  nextId: number
}

type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number }

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,                          // 既存の state をコピー
        todos: [
          ...state.todos,                  // 既存の todos をコピー
          { id: state.nextId, text: action.text, completed: false }
        ],
        nextId: state.nextId + 1,
      }

    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id
            ? { ...todo, completed: !todo.completed }  // 該当だけ変更
            : todo                                       // 他はそのまま
        ),
      }

    case 'DELETE':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id),
      }

    default:
      return state
  }
}
```

---

## 複雑な状態管理に適した場面

useReducer が特に有効なのは：

1. **複数の値が連動して変わる**場合
   - 例：`todos` と `nextId` が同時に変わる
2. **次の state が前の state に依存する**場合
   - 例：toggle は現在値の反転
3. **多くの種類の操作がある**場合
   - 例：CRUD 操作（追加・読取・更新・削除）
4. **ロジックを分離してテストしたい**場合
   - Reducer は純粋関数なので単体テストが容易

---

## Reducer の純粋関数とは

```tsx
// ✅ 純粋関数：副作用なし
function reducer(state: State, action: Action): State {
  // NG: 外部の値を変更しない
  // NG: state を直接変更しない（ミュータブル）
  // NG: API コールや console.log などの副作用を起こさない

  return { ...state, count: state.count + 1 }  // 新しいオブジェクトを返す
}

// ❌ 純粋関数でない例
function badReducer(state: State, action: Action): State {
  state.count += 1  // NG: state を直接変更している
  return state      // NG: 同じ参照を返している
}
```

---

## 確認問題

1. Reducer が「純粋関数」である必要があるのはなぜですか？
2. Action に `type` プロパティを必ず含める慣習はなぜですか？
3. `useReducer` と Context を組み合わせるとどんな利点がありますか？
4. 次の state が前の state に依存する操作には `useState` の `setState(prev => ...)` でも対応できますが、useReducer の方が優れる点は何ですか？

---

## 関連サンプル

- [サンプル11：Context API](../11_context/README.md)（前のステップ）
- [サンプル13：React.memo / useCallback / useMemo](../13_memo_callback/README.md)（次のステップ）
