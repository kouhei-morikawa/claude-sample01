/**
 * サンプル05: 条件分岐レンダリング
 *
 * 学習テーマ：
 * - && 演算子による条件付き表示
 * - 三項演算子（? :）による出し分け
 * - 変数を使った条件分岐
 * - コンポーネント自体を出し分ける
 */
import { useState } from 'react'

// -------------------------------------------------
// 型定義
// -------------------------------------------------
type Status = 'loading' | 'success' | 'error'

// -------------------------------------------------
// ステータスに応じて異なるコンポーネントを返す関数
// -------------------------------------------------
function StatusMessage({ status }: { status: Status }) {
  // 変数に JSX を代入して、後から返す書き方
  if (status === 'loading') {
    return <p className="text-indigo-500">⏳ 読み込み中...</p>
  }
  if (status === 'error') {
    return <p className="text-red-500">❌ エラーが発生しました</p>
  }
  return <p className="text-green-600">✅ データの取得に成功しました！</p>
}

// -------------------------------------------------
// メインコンポーネント
// -------------------------------------------------
function ConditionalRender() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [status, setStatus] = useState<Status>('loading')
  const [score, setScore] = useState(75)

  // スコアに応じたラベルを返す（if-else の代わりに変数を使う）
  let scoreLabel: string
  let scoreColor: string
  if (score >= 90) {
    scoreLabel = '🏆 優秀'
    scoreColor = 'text-green-600'
  } else if (score >= 70) {
    scoreLabel = '👍 合格'
    scoreColor = 'text-blue-600'
  } else {
    scoreLabel = '📚 要再試験'
    scoreColor = 'text-red-500'
  }

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">🔀 条件分岐レンダリング</h2>

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-5 leading-relaxed">
        React では JavaScript の条件式をそのまま JSX 内で使えます。
      </p>

      {/* ① 三項演算子：どちらか一方を表示 */}
      <section className="mb-7 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-3">① 三項演算子（? :）</h3>
        <button
          className="px-5 py-2 rounded-lg border border-slate-300 bg-white cursor-pointer hover:bg-slate-100 mr-2 mb-2"
          onClick={() => setIsLoggedIn(!isLoggedIn)}
        >
          {isLoggedIn ? 'ログアウト' : 'ログイン'}
        </button>
        <p>
          状態：{isLoggedIn
            ? <span className="text-green-600">✅ ログイン中</span>
            : <span className="text-slate-400">❌ 未ログイン</span>
          }
        </p>
        {/* ログイン時だけ表示するメニュー（三項演算子） */}
        {isLoggedIn ? (
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 mt-2">
            <p>👤 プロフィール</p>
            <p>⚙️ 設定</p>
            <p>📨 メッセージ</p>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">ログインするとメニューが表示されます</p>
        )}
      </section>

      {/* ② && 演算子：条件を満たす場合だけ表示 */}
      <section className="mb-7 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-3">② && 演算子</h3>
        <button
          className="px-5 py-2 rounded-lg border border-slate-300 bg-white cursor-pointer hover:bg-slate-100 mr-2 mb-2"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '詳細を隠す' : '詳細を見る'}
        </button>
        {/* showDetails が true のときだけ表示される */}
        {showDetails && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
            <p>これは詳細情報です。<code>&&</code> の左が <code>true</code> の場合だけ表示されます。</p>
            <p>⚠️ 注意：<code>0 && &lt;JSX&gt;</code> は <code>0</code> が表示されてしまうので、<code>!!count && ...</code> のように真偽値に変換しましょう。</p>
          </div>
        )}
      </section>

      {/* ③ コンポーネントを出し分ける */}
      <section className="mb-7 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-3">③ コンポーネントの出し分け</h3>
        <div className="flex gap-2 mb-3 flex-wrap">
          <button
            className="px-5 py-2 rounded-lg border border-slate-300 bg-white cursor-pointer hover:bg-slate-100"
            onClick={() => setStatus('loading')}
          >Loading</button>
          <button
            className="px-5 py-2 rounded-lg border border-slate-300 bg-white cursor-pointer hover:bg-slate-100"
            onClick={() => setStatus('success')}
          >Success</button>
          <button
            className="px-5 py-2 rounded-lg border border-slate-300 bg-white cursor-pointer hover:bg-slate-100"
            onClick={() => setStatus('error')}
          >Error</button>
        </div>
        <StatusMessage status={status} />
      </section>

      {/* ④ 変数に JSX を代入 */}
      <section className="mb-7 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-3">④ 変数を使った条件分岐</h3>
        <label>
          スコア：
          <input
            type="range"
            min={0}
            max={100}
            value={score}
            onChange={e => setScore(Number(e.target.value))}
            className="ml-2 align-middle"
          />
          <strong className={`ml-3 ${scoreColor}`}>
            {score}点 — {scoreLabel}
          </strong>
        </label>
      </section>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-2">
        <p className="font-semibold mb-2">📌 ポイント</p>
        <ul className="leading-loose pl-5 mb-0">
          <li><strong>三項演算子</strong>（<code>条件 ? A : B</code>）：どちらか一方を表示するとき</li>
          <li><strong>&& 演算子</strong>（<code>条件 && JSX</code>）：条件を満たすときだけ表示するとき</li>
          <li><strong>変数代入</strong>：複雑な条件は JSX の外で処理してから返すとすっきりします</li>
          <li>どの方法が適切かは場面によって変わります — 読みやすさを優先しましょう</li>
        </ul>
      </div>
    </div>
  )
}

export default ConditionalRender
