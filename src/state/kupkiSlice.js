import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  kupki: []  // Tablica kup, każdy obiekt: { id, name, icon, color, allocated }
}

const kupkiSlice = createSlice({
  name: 'kupki',
  initialState,
  reducers: {
    addKupka(state, action) {
      // action.payload: { id, name, icon, color }
      state.kupki.push({ ...action.payload, allocated: 0 })
    },
    addFunds(state, action) {
      // action.payload: { kupkaId, amount }
      const kupka = state.kupki.find(k => k.id === action.payload.kupkaId)
      if (kupka) {
        kupka.allocated += action.payload.amount
      }
    }
  }
})

export const { addKupka, addFunds } = kupkiSlice.actions
export default kupkiSlice.reducer
