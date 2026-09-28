import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import ItemForm from '../components/ItemForm'
import Loading from '../components/Loading'
import { useApp } from '../context/AppContext'
import useItemDetail from '../hooks/useItemDetail'
import { updateItem } from '../lib/itemService'

export default function ItemEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { notify } = useApp()
  const { item, loading, error, reload } = useItemDetail(id)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  async function submit(payload) {
    setSubmitting(true)
    setSubmitError('')
    try {
      await updateItem(id, payload)
      notify('기록을 수정했습니다.')
      navigate(`/items/${id}`)
    } catch (err) {
      setSubmitError(err.message || '수정하지 못했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loading label="수정할 기록을 불러오는 중..." />
  if (error) return <ErrorState message={error} onRetry={reload} />

  return (
    <section className="narrow">
      <p className="eyebrow">UPDATE</p>
      <h1>학습 기록 수정</h1>
      <ItemForm initialValue={item} onSubmit={submit} submitting={submitting} serverError={submitError} />
    </section>
  )
}
