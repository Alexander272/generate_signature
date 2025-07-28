import { createBrowserRouter, type RouteObject } from 'react-router'

import { Layout } from '@/components/Layout/Layout'
import { NotFound } from '@/pages/notFound/NotFoundLazy'
import { Home } from '@/pages/home/HomeLazy'
import { AppRoutes } from './routes'

const config: RouteObject[] = [
	{
		element: <Layout />,
		errorElement: <NotFound />,
		children: [
			{
				path: AppRoutes.Home,
				element: <Home />,
			},
		],
	},
]

export const router = createBrowserRouter(config)
