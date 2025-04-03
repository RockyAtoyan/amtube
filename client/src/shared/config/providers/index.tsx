'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

const Providers = ({
	children,
}: Readonly<{
	children: ReactNode
}>) => {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}

export default Providers
