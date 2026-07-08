# サンプル14：React Router

## React Router の基本

**React Router** は、React アプリに SPA（シングルページアプリケーション）の
ルーティングを追加するライブラリです。

### 通常のリンクとの違い

```html
<!-- ❌ 通常の <a> タグ：ページ全体がリロードされる -->
<a href="/users">ユーザー一覧</a>

<!-- ✅ React Router の <Link>：ページをリロードせずに URL を変更 -->
<Link to="/users">ユーザー一覧</Link>
```

---

## インストール

```bash
npm install react-router-dom
```

---

## ルーティング設定

```tsx
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      {/* ナビゲーション */}
      <nav>
        <Link to="/">ホーム</Link>
        <Link to="/users">ユーザー一覧</Link>
      </nav>

      {/* ルート定義 */}
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/users"     element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        <Route path="*"          element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 動的パラメーター

URL の一部を変数として扱えます。

```tsx
// ルート定義
<Route path="/users/:id" element={<UserDetailPage />} />
<Route path="/posts/:year/:month" element={<ArchivePage />} />

// コンポーネントで取得
function UserDetailPage() {
  const { id } = useParams()  // URL の :id の値を取得

  return <div>ユーザー ID: {id}</div>
}

function ArchivePage() {
  const { year, month } = useParams()

  return <div>{year}年{month}月のアーカイブ</div>
}
```

---

## ネストルート

親ルート内に子ルートを定義できます。

```tsx
function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* /dashboard にアクセスすると Overview が表示 */}
        <Route index element={<Overview />} />
        {/* /dashboard/settings にアクセスすると Settings が表示 */}
        <Route path="settings" element={<Settings />} />
        {/* /dashboard/users にアクセスすると Users が表示 */}
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  )
}

// 親レイアウト：<Outlet /> に子コンポーネントが描画される
import { Outlet } from 'react-router-dom'

function DashboardLayout() {
  return (
    <div>
      <nav>{/* サイドバーナビ */}</nav>
      <main>
        <Outlet />  {/* ここに子ルートが描画される */}
      </main>
    </div>
  )
}
```

---

## リンク遷移

### Link コンポーネント

```tsx
import { Link } from 'react-router-dom'

// テキストリンク
<Link to="/users">ユーザー一覧</Link>

// 動的リンク
<Link to={`/users/${user.id}`}>詳細を見る</Link>
```

### useNavigate フック（プログラム的遷移）

```tsx
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login()
    navigate('/dashboard')  // ログイン後にリダイレクト
  }

  return <form onSubmit={handleSubmit}>...</form>
}

// 戻る/進む
navigate(-1)  // ブラウザの「戻る」と同等
navigate(1)   // ブラウザの「進む」と同等
```

### NavLink（アクティブ状態対応）

```tsx
import { NavLink } from 'react-router-dom'

// 現在の URL と to が一致するときに isActive が true になる
<NavLink
  to="/users"
  className={({ isActive }) =>
    isActive ? 'text-blue-600 font-bold' : 'text-slate-600'
  }
>
  ユーザー一覧
</NavLink>
```

---

## 404 ページ

```tsx
// path="*" はどのルートにもマッチしない場合にマッチする
<Route path="*" element={<NotFoundPage />} />

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>404 - ページが見つかりません</h1>
      <button onClick={() => navigate('/')}>ホームに戻る</button>
    </div>
  )
}
```

---

## 確認問題

1. SPA のルーティングと通常の複数 HTML ファイルの切り替えの違いは何ですか？
2. `<a href="/users">` ではなく `<Link to="/users">` を使う理由は？
3. 動的ルート（`/posts/:postId`）から `postId` を取得するには何を使いますか？
4. ネストルートで子ルートのコンテンツを表示するには、親コンポーネントに何を配置しますか？

---

## 関連サンプル

- [サンプル13：React.memo / useCallback / useMemo](../13_memo_callback/README.md)（前のステップ）
- [サンプル15：Todo アプリ](../15_todo_app/README.md)（次のステップ）
