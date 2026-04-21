import { useState, FormEvent } from 'react'
import './AuthPage.css'

interface Props {
  onSignIn: (email: string, password: string) => Promise<boolean>
  onSignUp: (email: string, name: string, password: string) => Promise<boolean>
  error: string | null
  clearError: () => void
}

export function AuthPage({ onSignIn, onSignUp, error, clearError }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const switchMode = (m: 'signin' | 'signup') => {
    setMode(m)
    setLocalError(null)
    clearError()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    if (mode === 'signup') {
      if (password.length < 6) { setLocalError('パスワードは6文字以上で入力してください'); return }
      if (password !== confirmPassword) { setLocalError('パスワードが一致しません'); return }
    }
    setLoading(true)
    if (mode === 'signin') {
      await onSignIn(email, password)
    } else {
      await onSignUp(email, name, password)
    }
    setLoading(false)
  }

  const displayError = localError || error

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">TODO</h1>
        <div className="auth-tabs">
          <button className={`auth-tab${mode === 'signin' ? ' active' : ''}`} onClick={() => switchMode('signin')} type="button">
            サインイン
          </button>
          <button className={`auth-tab${mode === 'signup' ? ' active' : ''}`} onClick={() => switchMode('signup')} type="button">
            新規登録
          </button>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">表示名</label>
              <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="お名前" required autoFocus />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">メールアドレス</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" required autoFocus={mode === 'signin'} />
          </div>
          <div className="form-group">
            <label className="form-label">パスワード</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'signup' ? '6文字以上' : 'パスワード'} required />
          </div>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">パスワード（確認）</label>
              <input className="form-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="パスワードを再入力" required />
            </div>
          )}
          {displayError && <p className="auth-error">{displayError}</p>}
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? '処理中...' : mode === 'signin' ? 'サインイン' : '登録する'}
          </button>
        </form>
      </div>
    </div>
  )
}
