/**
 * サンプル06: リストのレンダリング
 *
 * 学習テーマ：
 * - map() でリストを表示する
 * - key の役割と正しい指定方法
 * - filter() と map() を組み合わせる
 * - ソートとリストの更新
 */
import { useState } from 'react'

// -------------------------------------------------
// 型定義
// -------------------------------------------------
type Fruit = {
  id: number
  name: string
  emoji: string
  category: 'tropical' | 'citrus' | 'berry'
  price: number
}

// -------------------------------------------------
// 初期データ
// -------------------------------------------------
const INITIAL_FRUITS: Fruit[] = [
  { id: 1, name: 'バナナ',      emoji: '🍌', category: 'tropical', price: 120 },
  { id: 2, name: 'オレンジ',    emoji: '🍊', category: 'citrus',   price: 150 },
  { id: 3, name: 'いちご',      emoji: '🍓', category: 'berry',    price: 350 },
  { id: 4, name: 'マンゴー',    emoji: '🥭', category: 'tropical', price: 500 },
  { id: 5, name: 'レモン',      emoji: '🍋', category: 'citrus',   price: 100 },
  { id: 6, name: 'ブルーベリー', emoji: '🫐', category: 'berry',   price: 280 },
]

const CATEGORY_LABELS: Record<Fruit['category'], string> = {
  tropical: '🌴 トロピカル',
  citrus:   '🍋 柑橘系',
  berry:    '🍓 ベリー系',
}

// -------------------------------------------------
// リストアイテムコンポーネント
// -------------------------------------------------
function FruitItem({ fruit, onDelete }: { fruit: Fruit; onDelete: (id: number) => void }) {
  return (
    <li className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl">
      <span className="text-2xl">{fruit.emoji}</span>
      <span className="font-bold flex-1">{fruit.name}</span>
      <span className="text-xs text-slate-500">{CATEGORY_LABELS[fruit.category]}</span>
      <span className="font-bold text-sky-700 min-w-[60px] text-right">¥{fruit.price}</span>
      <button
        className="px-2.5 py-1 rounded-md border border-rose-300 bg-rose-50 cursor-pointer text-sm hover:bg-rose-100"
        onClick={() => onDelete(fruit.id)}
      >削除</button>
    </li>
  )
}

// -------------------------------------------------
// メインコンポーネント
// -------------------------------------------------
function ListRender() {
  const [fruits, setFruits] = useState<Fruit[]>(INITIAL_FRUITS)
  const [filter, setFilter] = useState<Fruit['category'] | 'all'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')

  // フィルター処理
  const filtered = filter === 'all'
    ? fruits
    : fruits.filter(f => f.category === filter)

  // ソート処理
  const sorted = [...filtered].sort((a, b) =>
    sortBy === 'name' ? a.name.localeCompare(b.name) : a.price - b.price
  )

  // 削除処理
  const handleDelete = (id: number) => {
    setFruits(prev => prev.filter(f => f.id !== id))
  }

  // リセット処理
  const handleReset = () => setFruits(INITIAL_FRUITS)

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">📋 リストのレンダリング</h2>

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-4 leading-relaxed">
        配列の <code>.map()</code> で複数の要素を一気に描画できます。<br />
        各要素には必ず <strong>一意の <code>key</code></strong> を指定することが重要です。
      </p>

      {/* コントロールパネル */}
      <div className="flex gap-4 flex-wrap items-center p-3 bg-slate-50 rounded-xl mb-4">
        <div>
          <label>カテゴリー：</label>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as typeof filter)}
            className="ml-2 px-2 py-1 rounded-md border border-slate-300"
          >
            <option value="all">すべて</option>
            <option value="tropical">🌴 トロピカル</option>
            <option value="citrus">🍋 柑橘系</option>
            <option value="berry">🍓 ベリー系</option>
          </select>
        </div>
        <div>
          <label>ソート：</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="ml-2 px-2 py-1 rounded-md border border-slate-300"
          >
            <option value="name">名前順</option>
            <option value="price">価格順</option>
          </select>
        </div>
        <button
          className="px-4 py-1.5 rounded-lg border border-rose-300 bg-rose-50 cursor-pointer hover:bg-rose-100"
          onClick={handleReset}
        >リセット</button>
      </div>

      {/* フルーツのリスト */}
      <p className="text-slate-500 text-sm mb-2">{sorted.length} 件表示中</p>

      {/* リストが空のときの表示 */}
      {sorted.length === 0 ? (
        <p className="text-center text-slate-400 py-8 bg-slate-50 rounded-xl">フルーツがありません</p>
      ) : (
        <ul className="list-none p-0 m-0 flex flex-col gap-2">
          {/* key は各要素を一意に識別するために必須 */}
          {sorted.map(fruit => (
            <FruitItem
              key={fruit.id}
              fruit={fruit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <p className="font-semibold mb-2">📌 ポイント</p>
        <ul className="leading-loose pl-5 mb-0">
          <li><code>key</code> は React がリストの変化を効率的に検出するために使います</li>
          <li><code>key</code> には <strong>安定した一意の値</strong>（ID など）を使います — 配列のインデックスは避けましょう</li>
          <li>state の配列を更新するときは <strong>新しい配列</strong> を作ります（元の配列を直接変更してはいけない）</li>
          <li><code>filter()</code> / <code>sort()</code> / <code>map()</code> を組み合わせると、表示の加工が柔軟にできます</li>
        </ul>
      </div>
    </div>
  )
}

export default ListRender
