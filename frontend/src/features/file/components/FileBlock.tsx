import { Button, Stack } from '@mui/material'

import { useAppDispatch } from '@/hooks/redux'
import { useDownloadTemplateMutation } from '../fileApiSlice'
import { changeDialogIsOpen } from '@/features/dialog/dialogSlice'
import { DownloadIcon } from '@/components/Icons/DownloadIcon'
import { UploadIcon } from '@/components/Icons/UploadIcon'
import { ProcessDialog } from './ProcessDialog'
import { CodeDialog } from './CodeDialog'

export const FileBlock = () => {
	const [download] = useDownloadTemplateMutation()
	const dispatch = useAppDispatch()

	const downloadHandler = async () => {
		await download(null)
	}

	const openHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'ProcessKind', isOpen: true }))
	}

	return (
		<>
			<Stack direction={'row'} justifyContent={'center'} spacing={2}>
				<Button onClick={downloadHandler} fullWidth sx={{ textTransform: 'inherit', maxWidth: 260 }}>
					<DownloadIcon fontSize={16} mr={1} />
					Скачать шаблон
				</Button>

				<Button
					onClick={openHandler}
					variant='outlined'
					fullWidth
					sx={{ textTransform: 'inherit', maxWidth: 260 }}
				>
					<UploadIcon fontSize={16} mr={1} />
					Загрузить
				</Button>
			</Stack>

			<ProcessDialog />
			<CodeDialog />
		</>
	)
}
