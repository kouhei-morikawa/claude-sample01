/**
 * サンプル14: React Router
 *
 * 学習テーマ：
 * - React Router の基本概念
 * - ルーティング設定
 * - 動的パラメーター
 * - ネストルート
 * - リンク遷移
 *
 * 注意：このサンプルは react-router-dom の概念を学ぶため、
 * 実際の react-router-dom を使った場合と同等の動作を
 * カスタムルーターで再現しています。
 * 実際のプロジェクトでは react-router-dom を npm install して使ってください。
 */
import { useState, createContext, useContext, ReactNode } from 'react'

// =================================================
// シンプルなルーター実装（学習用）
// 実際は react-router-dom を使用します
// =================================================

type Params = Record<string, string>

type RouterContextType = {
  path: string
  params: Params
  navigate: (to: string) => void
}

const RouterContext = createContext<RouterContextType | null>(null)

function useRouter(): RouterContextType {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('Router の外で useRouter が呼ばれました')
  return ctx
}

// react-router-dom の useParams に相当
function useParams(): Params {
  return useRouter().params
}

// react-router-dom の Link に相当
function Link({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  const { navigate } = useRouter()
  return (
    <button
      onClick={() => navigate(to)}
      className={className ?? 'text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0 text-left'}
    >
      {children}
    </button>
  )
}

// パスマッチング（:id のような動的セグメントに対応）
function matchPath(pattern: string, path: string): Params | null {
  const patternParts = pattern.split('/')
  const pathParts = path.split('/')
  if (patternParts.length !== pathParts.length) return null

  const params: Params = {}
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = pathParts[i]
    } else if (patternParts[i] !== pathParts[i]) {
      return null
    }
  }
  return params
}

// react-router-dom の BrowserRouter + Routes に相当
type RouteConfig = {
  path: string
  element: ReactNode
}

function Router({ routes }: { routes: RouteConfig[] }) {
  const [currentPath, setCurrentPath] = useState('/')

  let matchedElement: ReactNode = null
  let matchedParams: Params = {}

  for (const route of routes) {
    const params = matchPath(route.path, currentPath)
    if (params !== null) {
      matchedElement = route.element
      matchedParams = params
      break
    }
  }

  return (
    <RouterContext.Provider
      value={{ path: currentPath, params: matchedParams, navigate: setCurrentPath }}
    >
      {matchedElement}
    </RouterContext.Provider>
  )
}

// =================================================
// アプリのデータ
// =================================================

type User = {
  id: number
  name: string
  role: string
  email: string
  bio: string
}

const USERS: User[] = [
  { id: 1, name: '山田 太郎', role: 'フロントエンドエンジニア', email: 'taro@example.com', bio: 'React と TypeScript が好きです。趣味はギター演奏。' },
  { id: 2, name: '鈴木 花子', role: 'デザイナー', email: 'hanako@example.com', bio: 'UI/UX デザインを専門にしています。コーヒーが大好き。' },
  { id: 3, name: '佐藤 健', role: 'バックエンドエンジニア', email: 'ken@example.com', bio: 'Node.js と Go を使った API 開発が得意です。' },
  { id: 4, name: '田中 美咲', role: 'プロジェクトマネージャー', email: 'misaki@example.com', bio: 'チームをまとめるのが仕事です。読書が趣味。' },
]

// =================================================
// ナビゲーションバー
// =================================================

function NavBar() {
  const { path } = useRouter()

  const links = [
    { to: '/', label: '🏠 ホーム' },
    { to: '/users', label: '👥 ユーザー一覧' },
    { to: '/about', label: 'ℹ️ About' },
  ]

  return (
    <nav className="flex items-center gap-1 px-4 py-2 bg-slate-800 text-white text-sm">
      <span className="mr-2 font-bold text-slate-300">学習サイト</span>
      {links.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className={`px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
            path === link.to
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

// =================================================
// ページコンポーネント
// =================================================

// ホームページ
function HomePage() {
  const { navigate } = useRouter()
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">🏠 ホームページ</h1>
      <p className="text-slate-600">React Router のデモサイトです。</p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/users')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer"
        >
          ユーザー一覧を見る →
        </button>
        <button
          onClick={() => navigate('/about')}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 cursor-pointer"
        >
          About を見る →
        </button>
      </div>
    </div>
  )
}

// ユーザー一覧ページ
function UsersPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold text-slate-800">👥 ユーザー一覧</h1>
      <div className="grid gap-3">
        {USERS.map(user => (
          <div
            key={user.id}
            className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
            <Link
              to={`/users/${user.id}`}
              className="text-sm text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0"
            >
              詳細を見る →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

// ユーザー詳細ページ（動的ルート /users/:id）
function UserDetailPage() {
  const { id } = useParams()
  const { navigate } = useRouter()
  const user = USERS.find(u => u.id === Number(id))

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-slate-600 mb-4">ユーザーが見つかりません（id: {id}）</p>
        <button
          onClick={() => navigate('/users')}
          className="text-blue-600 hover:underline cursor-pointer bg-transparent border-none text-sm"
        >
          ← ユーザー一覧に戻る
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={() => navigate('/users')}
        className="text-sm text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0"
      >
        ← ユーザー一覧に戻る
      </button>
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{user.name}</h1>
            <p className="text-sm text-slate-500">{user.role}</p>
          </div>
        </div>
        <div className="space-y-2 pt-2 border-t border-slate-100 text-sm text-slate-700">
          <p>📧 {user.email}</p>
          <p>📝 {user.bio}</p>
          <p className="text-xs text-slate-400">ユーザー ID：{user.id}</p>
        </div>
      </div>
    </div>
  )
}

// About ページ
function AboutPage() {
  return (
    <div className="p-8 space-y-3">
      <h1 className="text-xl font-bold text-slate-800">ℹ️ About</h1>
      <p className="text-slate-600">このサイトは React Router の学習用デモです。</p>
      <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 space-y-1">
        <p>🛠 使用技術：React + TypeScript + Tailwind CSS</p>
        <p>📚 学習サンプル：React 学習プロジェクト</p>
      </div>
    </div>
  )
}

// 404 ページ
function NotFoundPage() {
  const { navigate } = useRouter()
  return (
    <div className="p-8 text-center space-y-4">
      <p className="text-6xl">🔍</p>
      <h1 className="text-2xl font-bold text-slate-800">404 - ページが見つかりません</h1>
      <p className="text-slate-600">お探しのページは存在しないか、移動した可能性があります。</p>
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer"
      >
        ホームに戻る
      </button>
    </div>
  )
}

// =================================================
// レイアウト（ナビ + コンテンツ）
// =================================================

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 min-h-[320px]">
      <NavBar />
      <div>{children}</div>
    </div>
  )
}

// ルート定義にレイアウトを組み込む
function routes() {
  return [
    { path: '/', element: <Layout><HomePage /></Layout> },
    { path: '/users', element: <Layout><UsersPage /></Layout> },
    { path: '/users/:id', element: <Layout><UserDetailPage /></Layout> },
    { path: '/about', element: <Layout><AboutPage /></Layout> },
    { path: '*', element: <Layout><NotFoundPage /></Layout> },
  ]
}

// =================================================
// メインコンポーネント
// =================================================

function RouterDemo() {
  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">🗺️ React Router</h2>

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-6 leading-relaxed">
        <strong>React Router</strong> は、React アプリに SPA（シングルページアプリケーション）の
        ルーティングを追加するライブラリです。
        URL に応じて表示するコンポーネントを切り替えます。
      </p>

      {/* 基本説明 */}
      <section className="mb-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-2">🔑 react-router-dom の基本構造</h3>
        <div className="overflow-auto rounded-lg bg-slate-800 text-slate-100 p-4 text-sm font-mono leading-relaxed">
          <pre>{`import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">ホーム</Link>
        <Link to="/users">ユーザー一覧</Link>
      </nav>
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/users"     element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetail />} />  {/* 動的ルート */}
        <Route path="*"          element={<NotFound />} />    {/* 404 */}
      </Routes>
    </BrowserRouter>
  )
}

// 動的パラメーターの取得
function UserDetail() {
  const { id } = useParams()  // URL の :id を取得
  return <div>ユーザー ID: {id}</div>
}`}</pre>
        </div>
      </section>

      {/* デモ */}
      <section className="mb-6">
        <h3 className="font-semibold mb-3 text-slate-800">
          🎮 ルーティングデモ（ユーザー詳細ページを試してみてください）
        </h3>
        <Router routes={routes()} />
      </section>

      {/* まとめ */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="font-semibold mb-2">📌 ポイント</p>
        <ul className="leading-loose pl-5 mb-0 text-sm">
          <li>
            <strong>BrowserRouter</strong>：ルーティング機能全体をラップ
          </li>
          <li>
            <strong>Routes / Route</strong>：URL とコンポーネントを対応付け
          </li>
          <li>
            <strong>Link / useNavigate</strong>：ページ遷移（<code>{'<a>'}</code>{' '}
            の代わりに使う）
          </li>
          <li>
            <strong>動的ルート</strong>：<code>/users/:id</code> で URL の一部を変数として扱う
          </li>
          <li>
            <strong>useParams</strong>：動的セグメント（<code>:id</code> など）の値を取得
          </li>
          <li>
            <strong>404 対応</strong>：<code>path="*"</code> でどのルートにもマッチしない場合を処理
          </li>
        </ul>
      </div>

      {/* インストール方法 */}
      <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="font-semibold mb-2 text-sm">🛠 実際のプロジェクトでの使い方</p>
        <div className="overflow-auto rounded-lg bg-slate-800 text-slate-100 p-3 text-xs font-mono">
          <pre>{`# インストール
npm install react-router-dom

# TypeScript の型定義（v6 以降は不要）
# npm install --save-dev @types/react-router-dom`}</pre>
        </div>
      </div>

      {/* 確認問題 */}
      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="font-semibold mb-2">✅ 確認問題</p>
        <ol className="leading-loose pl-5 mb-0 text-sm">
          <li>SPA のルーティングと通常の複数 HTML ファイルの切り替えの違いは何ですか？</li>
          <li><code>{'<a href="/users">'}</code> ではなく <code>{'<Link to="/users">'}</code> を使う理由は？</li>
          <li>動的ルート（<code>/posts/:postId</code>）から <code>postId</code> を取得するには何を使いますか？</li>
        </ol>
      </div>
    </div>
  )
}

export default RouterDemo
