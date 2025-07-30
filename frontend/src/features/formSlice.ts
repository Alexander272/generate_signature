import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type { IForm, IHeaderValue } from './form/types/form'

type FormState = {
	values: IForm
	html: string
}

const initialState: FormState = {
	values: {
		header: {
			values: [],
		},
		base: {
			email: '',
			name: '',
			position: '',
			phone: '',
			mobile: '',
			logo: '',
		},
		footer: {
			isNotEmpty: false,
			hasEDI: false,
		},
	},
	html: '',
}

const formSlice = createSlice({
	name: 'form',
	initialState,
	reducers: {
		setValues: (state, action: PayloadAction<IForm>) => {
			state.values = action.payload
		},

		addHeaderValue: (state, action: PayloadAction<IHeaderValue>) => {
			state.values.header.values.push(action.payload)
		},
		updateHeaderValue: (state, action: PayloadAction<{ index: number; value: IHeaderValue }>) => {
			state.values.header.values[action.payload.index] = action.payload.value
		},
		removeHeaderValue: (state, action: PayloadAction<number>) => {
			state.values.header.values.splice(action.payload, 1)
		},

		setHtml: (state, action: PayloadAction<string>) => {
			state.html = action.payload
		},
	},
})

export const formPath = formSlice.name
export const formReducer = formSlice.reducer

export const getFormValues = (state: RootState) => state[formPath].values
export const getHeaderValues = (state: RootState) => state[formPath].values.header?.values
export const getHtml = (state: RootState) => state[formPath].html

export const { setValues, setHtml, addHeaderValue, updateHeaderValue, removeHeaderValue } = formSlice.actions
