import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import '@fontsource/roboto/400.css'

import { store } from '@/app/store'
import { AppRouter } from '@/pages/router/AppRouter'
import { theme } from '@/theme/theme'

function App() {
	return (
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AppRouter />
			</ThemeProvider>
			<ToastContainer />
		</Provider>
	)
}

export default App
