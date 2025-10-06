import { Stack } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import type { IForm } from '../types/form'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { List } from './List'

export const Footer = () => {
	const { control } = useFormContext<IForm>()

	return (
		<Stack spacing={1} mb={3}>
			<Stack direction={'row'} spacing={4}>
				<Controller
					control={control}
					name={'footer.hasEDI'}
					render={({ field }) => (
						<Checkbox
							id='hasEDI'
							name={field.name}
							checked={field.value}
							onChange={field.onChange}
							label='Фраза о Диадок'
						/>
					)}
				/>

				<Controller
					control={control}
					name={'footer.hasLinks'}
					render={({ field }) => (
						<Checkbox
							id='hasLinks'
							name={field.name}
							checked={field.value}
							onChange={field.onChange}
							label='Список ссылок'
						/>
					)}
				/>
			</Stack>

			<List />
		</Stack>
	)
}
