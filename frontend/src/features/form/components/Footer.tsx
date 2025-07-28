import { Stack } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import type { IForm } from '../types/form'
import { Checkbox } from '@/components/Checkbox/Checkbox'

export const Footer = () => {
	const { control } = useFormContext<IForm>()

	return (
		<Stack>
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
		</Stack>
	)
}
