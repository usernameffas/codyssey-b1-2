import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="state-box">
      <h1>404</h1>
      <p>요청한 페이지를 찾을 수 없습니다.</p>
      <Link className="button button-primary" to="/">홈으로</Link>
    </section>
  )
}
