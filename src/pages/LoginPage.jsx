import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import ErrorState from '../components/ErrorState'
import TextInput from '../components/TextInput'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export default function LoginPage() {
  const { user } = useAuth()
  const { notify } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (user) return <Navigate to="/items" replace />

  if (!isSupabaseConfigured) {
    return (
      <ErrorState message="Supabase 환경변수가 없습니다. README의 백엔드 설정 절차에 따라 .env를 설정해야 로그인과 CRUD가 동작합니다." />
    )
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!email.trim() || password.length < 6) {
      setError('이메일과 6자 이상의 비밀번호를 입력하세요.')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'signup') {
        const { error: authError } = await supabase.auth.signUp({ email, password })
        if (authError) throw authError
        notify('회원가입 요청이 완료되었습니다. 이메일 확인 설정에 따라 인증 후 로그인하세요.')
        setMode('login')
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) throw authError
        notify('로그인했습니다.')
        const destination = location.state?.from?.pathname || '/items'
        navigate(destination, { replace: true })
      }
    } catch (err) {
      setError(err.message || '인증 요청에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="narrow">
      <h1>{mode === 'login' ? '로그인' : '회원가입'}</h1>
      <form className="form-card" onSubmit={submit}>
        <TextInput label="이메일" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextInput label="비밀번호" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="submit-error" role="alert">{error}</p>}
        <Button type="submit" disabled={submitting}>{submitting ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}</Button>
      </form>
      <Button variant="ghost" onClick={() => { setError(''); setMode((m) => m === 'login' ? 'signup' : 'login') }}>
        {mode === 'login' ? '계정 만들기' : '로그인으로 돌아가기'}
      </Button>
    </section>
  )
}
