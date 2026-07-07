/**
 * サンプル11: Context API
 *
 * 学習テーマ：
 * - Context とは何か（Props のバケツリレー解消）
 * - createContext / Provider / useContext の使い方
 * - テーマ（ライト/ダーク）と言語の Context 実装例
 * - 複数 Context の組み合わせ
 */
import { createContext, useContext, useState, ReactNode } from 'react'

// =================================================
// テーマ Context
// =================================================

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  const toggleTheme = () => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme は ThemeProvider の中で使ってください')
  return ctx
}

// =================================================
// 言語 Context
// =================================================

type Language = 'ja' | 'en'

type Translations = {
  greeting: string
  welcome: string
  description: string
  switchLang: string
  switchTheme: string
  lightMode: string
  darkMode: string
  currentTheme: string
  currentLang: string
}

const TEXTS: Record<Language, Translations> = {
  ja: {
    greeting: 'こんにちは！',
    welcome: 'React Context API サンプルへようこそ',
    description: 'このデモはテーマと言語の Context を組み合わせています',
    switchLang: 'Switch to English',
    switchTheme: 'テーマ切替',
    lightMode: 'ライトモード',
    darkMode: 'ダークモード',
    currentTheme: '現在のテーマ',
    currentLang: '現在の言語',
  },
  en: {
    greeting: 'Hello!',
    welcome: 'Welcome to React Context API Sample',
    description: 'This demo combines theme and language contexts',
    switchLang: '日本語に切り替える',
    switchTheme: 'Toggle Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    currentTheme: 'Current Theme',
    currentLang: 'Current Language',
  },
}

type LanguageContextType = {
  language: Language
  t: Translations
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja')

  const toggleLanguage = () => {
    setLanguage(l => (l === 'ja' ? 'en' : 'ja'))
  }

  return (
    <LanguageContext.Provider value={{ language, t: TEXTS[language], toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage は LanguageProvider の中で使ってください')
  return ctx
}

// =================================================
// デモ UI コンポーネント
// =================================================

// コンポーネントツリーの最深部（Context を直接受け取る）
function DeepComponent() {
  const { theme } = useTheme()
  const { t } = useLanguage()

  const isDark = theme === 'dark'

  return (
    <div
      className={`p-4 rounded-lg border-2 border-dashed text-center text-sm transition-colors duration-300 ${
        isDark
          ? 'bg-slate-700 border-slate-500 text-slate-200'
          : 'bg-sky-50 border-sky-300 text-slate-700'
      }`}
    >
      <p className="font-semibold text-lg mb-1">{t.greeting}</p>
      <p>{t.description}</p>
      <p className="text-xs mt-2 opacity-70">
        🎯 このコンポーネントは props を受け取っていません
      </p>
    </div>
  )
}

// 中間コンポーネント（props を中継しない）
function MiddleComponent() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div
      className={`p-3 rounded-lg border transition-colors duration-300 ${
        isDark ? 'bg-slate-600 border-slate-500' : 'bg-slate-100 border-slate-200'
      }`}
    >
      <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        MiddleComponent（props の中継なし）
      </p>
      <DeepComponent />
    </div>
  )
}

// コントロールパネル
function ControlPanel() {
  const { theme, toggleTheme } = useTheme()
  const { language, t, toggleLanguage } = useLanguage()

  const isDark = theme === 'dark'

  return (
    <div
      className={`p-4 rounded-xl flex flex-wrap gap-3 items-center transition-colors duration-300 ${
        isDark ? 'bg-slate-700' : 'bg-white border border-slate-200'
      }`}
    >
      <button
        onClick={toggleTheme}
        className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
          isDark
            ? 'bg-yellow-400 text-slate-900 hover:bg-yellow-300'
            : 'bg-slate-800 text-white hover:bg-slate-700'
        }`}
      >
        {isDark ? '☀️ ' + t.lightMode : '🌙 ' + t.darkMode}
      </button>

      <button
        onClick={toggleLanguage}
        className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
          isDark
            ? 'bg-slate-500 text-slate-100 hover:bg-slate-400'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        🌐 {t.switchLang}
      </button>

      <div className={`ml-auto text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        <span className="mr-3">
          {t.currentTheme}:{' '}
          <strong>{isDark ? t.darkMode : t.lightMode}</strong>
        </span>
        <span>
          {t.currentLang}:{' '}
          <strong>{language === 'ja' ? '日本語' : 'English'}</strong>
        </span>
      </div>
    </div>
  )
}

// メインのデモ領域
function ThemeLanguageDemo() {
  const { theme } = useTheme()
  const { t } = useLanguage()

  const isDark = theme === 'dark'

  return (
    <div
      className={`rounded-xl p-5 space-y-4 transition-colors duration-300 ${
        isDark ? 'bg-slate-800 text-slate-100' : 'bg-white border border-slate-200'
      }`}
    >
      <h3
        className={`font-semibold text-lg ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
      >
        {t.welcome}
      </h3>

      <ControlPanel />

      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        コンポーネントツリー（↓ 全て Context から値を取得）：
      </p>

      <MiddleComponent />
    </div>
  )
}

// =================================================
// メインコンポーネント
// =================================================
function ContextDemo() {
  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">🌐 Context API</h2>

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-6 leading-relaxed">
        <strong>Context API</strong> は、Props のバケツリレーを解消する仕組みです。
        Provider で提供した値を、ツリーのどこにいるコンポーネントでも{' '}
        <code>useContext</code> で取得できます。
      </p>

      {/* 基本説明 */}
      <section className="mb-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-2">🔑 Context の基本構造</h3>
        <div className="overflow-auto rounded-lg bg-slate-800 text-slate-100 p-4 text-sm font-mono leading-relaxed">
          <pre>{`// 1. Context を作成
const ThemeContext = createContext<Theme>('light')

// 2. Provider で値を提供
function App() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={theme}>
      <Child />  {/* どこからでも取得可能 */}
    </ThemeContext.Provider>
  )
}

// 3. どこでも useContext で取得
function DeepChild() {
  const theme = useContext(ThemeContext)
  return <div data-theme={theme}>...</div>
}`}</pre>
        </div>
      </section>

      {/* デモ */}
      <section className="mb-6">
        <h3 className="font-semibold mb-3 text-slate-800">
          🎮 テーマ × 言語 Context デモ
        </h3>
        {/* 2 つの Provider を組み合わせる */}
        <ThemeProvider>
          <LanguageProvider>
            <ThemeLanguageDemo />
          </LanguageProvider>
        </ThemeProvider>
      </section>

      {/* まとめ */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="font-semibold mb-2">📌 ポイント</p>
        <ul className="leading-loose pl-5 mb-0 text-sm">
          <li>
            <strong>createContext</strong>：Context オブジェクトを作成
          </li>
          <li>
            <strong>Provider</strong>：<code>value</code>{' '}
            prop で子孫コンポーネントに値を提供
          </li>
          <li>
            <strong>useContext</strong>：最も近い Provider の値を取得
          </li>
          <li>
            <strong>再レンダリング</strong>：<code>value</code>{' '}
            が変わると、useContext しているコンポーネントが再レンダリングされる
          </li>
          <li>
            <strong>用途</strong>：テーマ・言語・認証情報など、グローバルに必要なデータに適している
          </li>
        </ul>
      </div>

      {/* 確認問題 */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="font-semibold mb-2">✅ 確認問題</p>
        <ol className="leading-loose pl-5 mb-0 text-sm">
          <li>Context を使うと何の問題が解決されますか？</li>
          <li><code>useContext</code> は最も近い Provider の値を返しますが、Provider が複数ネストされた場合はどうなりますか？</li>
          <li>Context の値が頻繁に変わる場合、パフォーマンスにどんな影響がありますか？</li>
        </ol>
      </div>
    </div>
  )
}

export default ContextDemo
