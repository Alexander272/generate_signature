import { toast } from 'react-toastify'

import type { IFetchError } from '@/app/types/error'
import { HttpCodes } from '@/constants/httpCodes'
import { saveAs } from '@/utils/saveAs'
import { apiSlice } from '@/app/apiSlice'
import type { IForm } from '../form/types/form'

const fileApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		downloadTemplate: builder.mutation({
			queryFn: async (_data, _api, _, baseQuery) => {
				const result = await baseQuery({
					url: 'signature/download',
					cache: 'no-cache',
					responseHandler: response => (response.status === HttpCodes.OK ? response.blob() : response.json()),
				})

				if (result.error) {
					console.log(result.error)
					const fetchError = result.error as IFetchError
					toast.error(fetchError.data.message, { autoClose: false })
				}

				if (result.data instanceof Blob) saveAs(result.data, 'Шаблон.csv')
				return { data: null }
			},
		}),
		processFile: builder.mutation<{ data: IForm[] }, { file: File; kind: 'file' | 'list' }>({
			queryFn: async (dto, _api, _, baseQuery) => {
				const data = new FormData()
				data.append('file', dto.file)
				data.append('kind', dto.kind)

				const result = await baseQuery({
					url: 'signature/file',
					cache: 'no-cache',
					method: 'POST',
					body: data,
					responseHandler: response =>
						response.status === HttpCodes.OK && dto.kind === 'file' ? response.blob() : response.json(),
				})

				if (result.error) {
					console.log(result.error)
					const fetchError = result.error as IFetchError
					toast.error(fetchError.data.message, { autoClose: false })
				}

				if (dto.kind === 'file') {
					if (result.data instanceof Blob) saveAs(result.data, 'Подписи.zip')
				} else return { data: result.data as { data: IForm[] } }
				return { data: { data: [] } }
			},
		}),
	}),
})

export const { useDownloadTemplateMutation, useProcessFileMutation } = fileApiSlice
