import { useState } from 'react'
import { Box, IconButton, Tooltip } from '@mui/material'
import { CodeBlock, dracula } from '@react-email/code-block'

import { useAppSelector } from '@/hooks/redux'
import { useDebounceFunc } from '@/hooks/useDebounceFunc'
import { getHtml } from '@/features/formSlice'
import { CopyIcon } from '@/components/Icons/CopyIcon'
import { CheckIcon } from '@/components/Icons/CheckIcon'
import { toast } from 'react-toastify'

export const Code = () => {
	const [copied, setCopied] = useState(false)
	const html = useAppSelector(getHtml)

	const clear = useDebounceFunc(() => {
		setCopied(false)
	}, 3000)

	const copyHandler = async () => {
		try {
			await navigator.clipboard.writeText(html)
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
					sx={{ position: 'absolute', top: 10, right: 10 }}
				>
					{copied ? <CheckIcon fontSize={16} fill={'#fff'} /> : <CopyIcon fontSize={16} fill={'#fff'} />}
				</IconButton>
			</Tooltip>

			<CodeBlock
				code={html}
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
