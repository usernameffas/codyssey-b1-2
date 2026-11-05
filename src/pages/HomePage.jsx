import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'

// ===== 1. 홈페이지 소개 및 시작 버튼 시작 =====
export default function HomePage() {
  const { user } = useAuth()
  if (user) return <Navigate to="/items" replace />
  const features = [
    { title: 'React Router', desc: '주소에 따라 홈·목록·상세·등록·수정 화면을 전환합니다.' },
    { title: 'CRUD', desc: '기록을 만들고(Create), 읽고(Read), 수정하고(Update), 삭제(Delete)합니다.' },
    { title: '로딩·오류·빈 상태', desc: '데이터를 기다리거나 결과가 없는 상황을 각각 화면에 표시합니다.' },
    { title: '입력 검증', desc: '필수 입력값과 오류를 확인하고 저장 중에는 버튼을 잠급니다.' }
  ]
  const bonuses = [
    { title: '전역 상태', desc: 'Context로 테마와 알림을 페이지 전체에서 공유합니다.' },
    { title: '렌더링 최적화', desc: 'React.memo, useMemo, useCallback 사용' },
    { title: '로그인·보호 라우트', desc: 'Supabase Auth로 접근 권한을 관리합니다.' }
  ]
  return (
    <>
      <section className="hero" aria-labelledby="home-title">
        <p className="eyebrow">CODYSSEY · B1-2 · REACT SPA</p>
        <h1 id="home-title">기록하고, 수정하고,<br />React로 화면을 바꿉니다.</h1>
        <p>웹 기초에서 한 단계 더 나아가 React 컴포넌트, 상태, 이벤트, 비동기 데이터 처리와 실제 CRUD를 연습하는 학습 기록 서비스입니다.</p>
        <div className="hero-actions">
          <Link className="button button-primary" to={user ? '/items' : '/login'}>{user ? '나의 기록 보기' : '시작하기'}</Link>
          <Link className="button button-secondary" to="/items/new">새 기록 작성</Link>
        </div>
        {!isSupabaseConfigured && <p role="status" className="setup-notice">현재 홈페이지 미리보기입니다. 실제 로그인·기록 저장은 Supabase 프로젝트 연결 후 활성화됩니다.</p>}
      </section>

      {/* ===== 1. 홈페이지 소개 및 시작 버튼 끝 ===== */}

      {/* ===== 2. 필수 기능 소개 시작 ===== */}
      <section aria-labelledby="feature-heading" className="home-features">
        <p className="eyebrow">CORE FEATURES</p>
        <h2 id="feature-heading">이 웹페이지에서 배우는 기능</h2>
        <div className="card-grid">
          {features.map(feature => <article className="card card-compact" key={feature.title}><h3>{feature.title}</h3><p>{feature.desc}</p></article>)}
        </div>
      </section>
      {/* ===== 2. 필수 기능 소개 끝 ===== */}

      {/* ===== 3. 보너스 3종 소개 시작 ===== */}
      <section aria-labelledby="bonus-heading" className="home-features">
        <p className="eyebrow">BONUS FEATURES</p>
        <h2 id="bonus-heading">보너스 3개도 함께 구현</h2>
        <div className="card-grid">
          {bonuses.map(bonus => <article className="card card-compact" key={bonus.title}><h3>{bonus.title}</h3><p>{bonus.desc}</p></article>)}
        </div>
      </section>
      {/* ===== 3. 보너스 3종 소개 끝 ===== */}
    </>
  )
}
// ===== 4. 홈페이지 컴포넌트 끝 =====
