import { AppBar, Box, Toolbar } from '@mui/material'

import logo from '@/assets/logo.webp'

export const LayoutHeader = () => {
	// const [signOut] = useSignOutMutation()

	// const token = useAppSelector(getToken)

	// const showRealmsSetting = useCheckPermission(PermRules.Realms.Write)

	// const signOutHandler = () => {
	// 	void signOut(null)
	// }

	return (
		<AppBar sx={{ borderRadius: 0 }}>
			<Toolbar sx={{ justifyContent: 'space-between', alignItems: 'inherit' }}>
				<Box alignSelf={'center'} display={'flex'} alignItems={'center'}>
					<img height={46} width={157} src={logo} alt='logo' />
				</Box>

				{/* {token && (
					<Stack direction={'row'} spacing={3} minHeight={'100%'}>
						<NavButton onClick={signOutHandler}>Выйти</NavButton>
					</Stack>
				)} */}
			</Toolbar>
		</AppBar>
	)
}
