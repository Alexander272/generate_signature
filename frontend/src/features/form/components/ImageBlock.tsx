import { Stack, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import type { IForm } from '../types/form'
import { UploadImage } from '@/components/UploadImage/UploadImage'
import { useEffect, type FC } from 'react'
import { fileToBase64 } from '../utils/base64'

type Props = {
	idx: number
}

export const ImageBlock: FC<Props> = ({ idx }) => {
	const { control, watch, setValue } = useFormContext<IForm>()
	const value = watch(`header.values.${idx}.value`, '')

	useEffect(() => {
		if (value.includes('data:image')) {
			setValue(`header.values.${idx}.isLink`, false)
		} else {
			setValue(`header.values.${idx}.isLink`, true)
		}
	}, [idx, setValue, value])

	return (
		<Stack spacing={1} width={'80%'}>
			<Controller
				control={control}
				name={`header.values.${idx}.value`}
				render={({ field }) => (
					<TextField
						{...field}
						label={'Ссылка'}
						disabled={field.value.includes('data:image')}
						slotProps={{
							inputLabel: { shrink: !!field.value },
						}}
					/>
				)}
			/>
			<Controller
				control={control}
				name={`header.values.${idx}.value`}
				render={({ field }) => (
					<UploadImage
						{...field}
						value={field.value}
						onChange={async file => field.onChange(file ? await fileToBase64(file) : '')}
					/>
				)}
			/>
		</Stack>
	)
}
