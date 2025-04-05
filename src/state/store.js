import { configureStore } from '@reduxjs/toolkit'
import savingsReducer from './savingsSlice'
import gameReducer from './gameSlice'

export default configureStore({
  reducer: {
    savings: savingsReducer,
    game: gameReducer
  }
})
