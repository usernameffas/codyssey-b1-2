import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import ErrorState from '../components/ErrorState'
import TextInput from '../components/TextInput'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

// ===== 1. 이메일 인증 오류를 이해하기 쉬운 안내로 변환 시작 =====
function explainAuthError(error) {
  const message = error?.message || ''
  if (/email not confirmed/i.test(message)) return '이메일 인증이 필요합니다. 받은 메일에서 인증 버튼을 누른 뒤 다시 로그인하세요.'
  if (/invalid login credentials/i.test(message)) return '이메일 또는 비밀번호를 확인하세요. 아직 인증 전이라면 먼저 받은 메일을 확인하세요.'
  if (/rate limit|too many requests/i.test(message)) return '요청이 많습니다. 잠시 후 다시 시도하세요.'
  return message || '인증 요청에 실패했습니다.'
}
// ===== 1. 이메일 인증 오류를 이해하기 쉬운 안내로 변환 끝 =====

export default function LoginPage() {
  const { user } = useAuth()
  const { notify } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (user) return <Navigate to="/items" replace />
  if (!isSupabaseConfigured) {
    return <ErrorState message="Supabase 환경변수가 없습니다. README의 백엔드 설정 절차에 따라 .env를 설정해야 로그인과 CRUD가 동작합니다." />
  }

  // 인증 후 현재 배포된 웹사이트로 돌아오도록 경로를 명시합니다.
  const emailRedirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`

  // ===== 2. 회원가입 직후 인증 대기 화면과 로그인 처리 시작 =====
  async function submit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (!email.trim() || password.length < 6) {
      setError('이메일과 6자 이상의 비밀번호를 입력하세요.')
      return
    }
    setSubmitting(true)
    try {
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo } })
        if (authError) throw authError
        if (data.session) {
          notify('회원가입과 로그인이 완료되었습니다.')
          navigate('/items', { replace: true })
        } else {
          setSuccess('가입 요청을 받았습니다. 이메일로 전송된 인증 링크를 눌러 계정을 활성화한 후 로그인하세요. 메일이 보이지 않으면 스팸함도 확인해 주세요.')
          setMode('check-email')
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (authError) throw authError
        notify('로그인했습니다.')
        navigate(location.state?.from?.pathname || '/items', { replace: true })
      }
    } catch (err) {
      setError(explainAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }
  // ===== 2. 회원가입 직후 인증 대기 화면과 로그인 처리 끝 =====

  // ===== 3. 인증 메일 재발송 시작 =====
  async function resendConfirmation() {
    setError('')
    setSuccess('')
    if (!email.trim()) { setError('먼저 이메일 주소를 입력하세요.'); return }
    setResending(true)
    try {
      const { error: resendError } = await supabase.auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo } })
      if (resendError) throw resendError
      setSuccess('인증 메일 재발송을 요청했습니다. 받은편지함과 스팸함을 확인해 주세요.')
    } catch (err) {
      setError(explainAuthError(err))
    } finally {
      setResending(false)
    }
  }
  // ===== 3. 인증 메일 재발송 끝 =====

  // ===== 4. 인증 안내를 화면에 고정 표시하는 UI 시작 =====
  return (
    <section className="narrow">
      <h1>{mode === 'signup' ? '회원가입' : mode === 'check-email' ? '이메일 인증 안내' : '로그인'}</h1>
      {mode === 'check-email' ? (
        <div className="form-card" aria-live="polite">
          <div style={{ fontSize: '2rem', marginBottom: '.5rem' }} aria-hidden="true">✉</div>
          <h2 style={{ marginTop: 0 }}>이메일을 확인해 주세요</h2>
          <p>인증 링크가 담긴 이메일을 <strong>{email}</strong> 주소로 요청했습니다.</p>
          <p>메일의 <strong>이메일 인증하기</strong> 버튼을 누른 뒤 로그인할 수 있습니다. 스팸함도 확인해 주세요.</p>
          {success && <p role="status" style={{ padding: '1rem', background: '#e5f4ed', color: '#20523d', borderRadius: '10px' }}>{success}</p>}
          {error && <p className="submit-error" role="alert">{error}</p>}
          <Button type="button" onClick={resendConfirmation} disabled={resending}>{resending ? '전송 중...' : '인증 메일 다시 보내기'}</Button>
          <Button variant="ghost" onClick={() => { setMode('login'); setError(''); setSuccess('') }}>인증 완료 후 로그인</Button>
        </div>
      ) : (
        <>
          {mode === 'signup' && <p>가입 후 이메일로 받은 인증 링크를 눌러야 로그인할 수 있습니다.</p>}
          {mode === 'login' && <p>회원가입 후 이메일 인증을 완료했다면 로그인하세요.</p>}
          {mode === 'login' && /email not confirmed|이메일 인증이 필요/i.test(error) && (
            <div className="form-card" aria-live="polite">
              <p>아직 이메일 인증이 완료되지 않았습니다. 이전 메일을 찾지 않아도 새 인증 메일을 요청할 수 있습니다.</p>
              <Button type="button" onClick={resendConfirmation} disabled={resending}>
                {resending ? '전송 중...' : '인증 메일 다시 보내기'}
              </Button>
              {success && <p role="status">{success}</p>}
            </div>
          )}
          <form className="form-card" onSubmit={submit}>
            <TextInput label="이메일" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextInput label="비밀번호" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="submit-error" role="alert">{error}</p>}
            <Button type="submit" disabled={submitting}>{submitting ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}</Button>
          </form>
          <Button variant="ghost" onClick={() => { setError(''); setSuccess(''); setMode((m) => m === 'login' ? 'signup' : 'login') }}>
            {mode === 'login' ? '계정 만들기' : '로그인으로 돌아가기'}
          </Button>
        </>
      )}
    </section>
  )
  // ===== 4. 인증 안내를 화면에 고정 표시하는 UI 끝 =====
}
