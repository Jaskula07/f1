import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addKupka, addFunds, removeKupka, spendFunds, transferFunds } from '../state/kupkiSlice'
import { addEntry } from '../state/savingsSlice'

const availableIcons = ["💰", "📚", "🏦", "🎁", "🚀", "💎", "🔥", "🌟", "⚡", "🥇"]

function Kupki({ onBack }) {
  const dispatch = useDispatch()
  const kupki = useSelector(state => state.kupki.kupki)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState(availableIcons[0])
  const [newColor, setNewColor] = useState('#EA00D9') // domyślny kolor Neon Magenta

  // Nowa kupka – formularz
  const handleAddKupka = () => {
    if (newName.trim() !== '') {
      dispatch(addKupka({ id: Date.now().toString(), name: newName, icon: newIcon, color: newColor }))
      setNewName('')
      setNewIcon(availableIcons[0])
      // Możesz zresetować kolor lub pozostawić aktualny
    }
  }

  // Dodawanie środków do kupki
  const [amountToAdd, setAmountToAdd] = useState('')
  const handleAddFunds = (kupkaId) => {
    if (amountToAdd) {
      dispatch(addFunds({ kupkaId, amount: Number(amountToAdd) }))
      // Dodajemy wpis o transferze - odjęcie środków z głównej skarbonki
      dispatch(addEntry(-Number(amountToAdd)))
      setAmountToAdd('')
    }
  }

  // Wydawanie środków z kupki (środki zostają usunięte tylko z kupki)
  const [amountToSpend, setAmountToSpend] = useState('')
  const handleSpendFunds = (kupkaId) => {
    if (amountToSpend) {
      dispatch(spendFunds({ kupkaId, amount: Number(amountToSpend) }))
      setAmountToSpend('')
    }
  }

  // Transfer środków z jednej kupki do innej lub do głównej skarbonki
  const [sourceKupkaId, setSourceKupkaId] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [target, setTarget] = useState('') // target: albo kupka id albo 'main'
  const handleTransferFunds = () => {
    if (sourceKupkaId && transferAmount && target) {
      dispatch(transferFunds({ sourceKupkaId, amount: Number(transferAmount), target, targetKupkaId: target !== 'main' ? target : undefined }))
      // Jeśli target to 'main', dodaj środki z powrotem do głównej skarbonki
      if (target === 'main') {
        dispatch(addEntry(Number(transferAmount)))
      }
      setSourceKupkaId('')
      setTransferAmount('')
      setTarget('')
    }
  }

  // Usuwanie kupki – środki z kupki są przywracane do głównej skarbonki
  const handleRemoveKupka = (kupkaId, allocated) => {
    if (window.confirm("Czy na pewno chcesz usunąć kupkę? Środki zostaną przywrócone do głównej skarbonki.")) {
      dispatch(removeKupka(kupkaId))
      // Przywróć środki do głównej skarbonki
      if (allocated > 0) {
        dispatch(addEntry(Number(allocated)))
      }
    }
  }

  return (
    <div className="kupki-view">
      <h2>Kupki pieniędzy</h2>
      
      {/* Formularz tworzenia nowej kupki */}
      <div className="create-kupka">
        <h3>Utwórz nową kupkę</h3>
        <input 
          type="text" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
          placeholder="Nazwa kupki (np. na rachunki)" 
        />
        <div className="icon-selector">
          <p>Wybierz ikonę:</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {availableIcons.map((icon, index) => (
              <button 
                key={index}
                onClick={() => setNewIcon(icon)}
                style={{ 
                  padding: '4px', 
                  fontSize: '1.5rem',
                  background: newIcon === icon ? 'var(--accent)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        <div className="color-picker">
          <p>Wybierz kolor:</p>
          <input 
            type="color" 
            value={newColor} 
            onChange={(e) => setNewColor(e.target.value)} 
            title="Wybierz kolor" 
          />
        </div>
        <button onClick={handleAddKupka}>Dodaj kupkę</button>
      </div>
      
      <hr />
      
      {/* Lista utworzonych kupek */}
      <div className="list-kupki">
        <h3>Twoje kupki</h3>
        {kupki.length === 0 ? (
          <p>Nie utworzono jeszcze żadnej kupki.</p>
        ) : (
          <ul>
            {kupki.map(kupka => (
              <li key={kupka.id} style={{ marginBottom: '8px', border: `1px solid ${kupka.color}`, padding: '4px' }}>
                <span style={{ marginRight: '8px', fontSize: '1.5rem' }}>{kupka.icon}</span>
                <strong>{kupka.name}</strong> – Kwota: {kupka.allocated}€
                {/* Przyciski do usuwania i wydawania */}
                <button onClick={() => handleRemoveKupka(kupka.id, kupka.allocated)} style={{ marginLeft: '10px', background: 'red', color: '#fff' }}>
                  Usuń
                </button>
                <div style={{ marginTop: '4px' }}>
                  <input 
                    type="number" 
                    placeholder="Kwota do wydania" 
                    value={amountToSpend} 
                    onChange={(e) => setAmountToSpend(e.target.value)}
                    style={{ borderColor: 'var(--info)' }}
                  />
                  <button onClick={() => handleSpendFunds(kupka.id)} style={{ background: 'var(--accent)', marginLeft: '4px' }}>
                    Wydaj
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <hr />
      
      {/* Sekcja transferu środków */}
      <div className="transfer-funds">
        <h3>Przenieś środki</h3>
        <div>
          <label>Źródło: </label>
          <select value={sourceKupkaId} onChange={(e) => setSourceKupkaId(e.target.value)}>
            <option value="">Wybierz kupkę</option>
            {kupki.map(kupka => (
              <option key={kupka.id} value={kupka.id}>{kupka.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Cel: </label>
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="">Wybierz cel</option>
            <option value="main">Główna skarbonka</option>
            {kupki.filter(k => k.id !== sourceKupkaId).map(kupka => (
              <option key={kupka.id} value={kupka.id}>{kupka.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Kwota: </label>
          <input 
            type="number" 
            value={transferAmount} 
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Kwota do przeniesienia"
            style={{ borderColor: 'var(--info)' }}
          />
        </div>
        <button onClick={handleTransferFunds} style={{ background: 'var(--accent)', marginTop: '10px' }}>
          Transferuj
        </button>
      </div>
      
      <hr />
      <div>
        <p><em>Łącznie przydzielono do kup: {kupki.reduce((sum, k) => sum + k.allocated, 0)}€</em></p>
      </div>
      <button onClick={onBack} style={{ background: 'var(--accent)', marginTop: '20px' }}>Powrót</button>
    </div>
  )
}

export default Kupki
