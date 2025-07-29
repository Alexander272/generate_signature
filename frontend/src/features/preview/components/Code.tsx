import { useState, type FC } from 'react'
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
import { CodeBlock, dracula } from '@react-email/code-block'
import { toast } from 'react-toastify'

import type { IForm } from '@/features/form/types/form'
// import { useAppSelector } from '@/hooks/redux'
import { useDebounceFunc } from '@/hooks/useDebounceFunc'
import { useDownloadSignMutation } from '@/features/form/signApiSlice'
// import { getHtml } from '@/features/formSlice'
import { CopyIcon } from '@/components/Icons/CopyIcon'
import { CheckIcon } from '@/components/Icons/CheckIcon'
import { DownloadIcon } from '@/components/Icons/DownloadIcon'

type Props = {
	hasDownload?: boolean
	code: string
	form?: IForm
}

export const Code: FC<Props> = ({ hasDownload, code, form }) => {
	const [copied, setCopied] = useState(false)
	// const html = useAppSelector(getHtml)

	const [download, { isLoading }] = useDownloadSignMutation()

	const clear = useDebounceFunc(() => {
		setCopied(false)
	}, 3000)

	const downloadHandler = async () => {
		await download(form)
	}
	const copyHandler = async () => {
		try {
			await navigator.clipboard.writeText(code)
			console.log('Текст успешно скопирован в буфер обмена')

			setCopied(true)
			clear()
		} catch (error) {
			console.error(error)
			toast.error('Не удалось скопировать текст')
		}
	}

	return (
		<Box height={650} overflow={'auto'} position={'relative'}>
			<Tooltip title={copied ? 'Скопировано' : 'Скопировать'}>
				<IconButton
					onClick={copyHandler}
					size='large'
					color='primary'
					sx={{ position: 'absolute', top: 5, right: 5 }}
				>
					{copied ? <CheckIcon fontSize={16} fill={'#fff'} /> : <CopyIcon fontSize={16} fill={'#fff'} />}
				</IconButton>
			</Tooltip>
			{hasDownload && (
				<Tooltip title='Скачать'>
					<IconButton
						onClick={downloadHandler}
						size='large'
						color='primary'
						sx={{ position: 'absolute', top: 5, right: 35 }}
					>
						{isLoading ? <CircularProgress size={16} /> : <DownloadIcon fontSize={16} fill={'#fff'} />}
					</IconButton>
				</Tooltip>
			)}

			<CodeBlock
				code={code}
				lineNumbers
				theme={{
					...dracula,
					base: {
						...dracula.base,
						whiteSpace: 'pre-wrap',
						wordBreak: 'break-word',
					},
				}}
				language='html'
			/>
		</Box>
	)
}
