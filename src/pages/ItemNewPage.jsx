import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ItemForm from '../components/ItemForm'
import { useApp } from '../context/AppContext'
import { createItem } from '../lib/itemService'

export default function ItemNewPage() {
  const navigate = useNavigate()
  const { notify } = useApp()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(payload) {
    setSubmitting(true)
    setError('')
    try {
      const created = await createItem(payload)
      notify('새 기록을 저장했습니다.')
      navigate(`/items/${created.id}`)
    } catch (err) {
      setError(err.message || '저장하지 못했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="narrow">
      <p className="eyebrow">CREATE</p>
      <h1>새 학습 기록</h1>
      <ItemForm onSubmit={submit} submitting={submitting} serverError={error} />
    </section>
  )
}
