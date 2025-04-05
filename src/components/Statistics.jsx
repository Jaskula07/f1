import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function Statistics({ onBack }) {
    const entries = useSelector(state => state.savings.entries)
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
    const avgYearly = avgDaily * 365

    const [predDaily, setPredDaily] = useState('')
    let predictedDate = ''
    const goal = useSelector(state => state.savings.goal)
    if (predDaily && Number(predDaily) > 0 && goal.amount > totalSaved) {
        const remaining = goal.amount - totalSaved
        const daysNeeded = remaining / Number(predDaily)
        const predicted = new Date(today.getTime() + daysNeeded * 24 * 3600 * 1000)
        predictedDate = predicted.toLocaleDateString()
    }

    return (
        <div className="statistics-view">
            <h2>Statystyki</h2>
            <p>�rednio dziennie: {avgDaily.toFixed(2)}�</p>
            <p>�rednio tygodniowo: {avgWeekly.toFixed(2)}�</p>
            <p>�rednio miesi�cznie: {avgMonthly.toFixed(2)}�</p>
            <p>�rednio rocznie: {avgYearly.toFixed(2)}�</p>
            <hr />
            <div className="prediction">
                <label>
                    Je�li �rednia dzienna wynosi:
                    <input
                        type="number"
                        value={predDaily}
                        onChange={(e) => setPredDaily(e.target.value)}
                        placeholder="Kwota"
                        style={{ borderColor: 'var(--info)' }}
                    />�
                </label>
                <p>Osi�gniesz cel: {predictedDate}</p>
            </div>
            <button onClick={onBack} style={{ background: 'var(--accent)' }}>Powr�t</button>
        </div>
    )
}

export default Statistics
