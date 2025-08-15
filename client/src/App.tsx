import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChecklistProvider } from './contexts/ChecklistContext'
import { GastosProvider } from './contexts/GastosContext'
import { MetasProvider } from './contexts/MetasContext'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Checklist from './pages/Checklist'
import Gastos from './pages/Gastos'
import Metas from './pages/Metas'
import './App.css'

function App() {
  return (
    <Router>
      <ChecklistProvider>
        <GastosProvider>
          <MetasProvider>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/checklist" element={<Checklist />} />
                  <Route path="/gastos" element={<Gastos />} />
                  <Route path="/metas" element={<Metas />} />
                </Routes>
              </main>
            </div>
          </MetasProvider>
        </GastosProvider>
      </ChecklistProvider>
    </Router>
  )
}

export default App
