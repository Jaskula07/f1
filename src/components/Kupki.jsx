import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addKupka, addFunds, removeKupka, spendFunds, transferFunds } from '../state/kupkiSlice'
import { addEntry } from '../state/savingsSlice'  // aby odjąć fundusze ze skarbonki

function Kupki({ onBack }) {
  const dispatch = useDispatch()
  const kupki = useSelector(state => state.kupki.kupki)

  // Stany dla tworzenia nowej kupki
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('💰') // domyślna ikona
  const [newColor, setNewColor] = useState('#EA00D9') // domyślny kolor (Neon Magenta)

  // Stan do wyboru ikon – otwiera modal wyboru ikon
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false)
  const availableIcons = ['💰', '📚', '💎', '🎯', '🚀', '🏦', '😄', '🛡️']  // przykładowa lista

  // Stany dla operacji na kupkach
  // Dla wydawania – obiekt: { [kupkaId]: kwota }
  const [spendAmounts, setSpendAmounts] = useState({})
  // Dla transferu – obiekt: { [kupkaId]: { amount, destination } }
  const [transferData, setTransferData] = useState({})

  // Dodawanie nowej kupki
  const handleAddKupka = () => {
    if (newName.trim() !== '') {
      const id = Date.now().toString()  // prosty identyfikator
      dispatch(addKupka({ id, name: newName, icon: newIcon, color: newColor }))
      setNewName('')
      // Resetujemy ikonę i kolor do wartości domyślnych
      setNewIcon('💰')
      setNewColor('#EA00D9')
    }
  }

  // Usuwanie kupki
  const handleRemoveKupka = (kupkaId) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę kupkę? Środki zostaną zwrócone do głównej skarbonki.")) {
      // Po usunięciu kupki, środki z niej "znikają" z allocated, co zwiększy dostępną kwotę
      dispatch(removeKupka(kupkaId))
    }
  }

  // Wydawanie środków z kupki
  const handleSpend = (kupkaId) => {
    const amount = parseFloat(spendAmounts[kupkaId])
    if (amount > 0) {
      dispatch(spendFunds({ kupkaId, amount }))
      // Nie dodajemy wpisu do skarbonki, bo to faktycznie wydaje środki
      setSpendAmounts({ ...spendAmounts, [kupkaId]: '' })
    }
  }

  // Transfer środków z kupki do innej kupki lub do głównej skarbonki ("main")
  const handleTransfer = (kupkaId) => {
    const data = transferData[kupkaId]
    const amount = parseFloat(data?.amount)
    if (amount > 0 && data?.destination) {
      dispatch(transferFunds({ sourceKupkaId: kupkaId, destination: data.destination, amount }))
      setTransferData({ ...transferData, [kupkaId]: { amount: '', destination: '' } })
    }
  }

  return (
    <div className="kupki-view">
      <h2>Kupki pieniędzy</h2>
      
      {/* Sekcja tworzenia nowej kupki */}
      <div className="create-kupka">
        <h3>Utwórz nową kupkę</h3>
        <input 
          type="text" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
          placeholder="Nazwa kupki (np. na rachunki)" 
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
          <input 
            type="text" 
            value={newIcon} 
            onChange={(e) => setNewIcon(e.target.value)} 
            placeholder="Ikonka" 
          />
          <button onClick={() => setIsIconPickerOpen(true)} style={{ background: 'var(--accent)', padding: '6px 12px', border: 'none', borderRadius: '4px', color: '#fff' }}>
            Wybierz ikonę
          </button>
        </div>
        <input 
          type="color" 
          value={newColor} 
          onChange={(e) => setNewColor(e.target.value)} 
          title="Wybierz kolor" 
        />
        <button onClick={handleAddKupka} style={{ background: 'var(--accent)', marginLeft: '10px' }}>
          Dodaj kupkę
        </button>
      </div>

      {/* Modal wyboru ikon */}
      {isIconPickerOpen && (
        <div className="modal">
          <h3>Wybierz ikonę</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {availableIcons.map((icon, index) => (
              <button 
                key={index} 
                onClick={() => { setNewIcon(icon); setIsIconPickerOpen(false) }}
                style={{ fontSize: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                {icon}
              </button>
            ))}
          </div>
          <button className="close" onClick={() => setIsIconPickerOpen(false)} style={{ marginTop: '10px' }}>Zamknij</button>
        </div>
      )}

      <hr />

      {/* Lista utworzonych kup */}
      <div className="list-kupki">
        <h3>Twoje kupki</h3>
        {kupki.length === 0 ? (
          <p>Nie utworzono jeszcze żadnej kupki.</p>
        ) : (
          <ul>
            {kupki.map(kupka => (
              <li key={kupka.id} style={{ border: `1px solid ${kupka.color}`, padding: '8px', marginBottom: '10px', borderRadius: '4px' }}>
                <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>{kupka.icon}</span>
                <strong>{kupka.name}</strong> – Kwota: {kupka.allocated}€
                <div style={{ marginTop: '8px' }}>
                  <button onClick={() => handleRemoveKupka(kupka.id)} style={{ background: 'var(--accent)', marginRight: '8px' }}>Usuń kupkę</button>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <input 
                    type="number" 
                    value={spendAmounts[kupka.id] || ''} 
                    onChange={e => setSpendAmounts({ ...spendAmounts, [kupka.id]: e.target.value })}
                    placeholder="Kwota do wydania"
                    style={{ borderColor: 'var(--info)', marginRight: '8px' }}
                  />
                  <button onClick={() => handleSpend(kupka.id)} style={{ background: 'var(--accent)' }}>Wydaj</button>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <input 
                    type="number" 
                    value={transferData[kupka.id]?.amount || ''} 
                    onChange={e => setTransferData({ 
                      ...transferData, 
                      [kupka.id]: { 
                        ...transferData[kupka.id], 
                        amount: e.target.value 
                      } 
                    })}
                    placeholder="Kwota do przeniesienia"
                    style={{ borderColor: 'var(--info)', marginRight: '8px' }}
                  />
                  <select 
                    value={transferData[kupka.id]?.destination || ''} 
                    onChange={e => setTransferData({ 
                      ...transferData, 
                      [kupka.id]: { 
                        ...transferData[kupka.id], 
                        destination: e.target.value 
                      } 
                    })}
                    style={{ marginRight: '8px' }}
                  >
                    <option value="">Wybierz cel transferu</option>
                    <option value="main">Do głównej skarbonki</option>
                    {kupki
                      .filter(k => k.id !== kupka.id)
                      .map(k => (
                        <option key={k.id} value={k.id}>
                          {k.name}
                        </option>
                      ))}
                  </select>
                  <button onClick={() => handleTransfer(kupka.id)} style={{ background: 'var(--accent)' }}>Transfer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr />
      <div>
        {/* Opcjonalnie: wyświetlenie łącznej kwoty przydzielonej do kup */}
        <p><em>Łącznie przydzielono do kup: {kupki.reduce((sum, k) => sum + k.allocated, 0)}€</em></p>
      </div>
      <button onClick={onBack} style={{ background: 'var(--accent)', marginTop: '20px' }}>Powrót</button>
    </div>
  )
}

export default Kupki
