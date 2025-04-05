import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  goal: { name: 'Nowy cel', amount: 1000 },
  total: 0,
  entries: []
}

const savingsSlice = createSlice({
  name: 'savings',
  initialState,
  reducers: {
    setGoal(state, action) {
      const { name, amount } = action.payload
      if (name !== undefined) state.goal.name = name
      if (amount !== undefined) state.goal.amount = amount
    },
    addEntry(state, action) {
      const amount = action.payload
      state.total += amount
      state.entries.push({
        date: new Date().toISOString(),
        amount
      })
    },
    reset(state) {
      state.total = 0
      state.entries = []
    }
  }
})

export const { setGoal, addEntry, reset } = savingsSlice.actions
export default savingsSlice.reducer
