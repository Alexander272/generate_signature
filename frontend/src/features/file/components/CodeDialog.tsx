import { useCallback, useEffect, useState, type FC } from 'react'
import { IconButton, Stack, Typography, useTheme } from '@mui/material'

import type { IForm } from '@/features/form/types/form'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { changeDialogIsOpen, getDialogState } from '@/features/dialog/dialogSlice'
import { Dialog } from '@/features/dialog/components/Dialog'
import { BoxFallback } from '@/components/Fallback/BoxFallback'
import { LeftArrowIcon } from '@/components/Icons/LeftArrowIcon'
import { Code } from '@/features/preview/components/Code'
import { useSignRenderMutation } from '@/features/form/signApiSlice'

export const CodeDialog = () => {
	const modal = useAppSelector(getDialogState('CodeList'))
	const dispatch = useAppDispatch()

	const closeHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'CodeList', isOpen: false }))
	}

	console.log('modal context', modal?.context)

	return (
		<Dialog
			title={'Исходный код'}
			body={<CodeList data={(modal?.context as Context)?.data} />}
			open={modal?.isOpen || false}
			onClose={closeHandler}
			maxWidth='lg'
			fullWidth
		/>
	)
}

type Context = { data: IForm[] }

const CodeList: FC<Context> = ({ data }) => {
	const [active, setActive] = useState(0)
	const [code, setCode] = useState('')
	const { palette } = useTheme()

	const [generate, { isLoading }] = useSignRenderMutation()

	const getCode = useCallback(async () => {
		const res = await generate(data[active])
		setCode((res.data as string) || '')
	}, [active, data, generate])

	useEffect(() => {
		getCode()
	}, [active, getCode])

	const activeHandler = (type: 'prev' | 'next') => () => {
		if (type == 'prev') setActive(prev => prev - 1)
		else setActive(prev => prev + 1)
	}

	if (!data || !data?.length) return <Typography textAlign={'center'}>Данные не найдены</Typography>
	return (
		<Stack>
			{isLoading ? <BoxFallback /> : null}

			<Stack spacing={2} direction={'row'} paddingX={3} mb={2}>
				{data.length > 1 && (
					<IconButton onClick={activeHandler('prev')} disabled={active == 0}>
						<LeftArrowIcon fontSize={16} fill={active == 0 ? palette.action.disabled : palette.grey[900]} />
					</IconButton>
				)}

				<Typography textAlign={'center'} sx={{ width: '100%' }}>
					<Typography component={'span'} mr={2.5} fontSize={'1.3rem'} color='primary'>
						{data.length > 1 ? `${active + 1}/${data.length}` : ''}
					</Typography>
					{data[active]?.base.email}
				</Typography>

				{data.length > 1 && (
					<IconButton onClick={activeHandler('next')} disabled={active == data.length - 1}>
						<LeftArrowIcon
							fontSize={16}
							transform={'rotate(180deg)'}
							fill={active == data.length - 1 ? palette.action.disabled : palette.grey[900]}
						/>
					</IconButton>
				)}
			</Stack>

			<Code code={code} form={data[active]} hasDownload />
		</Stack>
	)
}
