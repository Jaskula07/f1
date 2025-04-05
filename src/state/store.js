import { configureStore, combineReducers } from '@reduxjs/toolkit'
import savingsReducer from './savingsSlice'
import gameReducer from './gameSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

// Konfiguracja persist
const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  savings: savingsReducer,
  game: gameReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
})

export const persistor = persistStore(store)
export default store
