import { useEffect } from 'react'
import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toast, clearToast } = useApp()

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(clearToast, 2600)
    return () => clearTimeout(timer)
  }, [toast, clearToast])

  if (!toast) return null
  return <div className={`toast toast-${toast.type}`} role="status">{toast.message}</div>
}
