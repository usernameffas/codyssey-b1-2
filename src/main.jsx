import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import './styles.css'
import './calendar.css'

// ===== GitHub Pages 새로고침을 지원하는 HashRouter 시작 =====
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AppProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppProvider>
    </HashRouter>
  </React.StrictMode>
)

// ===== GitHub Pages HashRouter 끝 =====
