/**
 * サンプル17: 多言語対応（実践編）
 *
 * サンプル16（基礎編）で学んだ useTranslation / t() / changeLanguage() を前提に、
 * 実務でよく登場する応用パターンを学びます。
 *
 * 学習ポイント：
 * - フォームバリデーションエラーメッセージの多言語化
 * - APIエラーコード → 翻訳キーへのマッピングとフォールバック
 * - リスト表示の多言語化（Intl.ListFormat による「、」「と」の自動切替）
 * - 日付・数値・通貨のロケール対応（Intl.DateTimeFormat / Intl.NumberFormat）
 * - 翻訳キー欠落（訳し忘れ）の検知
 */

import { useMemo, useState } from 'react'
import { I18nextProvider, useTranslation } from 'react-i18next'
import i18nInstance from './i18n'

// =================================================
// 言語切替（各サンプル共通で使う小さなコンポーネント）
// =================================================

function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common')

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">🌍 {t('title')}</h2>
        <p className="text-slate-600 text-sm">{t('description')}</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => i18n.changeLanguage('ja')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors border ${
            i18n.language === 'ja'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
          }`}
        >
          {t('buttons.japanese')}
        </button>
        <button
          onClick={() => i18n.changeLanguage('en')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors border ${
            i18n.language === 'en'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
          }`}
        >
          {t('buttons.english')}
        </button>
      </div>
    </div>
  )
}

// =================================================
// パターン1: フォームバリデーションの多言語化
// =================================================

type FieldErrors = {
  email?: string
  password?: string
}

function ValidationSection() {
  const { t } = useTranslation(['validation', 'common'])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // バリデーションルール自体はロジックのみを持ち、エラーメッセージは翻訳キー経由で組み立てる
  const errors: FieldErrors = {}
  if (submitted) {
    if (!email.trim()) {
      errors.email = t('validation:required', { field: t('validation:fields.email') })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t('validation:email')
    }

    if (!password) {
      errors.password = t('validation:required', { field: t('validation:fields.password') })
    } else if (password.length < 8) {
      errors.password = t('validation:minLength', { field: t('validation:fields.password'), min: 8 })
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        バリデーションの<strong>ルール（必須／文字数／形式）</strong>はコードで判定し、
        <strong>表示メッセージ</strong>は翻訳キー（<code className="bg-slate-100 px-1 rounded text-xs">validation:required</code> など）
        から組み立てます。ロジックとメッセージを分離するのがポイントです。
      </p>

      <form
        noValidate
        onSubmit={e => { e.preventDefault(); setSubmitted(true) }}
        className="space-y-3 p-4 bg-white border border-slate-200 rounded-xl"
      >
        <div>
          <label htmlFor="i18n-adv-email" className="block text-sm text-slate-600 mb-1">
            {t('validation:fields.email')}
          </label>
          <input
            id="i18n-adv-email"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
              errors.email ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
            }`}
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="i18n-adv-password" className="block text-sm text-slate-600 mb-1">
            {t('validation:fields.password')}
          </label>
          <input
            id="i18n-adv-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
              errors.password ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
            }`}
          />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer transition-colors"
        >
          {t('common:buttons.submit')}
        </button>
      </form>

      <div className="p-3 bg-slate-800 rounded-lg text-xs font-mono text-slate-300 space-y-1">
        <p className="text-slate-500">// エラーメッセージの組み立て方</p>
        <p><span className="text-yellow-400">t</span>(<span className="text-green-400">'validation:required'</span>, {'{ field: t(\'validation:fields.email\') }'})</p>
        <p><span className="text-yellow-400">t</span>(<span className="text-green-400">'validation:minLength'</span>, {'{ field, min: 8 }'})</p>
      </div>
    </div>
  )
}

// =================================================
// パターン2: APIエラーコードの多言語化
// =================================================

const ERROR_CODES = ['NETWORK_ERROR', 'NOT_FOUND', 'SERVER_ERROR', 'UNAUTHORIZED', 'TEAPOT_ERROR'] as const

function ApiErrorSection() {
  const { t, i18n } = useTranslation('errors')
  const [lastCode, setLastCode] = useState<string | null>(null)

  // API が返すエラーコードを翻訳キーとして扱い、未知のコードは UNKNOWN にフォールバックする
  const message = useMemo(() => {
    if (!lastCode) return null
    const key = `errors:${lastCode}`
    return i18n.exists(key) ? t(key) : t('errors:UNKNOWN', { code: lastCode })
  }, [lastCode, t, i18n])

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        API から返る「エラーコード（文字列）」をそのまま翻訳キーとして使い、
        未知のコードは <code className="bg-slate-100 px-1 rounded text-xs">UNKNOWN</code> にフォールバックします。
        <code className="bg-slate-100 px-1 rounded text-xs">TEAPOT_ERROR</code> は翻訳ファイルに存在しないコードの例です。
      </p>

      <div className="flex flex-wrap gap-2">
        {ERROR_CODES.map(code => (
          <button
            key={code}
            onClick={() => setLastCode(code)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono hover:bg-slate-50 cursor-pointer transition-colors"
          >
            {code}
          </button>
        ))}
      </div>

      {message && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {message}
        </div>
      )}

      <div className="p-3 bg-slate-800 rounded-lg text-xs font-mono text-slate-300 space-y-1">
        <p className="text-slate-500">// エラーコード → メッセージのマッピング</p>
        <p><span className="text-blue-400">const</span> key = <span className="text-green-400">{'`errors:${code}`'}</span></p>
        <p><span className="text-blue-400">const</span> message = i18n.<span className="text-yellow-400">exists</span>(key)</p>
        <p>{'  '}? t(key)</p>
        <p>{'  '}: t(<span className="text-green-400">'errors:UNKNOWN'</span>, {'{ code }'})</p>
      </div>
    </div>
  )
}

// =================================================
// パターン3: リスト表示の多言語化（Intl.ListFormat）
// =================================================

const FRUIT_KEYS = ['apple', 'banana', 'orange', 'grape'] as const

function ListSection() {
  const { t, i18n } = useTranslation('common')
  const [selected, setSelected] = useState<string[]>(['apple', 'banana', 'orange'])

  const toggle = (key: string) => {
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const translatedItems = selected.map(key => t(`fruits.${key}`))

  // 言語ごとに「、」区切り＋「と」で終わる（ja）、", " 区切り＋"and"で終わる（en）等の違いを
  // 自前の文字列結合ではなく Intl.ListFormat に任せる
  const formattedList = useMemo(
    () => new Intl.ListFormat(i18n.language, { style: 'long', type: 'conjunction' }).format(translatedItems),
    [translatedItems, i18n.language]
  )

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        配列の各要素は <code className="bg-slate-100 px-1 rounded text-xs">t()</code> で翻訳し、
        要素同士のつなぎ方（「、」「と」／", " "and"）は
        <code className="bg-slate-100 px-1 rounded text-xs">Intl.ListFormat</code> に任せます。
        文字列連結（<code className="bg-slate-100 px-1 rounded text-xs">{'items.join()'}</code>）は言語ごとの語順崩れの原因になるため避けます。
      </p>

      <div className="flex flex-wrap gap-3">
        {FRUIT_KEYS.map(key => (
          <label key={key} className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(key)}
              onChange={() => toggle(key)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            {t(`fruits.${key}`)}
          </label>
        ))}
      </div>

      <div className="p-3 bg-slate-50 rounded-lg font-mono text-sm space-y-1">
        <p className="text-slate-500 text-xs">Intl.ListFormat(lang).format(items) →</p>
        <p className="text-slate-800 font-medium">
          {selected.length === 0 ? '(未選択)' : formattedList}
        </p>
      </div>
    </div>
  )
}

// =================================================
// パターン4: 日付・数値のロケール対応（Intl）
// =================================================

function FormatSection() {
  const { t, i18n } = useTranslation('common')
  const now = useMemo(() => new Date(), [])

  const dateStr = useMemo(
    () => new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long', timeStyle: 'short' }).format(now),
    [i18n.language, now]
  )
  const currency = i18n.language === 'ja' ? 'JPY' : 'USD'
  const priceStr = useMemo(
    () => new Intl.NumberFormat(i18n.language, { style: 'currency', currency }).format(1234567.891),
    [i18n.language, currency]
  )
  const percentStr = useMemo(
    () => new Intl.NumberFormat(i18n.language, { style: 'percent', maximumFractionDigits: 1 }).format(0.4567),
    [i18n.language]
  )

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        {t('title')} — i18next は<strong>テキストの翻訳</strong>に特化しています。
        日付・通貨・数値の書式はブラウザ標準の <code className="bg-slate-100 px-1 rounded text-xs">Intl</code> API
        （<code className="bg-slate-100 px-1 rounded text-xs">i18n.language</code> をロケールとして渡す）と組み合わせるのが定石です。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="p-3 bg-slate-50 rounded-lg text-sm">
          <p className="text-xs text-slate-500 mb-1">Intl.DateTimeFormat</p>
          <p className="font-medium text-slate-800">{dateStr}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg text-sm">
          <p className="text-xs text-slate-500 mb-1">Intl.NumberFormat（通貨）</p>
          <p className="font-medium text-slate-800">{priceStr}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg text-sm">
          <p className="text-xs text-slate-500 mb-1">Intl.NumberFormat（割合）</p>
          <p className="font-medium text-slate-800">{percentStr}</p>
        </div>
      </div>
    </div>
  )
}

// =================================================
// パターン5: 翻訳キー欠落の検知
// =================================================

function MissingKeySection() {
  const { t } = useTranslation('common')
  const [show, setShow] = useState(false)

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        存在しないキーを <code className="bg-slate-100 px-1 rounded text-xs">t()</code> に渡すと、
        既定ではキー文字列がそのまま表示されます（画面には気づきにくい形で「訳し忘れ」が残ります）。
        このサンプルの <code className="bg-slate-100 px-1 rounded text-xs">i18n.ts</code> では
        <code className="bg-slate-100 px-1 rounded text-xs">missingKeyHandler</code> を設定し、
        開発中にコンソール警告で検知できるようにしています。
      </p>

      <button
        onClick={() => setShow(true)}
        className="px-4 py-1.5 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 cursor-pointer transition-colors"
      >
        {t('buttons.showMissingKey')}
      </button>

      {show && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm space-y-1">
          <p className="text-slate-500 text-xs font-mono">{"t('common:thisKeyDoesNotExist') →"}</p>
          <p className="font-mono text-slate-800">{t('thisKeyDoesNotExist')}</p>
          <p className="text-xs text-slate-500 mt-2">ブラウザの開発者コンソールに警告が出力されているはずです。</p>
        </div>
      )}
    </div>
  )
}

// =================================================
// メインコンポーネント
// =================================================

function I18nAdvancedContent() {
  return (
    <div className="p-6 max-w-2xl">
      <LanguageSwitcher />

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-6 leading-relaxed text-sm">
        サンプル16（基礎編）で学んだ API を前提に、実務で遭遇しやすい5つの応用パターンを扱います。
        詳しい初期化手順・推奨フォルダ構成・留意事項は <strong>README.md</strong> を参照してください。
      </p>

      <SectionWrapper titleKey="sections.validation"><ValidationSection /></SectionWrapper>
      <SectionWrapper titleKey="sections.apiError"><ApiErrorSection /></SectionWrapper>
      <SectionWrapper titleKey="sections.list"><ListSection /></SectionWrapper>
      <SectionWrapper titleKey="sections.format"><FormatSection /></SectionWrapper>
      <SectionWrapper titleKey="sections.missingKey"><MissingKeySection /></SectionWrapper>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="font-semibold mb-2">✅ 確認問題</p>
        <ol className="leading-loose pl-5 mb-0 text-sm">
          <li>APIから未知のエラーコードが返ってきたとき、UIに何を表示すべきですか？</li>
          <li>リストの要素を「、」や「と」で連結するとき、なぜ自前の文字列結合ではなく <code>Intl.ListFormat</code> を使うべきですか？</li>
          <li>日付や通貨の書式は i18next と Intl のどちらの責務ですか？</li>
          <li>翻訳キーの訳し忘れをリリース前に検知するには、どんな仕組みが有効ですか？</li>
        </ol>
      </div>
    </div>
  )
}

function SectionWrapper({ titleKey, children }: { titleKey: string; children: React.ReactNode }) {
  const { t } = useTranslation('common')
  return (
    <section className="mb-6">
      <h3 className="font-semibold text-base mb-3">{t(titleKey)}</h3>
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        {children}
      </div>
    </section>
  )
}

function I18nAdvancedDemo() {
  return (
    // このサンプル専用の i18n インスタンスを Provider でスコープする
    <I18nextProvider i18n={i18nInstance}>
      <I18nAdvancedContent />
    </I18nextProvider>
  )
}

export default I18nAdvancedDemo
