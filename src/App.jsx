import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ItemsPage from './pages/ItemsPage'
import ItemDetailPage from './pages/ItemDetailPage'
import ItemNewPage from './pages/ItemNewPage'
import ItemEditPage from './pages/ItemEditPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/items/new" element={<ItemNewPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/items/:id/edit" element={<ItemEditPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
