import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '../components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TaskList MiniApp',
  description: 'Create and complete task lists to earn points and NFT rewards',
  other: {
    'fc:miniapp': JSON.stringify({
      version: "1",
      imageUrl: "https://your-domain.com/og-image.png", // Cambiar por tu dominio
      button: {
        title: "📋 Start TaskList",
        action: {
          type: "launch_miniapp",
          name: "TaskList",
          url: "https://your-domain.com", // Cambiar por tu dominio
          splashImageUrl: "https://your-domain.com/logo.png", // Cambiar por tu dominio
          splashBackgroundColor: "#3B82F6"
        }
      }
    })
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )

}
