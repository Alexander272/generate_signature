import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { apiSlice } from './apiSlice'
import { formPath, formReducer } from '@/features/formSlice'
import { dialogPath, dialogReducer } from '@/features/dialog/dialogSlice'

const rootReducer = combineReducers({
	[apiSlice.reducerPath]: apiSlice.reducer,
	[formPath]: formReducer,
	[dialogPath]: dialogReducer,
	// [dataTablePath]: dataTableReducer,
	// [employeesPath]: employeesReducer,
})

export const store = configureStore({
	reducer: rootReducer,
	devTools: process.env.NODE_ENV === 'development',
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
	// .prepend(resetStoreListener.middleware),
	// .concat(apiSlice.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
