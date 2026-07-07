# サンプル08：フォーム制御（制御コンポーネント）

## 制御コンポーネント（Controlled Component）とは？

React では、フォームの入力値を **state で管理する**コンポーネントを「制御コンポーネント」と呼びます。

```tsx
import { useState } from 'react'

function ControlledInput() {
  const [name, setName] = useState('')  // state で値を管理

  return (
    <input
      type="text"
      value={name}                          // ① state をバインド
      onChange={e => setName(e.target.value)} // ② 変更時に state を更新
    />
  )
}
```

入力値が変わる → `onChange` が呼ばれる → `state` が更新される → 再レンダリング → `value` に最新の state が反映される、という一方向のデータフローが特徴です。

---

## 非制御コンポーネント（Uncontrolled Component）との違い

| 比較項目 | 制御コンポーネント | 非制御コンポーネント |
|---------|-----------------|-----------------|
| 値の管理 | React の `state` | DOM が直接管理 |
| 値の取得方法 | `state` から読む | `ref.current.value` |
| リアルタイム処理 | ✅ 簡単 | ❌ 複雑 |
| バリデーション | ✅ 即時に対応可能 | ❌ 送信時のみ容易 |
| React の流儀 | ✅ 推奨 | ⚠️ 特定の場面のみ |

```tsx
// ❌ 非制御コンポーネント（DOM に値を任せる）
import { useRef } from 'react'

function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    console.log(inputRef.current?.value) // 送信時に DOM から直接取得
  }

  return <input type="text" defaultValue="初期値" ref={inputRef} />
}
```

---

## 複数の入力フィールド管理

フィールドが多い場合は、オブジェクトとして state をまとめると管理しやすくなります。

```tsx
type FormValues = {
  name: string
  email: string
  password: string
}

function MultiFieldForm() {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    password: '',
  })

  // name 属性を使ってフィールドを識別する汎用ハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form>
      <input name="name"     value={values.name}     onChange={handleChange} />
      <input name="email"    value={values.email}    onChange={handleChange} />
      <input name="password" value={values.password} onChange={handleChange} />
    </form>
  )
}
```

---

## フォームバリデーション（基本的なルール）

このサンプルで実装しているバリデーションルール：

| フィールド | ルール |
|---------|------|
| 名前 | 空でない・3文字以上 |
| メール | 正しいメール形式 |
| パスワード | 8文字以上 |
| 確認パスワード | パスワードと一致 |
| 年齢 | 18以上の数値 |
| 利用規約 | チェック必須 |

### touched（触れたフィールド）の管理

ページを開いた直後から全フィールドにエラーを表示するのはUXが良くありません。
一度フォーカスを当てたフィールド（touched）のみエラーを表示する工夫が重要です。

```tsx
const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({})

const handleBlur = (fieldName: keyof FormValues) => {
  // フォーカスが外れたとき：touched に記録してからバリデーション
  setTouched(prev => ({ ...prev, [fieldName]: true }))
  setErrors(prev => ({
    ...prev,
    [fieldName]: validateField(fieldName, values),
  }))
}
```

---

## フォーム送信の処理

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault() // ページのリロードを防ぐ（重要！）

  // 送信時は全フィールドを touched にしてエラーを表示
  const allTouched = Object.keys(values).reduce(
    (acc, key) => ({ ...acc, [key]: true }),
    {} as Record<keyof FormValues, boolean>
  )
  setTouched(allTouched)

  const errors = validateAll(values)
  setErrors(errors)

  if (Object.keys(errors).length === 0) {
    // バリデーション通過 → 送信処理
    console.log('送信データ:', values)
  }
}
```

---

## リセット機能

```tsx
const INITIAL_VALUES: FormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
  agreeToTerms: false,
}

const handleReset = () => {
  setValues(INITIAL_VALUES)  // 初期値に戻す
  setErrors({})              // エラーをクリア
  setTouched({})             // touched もリセット
}
```

---

## 確認問題

1. 制御コンポーネントで `value` だけを設定して `onChange` を省略するとどうなりますか？
2. 複数フィールドを1つの `handleChange` 関数で処理するために、HTML の何の属性を利用しましたか？
3. `e.preventDefault()` を `onSubmit` で呼ばない場合、何が起きますか？
4. `touched` を管理することで、どのようなUXの改善が得られますか？
5. `InputField` コンポーネントに分離することで得られるメリットを2つ挙げてください。

---

## 関連サンプル

- [サンプル04：イベントハンドリング](../04_event_handling/README.md)
- [サンプル07：useEffect](../07_use_effect/README.md)（前のステップ）
- [サンプル09：カスタムフック](../09_custom_hooks/README.md)（次のステップ）
