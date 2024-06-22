'use client'

import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'
import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [client, setClient] = useState(false)

  useEffect(() => {
    setClient(true)
  }, [])

  if (!client) {
    return null
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SSR</title>
        <ColorSchemeScript />
      </head>
      <body className={inter.className + ' bg-neutral-100'}>
        <MantineProvider>{!client ? null : children}</MantineProvider>
      </body>
    </html>
  )
}
