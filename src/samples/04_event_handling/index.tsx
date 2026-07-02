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
    <div style={styles.container}>
      <h2 style={styles.title}>🖱️ イベントハンドリング</h2>

      <p style={styles.note}>
        React では <code>on〇〇</code> という属性にハンドラ関数を渡します。<br />
        例：<code>onClick</code>、<code>onChange</code>、<code>onSubmit</code>、<code>onMouseMove</code>
      </p>

      {/* ① クリックイベント */}
      <section style={styles.section}>
        <h3>① onClick（クリック）</h3>
        <button style={styles.btn} onClick={handleClick}>
          クリックしてね
        </button>
        <ul style={styles.log}>
          {clickLog.map((log, i) => (
            <li key={i} style={{ opacity: 1 - i * 0.15 }}>{log}</li>
          ))}
        </ul>
      </section>

      {/* ② 入力イベント + フォーム送信 */}
      <section style={styles.section}>
        <h3>② onChange（入力）+ onSubmit（送信）</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="テキストを入力..."
            style={styles.input}
          />
          <button type="submit" style={styles.btn}>送信</button>
        </form>
        {/* リアルタイムで入力値を表示 */}
        <p>入力中：<strong>{inputValue || '（未入力）'}</strong>（文字数：{inputValue.length}）</p>
        {submitted && <p style={styles.success}>✅ 送信されました：「{submitted}」</p>}
      </section>

      {/* ③ マウス移動イベント */}
      <section style={styles.section}>
        <h3>③ onMouseMove（マウス移動）</h3>
        <div
          style={styles.mouseArea}
          onMouseMove={handleMouseMove}
        >
          <p>このエリアでマウスを動かしてみてください</p>
          <p>座標：X = {mousePos.x}、Y = {mousePos.y}</p>
        </div>
      </section>

      <div style={styles.tip}>
        <p>📌 ポイント</p>
        <ul>
          <li>イベントハンドラには <strong>関数の参照</strong> を渡します（<code>onClick={'{handleClick}'}</code>）</li>
          <li>引数が必要なときは <strong>アロー関数</strong> で包みます（<code>onClick={'{() => doSomething(id)}'}</code>）</li>
          <li><code>onChange</code> で入力値を取得するには <code>e.target.value</code> を使います</li>
          <li>フォームの送信は <code>e.preventDefault()</code> でページリロードを防ぎます</li>
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
    maxWidth: '640px',
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
  section: {
    marginBottom: '28px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '10px',
  },
  form: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
  },
  btn: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  log: {
    listStyle: 'none',
    padding: 0,
    margin: '8px 0 0',
    fontSize: '0.9rem',
    color: '#475569',
  },
  mouseArea: {
    height: '120px',
    background: '#e0f2fe',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'crosshair',
    userSelect: 'none',
  },
  success: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
  tip: {
    background: '#fefce8',
    border: '1px solid #fde68a',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '16px',
  },
}

export default EventHandling
