import { Button, IconButton, Stack, TextField } from '@mui/material'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

import type { IForm } from '../types/form'
// import { SettingIcon } from '@/components/Icons/SettingIcon'
import { TimesIcon } from '@/components/Icons/TimesIcon'
import { ImageBlock } from './ImageBlock'

export const Header = () => {
	const { control } = useFormContext<IForm>()
	const { fields, append, remove } = useFieldArray({ control, name: 'header.values' })

	const itemHandler = (isImage: boolean) => () => {
		append({ isImage, value: '', isLink: false })
	}

	const deleteHandler = (idx: number) => () => {
		remove(idx)
	}

	return (
		<Stack mb={2} sx={{ maxWidth: 708 }}>
			<Stack direction={'row'} spacing={2} mb={2}>
				<Button
					onClick={itemHandler(true)}
					variant='outlined'
					sx={{ maxWidth: 300, width: '100%', textTransform: 'inherit' }}
				>
					Добавить изображение
				</Button>
				<Button
					onClick={itemHandler(false)}
					variant='outlined'
					sx={{ maxWidth: 300, width: '100%', textTransform: 'inherit' }}
				>
					Добавить текст
				</Button>

				{/* <IconButton>
					<SettingIcon fontSize={18} />
				</IconButton> */}
			</Stack>

			{fields.map((item, idx) => (
				<Stack
					key={item.id}
					direction={'row'}
					alignItems={'center'}
					justifyContent={'center'}
					position={'relative'}
					mb={2}
				>
					{item.isImage && <ImageBlock idx={idx} />}
					{!item.isImage && (
						<Controller
							control={control}
							name={`header.values.${idx}.value`}
							render={({ field }) => <TextField {...field} multiline sx={{ width: '80%' }} />}
						/>
					)}

					<IconButton onClick={deleteHandler(idx)} size='large' sx={{ position: 'absolute', right: 0 }}>
						<TimesIcon fontSize={14} />
					</IconButton>
				</Stack>
			))}
		</Stack>
	)
}
