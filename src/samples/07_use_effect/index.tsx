/**
 * サンプル07: useEffect
 *
 * 学習テーマ：
 * - useEffect の基本的な使い方
 * - 依存配列（dependency array）の3つのパターン
 * - クリーンアップ関数でリソースを解放する
 * - API フェッチのシミュレーション
 * - タイマーの例
 */
import { useState, useEffect } from 'react'

// -------------------------------------------------
// ① 依存配列なし：毎レンダリング後に実行
// -------------------------------------------------
function TitleUpdater() {
  const [count, setCount] = useState(0)

  // 依存配列を省略 → レンダリングのたびに実行される
  useEffect(() => {
    document.title = `カウント: ${count} — React 学習`
  })

  return (
    <div className="flex items-center gap-4">
      <span className="text-3xl font-bold w-16 text-center">{count}</span>
      <button
        className="px-4 py-2 rounded-lg border border-slate-300 bg-white cursor-pointer hover:bg-slate-100"
        onClick={() => setCount(c => c - 1)}
      >－</button>
      <button
        className="px-4 py-2 rounded-lg border border-slate-300 bg-white cursor-pointer hover:bg-slate-100"
        onClick={() => setCount(c => c + 1)}
      >＋</button>
      <span className="text-sm text-slate-500">（ブラウザのタブタイトルが変わります）</span>
    </div>
  )
}

// -------------------------------------------------
// ② 空の依存配列：マウント時のみ実行
// -------------------------------------------------
function MountLogger() {
  const [log, setLog] = useState<string[]>([])

  // [] → コンポーネントが画面に現れた瞬間だけ実行
  useEffect(() => {
    const time = new Date().toLocaleTimeString()
    setLog(prev => [...prev, `${time} マウントされました`])

    // クリーンアップ関数：コンポーネントが消えるとき（アンマウント時）に実行
    return () => {
      console.log('MountLogger がアンマウントされました')
    }
  }, [])

  return (
    <div>
      <ul className="list-none p-0 m-0 text-sm text-slate-600">
        {log.map((entry, i) => (
          <li key={i} className="py-0.5">✅ {entry}</li>
        ))}
      </ul>
      {log.length === 0 && (
        <p className="text-slate-400 text-sm">まだログはありません</p>
      )}
    </div>
  )
}

// -------------------------------------------------
// ③ 依存配列あり：query が変わったときだけ実行
//    + クリーンアップでデバウンス処理
// -------------------------------------------------
function SearchSimulator() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 空のときは何もしない
    if (!query.trim()) {
      setResult(null)
      return
    }

    setIsLoading(true)
    setResult(null)

    // 800ms 後に「API レスポンス」を返す（デバウンス処理）
    const timer = setTimeout(() => {
      setResult(`「${query}」の検索結果: ${query.length * 3} 件`)
      setIsLoading(false)
    }, 800)

    // クリーンアップ：query が変わったら前のタイマーをキャンセル
    return () => {
      clearTimeout(timer)
      setIsLoading(false)
    }
  }, [query]) // query が変わるたびに実行

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="検索キーワードを入力..."
        className="px-3 py-2 rounded-md border border-slate-300 text-base w-full max-w-xs"
      />
      {isLoading && <p className="text-indigo-500 text-sm">⏳ 検索中...</p>}
      {result && <p className="text-green-600 text-sm">✅ {result}</p>}
      {!query.trim() && !isLoading && (
        <p className="text-slate-400 text-sm">キーワードを入力すると検索します</p>
      )}
    </div>
  )
}

// -------------------------------------------------
// ④ タイマーの例：setInterval + クリーンアップ
// -------------------------------------------------
function StopWatch() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    // isRunning が false のときは何もしない
    if (!isRunning) return

    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    // クリーンアップ：isRunning が false になったらタイマーを止める
    return () => clearInterval(interval)
  }, [isRunning]) // isRunning が変わるたびに実行

  const reset = () => {
    setIsRunning(false)
    setSeconds(0)
  }

  const pad = (n: number) => String(n).padStart(2, '0')
  const hh = Math.floor(seconds / 3600)
  const mm = Math.floor((seconds % 3600) / 60)
  const ss = seconds % 60

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-3xl font-mono font-bold text-slate-700">
        {hh > 0 && `${pad(hh)}:`}{pad(mm)}:{pad(ss)}
      </span>
      <button
        className={`px-4 py-2 rounded-lg border cursor-pointer font-medium ${
          isRunning
            ? 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100'
            : 'border-green-400 bg-green-50 text-green-700 hover:bg-green-100'
        }`}
        onClick={() => setIsRunning(r => !r)}
      >
        {isRunning ? '⏸ 一時停止' : '▶ スタート'}
      </button>
      <button
        className="px-4 py-2 rounded-lg border border-slate-300 bg-white cursor-pointer hover:bg-slate-100"
        onClick={reset}
      >
        🔄 リセット
      </button>
    </div>
  )
}

// -------------------------------------------------
// ⑤ ウィンドウリサイズの監視：イベントリスナー + クリーンアップ
// -------------------------------------------------
function WindowWidthMonitor() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)

    // イベントリスナーを登録
    window.addEventListener('resize', handleResize)

    // クリーンアップ：リスナーを解除（メモリリーク防止）
    return () => window.removeEventListener('resize', handleResize)
  }, []) // マウント時に一度だけ登録

  const label =
    width < 640  ? 'sm（モバイル）' :
    width < 768  ? 'md（タブレット）' :
    width < 1024 ? 'lg（小デスクトップ）' :
                   'xl（大デスクトップ）'

  return (
    <p className="text-slate-700">
      現在の幅：<strong className="text-blue-600">{width}px</strong>
      <span className="ml-3 text-sm text-slate-500">（{label}）</span>
      <span className="ml-2 text-xs text-slate-400">← ウィンドウを広げてみてください</span>
    </p>
  )
}

// -------------------------------------------------
// メインコンポーネント
// -------------------------------------------------
function UseEffectDemo() {
  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">⚡ useEffect</h2>

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-6 leading-relaxed">
        <code>useEffect</code> はレンダリングの<strong>後</strong>に何かを実行するためのフックです。<br />
        DOM の操作・API フェッチ・タイマー・イベントリスナーの登録などに使います。
      </p>

      {/* ① 依存配列なし */}
      <section className="mb-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-1">① 依存配列なし — 毎レンダリング後に実行</h3>
        <p className="text-sm text-slate-500 mb-3">
          <code>useEffect{'(() => { ... })'}</code> — 毎回のレンダリング後に実行されます
        </p>
        <TitleUpdater />
      </section>

      {/* ② 空の依存配列 */}
      <section className="mb-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-1">② 空の依存配列 — マウント時のみ実行</h3>
        <p className="text-sm text-slate-500 mb-3">
          <code>useEffect{'(() => { ... }, [])'}</code> — コンポーネントが最初に表示されたときだけ実行
        </p>
        <MountLogger />
      </section>

      {/* ③ 依存配列あり */}
      <section className="mb-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-1">③ 依存配列あり — 特定の値が変わったときだけ実行</h3>
        <p className="text-sm text-slate-500 mb-3">
          <code>useEffect{'(() => { ... }, [query])'}</code> — <code>query</code> が変わるたびに実行
        </p>
        <SearchSimulator />
      </section>

      {/* ④ タイマー */}
      <section className="mb-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-1">④ クリーンアップ関数 — setInterval の後始末</h3>
        <p className="text-sm text-slate-500 mb-3">
          <code>return () =&gt; clearInterval(id)</code> — エフェクトが再実行される前にクリーンアップ
        </p>
        <StopWatch />
      </section>

      {/* ⑤ ウィンドウリサイズ */}
      <section className="mb-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-1">⑤ イベントリスナーの登録と解除</h3>
        <p className="text-sm text-slate-500 mb-3">
          <code>addEventListener</code> の登録は <code>useEffect</code> 内で行い、クリーンアップで <code>removeEventListener</code> します
        </p>
        <WindowWidthMonitor />
      </section>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="font-semibold mb-2">📌 ポイント</p>
        <ul className="leading-loose pl-5 mb-0">
          <li><strong>依存配列なし</strong>：毎レンダリング後に実行（基本的に使わない）</li>
          <li><strong>空の配列 <code>[]</code></strong>：マウント時（初回表示）だけ実行</li>
          <li><strong>値あり <code>[val]</code></strong>：<code>val</code> が変わるたびに実行</li>
          <li><strong>クリーンアップ関数</strong>：<code>return () =&gt; {'{ ... }'}</code> — タイマーやリスナーの解除に必須</li>
          <li>クリーンアップはアンマウント時と、次のエフェクト実行前の両方で呼ばれます</li>
        </ul>
      </div>
    </div>
  )
}

export default UseEffectDemo
