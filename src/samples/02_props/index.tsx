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
    <div
      className="rounded-xl p-5 min-w-[160px] text-center border border-slate-200"
      style={{ background: color }}
    >
      <span className="text-4xl">{emoji}</span>
      <h3 className="mt-2 mb-1 text-base font-semibold">{name}</h3>
      <p className="m-0 text-sm text-slate-500">{role}</p>
    </div>
  )
}

// -------------------------------------------------
// 親コンポーネント：ProfileCard を複数回使い回しています
// 同じコンポーネントに異なる Props を渡すだけでOKです
// -------------------------------------------------
function PropsDemo() {
  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">🎴 Props の基本</h2>

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-5 leading-relaxed">
        <strong>Props</strong> は親コンポーネントから子コンポーネントへ渡す<strong>データ</strong>です。<br />
        同じ <code>ProfileCard</code> を異なる Props で3回使い回しています。
      </p>

      {/* 同じコンポーネントに異なる Props を渡すだけで見た目が変わる */}
      <div className="flex gap-4 flex-wrap mb-6">
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

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="font-semibold mb-2">📌 ポイント</p>
        <ul className="leading-loose pl-5 mb-0">
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

export default PropsDemo
