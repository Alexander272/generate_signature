import { Button, Stack } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'

import type { IForm } from '../types/form'
import { useAppDispatch } from '@/hooks/redux'
import { defFile } from '../utils/base64'
import { useSignRenderMutation } from '../signApiSlice'
import { setHtml, setValues } from '@/features/formSlice'
import { Header } from './Header'
import { Base } from './Base'
import { Footer } from './Footer'

const defValue: IForm = {
	base: {
		email: '',
		name: '',
		position: '',
		logo: defFile,
	},
	footer: {
		isNotEmpty: false,
		hasEDI: false,
	},
}

export const Form = () => {
	const dispatch = useAppDispatch()
	const methods = useForm<IForm>({ defaultValues: defValue })

	const [generate] = useSignRenderMutation()

	// const autosave = useDebounceFunc(() => {
	// 	saveHandler()
	// }, 100)

	// useEffect(() => {
	// 	console.log(Object.keys(methods.formState.dirtyFields))

	// 	if (Object.keys(methods.formState.dirtyFields)) autosave()
	// }, [methods.formState.dirtyFields, autosave])

	const saveHandler = methods.handleSubmit(async form => {
		console.log('save form', form)

		if (form.base.logo.includes('data:image')) form.base.logo = form.base.logo.split(',')[1]
		if (form.footer.hasEDI) form.footer.isNotEmpty = true

		dispatch(setValues(form))

		const res = await generate(form)
		console.log('res', res)

		dispatch(setHtml(res.data))
	})

	return (
		<Stack component={'form'} onSubmit={saveHandler}>
			<FormProvider {...methods}>
				<Header />
				<Base />
				<Footer />
			</FormProvider>

			<Button variant='outlined' type='submit' sx={{ maxWidth: 300, width: '100%', mx: 'auto' }}>
				Сохранить
			</Button>
		</Stack>
	)
}

export default Form
