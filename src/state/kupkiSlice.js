import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  kupki: []  // Każda kupka: { id, name, icon, color, allocated }
}

const kupkiSlice = createSlice({
  name: 'kupki',
  initialState,
  reducers: {
    // Dodaje nową kupkę – użytkownik podaje nazwę, ikonę i kolor
    addKupka(state, action) {
      // action.payload: { id, name, icon, color }
      state.kupki.push({ ...action.payload, allocated: 0 })
    },
    // Dodaje fundusze do danej kupki
    addFunds(state, action) {
      // action.payload: { kupkaId, amount }
      const kupka = state.kupki.find(k => k.id === action.payload.kupkaId)
      if (kupka) {
        kupka.allocated += action.payload.amount
      }
    },
    // Usuwa kupkę - po stronie UI należy przywrócić środki do głównej skarbonki
    removeKupka(state, action) {
      // action.payload: kupkaId
      state.kupki = state.kupki.filter(k => k.id !== action.payload)
    },
    // "Wydaje" środki – odejmuje kwotę z kupki, ale nie usuwa kupki
    spendFunds(state, action) {
      // action.payload: { kupkaId, amount }
      const kupka = state.kupki.find(k => k.id === action.payload.kupkaId)
      if (kupka) {
        kupka.allocated = Math.max(kupka.allocated - action.payload.amount, 0)
      }
    },
    // Przenosi środki:
    // Jeśli target to 'main', odejmuje środki z kupki (a komponent musi dodać je do głównej skarbonki)
    // Jeśli targetKupkaId jest podany, przenosi środki z jednej kupki do innej.
    transferFunds(state, action) {
      // action.payload: { sourceKupkaId, amount, target: 'main' } 
      //   lub { sourceKupkaId, amount, targetKupkaId }
      const { sourceKupkaId, amount } = action.payload
      const sourceKupka = state.kupki.find(k => k.id === sourceKupkaId)
      if (!sourceKupka) return
      if (action.payload.target === 'main') {
        // Przeniesienie do głównej skarbonki – odejmujemy środki z kupki,
        // a komponent z widoku kupki musi wywołać np. addEntry, aby przywrócić środki w savingsSlice.
        sourceKupka.allocated = Math.max(sourceKupka.allocated - amount, 0)
      } else {
        // Przenoszenie między kupkami
        const { targetKupkaId } = action.payload
        const targetKupka = state.kupki.find(k => k.id === targetKupkaId)
        if (targetKupka) {
          sourceKupka.allocated = Math.max(sourceKupka.allocated - amount, 0)
          targetKupka.allocated += amount
        }
      }
    }
  }
})

export const { addKupka, addFunds, removeKupka, spendFunds, transferFunds } = kupkiSlice.actions
export default kupkiSlice.reducer
