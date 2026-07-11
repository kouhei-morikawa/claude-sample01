/**
 * サンプル16: 多言語対応（i18n）
 *
 * react-i18next を使った国際化（Internationalization）の基本パターンを学びます。
 *
 * 学習ポイント：
 * - useTranslation hook で翻訳テキストを取得する
 * - i18n.changeLanguage() で言語を切り替える
 * - 変数補間（Interpolation）：{{name}} で動的な値を埋め込む
 * - 複数形（Pluralization）：count に応じた表現を切り替える
 * - ネームスペース：翻訳ファイルを common / todo に分割して管理する
 * - Trans コンポーネント：JSX を含む翻訳を行う
 */

// i18n を最初に初期化（他のインポートより先に実行する必要がある）
import './i18n'

import { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'

// =================================================
// 型定義
// =================================================

type TodoItem = {
  id: number
  text: string
  done: boolean
}

// =================================================
// セクション 1: 基本翻訳と言語切替
// =================================================

function BasicSection() {
  // useTranslation(namespace) でそのネームスペースの翻訳関数 t と i18n インスタンスを取得
  const { t, i18n } = useTranslation('common')

  const switchLang = (lang: string) => {
    // changeLanguage() を呼ぶだけで全コンポーネントが再レンダリングされる
    i18n.changeLanguage(lang)
  }

  return (
    <div className="space-y-3">
      {/* 現在の言語表示 */}
      <p className="text-sm text-slate-600">
        {/* t() に変数を渡す例（変数補間） */}
        {t('currentLang', { lang: i18n.language === 'ja' ? '日本語' : 'English' })}
      </p>

      {/* 言語切替ボタン */}
      <div className="flex gap-2">
        <button
          onClick={() => switchLang('ja')}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors border ${
            i18n.language === 'ja'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
          }`}
        >
          {/* t() でキーに対応した翻訳テキストを取得 */}
          {t('buttons.japanese')}
        </button>
        <button
          onClick={() => switchLang('en')}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors border ${
            i18n.language === 'en'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
          }`}
        >
          {t('buttons.english')}
        </button>
      </div>

      {/* シンプルなキー翻訳 */}
      <div className="p-3 bg-slate-50 rounded-lg font-mono text-sm space-y-1">
        <p className="text-slate-500 text-xs">{'t("appTitle")  →'}</p>
        <p className="text-slate-800 font-medium">{t('appTitle')}</p>
      </div>
    </div>
  )
}

// =================================================
// セクション 2: 変数補間（Interpolation）
// =================================================

function InterpolationSection() {
  const { t } = useTranslation('common')
  const [name, setName] = useState('山田')

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        翻訳テキスト内の <code className="bg-slate-100 px-1 rounded text-xs">{'{{name}}'}</code> に動的な値を埋め込みます。
      </p>

      {/* 名前入力 */}
      <div className="flex gap-2 items-center">
        <label htmlFor="i18n-demo-name" className="text-sm text-slate-600 flex-shrink-0">名前：</label>
        <input
          id="i18n-demo-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="名前を入力..."
        />
      </div>

      {/* 結果表示 */}
      <div className="p-3 bg-slate-50 rounded-lg font-mono text-sm space-y-1">
        <p className="text-slate-500 text-xs">{'t("hello", { name }) →'}</p>
        <p className="text-slate-800 font-medium">
          {/* 第2引数にオブジェクトを渡すと {{name}} が置き換えられる */}
          {t('hello', { name })}
        </p>
      </div>

      {/* 翻訳ファイルの内容 */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-blue-50 rounded-lg text-xs">
          <p className="font-semibold text-blue-700 mb-1">ja/common.json</p>
          <code className="text-blue-600">{"\"hello\": \"こんにちは、{{name}}さん！\""}</code>
        </div>
        <div className="p-2 bg-green-50 rounded-lg text-xs">
          <p className="font-semibold text-green-700 mb-1">en/common.json</p>
          <code className="text-green-600">{"\"hello\": \"Hello, {{name}}!\""}</code>
        </div>
      </div>
    </div>
  )
}

// =================================================
// セクション 3: 複数形（Pluralization）
// =================================================

function PluralizationSection() {
  const { t } = useTranslation('common')
  const [count, setCount] = useState(3)

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        <code className="bg-slate-100 px-1 rounded text-xs">count</code> の値に応じて翻訳テキストを自動で切り替えます。
        キーに <code className="bg-slate-100 px-1 rounded text-xs">_zero / _one / _other</code> を付けて定義します。
      </p>

      {/* カウント操作 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCount(c => Math.max(0, c - 1))}
          className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold cursor-pointer transition-colors"
        >
          −
        </button>
        <span className="text-2xl font-bold tabular-nums w-8 text-center">{count}</span>
        <button
          onClick={() => setCount(c => c + 1)}
          className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold cursor-pointer transition-colors"
        >
          ＋
        </button>
      </div>

      {/* 結果表示 */}
      <div className="p-3 bg-slate-50 rounded-lg font-mono text-sm space-y-1">
        <p className="text-slate-500 text-xs">{'t("itemCount", { count }) →'}</p>
        <p className="text-slate-800 font-medium">
          {/* count を渡すと i18next が自動で適切な複数形キーを選ぶ */}
          {t('itemCount', { count })}
        </p>
      </div>

      {/* キー定義の説明 */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs space-y-1">
        <p className="font-semibold text-yellow-800">翻訳ファイルのキー定義（英語の場合）</p>
        <code className="block text-yellow-700 whitespace-pre">{`"itemCount_zero":  "No items"
"itemCount_one":   "{{count}} item"
"itemCount_other": "{{count}} items"`}</code>
      </div>
    </div>
  )
}

// =================================================
// セクション 4: ネームスペース分割
// =================================================

function NamespaceSection() {
  // 配列で複数のネームスペースを同時に使用
  const { t: tc } = useTranslation('common')
  const { t: tt } = useTranslation('todo')

  const [items, setItems] = useState<TodoItem[]>([
    { id: 1, text: 'i18next をインストールする', done: true },
    { id: 2, text: 'useTranslation を使ってみる', done: false },
  ])
  const [input, setInput] = useState('')

  const remaining = items.filter(i => !i.done).length

  const addItem = () => {
    if (!input.trim()) return
    setItems(prev => [...prev, { id: Date.now(), text: input.trim(), done: false }])
    setInput('')
  }

  const toggleItem = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        翻訳ファイルを機能ごとに分割（ネームスペース）し、
        <code className="bg-slate-100 px-1 rounded text-xs">useTranslation('todo')</code> で呼び出します。
      </p>

      {/* Todo UI */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-800 text-white px-4 py-2.5 flex items-center justify-between">
          {/* todo ネームスペースのキーを使用 */}
          <span className="font-semibold text-sm">{tt('title')}</span>
          <span className="text-xs text-slate-400">
            {/* count を渡して複数形を処理 */}
            {tt('todoCount', { count: remaining })}
          </span>
        </div>

        <div className="p-3 space-y-2">
          {/* 入力フォーム */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              placeholder={tt('addPlaceholder')}
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              onClick={addItem}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer transition-colors"
            >
              {tc('buttons.add')}
            </button>
          </div>

          {/* リスト */}
          {items.length === 0 ? (
            <p className="text-sm text-slate-400 py-2 text-center">{tt('emptyMessage')}</p>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleItem(item.id)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className={`text-sm flex-1 ${item.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {item.text}
                </span>
                <span className="text-xs text-slate-400">
                  {/* todo ネームスペースのネストされたキー */}
                  {item.done ? tt('status.done') : tt('status.pending')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* コード例 */}
      <div className="p-3 bg-slate-800 rounded-lg text-xs font-mono text-slate-300 space-y-1">
        <p className="text-slate-500">// 複数ネームスペースの取得方法</p>
        <p><span className="text-blue-400">const</span> {'{ t: tc } = '}<span className="text-yellow-400">useTranslation</span>(<span className="text-green-400">'common'</span>)</p>
        <p><span className="text-blue-400">const</span> {'{ t: tt } = '}<span className="text-yellow-400">useTranslation</span>(<span className="text-green-400">'todo'</span>)</p>
        <p className="mt-2 text-slate-500">// または第1引数を配列にして複数ネームスペースを同時に取得することも可能</p>
        <p><span className="text-blue-400">const</span> {'{ t } = '}<span className="text-yellow-400">useTranslation</span>([<span className="text-green-400">'common'</span>, <span className="text-green-400">'todo'</span>])</p>
        <p><span className="text-yellow-400">t</span>(<span className="text-green-400">'todo:title'</span>)  <span className="text-slate-500">// ns:key 形式</span></p>
      </div>
    </div>
  )
}

// =================================================
// セクション 5: Trans コンポーネント
// =================================================

function TransSection() {
  const { t } = useTranslation('common')

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        <code className="bg-slate-100 px-1 rounded text-xs">{'<Trans>'}</code> コンポーネントを使うと、
        翻訳テキストの中に React コンポーネント（<code className="bg-slate-100 px-1 rounded text-xs">{'<strong>'}</code> など）を含められます。
      </p>

      {/* Trans コンポーネントの使用例 */}
      <div className="p-4 bg-slate-50 rounded-lg text-sm space-y-3">
        {/* 基本的な Trans の使い方 */}
        <div>
          <p className="text-xs text-slate-500 mb-1">例: 太字・リンクを含む翻訳</p>
          <p className="text-slate-700">
            <Trans
              i18nKey="appDescriptionWithStrong"
              ns="common"
              components={{
                // インデックス 0 = <strong> タグ
                0: <strong className="text-blue-600" />,
              }}
            />
          </p>
        </div>

        {/* t() と Trans の使い分け */}
        <div className="border-t border-slate-200 pt-3">
          <p className="text-xs text-slate-500 mb-2 font-semibold">使い分けのポイント</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-white border border-slate-200 rounded-lg">
              <p className="font-semibold text-slate-700 mb-1">t() 関数</p>
              <p className="text-slate-500">プレーンテキストのみ</p>
              <p className="text-slate-500">変数補間・複数形</p>
            </div>
            <div className="p-2 bg-white border border-slate-200 rounded-lg">
              <p className="font-semibold text-slate-700 mb-1">{'<Trans>'}</p>
              <p className="text-slate-500">JSX タグを含む翻訳</p>
              <p className="text-slate-500">リンク・強調など</p>
            </div>
          </div>
        </div>
      </div>

      {/* 翻訳文字列とコードの対応 */}
      <div className="p-3 bg-slate-800 rounded-lg text-xs font-mono text-slate-300 space-y-1">
        <p className="text-slate-500">// Trans コンポーネントの使い方</p>
        <p>{'<'}<span className="text-yellow-400">Trans</span></p>
        <p>{'  '}<span className="text-blue-400">i18nKey</span>=<span className="text-green-400">"appDescriptionWithStrong"</span></p>
        <p>{'  '}<span className="text-blue-400">ns</span>=<span className="text-green-400">"common"</span></p>
        <p>{'  '}<span className="text-blue-400">components</span>={'{{ 0: <strong /> }}'}</p>
        <p>{'/'}{'>'}  <span className="text-slate-500">{'// <0> が <strong> に置換'}</span></p>
      </div>

      {/* t() を通常通り使う例も表示 */}
      <div className="p-3 bg-blue-50 rounded-lg text-sm">
        <p className="text-blue-700">
          {t('appDescription')}
        </p>
        <p className="text-xs text-blue-500 mt-1">↑ t() で取得したプレーンテキスト（タグ変換なし）</p>
      </div>
    </div>
  )
}

// =================================================
// メインコンポーネント
// =================================================

function I18nDemo() {
  // ルートレベルでも useTranslation を使用して言語を取得
  const { t, i18n } = useTranslation('common')

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-2">🌐 多言語対応（i18n）</h2>
      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
        {t('appDescription')}
      </p>

      {/* 説明バナー */}
      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-6 leading-relaxed text-sm">
        <strong>react-i18next</strong> は React アプリの国際化（i18n）ライブラリとして業界標準です。
        <code className="bg-white border border-sky-200 rounded px-1 mx-1 text-xs">useTranslation</code> hook を中心に、
        言語切替・変数補間・複数形・ネームスペース分割など実務で必要なパターンを網羅できます。
      </p>

      {/* ============================================= */}
      {/* セクション 1: 基本翻訳と言語切替 */}
      {/* ============================================= */}
      <section className="mb-6">
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-mono">1</span>
          {t('sections.basic')} ＆ 言語切替
        </h3>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          {/* BasicSection は自分で useTranslation を呼ぶのでここでは Props 不要 */}
          <BasicSection />
        </div>
      </section>

      {/* ============================================= */}
      {/* セクション 2: 変数補間 */}
      {/* ============================================= */}
      <section className="mb-6">
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-mono">2</span>
          {t('sections.interpolation')}
        </h3>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <InterpolationSection />
        </div>
      </section>

      {/* ============================================= */}
      {/* セクション 3: 複数形 */}
      {/* ============================================= */}
      <section className="mb-6">
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-mono">3</span>
          {t('sections.pluralization')}
        </h3>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <PluralizationSection />
        </div>
      </section>

      {/* ============================================= */}
      {/* セクション 4: ネームスペース */}
      {/* ============================================= */}
      <section className="mb-6">
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-mono">4</span>
          {t('sections.namespace')}
        </h3>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <NamespaceSection />
        </div>
      </section>

      {/* ============================================= */}
      {/* セクション 5: Trans コンポーネント */}
      {/* ============================================= */}
      <section className="mb-6">
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-mono">5</span>
          {t('sections.transComponent')}
        </h3>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <TransSection />
        </div>
      </section>

      {/* ============================================= */}
      {/* まとめ */}
      {/* ============================================= */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="font-semibold mb-2">📌 学習のまとめ</p>
        <ul className="leading-loose pl-5 mb-0 text-sm">
          <li><code className="bg-white border border-yellow-200 rounded px-1 text-xs">useTranslation(ns)</code> でネームスペースを指定して翻訳関数を取得する</li>
          <li><code className="bg-white border border-yellow-200 rounded px-1 text-xs">i18n.changeLanguage(lang)</code> で言語を切り替えると全コンポーネントが再レンダリングされる</li>
          <li><code className="bg-white border border-yellow-200 rounded px-1 text-xs">{'{{変数名}}'}</code> で翻訳テキストに動的な値を埋め込む（補間）</li>
          <li><code className="bg-white border border-yellow-200 rounded px-1 text-xs">_zero / _one / _other</code> サフィックスで複数形を定義する</li>
          <li>JSX を含む翻訳は <code className="bg-white border border-yellow-200 rounded px-1 text-xs">{'<Trans>'}</code> コンポーネントを使う</li>
        </ul>
      </div>

      {/* 確認問題 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="font-semibold mb-2">✅ 確認問題</p>
        <ol className="leading-loose pl-5 mb-0 text-sm">
          <li>現在の言語を取得するにはどうすればよいですか？（ヒント: <code className="bg-white border border-green-200 rounded px-1 text-xs">i18n.language</code>）</li>
          <li>翻訳ファイルが増えてきた場合、どのようにファイルを分割・整理しますか？</li>
          <li>ブラウザのロケール設定に応じてデフォルト言語を自動設定するには何が必要ですか？</li>
        </ol>
        <p className="text-xs text-slate-500 mt-3">
          ヒント: <code>i18next-browser-languagedetector</code> プラグインを使うとブラウザの言語設定を自動検出できます。
        </p>
      </div>

      {/* 言語表示（ページ下部に常時表示） */}
      <div className="mt-6 p-3 bg-slate-100 rounded-lg flex items-center justify-between text-xs text-slate-500">
        <span>現在の言語: <strong>{i18n.language === 'ja' ? '日本語 (ja)' : 'English (en)'}</strong></span>
        <span>フォールバック: en</span>
      </div>
    </div>
  )
}

export default I18nDemo
