export default function Loading({ label = '불러오는 중...' }) {
  return (
    <div className="state-box" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
