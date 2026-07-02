/**
 * サンプル01: はじめてのコンポーネント（Hello World）
 *
 * 学習テーマ：
 * - JSX の書き方
 * - 関数コンポーネントの定義
 * - コンポーネントを組み合わせる
 */

// -------------------------------------------------
// 1. 最もシンプルなコンポーネント
//    「関数が JSX を返す」だけで React コンポーネントになります
// -------------------------------------------------
function Greeting() {
  return <p>こんにちは、React の世界へようこそ！</p>
}

// -------------------------------------------------
// 2. コンポーネントは入れ子にできます
//    親コンポーネントの中に子コンポーネントを書くだけです
// -------------------------------------------------
function HelloWorld() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👋 Hello, World!</h2>

      {/* Greeting コンポーネントを呼び出す */}
      <Greeting />

      <p style={styles.note}>
        ポイント：React の UI は <strong>コンポーネント</strong> という部品の組み合わせで作ります。
      </p>

      <ul style={styles.list}>
        <li>コンポーネントは <code>function</code> キーワードで定義します</li>
        <li>コンポーネントの名前は <strong>大文字</strong> で始めます（例：<code>Greeting</code>）</li>
        <li>JSX は HTML に似た構文ですが、実は JavaScript です</li>
        <li>複数の要素を返すときは <code>&lt;div&gt;</code> や <code>&lt;&gt;&lt;/&gt;</code>（フラグメント）で囲みます</li>
      </ul>
    </div>
  )
}

// -------------------------------------------------
// スタイル（見た目の定義）
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
    marginTop: '16px',
  },
  list: {
    lineHeight: '1.8',
    paddingLeft: '24px',
  },
}

export default HelloWorld
