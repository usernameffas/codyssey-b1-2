import EmptyState from './EmptyState'
import ItemCard from './ItemCard'

export default function ItemList({ items }) {
  if (!items.length) return <EmptyState />
  return (
    <div className="card-grid">
      {items.map((item) => <ItemCard key={item.id} item={item} />)}
    </div>
  )
}
