import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

function Kalkulator({ onBack }) {
  const entries = useSelector(state => state.savings.entries)
  const totalSaved = entries.reduce((sum, entry) => sum + entry.amount, 0)
  let firstDate = null
  if (entries.length > 0) {
    firstDate = new Date(Math.min(...entries.map(entry => new Date(entry.date).getTime())))
  }
  const today = new Date()
  const diffDays = firstDate ? Math.max((today - firstDate) / (1000 * 3600 * 24), 1) : 1
  const defaultAvgDaily = totalSaved / diffDays

  // Używamy jednej wartości głównej (avgDaily) i obliczamy pozostałe
  const [avgDaily, setAvgDaily] = useState(defaultAvgDaily.toFixed(2))
  const [avgWeekly, setAvgWeekly] = useState((defaultAvgDaily * 7).toFixed(2))
  const [avgMonthly, setAvgMonthly] = useState((defaultAvgDaily * 30).toFixed(2))
  const [avgYearly, setAvgYearly] = useState((defaultAvgDaily * 365).toFixed(2))

  // Jeśli użytkownik zmienia avgDaily, aktualizujemy pozostałe pola
  useEffect(() => {
    const d = parseFloat(avgDaily) || 0
    setAvgWeekly((d * 7).toFixed(2))
    setAvgMonthly((d * 30).toFixed(2))
    setAvgYearly((d * 365).toFixed(2))
  }, [avgDaily])

  // Jeśli użytkownik zmienia inne pola, przeliczamy avgDaily
  const handleWeeklyChange = (e) => {
    const value = e.target.value
    setAvgWeekly(value)
    const d = parseFloat(value) / 7 || 0
    setAvgDaily(d.toFixed(2))
  }
  const handleMonthlyChange = (e) => {
    const value = e.target.value
    setAvgMonthly(value)
    const d = parseFloat(value) / 30 || 0
    setAvgDaily(d.toFixed(2))
  }
  const handleYearlyChange = (e) => {
    const value = e.target.value
    setAvgYearly(value)
    const d = parseFloat(value) / 365 || 0
    setAvgDaily(d.toFixed(2))
  }
  const handleDailyChange = (e) => {
    setAvgDaily(e.target.value)
  }

  // Predykcja daty osiągnięcia celu na podstawie edytowanego avgDaily
  let predictedDate = ""
  const goal = useSelector(state => state.savings.goal)
  if (parseFloat(avgDaily) > 0 && goal.amount > totalSaved) {
    const remaining = goal.amount - totalSaved
    const daysNeeded = remaining / parseFloat(avgDaily)
    const predicted = new Date(today.getTime() + daysNeeded * 24 * 3600 * 1000)
    predictedDate = predicted.toLocaleDateString()
  }

  return (
    <div className="statistics-view">
      <h2>Kalkulator</h2>
      <div className="editable-stats">
        <div>
          <label>Średnio dziennie: </label>
          <input type="number" value={avgDaily} onChange={handleDailyChange} style={{ borderColor: 'var(--info)' }} />€
        </div>
        <div>
          <label>Średnio tygodniowo: </label>
          <input type="number" value={avgWeekly} onChange={handleWeeklyChange} style={{ borderColor: 'var(--info)' }} />€
        </div>
        <div>
          <label>Średnio miesięcznie: </label>
          <input type="number" value={avgMonthly} onChange={handleMonthlyChange} style={{ borderColor: 'var(--info)' }} />€
        </div>
        <div>
          <label>Średnio rocznie: </label>
          <input type="number" value={avgYearly} onChange={handleYearlyChange} style={{ borderColor: 'var(--info)' }} />€
        </div>
      </div>
      <hr />
      <div className="prediction">
        <p>
          <strong>
            Osiągniesz cel: <span style={{ color: 'var(--highlight)', fontWeight: 'bold' }}>{predictedDate || 'Brak danych'}</span>
          </strong>
        </p>
      </div>
      <button onClick={onBack} style={{ background: 'var(--accent)' }}>Powrót</button>
    </div>
  )
}

export default Kalkulator
