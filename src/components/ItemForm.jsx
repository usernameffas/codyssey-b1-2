import { useEffect, useState } from 'react'
import Button from './Button'
import TextArea from './TextArea'
import TextInput from './TextInput'

const localDate = () => { const d=new Date(); return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-') }
const EMPTY = { title: '', category: '', content: '', studied_on:'' }

export default function ItemForm({ initialValue = EMPTY, initialDate, submitting = false, serverError = '', onSubmit }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  useEffect(() => {
    setForm({
      title: initialValue?.title ?? '',
      category: initialValue?.category ?? '',
      content: initialValue?.content ?? '',
      studied_on: initialValue?.studied_on || initialDate || localDate()
    })
  }, [initialValue, initialDate])
  function change(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }
  function validate() {
    const next = {}
    if (!form.title.trim()) next.title = '제목을 입력하세요.'
    if (!form.content.trim()) next.content = '내용을 입력하세요.'
    if (!form.studied_on || !/^\d{4}-\d{2}-\d{2}$/.test(form.studied_on)) next.studied_on = '학습 날짜를 선택하세요.'
    if (form.title.trim().length > 80) next.title = '제목은 80자 이하로 입력하세요.'
    setErrors(next)
    return Object.keys(next).length === 0
  }
  async function submit(event) {
    event.preventDefault()
    if (!validate()) return
    await onSubmit({title:form.title.trim(),category:form.category.trim()||'기타',content:form.content.trim(),studied_on:form.studied_on})
  }
  return <form className="form-card" onSubmit={submit} noValidate>
    <div className="field"><label htmlFor="studied_on">실제 학습일 *</label><input id="studied_on" type="date" name="studied_on" value={form.studied_on} onChange={change} aria-invalid={!!errors.studied_on}/>{errors.studied_on&&<span className="field-error">{errors.studied_on}</span>}</div>
    <TextInput label="제목 *" name="title" value={form.title} onChange={change} error={errors.title} placeholder="예: 오토캐드 치수 구속"/>
    <TextInput label="분류" name="category" value={form.category} onChange={change} placeholder="예: CAD·3D"/>
    <TextArea label="내용 *" name="content" value={form.content} onChange={change} error={errors.content} rows="8" placeholder="배운 내용 기록"/>
    <section className="preview" aria-live="polite"><strong>미리보기</strong><p>{form.title||'제목 미리보기'}</p><small>{form.studied_on} · {form.category||'기타'}</small></section>
    {serverError&&<p className="submit-error" role="alert">{serverError}</p>}
    <Button type="submit" disabled={submitting}>{submitting?'저장 중...':'저장하기'}</Button>
  </form>
}
