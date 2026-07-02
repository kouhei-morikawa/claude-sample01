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
    return <p style={{ color: '#6366f1' }}>⏳ 読み込み中...</p>
  }
  if (status === 'error') {
    return <p style={{ color: '#ef4444' }}>❌ エラーが発生しました</p>
  }
  return <p style={{ color: '#16a34a' }}>✅ データの取得に成功しました！</p>
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
    scoreColor = '#16a34a'
  } else if (score >= 70) {
    scoreLabel = '👍 合格'
    scoreColor = '#2563eb'
  } else {
    scoreLabel = '📚 要再試験'
    scoreColor = '#ef4444'
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔀 条件分岐レンダリング</h2>

      <p style={styles.note}>
        React では JavaScript の条件式をそのまま JSX 内で使えます。
      </p>

      {/* ① 三項演算子：どちらか一方を表示 */}
      <section style={styles.section}>
        <h3>① 三項演算子（? :）</h3>
        <button style={styles.btn} onClick={() => setIsLoggedIn(!isLoggedIn)}>
          {isLoggedIn ? 'ログアウト' : 'ログイン'}
        </button>
        <p>
          状態：{isLoggedIn
            ? <span style={{ color: '#16a34a' }}>✅ ログイン中</span>
            : <span style={{ color: '#94a3b8' }}>❌ 未ログイン</span>
          }
        </p>
        {/* ログイン時だけ表示するメニュー（三項演算子） */}
        {isLoggedIn ? (
          <div style={styles.menu}>
            <p>👤 プロフィール</p>
            <p>⚙️ 設定</p>
            <p>📨 メッセージ</p>
          </div>
        ) : (
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>ログインするとメニューが表示されます</p>
        )}
      </section>

      {/* ② && 演算子：条件を満たす場合だけ表示 */}
      <section style={styles.section}>
        <h3>② && 演算子</h3>
        <button style={styles.btn} onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? '詳細を隠す' : '詳細を見る'}
        </button>
        {/* showDetails が true のときだけ表示される */}
        {showDetails && (
          <div style={styles.detailBox}>
            <p>これは詳細情報です。<code>&&</code> の左が <code>true</code> の場合だけ表示されます。</p>
            <p>⚠️ 注意：<code>0 && &lt;JSX&gt;</code> は <code>0</code> が表示されてしまうので、<code>!!count && ...</code> のように真偽値に変換しましょう。</p>
          </div>
        )}
      </section>

      {/* ③ コンポーネントを出し分ける */}
      <section style={styles.section}>
        <h3>③ コンポーネントの出し分け</h3>
        <div style={styles.btnGroup}>
          <button style={styles.btn} onClick={() => setStatus('loading')}>Loading</button>
          <button style={styles.btn} onClick={() => setStatus('success')}>Success</button>
          <button style={styles.btn} onClick={() => setStatus('error')}>Error</button>
        </div>
        <StatusMessage status={status} />
      </section>

      {/* ④ 変数に JSX を代入 */}
      <section style={styles.section}>
        <h3>④ 変数を使った条件分岐</h3>
        <label>
          スコア：
          <input
            type="range"
            min={0}
            max={100}
            value={score}
            onChange={e => setScore(Number(e.target.value))}
            style={{ marginLeft: '8px', verticalAlign: 'middle' }}
          />
          <strong style={{ marginLeft: '12px', color: scoreColor }}>
            {score}点 — {scoreLabel}
          </strong>
        </label>
      </section>

      <div style={styles.tip}>
        <p>📌 ポイント</p>
        <ul>
          <li><strong>三項演算子</strong>（<code>条件 ? A : B</code>）：どちらか一方を表示するとき</li>
          <li><strong>&& 演算子</strong>（<code>条件 && JSX</code>）：条件を満たすときだけ表示するとき</li>
          <li><strong>変数代入</strong>：複雑な条件は JSX の外で処理してから返すとすっきりします</li>
          <li>どの方法が適切かは場面によって変わります — 読みやすさを優先しましょう</li>
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
  btn: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    cursor: 'pointer',
    marginRight: '8px',
    marginBottom: '8px',
  },
  btnGroup: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  menu: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px 16px',
    marginTop: '8px',
  },
  detailBox: {
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: '8px',
    padding: '12px',
    marginTop: '8px',
  },
  tip: {
    background: '#fefce8',
    border: '1px solid #fde68a',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '8px',
  },
}

export default ConditionalRender
