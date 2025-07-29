import { useState, type ChangeEvent, type DragEvent } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { changeDialogIsOpen, getDialogState } from '@/features/dialog/dialogSlice'
import { Dialog } from '@/features/dialog/components/Dialog'
import { DownloadIcon } from '@/components/Icons/DownloadIcon'
import { UploadImage } from '@/components/UploadImage/UploadImage'
import { BoxFallback } from '@/components/Fallback/BoxFallback'
import Input from '@/components/UploadImage/Input'
import { CodeIcon } from '@/components/Icons/CodeIcon'
import { UploadIcon } from '@/components/Icons/UploadIcon'
import { useProcessFileMutation } from '../fileApiSlice'

export const ProcessDialog = () => {
	const modal = useAppSelector(getDialogState('ProcessKind'))
	const dispatch = useAppDispatch()

	const closeHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'ProcessKind', isOpen: false }))
	}

	return (
		<Dialog
			title={'Загрузить файл'}
			body={<Kind />}
			open={modal?.isOpen || false}
			onClose={closeHandler}
			maxWidth='sm'
			fullWidth
		/>
	)
}

const Kind = () => {
	const [active, setActive] = useState<'file' | 'list'>('file')
	const [hasDropFiles, setHasDropFiles] = useState(false)
	const dispatch = useAppDispatch()

	const [upload, { isLoading }] = useProcessFileMutation()

	const activeHandler = (value: 'file' | 'list') => () => {
		setActive(value)
	}

	const dragHandler = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()

		if (event.type === 'dragenter' || event.type === 'dragover') {
			setHasDropFiles(true)
		} else if (event.type === 'dragleave') {
			setHasDropFiles(false)
		}
	}

	const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (!files) return
		fileHandler(files[0])
	}

	const fileHandler = async (file?: File | null) => {
		setHasDropFiles(false)
		if (!file) return

		const result = await upload({ file, kind: active }).unwrap()
		if (active != 'file') {
			console.log(result)
			dispatch(changeDialogIsOpen({ variant: 'CodeList', isOpen: true, context: { data: result.data } }))
		}
		dispatch(changeDialogIsOpen({ variant: 'ProcessKind', isOpen: false }))
	}

	return (
		<Stack alignItems={'center'} onDragEnter={dragHandler}>
			{/* FileInput */}
			<Button
				variant='outlined'
				component='label'
				color='inherit'
				sx={{ textTransform: 'inherit', maxWidth: 500, width: '100%', mb: 4 }}
			>
				<UploadIcon />
				<Typography ml={1}>Загрузить файл</Typography>

				<Input onChange={changeHandler} type='file' />
			</Button>

			{hasDropFiles && (
				<Box
					sx={{
						background: '#bfbfbfcf',
						position: 'absolute',
						zIndex: 15,
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
					}}
				>
					<UploadImage onChange={fileHandler} sx={{ width: '100%', height: '100%' }} />
				</Box>
			)}

			{isLoading && <BoxFallback />}

			<Stack direction={'row'} justifyContent={'space-around'} alignItems={'center'} width={'100%'}>
				<Stack
					onClick={activeHandler('file')}
					alignItems={'center'}
					border={'2px solid rgba(0, 0, 0, 0.12)'}
					borderColor={active === 'file' ? 'primary.main' : 'rgba(0, 0, 0, 0.12)'}
					borderRadius={3}
					padding={2}
					width={220}
					sx={{
						cursor: 'pointer',
						transition: 'all .2s ease-in-out',
						':hover': { borderColor: 'primary.main', boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)' },
					}}
				>
					<DownloadIcon fontSize={30} mb={1} />
					<Typography align='center'>Скачать подписи</Typography>
				</Stack>

				<Stack
					onClick={activeHandler('list')}
					alignItems={'center'}
					border={'2px solid rgba(0, 0, 0, 0.12)'}
					borderColor={active === 'list' ? 'primary.main' : 'rgba(0, 0, 0, 0.12)'}
					borderRadius={3}
					padding={2}
					width={220}
					sx={{
						cursor: 'pointer',
						transition: 'all .2s ease-in-out',
						':hover': { borderColor: 'primary.main', boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)' },
					}}
				>
					<CodeIcon fontSize={30} mb={1} />
					<Typography align='center'>Вывести код</Typography>
				</Stack>

				{/* <FormControl sx={{ width: '50%' }}>
					<Checkbox id='download' name='download' label='Скачать подписи' />
				</FormControl>

				<FormControl sx={{ width: '50%' }}>
					<Checkbox id='show' name='show' label='Вывести код' />
				</FormControl> */}
			</Stack>
		</Stack>
	)
}
