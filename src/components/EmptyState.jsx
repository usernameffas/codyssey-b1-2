import { Link } from 'react-router-dom'

export default function EmptyState({ message = '표시할 데이터가 없습니다.', actionTo = '/items/new' }) {
  return (
    <div className="state-box">
      <p>{message}</p>
      <Link className="button button-primary" to={actionTo}>첫 기록 만들기</Link>
    </div>
  )
}
