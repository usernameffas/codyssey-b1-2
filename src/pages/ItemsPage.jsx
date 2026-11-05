import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import Loading from '../components/Loading'
import useItems from '../hooks/useItems'
import { deleteItem } from '../lib/itemService'

const pad = (n) => String(n).padStart(2, '0')
const localISO = (d) => [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-')
const initialMonth = () => { const d = new Date(); return new Date(d.getFullYear(),d.getMonth(),1) }
const studyDate = (item) => item.studied_on || localISO(new Date(item.created_at))
const days = ['일', '월', '화', '수', '목', '금', '토']

export default function ItemsPage() {
  const { items, loading, error, reload } = useItems()
  const [month, setMonth] = useState(initialMonth)
  const [selected, setSelected] = useState(localISO(new Date()))
  const [view, setView] = useState('month')
  const [query, setQuery] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [actionError, setActionError] = useState('')
  const navigate = useNavigate()
  const filtered = useMemo(() => items.filter(item =>
    [item.title, item.content, item.category].some(value => String(value ?? '').toLowerCase().includes(query.trim().toLowerCase()))
  ), [items, query])
  const grouped = useMemo(() => {
    const result = {}
    for (const item of filtered) (result[studyDate(item)] ||= []).push(item)
    return result
  }, [filtered])
  const first = new Date(month.getFullYear(),month.getMonth(),1)
  const slots = Array.from({ length: 42 }, (_, index) => {
    const d = new Date(first.getFullYear(),first.getMonth(),1-first.getDay()+index)
    return { key: localISO(d), day:d.getDate(), outside:d.getMonth()!==first.getMonth() }
  })
  const visibleSlots = view==='week' ? (() => {
    const d = new Date(selected+'T12:00:00')
    const start = new Date(d.getFullYear(),d.getMonth(),d.getDate()-d.getDay())
    return Array.from({length:7},(_,i)=>{ const dt=new Date(start.getFullYear(),start.getMonth(),start.getDate()+i);return {key:localISO(dt),day:dt.getDate(),outside:dt.getMonth()!==first.getMonth()} })
  })() : slots
  const selectedItems = grouped[selected] || []
  const changeMonth = (offset) => {
    const d = new Date(month.getFullYear(), month.getMonth()+offset, 1)
    setMonth(d)
    setSelected(localISO(d))
  }
  const selectDay = (date) => { setSelected(date); const d = new Date(date+'T12:00:00');if (d.getMonth()!==month.getMonth()||d.getFullYear()!==month.getFullYear()) setMonth(new Date(d.getFullYear(), d.getMonth(), 1)) }
  async function remove(item) {
    if (!window.confirm(`"${item.title}" 기록을 삭제할까요?`)) return
    setDeleting(item.id); setActionError('')
    try { await deleteItem(item.id); await reload() } catch(e){setActionError(e.message || '삭제에 실패했습니다.')} finally {setDeleting(null)}
  }
  return <section className="archive">
    <div className="archive-header">
      <div><p className="eyebrow">STUDY ARCHIVE</p><h1>학습 달력</h1></div>
      <Link className="button button-primary" to={`/items/new?date=${selected}`}>새 기록 작성</Link>
    </div>
    <div className="archive-toolbar">
      <div className="archive-month-controls">
        <button type="button" aria-label="이전 달" onClick={()=>changeMonth(-1)}>‹</button>
        <strong>{month.getFullYear()}년 {month.getMonth()+1}월</strong>
        <button type="button" aria-label="다음 달" onClick={()=>changeMonth(1)}>›</button>
        <button type="button" className="archive-today" onClick={()=>{ const d=new Date();setMonth(new Date(d.getFullYear(),d.getMonth(),1));setSelected(localISO(d)) }}>오늘</button>
      </div>
      <div className="archive-views" aria-label="달력 보기 방식">
        <button type="button" aria-pressed={view==='month'} onClick={()=>setView('month')}>월간</button>
        <button type="button" aria-pressed={view==='week'} onClick={()=>setView('week')}>주간</button>
      </div>
      <input aria-label="기록 검색" value={query} onChange={e=>setQuery(e.target.value)} placeholder="제목·내용·분류 검색" />
    </div>
    {loading && <Loading label="기록을 불러오는 중..." />}
    {error && <ErrorState message={error} onRetry={reload}/>}
    {!loading && !error && <div className="archive-workspace">
      <div className="archive-calendar">
        <div className="archive-weekdays">{days.map(d=><span key={d}>{d}</span>)}</div>
        <div className={`archive-grid ${view==='week'?'archive-grid-week':''}`}>
          {visibleSlots.map(slot=><div key={slot.key} className={`archive-day ${slot.outside?'archive-outside':''} ${selected===slot.key?'archive-selected':''}`}>
            <button type="button" className="archive-date" aria-pressed={selected===slot.key} onClick={()=>selectDay(slot.key)}>{slot.day}</button>
            <div className="archive-day-records">
              {(grouped[slot.key]||[]).map(item=><button type="button" title={item.title} key={item.id} className="archive-record" onClick={()=>selectDay(slot.key)}>
                <span>{item.title}</span>
              </button>)}
            </div>
            <Link className="archive-day-add" to={`/items/new?date=${slot.key}`} aria-label={`${slot.key} 기록 추가`}>＋</Link>
          </div>)}
        </div>
      </div>
      <aside className="archive-side" aria-live="polite">
        <p className="eyebrow">선택 날짜</p>
        <h2>{selected.replaceAll('-','.')} </h2>
        <p className="archive-side-count">학습 기록 {selectedItems.length}개</p>
        <Link className="button button-primary archive-side-add" to={`/items/new?date=${selected}`}>이 날짜에 기록 추가</Link>
        {actionError && <p role="alert" className="submit-error">{actionError}</p>}
        {selectedItems.length===0 && <p className="archive-empty">이 날짜의 기록이 없습니다.</p>}
        {selectedItems.map(item=><article key={item.id} className="archive-side-item">
          <small>{item.category}</small>
          <h3><Link to={`/items/${item.id}`}>{item.title}</Link></h3>
          <p>{item.content}</p>
          <div className="archive-side-actions">
            <Link to={`/items/${item.id}`}>보기</Link>
            <Link to={`/items/${item.id}/edit`}>수정</Link>
            <button type="button" disabled={deleting===item.id} onClick={()=>remove(item)}>삭제</button>
          </div>
        </article>)}
      </aside>
    </div>}
  </section>
}
