import { memo } from 'react'
import { Link } from 'react-router-dom'

function ItemCard({ item, compact = false }) {
  return (
    <article className={`card ${compact ? 'card-compact' : ''}`}>
      <div>
        <p className="eyebrow">{item.category || '기타'}</p>
        <h2>{item.title}</h2>
        {!compact && <p className="line-clamp">{item.content}</p>}
      </div>
      <Link to={`/items/${item.id}`}>상세 보기 →</Link>
    </article>
  )
}

export default memo(ItemCard)
