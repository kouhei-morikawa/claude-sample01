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
    <div style={styles.counterBox}>
      <p style={styles.countDisplay}>{count}</p>
      <div style={styles.buttonRow}>
        {/* ボタンを押すと setCount が呼ばれ、画面が更新される */}
        <button style={styles.btn} onClick={() => setCount(count - 1)}>－</button>
        <button style={styles.btnReset} onClick={() => setCount(0)}>リセット</button>
        <button style={styles.btn} onClick={() => setCount(count + 1)}>＋</button>
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
    <div style={styles.container}>
      <h2 style={styles.title}>🔢 useState でカウンター</h2>

      <p style={styles.note}>
        <code>useState</code> は React に値を「覚えさせる」ための仕組みです。<br />
        通常の変数（<code>let count = 0</code>）は変更しても画面が更新されませんが、<br />
        <code>useState</code> を使うと値が変わるたびに <strong>自動で再レンダリング</strong> されます。
      </p>

      {/* シンプルなカウンター */}
      <h3>シンプルなカウンター</h3>
      <Counter />

      <hr style={styles.divider} />

      {/* ステップ付きカウンター */}
      <h3>ステップ付きカウンター</h3>
      <div style={styles.stepBox}>
        <label>
          増減幅：
          <select
            value={step}
            onChange={e => setStep(Number(e.target.value))}
            style={styles.select}
          >
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </label>
        <p style={styles.countDisplay}>{count}</p>
        <div style={styles.buttonRow}>
          <button style={styles.btn} onClick={decrement}>－{step}</button>
          <button style={styles.btnReset} onClick={() => setCount(0)}>リセット</button>
          <button style={styles.btn} onClick={increment}>＋{step}</button>
        </div>
      </div>

      <div style={styles.tip}>
        <p>📌 ポイント</p>
        <ul>
          <li><code>useState</code> は <strong>フック</strong>（Hook）と呼ばれる特別な関数です</li>
          <li>フックはコンポーネントの <strong>トップレベル</strong> でのみ呼び出せます（if 文の中などはNG）</li>
          <li>state を直接書き換えてはいけません — 必ず <strong>セッター関数</strong>（<code>setCount</code>）を使います</li>
          <li>同じコンポーネントを複数配置すると、それぞれが <strong>独立した state</strong> を持ちます</li>
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
    maxWidth: '600px',
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
    marginBottom: '20px',
    lineHeight: '1.7',
  },
  counterBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    background: '#f8fafc',
    borderRadius: '12px',
    width: 'fit-content',
  },
  stepBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    background: '#f8fafc',
    borderRadius: '12px',
  },
  countDisplay: {
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: 0,
    minWidth: '80px',
    textAlign: 'center',
  },
  buttonRow: {
    display: 'flex',
    gap: '8px',
  },
  btn: {
    padding: '8px 20px',
    fontSize: '1.1rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    cursor: 'pointer',
  },
  btnReset: {
    padding: '8px 16px',
    fontSize: '0.9rem',
    borderRadius: '8px',
    border: '1px solid #fca5a5',
    background: '#fff1f2',
    cursor: 'pointer',
  },
  select: {
    marginLeft: '8px',
    padding: '4px 8px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
  },
  divider: {
    margin: '24px 0',
    borderColor: '#e2e8f0',
  },
  tip: {
    background: '#fefce8',
    border: '1px solid #fde68a',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '24px',
  },
}

export default StateCounter
