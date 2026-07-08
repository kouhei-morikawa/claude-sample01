/**
 * サンプル09: API フェッチ
 *
 * 学習テーマ：
 * - fetch API の基本的な使い方
 * - useEffect での非同期処理
 * - ローディング状態管理
 * - エラーハンドリング
 * - AbortController によるクリーンアップ
 */
import { useState, useEffect, useCallback } from 'react'

// -------------------------------------------------
// 型定義（JSONPlaceholder の /users レスポンス）
// -------------------------------------------------
type Address = {
  street: string
  suite: string
  city: string
  zipcode: string
}

type Company = {
  name: string
}

type User = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: Address
  company: Company
}

// -------------------------------------------------
// ユーザーカードコンポーネント
// -------------------------------------------------
function UserCard({ user }: { user: User }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
          {user.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-slate-800 leading-tight">{user.name}</p>
          <p className="text-xs text-slate-500">@{user.username}</p>
        </div>
      </div>
      <div className="space-y-1 text-sm text-slate-600">
        <p>📧 {user.email}</p>
        <p>📞 {user.phone}</p>
        <p>🌐 {user.website}</p>
        <p>🏢 {user.company.name}</p>
        <p>📍 {user.address.city}</p>
      </div>
    </div>
  )
}

// -------------------------------------------------
// ユーザー一覧コンポーネント
// -------------------------------------------------
function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchCount, setFetchCount] = useState(0)

  const fetchUsers = useCallback(() => {
    setFetchCount(c => c + 1)
  }, [])

  useEffect(() => {
    if (fetchCount === 0) return

    // AbortController でリクエストのキャンセルを可能にする
    const controller = new AbortController()

    const load = async () => {
      setLoading(true)
      setError(null)
      setUsers([])

      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users', {
          signal: controller.signal,
        })

        if (!res.ok) {
          throw new Error(`HTTP エラー: ${res.status}`)
        }

        const data: User[] = await res.json()
        setUsers(data)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // キャンセルされた場合はエラー表示しない
          return
        }
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    load()

    // クリーンアップ：コンポーネントのアンマウント時やエフェクト再実行時にキャンセル
    return () => {
      controller.abort()
    }
  }, [fetchCount])

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          {loading ? '取得中...' : 'ユーザーを取得'}
        </button>
        {users.length > 0 && (
          <span className="text-sm text-slate-500">{users.length} 件取得しました</span>
        )}
      </div>

      {/* ローディング表示 */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-10 text-slate-500">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm">JSONPlaceholder からデータを取得中...</p>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <div>
            <p className="font-medium text-red-700">エラーが発生しました</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-2 text-sm text-red-600 underline cursor-pointer hover:text-red-800"
            >
              リトライ
            </button>
          </div>
        </div>
      )}

      {/* 初期状態 */}
      {!loading && !error && users.length === 0 && fetchCount === 0 && (
        <div className="py-8 text-center text-slate-400">
          <p className="text-4xl mb-2">👆</p>
          <p>「ユーザーを取得」ボタンを押してください</p>
        </div>
      )}

      {/* ユーザー一覧 */}
      {users.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {users.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------
// メインコンポーネント
// -------------------------------------------------
function FetchApiDemo() {
  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">🌐 API フェッチ</h2>

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-6 leading-relaxed">
        <strong>fetch API</strong> は、ブラウザ標準の HTTP 通信機能です。
        <code>useEffect</code> の中で非同期処理を行い、
        ローディング・エラー・データの 3 つの状態を管理するのが基本パターンです。
      </p>

      {/* 基本パターンの説明 */}
      <section className="mb-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-2">🔑 基本パターン</h3>
        <div className="overflow-auto rounded-lg bg-slate-800 text-slate-100 p-4 text-sm font-mono leading-relaxed">
          <pre>{`const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  const controller = new AbortController()

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(URL, { signal: controller.signal })
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  load()
  return () => controller.abort() // クリーンアップ
}, []) // 依存配列に注目`}</pre>
        </div>
      </section>

      {/* 実際の動作例 */}
      <section className="mb-6 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4 text-slate-800">
          👥 ユーザー一覧（JSONPlaceholder API）
        </h3>
        <UserList />
      </section>

      {/* まとめ */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="font-semibold mb-2">📌 ポイント</p>
        <ul className="leading-loose pl-5 mb-0 text-sm">
          <li>
            <strong>3 つの状態</strong>：<code>loading</code>・<code>error</code>・<code>data</code>{' '}
            を管理するのが基本
          </li>
          <li>
            <strong>res.ok チェック</strong>：ステータスコードが 200 系以外でも{' '}
            <code>fetch</code> は reject しないため、手動でチェックが必要
          </li>
          <li>
            <strong>AbortController</strong>：クリーンアップ関数でキャンセルし、
            アンマウント後の state 更新を防ぐ
          </li>
          <li>
            <strong>finally</strong>：成功・失敗どちらでも <code>loading</code> を{' '}
            <code>false</code> にする
          </li>
        </ul>
      </div>

      {/* 確認問題 */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="font-semibold mb-2">✅ 確認問題</p>
        <ol className="leading-loose pl-5 mb-0 text-sm">
          <li><code>fetch</code> がエラーを throw するのはどんな場合ですか？（ネットワークエラー以外も考えてみてください）</li>
          <li><code>AbortController</code> を使わない場合、どんな問題が起きる可能性がありますか？</li>
          <li><code>loading</code> を <code>finally</code> ではなく <code>try</code> と <code>catch</code> の両方に書いた場合の問題点は？</li>
        </ol>
      </div>
    </div>
  )
}

export default FetchApiDemo
