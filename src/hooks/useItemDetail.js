import { useCallback, useEffect, useState } from 'react'
import { fetchItem } from '../lib/itemService'

export default function useItemDetail(id) {
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError('')
    try {
      setItem(await fetchItem(id))
    } catch (err) {
      setError(err.message || '상세 데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  return { item, loading, error, reload: load }
}
