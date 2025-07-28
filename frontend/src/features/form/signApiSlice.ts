import { toast } from 'react-toastify'

import type { IFetchError } from '@/app/types/error'
import { HttpCodes } from '@/constants/httpCodes'
import { saveAs } from './utils/saveAs'
import { apiSlice } from '@/app/apiSlice'

const signApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		downloadSign: builder.mutation({
			queryFn: async (data, _api, _, baseQuery) => {
				const result = await baseQuery({
					url: '/signature',
					cache: 'no-cache',
					method: 'POST',
					body: data,
					responseHandler: response => (response.status === HttpCodes.OK ? response.blob() : response.json()),
				})

				if (result.error) {
					console.log(result.error)
					const fetchError = result.error as IFetchError
					toast.error(fetchError.data.message, { autoClose: false })
				}

				if (result.data instanceof Blob) saveAs(result.data, 'Подпись.html')
				return { data: null }
			},
		}),
		signRender: builder.mutation({
			queryFn: async (data, _api, _, baseQuery) => {
				const result = await baseQuery({
					url: '/signature',
					cache: 'no-cache',
					method: 'POST',
					body: data,
					responseHandler: response => (response.status === HttpCodes.OK ? response.blob() : response.json()),
				})

				if (result.error) {
					console.log(result.error)
					const fetchError = result.error as IFetchError
					toast.error(fetchError.data.message, { autoClose: false })
				}

				if (result.data instanceof Blob) return { data: result.data.text() }
				return { data: null }
			},
		}),
	}),
})

export const { useSignRenderMutation, useDownloadSignMutation } = signApiSlice
