import { useState } from 'react'
import { Box } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { getFormValues, getHtml } from '@/features/formSlice'
import { Tabs } from './Tabs'
import { Code } from './Code'
import { useDownloadSignMutation } from '@/features/form/signApiSlice'
import { BoxFallback } from '@/components/Fallback/BoxFallback'

export const Preview = () => {
	const [value, setValue] = useState('preview')

	const form = useAppSelector(getFormValues)
	const html = useAppSelector(getHtml)

	const [download, { isLoading }] = useDownloadSignMutation()

	const tabHandler = async (value: string) => {
		if (value == 'download') {
			await download(form)
			return
		}

		setValue(value)
	}

	if (!form.base?.name || !html) return null
	return (
		<Box width={'100%'}>
			<Tabs value={value} onChange={tabHandler} />

			{isLoading && <BoxFallback />}

			{value === 'preview' && (
				<iframe title='Webview' style={{ width: '100%', height: '500px', border: 'none' }} srcDoc={html} />
			)}
			{value === 'code' && <Code hasDownload code={html} />}
		</Box>
	)
}
