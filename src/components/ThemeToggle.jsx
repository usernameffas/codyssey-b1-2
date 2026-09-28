import { useApp } from '../context/AppContext'
import Button from './Button'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useApp()
  return (
    <Button variant="ghost" onClick={toggleTheme} aria-label="테마 변경">
      {theme === 'light' ? '다크 모드' : '라이트 모드'}
    </Button>
  )
}
