/**
 * サンプル04: イベントハンドリング
 *
 * 学習テーマ：
 * - onClick / onChange / onSubmit などのイベント
 * - イベントオブジェクト（e）の使い方
 * - イベントハンドラ関数の書き方パターン
 */
import { useState } from 'react'

function EventHandling() {
  // 各イベントの結果を表示するための state
  const [clickLog, setClickLog] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [submitted, setSubmitted] = useState('')

  // ---- クリックイベント ----
  const handleClick = () => {
    const now = new Date().toLocaleTimeString()
    // 前の配列をコピーして新しい要素を追加（state の不変性を保つ）
    setClickLog(prev => [`${now} クリックされました`, ...prev].slice(0, 5))
  }

  // ---- 入力イベント：e.target.value で入力値を取得 ----
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // ---- マウス移動イベント：座標を取得 ----
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  // ---- フォームの送信イベント ----
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault() でページリロードを防ぐ
    e.preventDefault()
    setSubmitted(inputValue)
    setInputValue('')
  }

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">🖱️ イベントハンドリング</h2>

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-5 leading-relaxed">
        React では <code>on〇〇</code> という属性にハンドラ関数を渡します。<br />
        例：<code>onClick</code>、<code>onChange</code>、<code>onSubmit</code>、<code>onMouseMove</code>
      </p>

      {/* ① クリックイベント */}
      <section className="mb-7 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-3">① onClick（クリック）</h3>
        <button
          className="px-5 py-2 rounded-lg border border-slate-300 bg-white cursor-pointer hover:bg-slate-100 mr-2 mb-2"
          onClick={handleClick}
        >
          クリックしてね
        </button>
        <ul className="list-none p-0 mt-2 text-sm text-slate-600">
          {clickLog.map((log, i) => (
            <li key={i} style={{ opacity: 1 - i * 0.15 }}>{log}</li>
          ))}
        </ul>
      </section>

      {/* ② 入力イベント + フォーム送信 */}
      <section className="mb-7 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-3">② onChange（入力）+ onSubmit（送信）</h3>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="テキストを入力..."
            className="flex-1 px-3 py-2 rounded-md border border-slate-300 text-base"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-lg border border-slate-300 bg-white cursor-pointer hover:bg-slate-100"
          >送信</button>
        </form>
        {/* リアルタイムで入力値を表示 */}
        <p>入力中：<strong>{inputValue || '（未入力）'}</strong>（文字数：{inputValue.length}）</p>
        {submitted && <p className="text-green-700 font-bold">✅ 送信されました：「{submitted}」</p>}
      </section>

      {/* ③ マウス移動イベント */}
      <section className="mb-7 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-3">③ onMouseMove（マウス移動）</h3>
        <div
          className="h-28 bg-sky-100 rounded-xl flex flex-col items-center justify-center cursor-crosshair select-none"
          onMouseMove={handleMouseMove}
        >
          <p>このエリアでマウスを動かしてみてください</p>
          <p>座標：X = {mousePos.x}、Y = {mousePos.y}</p>
        </div>
      </section>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <p className="font-semibold mb-2">📌 ポイント</p>
        <ul className="leading-loose pl-5 mb-0">
          <li>イベントハンドラには <strong>関数の参照</strong> を渡します（<code>onClick={'{handleClick}'}</code>）</li>
          <li>引数が必要なときは <strong>アロー関数</strong> で包みます（<code>onClick={'{() => doSomething(id)}'}</code>）</li>
          <li><code>onChange</code> で入力値を取得するには <code>e.target.value</code> を使います</li>
          <li>フォームの送信は <code>e.preventDefault()</code> でページリロードを防ぎます</li>
        </ul>
      </div>
    </div>
  )
}

export default EventHandling
