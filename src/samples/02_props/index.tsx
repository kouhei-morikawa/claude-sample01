/**
 * サンプル02: Props（プロパティ）の基本
 *
 * 学習テーマ：
 * - Props を使って親から子へデータを渡す
 * - Props の TypeScript 型定義
 * - Props を活用してコンポーネントを再利用する
 */

// -------------------------------------------------
// 型定義：このコンポーネントが受け取るデータの型を宣言します
// -------------------------------------------------
type ProfileCardProps = {
  name: string      // 名前（必須）
  role: string      // 役職（必須）
  emoji: string     // アイコン絵文字（必須）
  color?: string    // カードの色（省略可能 = Optional）
}

// -------------------------------------------------
// ProfileCard コンポーネント
// 受け取った Props をそのまま表示します
// -------------------------------------------------
function ProfileCard({ name, role, emoji, color = '#f8f9fa' }: ProfileCardProps) {
  return (
    <div style={{ ...styles.card, background: color }}>
      <span style={styles.emoji}>{emoji}</span>
      <h3 style={styles.name}>{name}</h3>
      <p style={styles.role}>{role}</p>
    </div>
  )
}

// -------------------------------------------------
// 親コンポーネント：ProfileCard を複数回使い回しています
// 同じコンポーネントに異なる Props を渡すだけでOKです
// -------------------------------------------------
function PropsDemo() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎴 Props の基本</h2>

      <p style={styles.note}>
        <strong>Props</strong> は親コンポーネントから子コンポーネントへ渡す<strong>データ</strong>です。<br />
        同じ <code>ProfileCard</code> を異なる Props で3回使い回しています。
      </p>

      {/* 同じコンポーネントに異なる Props を渡すだけで見た目が変わる */}
      <div style={styles.cardList}>
        <ProfileCard
          name="田中 花子"
          role="フロントエンドエンジニア"
          emoji="👩‍💻"
          color="#e0f2fe"
        />
        <ProfileCard
          name="鈴木 一郎"
          role="バックエンドエンジニア"
          emoji="🧑‍💻"
          color="#f0fdf4"
        />
        {/* color を省略 → デフォルト値 '#f8f9fa' が使われます */}
        <ProfileCard
          name="山田 太郎"
          role="デザイナー"
          emoji="🎨"
        />
      </div>

      <div style={styles.tip}>
        <p>📌 ポイント</p>
        <ul>
          <li>Props はコンポーネントの引数です（関数の引数と同じ仕組み）</li>
          <li>型を <code>type</code> や <code>interface</code> で宣言することで安全に使えます</li>
          <li><code>?</code> をつけると省略可能な Props になります</li>
          <li>デフォルト値は <code>= 値</code> の形で設定できます</li>
          <li>Props は <strong>読み取り専用</strong>：子コンポーネントで書き換えることはできません</li>
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
    maxWidth: '700px',
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
  cardList: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  card: {
    borderRadius: '12px',
    padding: '20px',
    minWidth: '160px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
  },
  emoji: {
    fontSize: '2.5rem',
  },
  name: {
    margin: '8px 0 4px',
    fontSize: '1rem',
  },
  role: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#64748b',
  },
  tip: {
    background: '#fefce8',
    border: '1px solid #fde68a',
    borderRadius: '8px',
    padding: '16px',
  },
}

export default PropsDemo
