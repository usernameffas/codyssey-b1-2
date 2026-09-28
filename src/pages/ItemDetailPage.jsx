import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import ErrorState from '../components/ErrorState'
import Loading from '../components/Loading'
import { useApp } from '../context/AppContext'
import useItemDetail from '../hooks/useItemDetail'
import { deleteItem } from '../lib/itemService'

export default function ItemDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { notify } = useApp()
  const { item, loading, error, reload } = useItemDetail(id)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function remove() {
    if (!window.confirm('이 기록을 삭제할까요?')) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteItem(id)
      notify('기록을 삭제했습니다.')
      navigate('/items')
    } catch (err) {
      setDeleteError(err.message || '삭제하지 못했습니다.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loading label="상세 정보를 불러오는 중..." />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!item) return <ErrorState message="기록을 찾을 수 없습니다." />

  return (
    <article className="detail-card">
      <p className="eyebrow">{item.category || '기타'}</p>
      <h1>{item.title}</h1>
      <p className="detail-content">{item.content}</p>
      <p className="meta">작성: {new Date(item.created_at).toLocaleString('ko-KR')}</p>

      {deleteError && <p className="submit-error" role="alert">{deleteError}</p>}

      <div className="button-row">
        <Link className="button button-secondary" to={`/items/${id}/edit`}>수정</Link>
        <Button variant="danger" onClick={remove} disabled={deleting}>
          {deleting ? '삭제 중...' : '삭제'}
        </Button>
        <Link className="button button-ghost" to="/items">목록</Link>
      </div>
    </article>
  )
}
