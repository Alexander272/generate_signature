import { createSlice } from '@reduxjs/toolkit'
import type { IForm } from './form/types/form'
import type { RootState } from '@/app/store'

type FormState = {
	values: IForm
	html: string
}

const initialState: FormState = {
	values: {
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
		setValues: (state, action) => {
			state.values = action.payload
		},

		setHtml: (state, action) => {
			state.html = action.payload
		},
	},
})

export const formPath = formSlice.name
export const formReducer = formSlice.reducer

export const getFormValues = (state: RootState) => state[formPath].values
export const getHtml = (state: RootState) => state[formPath].html

export const { setValues, setHtml } = formSlice.actions
