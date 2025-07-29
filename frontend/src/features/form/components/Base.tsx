import type { FC } from 'react'
import { InputAdornment, Stack, TextField } from '@mui/material'
import { Controller, useFormContext, type ControllerRenderProps } from 'react-hook-form'
import { useIMask } from 'react-imask'

import type { IForm } from '../types/form'
import { fileToBase64 } from '../utils/base64'
import { UploadImage } from '@/components/UploadImage/UploadImage'

export const Base = () => {
	const { control } = useFormContext<IForm>()

	return (
		<Stack spacing={1} direction={'row'} mb={2}>
			<Stack width={350}>
				{/* Image */}
				<Controller
					control={control}
					name={'base.logo'}
					render={({ field }) => (
						<UploadImage
							{...field}
							value={field.value}
							onChange={file => field.onChange(file ? fileToBase64(file) : '')}
						/>
					)}
				/>
			</Stack>
			<Stack spacing={2} width={350}>
				<Controller
					control={control}
					name={'base.name'}
					rules={{ required: true }}
					render={({ field, fieldState: { error } }) => (
						<TextField
							label={'ФИО'}
							{...field}
							value={field.value || ''}
							error={Boolean(error)}
							helperText={error && 'Обязательное поле'}
						/>
					)}
				/>
				<Controller
					control={control}
					name={'base.position'}
					rules={{ required: true }}
					render={({ field, fieldState: { error } }) => (
						<TextField
							label={'Должность'}
							{...field}
							value={field.value || ''}
							error={Boolean(error)}
							helperText={error && 'Обязательное поле'}
						/>
					)}
				/>

				<Controller
					control={control}
					name={'base.phone'}
					render={({ field }) => <PhoneInput field={field} />}
				/>
				<Controller control={control} name={'base.mobile'} render={({ field }) => <MobileInput {...field} />} />

				<Controller
					control={control}
					name={'base.email'}
					rules={{ required: true }}
					render={({ field, fieldState: { error } }) => (
						<TextField
							label={'Email'}
							{...field}
							value={field.value || ''}
							error={Boolean(error)}
							helperText={error && 'Некорректный email'}
							slotProps={{
								input: {
									endAdornment: <InputAdornment position='end'>@sealur.ru</InputAdornment>,
								},
							}}
						/>
					)}
				/>
			</Stack>
		</Stack>
	)
}

const PhoneInput: FC<{ field: ControllerRenderProps<IForm, 'base.phone'>; error?: boolean }> = ({ field, error }) => {
	const phone = useIMask(
		{
			mask: '+7 (000) 000-00-00 (доб. 000[000])',
			lazy: false,
		},
		{
			onAccept: (value: string) => {
				field.onChange(value, { shouldDirty: true })
			},
		}
	)

	return (
		<TextField
			inputRef={phone.ref}
			label={'Телефон'}
			error={error}
			helperText={error && 'Обязательное поле'}
			slotProps={{
				inputLabel: { shrink: true },
			}}
		/>
	)
}

const MobileInput = (field: ControllerRenderProps) => {
	const phone = useIMask(
		{
			mask: '+7 (000) 000-00-00',
			lazy: false,
		},
		{
			onAccept: (value: string) => {
				field.onChange(value, { shouldDirty: true })
			},
		}
	)

	return (
		<TextField
			inputRef={phone.ref}
			label={'Мобильный телефон'}
			slotProps={{
				inputLabel: { shrink: true },
			}}
		/>
	)
}
