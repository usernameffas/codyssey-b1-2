export default function TextArea({ label, error, ...props }) {
  const id = props.id || props.name
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  )
}
