/**
 * サンプル08: フォーム制御（制御コンポーネント）
 *
 * 学習テーマ：
 * - 制御コンポーネント（Controlled Component）の概念
 * - 複数の入力フィールドを state で管理する
 * - リアルタイムバリデーション
 * - フォーム送信とリセット処理
 */
import { useState } from 'react'

// -------------------------------------------------
// 型定義
// -------------------------------------------------
type FormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
  age: string
  agreeToTerms: boolean
}

type FormErrors = Partial<Record<keyof FormValues, string>>

// -------------------------------------------------
// バリデーション関数
// -------------------------------------------------
function validateField(field: keyof FormValues, values: FormValues): string {
  switch (field) {
    case 'name':
      if (!values.name.trim()) return '名前を入力してください'
      if (values.name.trim().length < 3) return '名前は3文字以上で入力してください'
      return ''
    case 'email':
      if (!values.email.trim()) return 'メールアドレスを入力してください'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
        return '正しいメールアドレスの形式で入力してください'
      return ''
    case 'password':
      if (!values.password) return 'パスワードを入力してください'
      if (values.password.length < 8) return 'パスワードは8文字以上で入力してください'
      return ''
    case 'confirmPassword':
      if (!values.confirmPassword) return '確認パスワードを入力してください'
      if (values.confirmPassword !== values.password) return 'パスワードが一致しません'
      return ''
    case 'age':
      if (!values.age) return '年齢を入力してください'
      if (isNaN(Number(values.age)) || Number(values.age) < 18)
        return '18歳以上である必要があります'
      return ''
    case 'agreeToTerms':
      if (!values.agreeToTerms) return '利用規約への同意が必要です'
      return ''
    default:
      return ''
  }
}

function validateAll(values: FormValues): FormErrors {
  const fields: (keyof FormValues)[] = [
    'name',
    'email',
    'password',
    'confirmPassword',
    'age',
    'agreeToTerms',
  ]
  const errors: FormErrors = {}
  for (const f of fields) {
    const msg = validateField(f, values)
    if (msg) errors[f] = msg
  }
  return errors
}

// -------------------------------------------------
// 再利用可能な入力フィールドコンポーネント
// -------------------------------------------------
type InputFieldProps = {
  id: string
  name: keyof FormValues
  label: string
  type?: string
  value: string
  error?: string
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (name: keyof FormValues) => void
}

function InputField({
  id,
  name,
  label,
  type = 'text',
  value,
  error,
  placeholder,
  onChange,
  onBlur,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
        <span className="ml-1 text-red-500 text-xs">*</span>
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={() => onBlur(name)}
        className={[
          'px-3 py-2 rounded-lg border text-base transition-colors focus:outline-none focus:ring-2',
          error
            ? 'border-red-400 focus:ring-red-200 bg-red-50'
            : 'border-slate-300 focus:ring-blue-200 focus:border-blue-400',
        ].join(' ')}
      />
      {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
  )
}

// -------------------------------------------------
// ユーザー登録フォームコンポーネント
// -------------------------------------------------
const INITIAL_VALUES: FormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
  agreeToTerms: false,
}

function RegistrationForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<FormErrors>({})
  // どのフィールドを一度でも触ったか（touched）を記録してUXを改善
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  // 入力変更ハンドラー（テキスト・チェックボックス共通）
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const fieldName = name as keyof FormValues
    const newValues: FormValues = {
      ...values,
      [fieldName]: type === 'checkbox' ? checked : value,
    }
    setValues(newValues)

    // 一度触れたフィールドはリアルタイムでバリデーション
    if (touched[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: validateField(fieldName, newValues),
      }))
    }
  }

  // フォーカスが外れたとき（touched 登録 + バリデーション）
  const handleBlur = (fieldName: keyof FormValues) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    setErrors(prev => ({
      ...prev,
      [fieldName]: validateField(fieldName, values),
    }))
  }

  // 送信ハンドラー
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // すべてのフィールドを touched にしてエラーを表示
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<keyof FormValues, boolean>
    )
    setTouched(allTouched)

    const newErrors = validateAll(values)
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true)
    }
  }

  // リセットハンドラー
  const handleReset = () => {
    setValues(INITIAL_VALUES)
    setErrors({})
    setTouched({})
    setSubmitted(false)
  }

  // 送信完了画面
  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <div className="text-5xl">🎉</div>
        <h3 className="text-xl font-bold text-green-700">登録が完了しました！</h3>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 w-full max-w-sm text-sm text-slate-700 space-y-1">
          <p><span className="font-medium">名前：</span>{values.name}</p>
          <p><span className="font-medium">メール：</span>{values.email}</p>
          <p><span className="font-medium">年齢：</span>{values.age} 歳</p>
        </div>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium"
        >
          もう一度入力する
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <InputField
        id="name"
        name="name"
        label="名前"
        value={values.name}
        error={errors.name}
        placeholder="例: 山田太郎"
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <InputField
        id="email"
        name="email"
        label="メールアドレス"
        type="email"
        value={values.email}
        error={errors.email}
        placeholder="例: taro@example.com"
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <InputField
        id="password"
        name="password"
        label="パスワード"
        type="password"
        value={values.password}
        error={errors.password}
        placeholder="8文字以上"
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <InputField
        id="confirmPassword"
        name="confirmPassword"
        label="パスワード（確認）"
        type="password"
        value={values.confirmPassword}
        error={errors.confirmPassword}
        placeholder="パスワードを再入力"
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <InputField
        id="age"
        name="age"
        label="年齢"
        type="number"
        value={values.age}
        error={errors.age}
        placeholder="18以上"
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {/* 利用規約チェックボックス */}
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            checked={values.agreeToTerms}
            onChange={handleChange}
            onBlur={() => handleBlur('agreeToTerms')}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm text-slate-700">
            <span className="text-red-500 text-xs mr-1">*</span>
            利用規約に同意します
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="text-red-500 text-xs mt-0.5 ml-6">{errors.agreeToTerms}</p>
        )}
      </div>

      {/* ボタン */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors"
        >
          登録する
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-5 py-2.5 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
        >
          リセット
        </button>
      </div>
    </form>
  )
}

// -------------------------------------------------
// メインコンポーネント
// -------------------------------------------------
function FormsDemo() {
  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">📝 フォーム制御</h2>

      <p className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 mb-6 leading-relaxed">
        <strong>制御コンポーネント</strong>とは、フォームの入力値を React の{' '}
        <code>state</code> で管理するパターンです。
        <br />
        <code>value</code> に state をバインドし、<code>onChange</code> で更新することで
        React が「唯一の情報源（Single Source of Truth）」になります。
      </p>

      {/* 制御コンポーネントの基本説明 */}
      <section className="mb-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold mb-2">🔑 制御コンポーネントの仕組み</h3>
        <div className="overflow-auto rounded-lg bg-slate-800 text-slate-100 p-4 text-sm font-mono leading-relaxed">
          <pre>{`// ❌ 非制御コンポーネント（React が値を知らない）
<input type="text" defaultValue="初期値" />

// ✅ 制御コンポーネント（state が値を管理）
const [name, setName] = useState('')
<input
  type="text"
  value={name}           // state をバインド
  onChange={e => setName(e.target.value)}  // state を更新
/>`}</pre>
        </div>
      </section>

      {/* ユーザー登録フォーム */}
      <section className="mb-6 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4 text-slate-800">👤 ユーザー登録フォーム（実装例）</h3>
        <RegistrationForm />
      </section>

      {/* まとめ */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="font-semibold mb-2">📌 ポイント</p>
        <ul className="leading-loose pl-5 mb-0 text-sm">
          <li>
            <strong>制御コンポーネント</strong>：<code>value</code> +{' '}
            <code>onChange</code> で state が常に入力値を把握
          </li>
          <li>
            <strong>リアルタイムバリデーション</strong>：<code>onChange</code> または{' '}
            <code>onBlur</code> でエラーを即座にチェック
          </li>
          <li>
            <strong>touched 管理</strong>：一度触れたフィールドだけエラーを表示してUXを改善
          </li>
          <li>
            <strong>送信時に全チェック</strong>：<code>onSubmit</code>{' '}
            でまとめてバリデーションし、エラーがなければ処理を進める
          </li>
          <li>
            <strong>コンポーネント化</strong>：<code>InputField</code>{' '}
            のような再利用可能なコンポーネントにまとめると保守性が上がる
          </li>
        </ul>
      </div>
    </div>
  )
}

export default FormsDemo
