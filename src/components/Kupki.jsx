import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addKupka, addFunds } from '../state/kupkiSlice'
import { addEntry } from '../state/savingsSlice'

function Kupki({ onBack }) {
  const dispatch = useDispatch()
  const kupki = useSelector(state => state.kupki.kupki)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('💰')  // Domyślna ikona – możesz dodać więcej opcji
  const [newColor, setNewColor] = useState('#EA00D9') // Domyślny kolor (Neon Magenta)
  const [selectedKupkaId, setSelectedKupkaId] = useState('')
  const [amountToAdd, setAmountToAdd] = useState('')

  // Dodawanie nowej kupki
  const handleAddKupka = () => {
    if (newName.trim() !== '') {
      // Użyj unikalnego identyfikatora, np. Date.now() lub innego mechanizmu
      dispatch(addKupka({ id: Date.now().toString(), name: newName, icon: newIcon, color: newColor }))
      setNewName('')
    }
  }

  // Dodawanie kwoty do wybranej kupki
  const handleAddFunds = () => {
    if (selectedKupkaId && amountToAdd) {
      // Dodaj kwotę do kupki
      dispatch(addFunds({ kupkaId: selectedKupkaId, amount: Number(amountToAdd) }))
      // Dodaj wpis o transferze funduszy do kupki, aby odjąć kwotę ze "skarbonki"
      dispatch(addEntry(-Number(amountToAdd)))
      setAmountToAdd('')
    }
  }

  // Obliczamy łączną kwotę już przydzieloną do kupki, aby pokazać ten efekt (opcjonalnie)
  const totalAllocated = kupki.reduce((sum, k) => sum + k.allocated, 0)

  return (
    <div className="kupki-view">
      <h2>Kupki pieniędzy</h2>
      <div className="create-kupka">
        <h3>Utwórz nową kupkę</h3>
        <input 
          type="text" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
          placeholder="Nazwa kupki (np. na rachunki)" 
        />
        <input 
          type="text" 
          value={newIcon} 
          onChange={(e) => setNewIcon(e.target.value)} 
          placeholder="Ikona (np. 💰, 📚, etc.)" 
        />
        <input 
          type="color" 
          value={newColor} 
          onChange={(e) => setNewColor(e.target.value)} 
          title="Wybierz kolor" 
        />
        <button onClick={handleAddKupka}>Dodaj kupkę</button>
      </div>
      <hr />
      <div className="list-kupki">
        <h3>Twoje kupki</h3>
        {kupki.length === 0 ? (
          <p>Nie utworzono jeszcze żadnej kupki.</p>
        ) : (
          <ul>
            {kupki.map(kupka => (
              <li key={kupka.id} style={{ color: kupka.color, marginBottom: '8px' }}>
                <span style={{ marginRight: '8px' }}>{kupka.icon}</span>
                <strong>{kupka.name}</strong> – Kwota: {kupka.allocated}€
                <button onClick={() => setSelectedKupkaId(kupka.id)} style={{ marginLeft: '10px' }}>
                  Wybierz
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <hr />
      <div className="add-funds">
        <h3>Dodaj środki do wybranej kupki</h3>
        {selectedKupkaId === '' ? (
          <p>Wybierz kupkę, do której chcesz dodać środki.</p>
        ) : (
          <>
            <input 
              type="number" 
              value={amountToAdd} 
              onChange={(e) => setAmountToAdd(e.target.value)} 
              placeholder="Kwota do dodania" 
              style={{ borderColor: 'var(--info)' }}
            />
            <button onClick={handleAddFunds} style={{ background: 'var(--accent)' }}>Dodaj środki</button>
          </>
        )}
      </div>
      <hr />
      <div>
        <p><em>Łącznie przydzielono do kup: {totalAllocated}€</em></p>
      </div>
      <button onClick={onBack} style={{ background: 'var(--accent)', marginTop: '20px' }}>Powrót</button>
    </div>
  )
}

export default Kupki
