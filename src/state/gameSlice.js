import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  xp: 0,
  achievements: [
    { name: 'Pierwsza wpłata', icon: '💰', unlocked: false },
    { name: '100€ uzbierane', icon: '🏦', unlocked: false },
    { name: '7 dni z rzędu wpłat', icon: '📆', unlocked: false },
    { name: 'Ukończenie pierwszego celu', icon: '✅', unlocked: false },
    { name: 'Poziom 5 osiągnięty', icon: '🚀', unlocked: false }
  ]
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    addXP(state, action) {
      state.xp += action.payload
    },
    unlockAchievement(state, action) {
      const achievementName = action.payload
      state.achievements = state.achievements.map(ach =>
        ach.name === achievementName ? { ...ach, unlocked: true } : ach
      )
    }
  }
})

export const { addXP, unlockAchievement } = gameSlice.actions
export default gameSlice.reducer
