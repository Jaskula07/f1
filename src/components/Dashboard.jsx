import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addEntry } from '../state/savingsSlice'
import { addXP } from '../state/gameSlice'

function Dashboard({ onNavigate }) {
  const dispatch = useDispatch()
  const goal = useSelector((state) => state.savings.goal)
  const total = useSelector((state) => state.savings.total)
  const entries = useSelector((state) => state.savings.entries)
  const progress = goal.amount > 0 ? Math.min((total / goal.amount) * 100, 100) : 0

  // Pola do wprowadzania kwot
  const [addAmount, setAddAmount] = useState('')
  const [subtractAmount, setSubtractAmount] = useState('')

  // Obliczenia statystyk – podobne do tych w Statistics.jsx
  const totalSaved = entries.reduce((sum, entry) => sum + entry.amount, 0)
  let firstDate = null
  if (entries.length > 0) {
    firstDate = new Date(Math.min(...entries.map(entry => new Date(entry.date).getTime())))
  }
  const today = new Date()
  const diffDays = firstDate ? Math.max((today - firstDate) / (1000 * 3600 * 24), 1) : 1
  const avgDaily = totalSaved / diffDays
  const avgWeekly = avgDaily * 7
  const avgMonthly = avgDaily * 30

  // Predykcja daty osiągnięcia celu na podstawie średniej dziennej
  let predictedDate = ""
  if (avgDaily > 0 && goal.amount > total) {
    const remaining = goal.amount - total
    const daysNeeded = remaining / avgDaily
    const predicted = new Date(today.getTime() + daysNeeded * 24 * 3600 * 1000)
    predictedDate = predicted.toLocaleDateString()
  }

  const handleAdd = () => {
    if (addAmount) {
      dispatch(addEntry(Number(addAmount)))
      dispatch(addXP(Number(addAmount))) // Opcjonalnie, jeśli masz mechanikę XP
      setAddAmount('')
    }
  }

  const handleSubtract = () => {
    if (subtractAmount) {
      dispatch(addEntry(-Number(subtractAmount))) // Odejmujemy jako ujemna wartość
      setSubtractAmount('')
    }
  }

  return (
    <div className="dashboard-view">
      <div className="logo">
        <h1>FinansowyQuest</h1>
      </div>
      <hr />
      <div className="goal-info">
        <p><strong>Cel:</strong> {goal.name}</p>
        <p><strong>Kwota celu:</strong> {goal.amount}€</p>
        <p><strong>Zaoszczędzono:</strong> {total}€</p>
        <p><strong>Postęp:</strong> {progress.toFixed(0)}%</p>
      </div>
      <hr />
      <div className="transaction-inputs">
        <div className="transaction">
          <input 
            type="number" 
            value={addAmount} 
            onChange={(e) => setAddAmount(e.target.value)}
            placeholder="Kwota do dodania"
            style={{ borderColor: 'var(--info)' }}
          />
          <button onClick={handleAdd} style={{ background: 'var(--accent)' }}>Dodaj</button>
        </div>
        <div className="transaction">
          <input 
            type="number" 
            value={subtractAmount} 
            onChange={(e) => setSubtractAmount(e.target.value)}
            placeholder="Kwota do odjęcia"
            style={{ borderColor: 'var(--info)' }}
          />
          <button onClick={handleSubtract} style={{ background: 'var(--accent)' }}>Odejmij</button>
        </div>
      </div>
      <hr />
      {/* Dodatkowe statystyki */}
      <div className="additional-stats">
        <p><strong>Jeśli daalej będziesz wpłacał:</strong></p>
        <p>dziennie średnio: {avgDaily.toFixed(2)}€</p>
        <p>tygodniowo średnio: {avgWeekly.toFixed(2)}€</p>
        <p>miesięcznie średnio: {avgMonthly.toFixed(2)}€</p>
        {predictedDate && (
          <p>
            <strong>
              to osiągniesz cel dnia: <span style={{ color: 'var(--highlight)', fontWeight: 'bold' }}>{predictedDate}</span>
            </strong>
          </p>
        )}
      </div>
      <hr />
      <div className="navigation-buttons">
        <button onClick={() => onNavigate('settings')} style={{ background: 'var(--accent)' }}>USTAWIENIA</button>
        <button onClick={() => onNavigate('history')} style={{ background: 'var(--accent)' }}>HISTORIA</button>
        <button onClick={() => onNavigate('statistics')} style={{ background: 'var(--accent)' }}>STATYSTYKI</button>
      </div>
    </div>
  )
}

export default Dashboard
