import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setGoal, reset } from '../state/savingsSlice'

function Settings({ onBack }) {
  const dispatch = useDispatch()
  const currentGoal = useSelector(state => state.savings.goal)
  const [newName, setNewName] = useState(currentGoal.name)
  const [newAmount, setNewAmount] = useState(currentGoal.amount)

  const handleNameChange = () => {
    dispatch(setGoal({ name: newName }))
  }

  const handleAmountChange = () => {
    dispatch(setGoal({ amount: Number(newAmount) }))
  }

  const handleReset = () => {
    if (window.confirm("Czy na pewno chcesz zresetować postępy aplikacji?")) {
      dispatch(reset())
    }
  }

  return (
    <div className="settings-view">
      <h2>Ustawienia</h2>
      <div className="field">
        <label>Zmień nazwę Skarbonki:</label>
        <input 
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nowa nazwa celu"
          style={{ borderColor: 'var(--info)' }}
        />
        <button onClick={handleNameChange} style={{ background: 'var(--accent)' }}>Zatwierdź</button>
      </div>
      <div className="field">
        <label>Zmień kwotę celu nadrzędnego:</label>
        <input 
          type="number"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          placeholder="Nowa kwota celu"
          style={{ borderColor: 'var(--info)' }}
        />
        <button onClick={handleAmountChange} style={{ background: 'var(--accent)' }}>Zatwierdź</button>
      </div>
      <div className="field" style={{ marginTop: '20px' }}>
        <button onClick={handleReset} style={{ background: 'var(--highlight)' }}>
          Reset postępów aplikacji
        </button>
      </div>
      <button onClick={onBack} style={{ background: 'var(--accent)', marginTop: '20px' }}>Powrót</button>
    </div>
  )
}

export default Settings
