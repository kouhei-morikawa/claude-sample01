/**
 * サンプル13: React.memo / useCallback / useMemo
 *
 * 学習テーマ：
 * - 不要な再レンダリングとは
 * - React.memo でコンポーネントをメモ化
 * - useCallback で関数をメモ化
 * - useMemo で値をメモ化
 * - 再レンダリング回数の可視化
 */
import { useState, useCallback, useMemo, useRef, memo } from 'react'

// =================================================
// ユーティリティ：レンダリング回数カウンター
// =================================================

function useRenderCount() {
  const count = useRef(0)
  count.current += 1
  return count.current
}

// =================================================
// 子コンポーネント（React.memo なし）
// =================================================

function CounterDisplay({ value, label }: { value: number; label: string }) {
  const renders = useRenderCount()
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm">
      <span className="text-slate-700">
        {label}：<strong className="text-slate-900">{value}</strong>
      </span>
      <span className="text-xs text-red-500 font-medium">レンダリング {renders} 回</span>
    </div>
  )
}

// =================================================
// 子コンポーネント（React.memo あり）
// =================================================

const MemoizedDisplay = memo(function MemoizedDisplay({
  value,
  label,
}: {
  value: number
  label: string
}) {
  const renders = useRenderCount()
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm">
      <span className="text-slate-700">
        {label}：<strong className="text-slate-900">{value}</strong>
      </span>
      <span className="text-xs text-green-600 font-medium">レンダリング {renders} 回</span>
    </div>
  )
})

// =================================================
// ボタンコンポーネント（React.memo + useCallback の組み合わせ）
// =================================================

const MemoizedButton = memo(function MemoizedButton({
  label,
  onClick,
  color = 'blue',
}: {
  label: string
  onClick: () => void
  color?: 'blue' | 'purple'
}) {
  const renders = useRenderCount()
  const colorClass =
    color === 'blue'
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-purple-600 hover:bg-purple-700'

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 ${colorClass} text-white rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-2`}
    >
      {label}
      <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">
        {renders} 回
      </span>
    </button>
  )
})

// =================================================
// メインデモコンポーネント
// =================================================

function MemoDemo() {
  const [count, setCount] = useState(0)
  const [score, setScore] = useState(0)
  const parentRenders = useRenderCount()

  // ❌ useCallback なし：毎回新しい関数が作られる
  const incrementCount = () => setCount(c => c + 1)
  const incrementScore = () => setScore(s => s + 1)

  // ✅ useCallback あり：依存配列が変わらない限り同じ関数参照
  const memoIncrementCount = useCallback(() => setCount(c => c + 1), [])
  const memoIncrementScore = useCallback(() => setScore(s => s + 1), [])

  // ✅ useMemo：重い計算をキャッシュ
  const expensiveValue = useMemo(() => {
    // 擬似的に重い計算を表現
    let sum = 0
    for (let i = 0; i <= count * 1000; i++) sum += i
    return sum
  }, [count])  // count が変わったときだけ再計算

  return (
    <div className="space-y-5">
      {/* 親コンポーネントのレンダリング回数 */}
      <div className="bg-slate-100 rounded-lg p-3 text-sm font-medium text-slate-700">
        🔁 親コンポーネントのレンダリング回数：{parentRenders} 回
      </div>

      {/* カウント・スコア操作ボタン */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setCount(c => c + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
        >
          count +1
        </button>
        <button
          onClick={() => setScore(s => s + 1)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 cursor-pointer"
        >
          score +1
        </button>
      </div>

      {/* React.memo の比較 */}
      <div>
        <h4 className="font-semibold text-sm text-slate-700 mb-2">
          React.memo の効果（score を変更しても count 表示は再レンダリングされないはず）
        </h4>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-slate-500 mb-1">❌ memo なし（親が再レンダリングすると常に再レンダリング）</p>
            <CounterDisplay value={count} label="count" />
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">✅ memo あり（props が変わらない限り再レンダリングしない）</p>
            <MemoizedDisplay value={count} label="count (memo)" />
          </div>
        </div>
      </div>

      {/* useCallback の比較 */}
      <div>
        <h4 className="font-semibold text-sm text-slate-700 mb-2">
          useCallback の効果（ボタンの再レンダリング回数に注目）
        </h4>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-slate-500 mb-1">
              ❌ useCallback なし（毎回新しい関数 → memo があっても再レンダリング）
            </p>
            <div className="flex gap-2">
              <MemoizedButton label="count +1" onClick={incrementCount} color="blue" />
              <MemoizedButton label="score +1" onClick={incrementScore} color="purple" />
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">
              ✅ useCallback あり（関数参照が安定 → 不要な再レンダリングを防ぐ）
            </p>
            <div className="flex gap-2">
              <MemoizedButton label="count +1" onClick={memoIncrementCount} color="blue" />
              <MemoizedButton label="score +1" onClick={memoIncrementScore} color="purple" />
            </div>
          </div>
        </div>
      </div>

      {/* useMemo の例 */}
      <div>
        <h4 className="font-semibold text-sm text-slate-700 mb-2">
          useMemo の効果（count が変わったときだけ計算）
        </h4>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
          <p className="text-slate-600">
            count（{count}）を使った計算結果：
            <strong className="text-slate-900 ml-1 tabular-nums">{expensiveValue.toLocaleString()}</strong>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            score（{score}）を変更しても再計算されません
          </p>
        </div>
      </div>
    </div>
  )
}

// =================================================
// メインコンポーネント
// =================================================

function MemoCallbackDemo() {
  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">⚡ React.memo / useCallback / useMemo</h2>

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-6 leading-relaxed">
        React のコンポーネントは、親が再レンダリングされると子も再レンダリングされます。
        <strong>React.memo</strong>・<strong>useCallback</strong>・<strong>useMemo</strong>{' '}
        を使うと、不要な再レンダリングや再計算を防いでパフォーマンスを改善できます。
      </p>

      {/* 概要テーブル */}
      <section className="mb-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-3">🔑 3 つの最適化 API</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-200">
                <th className="px-3 py-2 text-left border border-slate-300">API</th>
                <th className="px-3 py-2 text-left border border-slate-300">対象</th>
                <th className="px-3 py-2 text-left border border-slate-300">効果</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['React.memo', 'コンポーネント', 'props が変わらない限り再レンダリングをスキップ'],
                ['useCallback', '関数', '依存配列が変わらない限り同じ関数参照を返す'],
                ['useMemo', '計算結果（値）', '依存配列が変わらない限りキャッシュした値を返す'],
              ].map(([api, target, effect]) => (
                <tr key={api} className="even:bg-slate-50">
                  <td className="px-3 py-2 border border-slate-300 font-mono font-medium">{api}</td>
                  <td className="px-3 py-2 border border-slate-300">{target}</td>
                  <td className="px-3 py-2 border border-slate-300 text-slate-600">{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* デモ */}
      <section className="mb-6 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4 text-slate-800">🎮 再レンダリング可視化デモ</h3>
        <MemoDemo />
      </section>

      {/* まとめ */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="font-semibold mb-2">📌 ポイント</p>
        <ul className="leading-loose pl-5 mb-0 text-sm">
          <li>
            <strong>React.memo は props が変わったときは再レンダリングする</strong>（ミュート化ではない）
          </li>
          <li>
            <strong>useCallback と React.memo はセットで効果を発揮</strong>する
            （useCallback なしで関数を渡すと、毎回新しい参照になって memo が意味をなさない）
          </li>
          <li>
            <strong>useMemo は計算コストが高い処理に使う</strong>
            （軽い計算への過剰な useMemo はかえって遅くなることも）
          </li>
          <li>
            <strong>最初から最適化しない</strong>：問題が起きてから対処するのが推奨
          </li>
        </ul>
      </div>

      {/* 確認問題 */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="font-semibold mb-2">✅ 確認問題</p>
        <ol className="leading-loose pl-5 mb-0 text-sm">
          <li>React.memo でメモ化されたコンポーネントが再レンダリングされるのはどんな場合ですか？</li>
          <li>useCallback を使っても memo の子コンポーネントが再レンダリングされる場合があります。どんな場合ですか？</li>
          <li>useMemo の依存配列が空（<code>[]</code>）の場合、どんな挙動になりますか？</li>
        </ol>
      </div>
    </div>
  )
}

export default MemoCallbackDemo
