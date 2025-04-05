import React, { useState } from 'react'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'
import History from './components/History'
import Kalkulator from './components/Kalkulator'

function App() {
  const [view, setView] = useState('dashboard')

  const renderView = () => {
    switch(view) {
      case 'dashboard':
        return <Dashboard onNavigate={setView} />
      case 'settings':
        return <Settings onBack={() => setView('dashboard')} />
      case 'history':
        return <History onBack={() => setView('dashboard')} />
      case 'kalkulator':
        return <Kalkulator onBack={() => setView('dashboard')} />
      default:
        return <Dashboard onNavigate={setView} />
    }
  }

  return (
    <div className="app">
      {renderView()}
    </div>
  )
}

export default App
