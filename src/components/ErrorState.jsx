import Button from './Button'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state-box state-error" role="alert">
      <strong>요청에 실패했습니다.</strong>
      <p>{message}</p>
      {onRetry && <Button onClick={onRetry}>다시 시도</Button>}
    </div>
  )
}
