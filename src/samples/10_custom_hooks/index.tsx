/**
 * サンプル10: カスタムフック
 *
 * 学習テーマ：
 * - カスタムフックとは何か
 * - ロジックをフックに分離して再利用する
 * - useCounter・useForm・useFetch の実装例
 */
import { useState, useEffect, useRef, useCallback } from 'react'

// =================================================
// カスタムフック定義
// =================================================

// -------------------------------------------------
// useCounter：カウンター機能
// -------------------------------------------------
type UseCounterOptions = {
  initial?: number
  min?: number
  max?: number
  step?: number
}

function useCounter(options: UseCounterOptions = {}) {
  const { initial = 0, min = -Infinity, max = Infinity, step = 1 } = options
  const [count, setCount] = useState(initial)

  const increment = useCallback(() => {
    setCount(c => Math.min(c + step, max))
  }, [step, max])

  const decrement = useCallback(() => {
    setCount(c => Math.max(c - step, min))
  }, [step, min])

  const reset = useCallback(() => {
    setCount(initial)
  }, [initial])

  const isMin = count <= min
  const isMax = count >= max

  return { count, increment, decrement, reset, isMin, isMax }
}

// -------------------------------------------------
// useForm：フォーム管理
// -------------------------------------------------
type FormValues = Record<string, string>
type FormErrors = Record<string, string>
type Validator<T extends FormValues> = (values: T) => FormErrors

function useForm<T extends FormValues>(initialValues: T, validate?: Validator<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setValues(prev => ({ ...prev, [name]: value }))
      if (touched[name] && validate) {
        const newValues = { ...values, [name]: value } as T
        const newErrors = validate(newValues)
        setErrors(prev => ({ ...prev, [name]: newErrors[name] ?? '' }))
      }
    },
    [values, touched, validate]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name } = e.target
      setTouched(prev => ({ ...prev, [name]: true }))
      if (validate) {
        const newErrors = validate(values)
        setErrors(prev => ({ ...prev, [name]: newErrors[name] ?? '' }))
      }
    },
    [values, validate]
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const isValid = validate ? Object.keys(validate(values)).length === 0 : true

  return { values, errors, touched, handleChange, handleBlur, reset, isValid }
}

// -------------------------------------------------
// useFetch：API 通信の汎用化
// -------------------------------------------------
type FetchState<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

function useFetch<T>(url: string | null) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  })
  const abortRef = useRef<AbortController | null>(null)

  const execute = useCallback(() => {
    if (!url) return

    // 既存のリクエストをキャンセル
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState({ data: null, loading: true, error: null })

    const load = async () => {
      try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP エラー: ${res.status}`)
        const data: T = await res.json()
        setState({ data, loading: false, error: null })
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : '不明なエラー',
        })
      }
    }

    load()
  }, [url])

  useEffect(() => {
    execute()
    return () => {
      abortRef.current?.abort()
    }
  }, [execute])

  return { ...state, refetch: execute }
}

// =================================================
// デモコンポーネント
// =================================================

// -------------------------------------------------
// useCounter デモ
// -------------------------------------------------
function CounterDemo() {
  const counter = useCounter({ initial: 0, min: 0, max: 10, step: 1 })

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl">
      <h4 className="font-semibold mb-3 text-slate-700">useCounter デモ（0〜10）</h4>
      <div className="flex items-center gap-3">
        <button
          onClick={counter.decrement}
          disabled={counter.isMin}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-lg font-bold transition-colors"
        >
          −
        </button>
        <span className="text-3xl font-bold w-16 text-center tabular-nums text-slate-800">
          {counter.count}
        </span>
        <button
          onClick={counter.increment}
          disabled={counter.isMax}
          className="w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-lg font-bold transition-colors text-blue-700"
        >
          ＋
        </button>
        <button
          onClick={counter.reset}
          className="ml-2 px-3 py-1 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-600"
        >
          リセット
        </button>
      </div>
      {counter.isMax && (
        <p className="text-xs text-orange-600 mt-2">最大値（10）に達しました</p>
      )}
      {counter.isMin && (
        <p className="text-xs text-blue-600 mt-2">最小値（0）に達しました</p>
      )}
    </div>
  )
}

// -------------------------------------------------
// useForm デモ
// -------------------------------------------------
type ContactForm = {
  name: string
  email: string
  message: string
}

function ContactFormDemo() {
  const [submitted, setSubmitted] = useState<ContactForm | null>(null)

  const validate = useCallback((values: ContactForm): FormErrors => {
    const errs: FormErrors = {}
    if (!values.name.trim()) errs.name = '名前を入力してください'
    if (!values.email.trim()) errs.email = 'メールを入力してください'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      errs.email = '正しいメール形式で入力してください'
    if (!values.message.trim()) errs.message = 'メッセージを入力してください'
    return errs
  }, [])

  const form = useForm<ContactForm>({ name: '', email: '', message: '' }, validate)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.isValid) {
      setSubmitted({ ...form.values })
      form.reset()
    }
  }

  if (submitted) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm space-y-1">
        <p className="font-semibold text-green-700">✅ 送信完了！</p>
        <p>名前：{submitted.name}</p>
        <p>メール：{submitted.email}</p>
        <p>メッセージ：{submitted.message}</p>
        <button
          onClick={() => setSubmitted(null)}
          className="mt-2 text-xs text-blue-600 underline cursor-pointer hover:text-blue-800"
        >
          もう一度送信する
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          name="name"
          placeholder="名前"
          value={form.values.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          className={`w-full px-3 py-2 rounded-lg border text-sm ${
            form.errors.name && form.touched.name
              ? 'border-red-400 bg-red-50'
              : 'border-slate-300'
          }`}
        />
        {form.errors.name && form.touched.name && (
          <p className="text-xs text-red-500 mt-1">{form.errors.name}</p>
        )}
      </div>
      <div>
        <input
          name="email"
          type="email"
          placeholder="メールアドレス"
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          className={`w-full px-3 py-2 rounded-lg border text-sm ${
            form.errors.email && form.touched.email
              ? 'border-red-400 bg-red-50'
              : 'border-slate-300'
          }`}
        />
        {form.errors.email && form.touched.email && (
          <p className="text-xs text-red-500 mt-1">{form.errors.email}</p>
        )}
      </div>
      <div>
        <textarea
          name="message"
          placeholder="メッセージ"
          value={form.values.message}
          onChange={form.handleChange as React.ChangeEventHandler<HTMLTextAreaElement>}
          onBlur={form.handleBlur as React.FocusEventHandler<HTMLTextAreaElement>}
          rows={3}
          className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${
            form.errors.message && form.touched.message
              ? 'border-red-400 bg-red-50'
              : 'border-slate-300'
          }`}
        />
        {form.errors.message && form.touched.message && (
          <p className="text-xs text-red-500 mt-1">{form.errors.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={!form.isValid}
        className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        送信する
      </button>
    </form>
  )
}

// -------------------------------------------------
// useFetch デモ
// -------------------------------------------------
type Post = {
  id: number
  title: string
  body: string
  userId: number
}

function FetchDemo() {
  const [postId, setPostId] = useState<number>(1)
  const url = `https://jsonplaceholder.typicode.com/posts/${postId}`
  const { data, loading, error, refetch } = useFetch<Post>(url)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-slate-600">投稿 ID：</span>
        {[1, 2, 3, 4, 5].map(id => (
          <button
            key={id}
            onClick={() => setPostId(id)}
            className={`w-8 h-8 rounded-full text-sm font-medium cursor-pointer transition-colors ${
              postId === id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {id}
          </button>
        ))}
        <button
          onClick={refetch}
          disabled={loading}
          className="ml-1 px-3 py-1 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer disabled:opacity-50"
        >
          再取得
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-2">
          <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          読み込み中...
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">⚠️ {error}</p>
      )}

      {data && !loading && (
        <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-2">
          <p className="font-medium text-slate-800">投稿 #{data.id}</p>
          <p className="font-semibold text-slate-700">{data.title}</p>
          <p className="text-slate-600 leading-relaxed">{data.body}</p>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------
// メインコンポーネント
// -------------------------------------------------
function CustomHooksDemo() {
  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">🪝 カスタムフック</h2>

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-6 leading-relaxed">
        <strong>カスタムフック</strong>とは、<code>use</code> で始まる関数で、
        他のフックを呼び出してロジックを再利用可能にしたものです。
        コンポーネントから状態管理ロジックを分離し、複数箇所で再利用できます。
      </p>

      {/* カスタムフックの基本説明 */}
      <section className="mb-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-2">🔑 カスタムフックのルール</h3>
        <div className="overflow-auto rounded-lg bg-slate-800 text-slate-100 p-4 text-sm font-mono leading-relaxed">
          <pre>{`// ✅ カスタムフックの命名規則：use で始める
function useCounter() {
  const [count, setCount] = useState(0)
  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  return { count, increment, decrement }  // 値と関数を返す
}

// コンポーネントから使う
function MyComponent() {
  const { count, increment, decrement } = useCounter()
  return <button onClick={increment}>{count}</button>
}`}</pre>
        </div>
      </section>

      {/* useCounter デモ */}
      <section className="mb-6">
        <h3 className="font-semibold mb-2 text-slate-800">
          1️⃣ useCounter — カウンター機能
        </h3>
        <CounterDemo />
      </section>

      {/* useForm デモ */}
      <section className="mb-6 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-3 text-slate-800">
          2️⃣ useForm — フォーム管理
        </h3>
        <ContactFormDemo />
      </section>

      {/* useFetch デモ */}
      <section className="mb-6 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-3 text-slate-800">
          3️⃣ useFetch — API 通信の汎用化
        </h3>
        <FetchDemo />
      </section>

      {/* まとめ */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="font-semibold mb-2">📌 ポイント</p>
        <ul className="leading-loose pl-5 mb-0 text-sm">
          <li>
            <strong>命名規則</strong>：必ず <code>use</code> で始める（React のルール）
          </li>
          <li>
            <strong>ロジックの分離</strong>：状態管理のロジックをコンポーネントから分離できる
          </li>
          <li>
            <strong>再利用性</strong>：同じフックを複数のコンポーネントで使い回せる
          </li>
          <li>
            <strong>テスト容易性</strong>：ロジックが分離されているのでテストしやすい
          </li>
        </ul>
      </div>

      {/* 確認問題 */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="font-semibold mb-2">✅ 確認問題</p>
        <ol className="leading-loose pl-5 mb-0 text-sm">
          <li>カスタムフックの命名規則は何ですか？その理由は？</li>
          <li><code>useCounter</code> を 2 つのコンポーネントで使った場合、状態は共有されますか？</li>
          <li><code>useFetch</code> で同じ URL を渡した複数コンポーネントがあるとき、リクエストは何回発生しますか？</li>
        </ol>
      </div>
    </div>
  )
}

export default CustomHooksDemo
