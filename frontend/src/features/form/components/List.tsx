import { Button, Divider, IconButton, Stack, TextField, useTheme } from '@mui/material'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

import type { IForm } from '../types/form'
import { PlusIcon } from '@/components/Icons/PlusIcon'
import { TimesIcon } from '@/components/Icons/TimesIcon'

export const List = () => {
	const { palette } = useTheme()

	const { control, watch } = useFormContext<IForm>()
	const hasLinks = watch('footer.hasLinks')
	const { fields, append, remove } = useFieldArray({ control, name: 'footer.links' })

	const addHandler = () => {
		append({ label: '', imageLink: '', link: '' })
	}

	const deleteHandler = (idx: number) => () => {
		remove(idx)
	}

	if (!hasLinks) return null
	return (
		<Stack px={'3%'}>
			<Controller
				control={control}
				name={`footer.column`}
				render={({ field }) => <TextField {...field} label={'Количество колонок'} sx={{ mb: 1 }} />}
			/>
			<Controller
				control={control}
				name={`footer.linksTitle`}
				render={({ field }) => <TextField {...field} label={'Заголовок списка'} multiline sx={{ mb: 2 }} />}
			/>

			<Stack spacing={1}>
				{fields.map((item, idx) => (
					<Stack key={item.id} sx={{ position: 'relative', pl: 1, pr: 5 }}>
						<Controller
							control={control}
							name={`footer.links.${idx}.link`}
							render={({ field }) => <TextField {...field} label={'Ссылка'} sx={{ mb: 1 }} />}
						/>

						<Controller
							control={control}
							name={`footer.links.${idx}.imageLink`}
							render={({ field }) => (
								<TextField {...field} label={'Ссылка на изображение'} sx={{ mb: 1 }} />
							)}
						/>
						<Controller
							control={control}
							name={`footer.links.${idx}.label`}
							render={({ field }) => <TextField {...field} label={'Текст'} sx={{ mb: 1 }} />}
						/>

						<IconButton
							onClick={deleteHandler(idx)}
							size='large'
							sx={{ position: 'absolute', right: -5, top: '50%', transform: 'translateY(-50%)' }}
						>
							<TimesIcon fontSize={14} />
						</IconButton>

						<Divider sx={{ width: '60%', mx: 'auto' }} />
					</Stack>
				))}

				<Divider sx={{ mt: 1 }}>
					<Button onClick={addHandler} variant='outlined' sx={{ width: 50 }}>
						<PlusIcon fontSize={16} fill={palette.primary.main} />
					</Button>
				</Divider>
			</Stack>
		</Stack>
	)
}
