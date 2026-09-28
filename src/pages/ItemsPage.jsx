import { useMemo, useState } from 'react'
import ErrorState from '../components/ErrorState'
import ItemList from '../components/ItemList'
import Loading from '../components/Loading'
import TextInput from '../components/TextInput'
import useItems from '../hooks/useItems'

export default function ItemsPage() {
  const { items, loading, error, reload } = useItems()
  const [query, setQuery] = useState('')

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return items
    return items.filter((item) =>
      [item.title, item.content, item.category].some((value) =>
        String(value ?? '').toLowerCase().includes(keyword)
      )
    )
  }, [items, query])

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">READ</p>
          <h1>학습 기록</h1>
        </div>
        <span>{filteredItems.length}개</span>
      </div>

      <TextInput
        label="목록 필터"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="제목, 내용, 분류 검색"
      />

      {loading && <Loading label="기록을 불러오는 중..." />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && <ItemList items={filteredItems} />}
    </section>
  )
}
