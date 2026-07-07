/**
 * サンプル03: useState でカウンター
 *
 * 学習テーマ：
 * - useState で状態（state）を管理する
 * - state が変わると画面が再レンダリングされる仕組みを理解する
 * - 複数の state を使い分ける
 */
import { useState } from 'react'

// -------------------------------------------------
// シンプルなカウンターコンポーネント
// -------------------------------------------------
function Counter() {
  // useState の使い方：
  //   const [現在の値, 値を変える関数] = useState(初期値)
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center gap-3 p-5 bg-slate-50 rounded-xl w-fit">
      <p className="text-5xl font-bold m-0 min-w-[80px] text-center">{count}</p>
      <div className="flex gap-2">
        {/* ボタンを押すと setCount が呼ばれ、画面が更新される */}
        <button
          className="px-5 py-2 text-lg rounded-lg border border-slate-300 bg-white cursor-pointer hover:bg-slate-50"
          onClick={() => setCount(count - 1)}
        >－</button>
        <button
          className="px-4 py-2 text-sm rounded-lg border border-rose-300 bg-rose-50 cursor-pointer hover:bg-rose-100"
          onClick={() => setCount(0)}
        >リセット</button>
        <button
          className="px-5 py-2 text-lg rounded-lg border border-slate-300 bg-white cursor-pointer hover:bg-slate-50"
          onClick={() => setCount(count + 1)}
        >＋</button>
      </div>
    </div>
  )
}

// -------------------------------------------------
// メインコンポーネント
// -------------------------------------------------
function StateCounter() {
  // state は同じコンポーネント内で複数持てます
  const [step, setStep] = useState(1)  // 増減幅
  const [count, setCount] = useState(0)

  const increment = () => setCount(count + step)
  const decrement = () => setCount(count - step)

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">🔢 useState でカウンター</h2>

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-5 leading-relaxed">
        <code>useState</code> は React に値を「覚えさせる」ための仕組みです。<br />
        通常の変数（<code>let count = 0</code>）は変更しても画面が更新されませんが、<br />
        <code>useState</code> を使うと値が変わるたびに <strong>自動で再レンダリング</strong> されます。
      </p>

      {/* シンプルなカウンター */}
      <h3 className="font-semibold mb-2">シンプルなカウンター</h3>
      <Counter />

      <hr className="my-6 border-slate-200" />

      {/* ステップ付きカウンター */}
      <h3 className="font-semibold mb-2">ステップ付きカウンター</h3>
      <div className="flex flex-col items-center gap-3 p-5 bg-slate-50 rounded-xl">
        <label>
          増減幅：
          <select
            value={step}
            onChange={e => setStep(Number(e.target.value))}
            className="ml-2 px-2 py-1 rounded-md border border-slate-300"
          >
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </label>
        <p className="text-5xl font-bold m-0 min-w-[80px] text-center">{count}</p>
        <div className="flex gap-2">
          <button
            className="px-5 py-2 text-lg rounded-lg border border-slate-300 bg-white cursor-pointer hover:bg-slate-50"
            onClick={decrement}
          >－{step}</button>
          <button
            className="px-4 py-2 text-sm rounded-lg border border-rose-300 bg-rose-50 cursor-pointer hover:bg-rose-100"
            onClick={() => setCount(0)}
          >リセット</button>
          <button
            className="px-5 py-2 text-lg rounded-lg border border-slate-300 bg-white cursor-pointer hover:bg-slate-50"
            onClick={increment}
          >＋{step}</button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <p className="font-semibold mb-2">📌 ポイント</p>
        <ul className="leading-loose pl-5 mb-0">
          <li><code>useState</code> は <strong>フック</strong>（Hook）と呼ばれる特別な関数です</li>
          <li>フックはコンポーネントの <strong>トップレベル</strong> でのみ呼び出せます（if 文の中などはNG）</li>
          <li>state を直接書き換えてはいけません — 必ず <strong>セッター関数</strong>（<code>setCount</code>）を使います</li>
          <li>同じコンポーネントを複数配置すると、それぞれが <strong>独立した state</strong> を持ちます</li>
        </ul>
      </div>
    </div>
  )
}

export default StateCounter
