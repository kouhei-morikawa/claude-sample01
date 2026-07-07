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
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">👋 Hello, World!</h2>

      {/* Greeting コンポーネントを呼び出す */}
      <Greeting />

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mt-4 leading-relaxed">
        ポイント：React の UI は <strong>コンポーネント</strong> という部品の組み合わせで作ります。
      </p>

      <ul className="leading-loose pl-6">
        <li>コンポーネントは <code>function</code> キーワードで定義します</li>
        <li>コンポーネントの名前は <strong>大文字</strong> で始めます（例：<code>Greeting</code>）</li>
        <li>JSX は HTML に似た構文ですが、実は JavaScript です</li>
        <li>複数の要素を返すときは <code>&lt;div&gt;</code> や <code>&lt;&gt;&lt;/&gt;</code>（フラグメント）で囲みます</li>
      </ul>
    </div>
  )
}

export default HelloWorld
