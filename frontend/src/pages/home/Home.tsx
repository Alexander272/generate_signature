import { lazy, Suspense } from 'react'
import { Box, Divider, Stack } from '@mui/material'

import { Fallback } from '@/components/Fallback/Fallback'
import { PageBox } from '@/components/PageBox/PageBox'
import { Preview } from '@/features/preview/components/Preview'

const Form = lazy(() => import('@/features/form/components/Form'))

export default function Home() {
	return (
		<PageBox>
			<Box
				borderRadius={3}
				paddingX={2}
				paddingY={1.5}
				width={'100%'}
				border={'1px solid rgba(0, 0, 0, 0.12)'}
				// flexGrow={1}
				height={'fit-content'}
				minHeight={600}
				maxHeight={800}
				display={'flex'}
				flexDirection={'column'}
				sx={{ backgroundColor: '#fff', userSelect: 'none' }}
			>
				<Suspense fallback={<Fallback />}>
					<Stack direction={'row'} spacing={3} divider={<Divider orientation='vertical' flexItem />}>
						<Form />
						<Preview />
					</Stack>
				</Suspense>
			</Box>
		</PageBox>
	)
}
