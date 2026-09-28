import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import ThemeToggle from './ThemeToggle'
import Button from './Button'

export default function Header() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function logout() {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="site-header">
      <NavLink to="/" className="brand">Study Records</NavLink>
      <nav aria-label="주요 메뉴">
        {user && <NavLink to="/items">기록</NavLink>}
        {user && <NavLink to="/items/new">새 기록</NavLink>}
        {user && <NavLink to="/profile">프로필</NavLink>}
        {!user && <NavLink to="/login">로그인</NavLink>}
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        {user && <Button variant="ghost" onClick={logout}>로그아웃</Button>}
      </div>
    </header>
  )
}
