import { Outlet } from 'react-router-dom'
import Header from './Header'
import Toast from './Toast'

export default function Layout() {
  return (
    <>
      <Header />
      <main className="container">
        <Outlet />
      </main>
      <Toast />
    </>
  )
}
