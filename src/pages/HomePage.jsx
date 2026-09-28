import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()
  return (
    <section className="hero">
      <p className="eyebrow">CODYSSEY B1-2</p>
      <h1>버튼을 누르면 화면과 데이터가 함께 바뀌는 React SPA</h1>
      <p>
        React Router, 상태 관리, Supabase CRUD, 로딩·에러·빈 상태, 인증과 보호 라우트를
        하나의 학습 기록 서비스로 구현했습니다.
      </p>
      <div className="hero-actions">
        <Link className="button button-primary" to={user ? '/items' : '/login'}>
          {user ? '기록 보기' : '시작하기'}
        </Link>
        <Link className="button button-secondary" to="/items/new">새 기록 작성</Link>
      </div>
    </section>
  )
}
