import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loading from './Loading'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loading label="로그인 상태 확인 중..." />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
