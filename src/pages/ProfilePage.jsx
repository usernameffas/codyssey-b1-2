import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()
  return (
    <section className="detail-card narrow">
      <p className="eyebrow">AUTH BONUS</p>
      <h1>프로필</h1>
      <p>현재 로그인한 사용자</p>
      <strong>{user?.email}</strong>
      <p className="meta">사용자 ID: {user?.id}</p>
    </section>
  )
}
