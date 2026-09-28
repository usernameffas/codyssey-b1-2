import { useEffect, useState } from 'react'
import Button from './Button'
import TextArea from './TextArea'
import TextInput from './TextInput'

const EMPTY = { title: '', category: '', content: '' }

export default function ItemForm({ initialValue = EMPTY, submitting = false, serverError = '', onSubmit }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm({
      title: initialValue?.title ?? '',
      category: initialValue?.category ?? '',
      content: initialValue?.content ?? ''
    })
  }, [initialValue])

  function change(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function validate() {
    const next = {}
    if (!form.title.trim()) next.title = '제목을 입력하세요.'
    if (!form.content.trim()) next.content = '내용을 입력하세요.'
    if (form.title.trim().length > 80) next.title = '제목은 80자 이하로 입력하세요.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function submit(event) {
    event.preventDefault()
    if (!validate()) return
    await onSubmit({
      title: form.title.trim(),
      category: form.category.trim() || '기타',
      content: form.content.trim()
    })
  }

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <TextInput
        label="제목 *"
        name="title"
        value={form.title}
        onChange={change}
        error={errors.title}
        placeholder="예: React Router 복습"
      />
      <TextInput
        label="분류"
        name="category"
        value={form.category}
        onChange={change}
        placeholder="예: React"
      />
      <TextArea
        label="내용 *"
        name="content"
        value={form.content}
        onChange={change}
        error={errors.content}
        rows="8"
        placeholder="배운 점과 다음 행동을 적어보세요."
      />

      <section className="preview" aria-live="polite">
        <strong>미리보기</strong>
        <p>{form.title || '제목 미리보기'}</p>
        <small>{form.category || '기타'}</small>
      </section>

      {serverError && <p className="submit-error" role="alert">{serverError}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? '저장 중...' : '저장하기'}
      </Button>
    </form>
  )
}
