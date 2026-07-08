# サンプル11：Context API

## Context とは？

**Context** は、コンポーネントツリーの深い階層にあるコンポーネントへ、
中間コンポーネントを経由せずに値を渡す仕組みです。

### Props のバケツリレー（問題）

```tsx
// ❌ Props を何段も中継する必要がある
function App() {
  const [theme, setTheme] = useState('light')
  return <Parent theme={theme} setTheme={setTheme} />
}

function Parent({ theme, setTheme }) {
  return <Child theme={theme} setTheme={setTheme} />  // 使わないのに中継
}

function Child({ theme, setTheme }) {
  return <GrandChild theme={theme} setTheme={setTheme} />  // 使わないのに中継
}

function GrandChild({ theme, setTheme }) {
  return <button onClick={() => setTheme('dark')}>{theme}</button>  // ここだけで使う
}
```

### Context による解決

```tsx
// ✅ Context を使うとバケツリレーが不要
const ThemeContext = createContext('light')

function App() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={theme}>
      <Parent />   {/* theme を渡さなくていい */}
    </ThemeContext.Provider>
  )
}

function Parent() {
  return <Child />   // 何も渡さなくていい
}

function Child() {
  return <GrandChild />  // 何も渡さなくていい
}

function GrandChild() {
  const theme = useContext(ThemeContext)  // 直接取得
  return <div>{theme}</div>
}
```

---

## Provider / Consumer パターン

### 1. Context を作成する

```tsx
import { createContext } from 'react'

// 型と初期値を指定してContextを作成
const ThemeContext = createContext<'light' | 'dark'>('light')
```

### 2. Provider で値を提供する

```tsx
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    // value に渡した値が子孫から取得できる
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}
```

### 3. useContext フックで値を取得する

```tsx
function ThemedButton() {
  const theme = useContext(ThemeContext)

  return (
    <button className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white'}>
      ボタン
    </button>
  )
}
```

---

## useContext フック

`useContext` は最も近い Provider の値を返します。

```tsx
// Context オブジェクトを渡す（.Provider や .Consumer ではなく Context 本体を渡す）
const theme = useContext(ThemeContext)
```

### カスタムフックでラップする（推奨パターン）

```tsx
function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme は ThemeProvider の中で使ってください')
  }
  return ctx
}

// 使う側
function MyComponent() {
  const { theme, toggleTheme } = useTheme()
  // ...
}
```

---

## 複数 Context の組み合わせ

Provider は入れ子にして複数組み合わせることができます。

```tsx
function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

// 深い階層でも好きな Context を取得できる
function DeepComponent() {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { user } = useAuth()

  return <div>...</div>
}
```

---

## いつ Context を使うべきか？

### 適している用途

- **テーマ**（ライト/ダークモード）
- **言語設定**（i18n）
- **認証情報**（ログインユーザー）
- **アプリ全体の設定**

### 注意点

Context の値が変わると、`useContext` しているすべてのコンポーネントが再レンダリングされます。
頻繁に変わる値には注意が必要です。

```tsx
// ❌ カウンターのように頻繁に変わる値には不向き
const CountContext = createContext(0)
// count が変わるたびに全コンポーネントが再レンダリング

// ✅ あまり変わらないグローバル設定に使う
const ThemeContext = createContext('light')
```

---

## 確認問題

1. Context を使うと何の問題が解決されますか？
2. `useContext` は最も近い Provider の値を返しますが、Provider が複数ネストされた場合はどうなりますか？
3. Context の値が頻繁に変わる場合、パフォーマンスにどんな影響がありますか？
4. カスタムフック（`useTheme` など）で `useContext` をラップするメリットは何ですか？

---

## 関連サンプル

- [サンプル10：カスタムフック](../10_custom_hooks/README.md)（前のステップ）
- [サンプル12：useReducer](../12_reducer/README.md)（次のステップ）
