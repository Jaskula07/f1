import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addEntry } from '../state/savingsSlice'
import { addXP } from '../state/gameSlice'

function Dashboard({ onNavigate }) {
  const dispatch = useDispatch()
  const goal = useSelector((state) => state.savings.goal)
  const total = useSelector((state) => state.savings.total)
  const progress = goal.amount > 0 ? Math.min((total / goal.amount) * 100, 100) : 0

  const [addAmount, setAddAmount] = useState('')
  const [subtractAmount, setSubtractAmount] = useState('')

  const handleAdd = () => {
    if (addAmount) {
      dispatch(addEntry(Number(addAmount)))
      dispatch(addXP(Number(addAmount))) // opcjonalnie, jeśli masz mechanikę XP
      setAddAmount('')
    }
  }
  const handleSubtract = () => {
    if (subtractAmount) {
      dispatch(addEntry(-Number(subtractAmount))) // odejmujemy jako ujemna wartość
      setSubtractAmount('')
    }
  }

  return (
    <div className="dashboard-view">
      <div className="logo">
        <h1 style={{ color: 'var(--primary)' }}>FinansowyQuest</h1>
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
      <div className="navigation-buttons">
        <button onClick={() => onNavigate('settings')} style={{ background: 'var(--accent)' }}>USTAWIENIA</button>
        <button onClick={() => onNavigate('history')} style={{ background: 'var(--accent)' }}>HISTORIA</button>
        <button onClick={() => onNavigate('statistics')} style={{ background: 'var(--accent)' }}>STATYSTYKI</button>
      </div>
    </div>
  )
}

export default Dashboard
