import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import AuthButton from '@/components/AuthButton'

export const metadata: Metadata = {
  title: 'Masyandra',
  description: 'a little corner of the internet, just for us',
  icons: {
    icon: ['../public/favicon.ico'],
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=Petit+Formal+Script&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Sidebar />
        <AuthButton />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
