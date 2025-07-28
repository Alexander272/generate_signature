import type { FC, SyntheticEvent } from 'react'
import { Tab, Tabs as MTabs, useTheme } from '@mui/material'

import { VisibleIcon } from '@/components/Icons/VisibleIcon'
import { CodeIcon } from '@/components/Icons/CodeIcon'
import { DownloadIcon } from '@/components/Icons/DownloadIcon'

type Props = {
	value: string
	onChange: (item: string) => void
}

export const Tabs: FC<Props> = ({ value, onChange }) => {
	const { palette } = useTheme()

	const tabHandler = (_event: SyntheticEvent, value: string) => {
		onChange(value)
	}

	return (
		<MTabs
			value={value}
			onChange={tabHandler}
			sx={{
				mb: 2,
				'.MuiTabs-scrollButtons': { transition: 'all .2s ease-in-out' },
				'.MuiTabs-scrollButtons.Mui-disabled': {
					height: 0,
				},
				borderBottom: '1px solid #cccccc',
			}}
		>
			<Tab
				label='Предпросмотр'
				value='preview'
				icon={
					<VisibleIcon
						fontSize={18}
						mr={1}
						fill={value == 'preview' ? palette.primary.main : palette.text.secondary}
					/>
				}
				iconPosition='start'
				sx={{
					textTransform: 'inherit',
					borderRadius: 3,
					transition: 'all 0.3s ease-in-out',
					maxWidth: '50%',
					minHeight: 48,
					flexGrow: 1,
					':hover': {
						backgroundColor: '#f5f5f5',
					},
				}}
			/>
			<Tab
				label='исходный код'
				value='code'
				icon={
					<CodeIcon
						fontSize={18}
						mr={1}
						fill={value == 'code' ? palette.primary.main : palette.text.secondary}
					/>
				}
				iconPosition='start'
				sx={{
					textTransform: 'inherit',
					borderRadius: 3,
					transition: 'all 0.3s ease-in-out',
					maxWidth: '50%',
					minHeight: 48,
					flexGrow: 1,
					':hover': {
						backgroundColor: '#f5f5f5',
					},
				}}
			/>
			<Tab
				label='Скачать'
				value='download'
				icon={
					<DownloadIcon
						fontSize={18}
						mr={1}
						fill={value == 'download' ? palette.primary.main : palette.text.secondary}
					/>
				}
				iconPosition='start'
				sx={{
					textTransform: 'inherit',
					borderRadius: 3,
					transition: 'all 0.3s ease-in-out',
					maxWidth: '50%',
					minHeight: 48,
					flexGrow: 1,
					':hover': {
						backgroundColor: '#f5f5f5',
					},
				}}
			/>
		</MTabs>
	)
}
