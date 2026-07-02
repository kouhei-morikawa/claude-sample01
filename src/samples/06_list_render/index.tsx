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
  { id: 1, name: 'バナナ',     emoji: '🍌', category: 'tropical', price: 120 },
  { id: 2, name: 'オレンジ',   emoji: '🍊', category: 'citrus',   price: 150 },
  { id: 3, name: 'いちご',     emoji: '🍓', category: 'berry',    price: 350 },
  { id: 4, name: 'マンゴー',   emoji: '🥭', category: 'tropical', price: 500 },
  { id: 5, name: 'レモン',     emoji: '🍋', category: 'citrus',   price: 100 },
  { id: 6, name: 'ブルーベリー', emoji: '🫐', category: 'berry',  price: 280 },
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
    <li style={styles.item}>
      <span style={styles.emoji}>{fruit.emoji}</span>
      <span style={styles.name}>{fruit.name}</span>
      <span style={styles.category}>{CATEGORY_LABELS[fruit.category]}</span>
      <span style={styles.price}>¥{fruit.price}</span>
      <button style={styles.deleteBtn} onClick={() => onDelete(fruit.id)}>削除</button>
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
    <div style={styles.container}>
      <h2 style={styles.title}>📋 リストのレンダリング</h2>

      <p style={styles.note}>
        配列の <code>.map()</code> で複数の要素を一気に描画できます。<br />
        各要素には必ず <strong>一意の <code>key</code></strong> を指定することが重要です。
      </p>

      {/* コントロールパネル */}
      <div style={styles.controls}>
        <div>
          <label>カテゴリー：</label>
          <select value={filter} onChange={e => setFilter(e.target.value as typeof filter)} style={styles.select}>
            <option value="all">すべて</option>
            <option value="tropical">🌴 トロピカル</option>
            <option value="citrus">🍋 柑橘系</option>
            <option value="berry">🍓 ベリー系</option>
          </select>
        </div>
        <div>
          <label>ソート：</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} style={styles.select}>
            <option value="name">名前順</option>
            <option value="price">価格順</option>
          </select>
        </div>
        <button style={styles.resetBtn} onClick={handleReset}>リセット</button>
      </div>

      {/* フルーツのリスト */}
      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
        {sorted.length} 件表示中
      </p>

      {/* リストが空のときの表示 */}
      {sorted.length === 0 ? (
        <p style={styles.empty}>フルーツがありません</p>
      ) : (
        <ul style={styles.list}>
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

      <div style={styles.tip}>
        <p>📌 ポイント</p>
        <ul>
          <li><code>key</code> は React がリストの変化を効率的に検出するために使います</li>
          <li><code>key</code> には <strong>安定した一意の値</strong>（ID など）を使います — 配列のインデックスは避けましょう</li>
          <li>state の配列を更新するときは <strong>新しい配列</strong> を作ります（元の配列を直接変更してはいけない）</li>
          <li><code>filter()</code> / <code>sort()</code> / <code>map()</code> を組み合わせると、表示の加工が柔軟にできます</li>
        </ul>
      </div>
    </div>
  )
}

// -------------------------------------------------
// スタイル
// -------------------------------------------------
const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '24px',
    maxWidth: '680px',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '16px',
  },
  note: {
    background: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '16px',
    lineHeight: '1.7',
  },
  controls: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: '12px',
    background: '#f8fafc',
    borderRadius: '10px',
    marginBottom: '16px',
  },
  select: {
    marginLeft: '8px',
    padding: '4px 8px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
  },
  resetBtn: {
    padding: '6px 16px',
    borderRadius: '8px',
    border: '1px solid #fca5a5',
    background: '#fff1f2',
    cursor: 'pointer',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
  },
  emoji: {
    fontSize: '1.5rem',
  },
  name: {
    fontWeight: 'bold',
    flex: 1,
  },
  category: {
    fontSize: '0.8rem',
    color: '#64748b',
  },
  price: {
    fontWeight: 'bold',
    color: '#0369a1',
    minWidth: '60px',
    textAlign: 'right',
  },
  deleteBtn: {
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid #fca5a5',
    background: '#fff1f2',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  empty: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '32px',
    background: '#f8fafc',
    borderRadius: '10px',
  },
  tip: {
    background: '#fefce8',
    border: '1px solid #fde68a',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '16px',
  },
}

export default ListRender
