# サンプル09：API フェッチ

## fetch API とは？

`fetch` は、ブラウザに組み込まれた HTTP 通信の API です。
外部サーバーからデータを取得したり、サーバーにデータを送信したりする際に使います。

```tsx
// 基本的な使い方
const response = await fetch('https://api.example.com/users')
const data = await response.json()
```

---

## useEffect での非同期処理

`useEffect` のコールバック関数は `async` にできません。
内部に `async` 関数を定義して即座に呼び出すパターンを使います。

```tsx
useEffect(() => {
  // ❌ コールバック自体を async にしてはいけない
  // async () => { ... }

  // ✅ 内部に async 関数を定義して呼び出す
  const load = async () => {
    const res = await fetch('...')
    const data = await res.json()
    setData(data)
  }

  load() // 即座に呼び出す
}, [])
```

---

## ローディング状態管理

API 通信には時間がかかるため、3 つの状態を管理するのが基本パターンです。

| 状態 | 型 | 説明 |
|-----|---|-----|
| `loading` | `boolean` | 通信中かどうか |
| `error` | `string \| null` | エラーメッセージ（なければ null） |
| `data` | `T \| null` | 取得したデータ（なければ null） |

```tsx
const [data, setData] = useState<User[] | null>(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

// 通信開始
setLoading(true)
setError(null)

// 通信完了（成功）
setData(result)

// 通信完了（失敗）
setError('エラーメッセージ')

// どちらでも最後に
setLoading(false)
```

---

## エラーハンドリング

`fetch` はネットワークエラーの場合のみ例外を throw します。
**HTTP ステータスエラー（404、500 など）では throw しません**。

```tsx
const res = await fetch(URL)

// ✅ ステータスコードのチェックが必要
if (!res.ok) {
  throw new Error(`HTTP エラー: ${res.status}`)
}

const data = await res.json()
```

---

## クリーンアップ関数でのキャンセル処理

コンポーネントがアンマウントされた後（画面遷移など）に通信が完了すると、
存在しないコンポーネントの state を更新しようとしてエラーになります。
`AbortController` を使って通信をキャンセルします。

```tsx
useEffect(() => {
  const controller = new AbortController()

  const load = async () => {
    try {
      const res = await fetch(URL, {
        signal: controller.signal, // キャンセル信号を渡す
      })
      const data = await res.json()
      setData(data)
    } catch (err) {
      // AbortError はキャンセルなので無視
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err.message)
    }
  }

  load()

  // クリーンアップ関数でキャンセル
  return () => {
    controller.abort()
  }
}, [])
```

---

## 完全な実装例

```tsx
import { useState, useEffect } from 'react'

type User = {
  id: number
  name: string
  email: string
}

function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          'https://jsonplaceholder.typicode.com/users',
          { signal: controller.signal }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: User[] = await res.json()
        setUsers(data)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : '不明なエラー')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  if (loading) return <p>読み込み中...</p>
  if (error) return <p>エラー: {error}</p>

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  )
}
```

---

## 確認問題

1. `fetch` がエラーを throw するのはどんな場合ですか？（ネットワークエラー以外も考えてみてください）
2. `AbortController` を使わない場合、どんな問題が起きる可能性がありますか？
3. `loading` を `finally` ではなく `try` と `catch` の両方に書いた場合の問題点は？
4. `useEffect` のコールバック自体を `async` にできない理由は何ですか？

---

## 関連サンプル

- [サンプル07：useEffect](../07_use_effect/README.md)（前のステップ）
- [サンプル10：カスタムフック](../10_custom_hooks/README.md)（次のステップ）
