import React from 'react'
import { useSelector } from 'react-redux'

function History({ onBack }) {
  const entries = useSelector(state => state.savings.entries)
  
  return (
    <div className="history-view">
      <h2>Historia</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Kwota</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            const date = new Date(entry.date).toLocaleDateString()
            const amount = entry.amount
            return (
              <tr key={index}>
                <td>{date}</td>
                <td>{amount >= 0 ? `+${amount}€` : `${amount}€`}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <button onClick={onBack} style={{ background: 'var(--accent)' }}>Powrót</button>
    </div>
  )
}

export default History
