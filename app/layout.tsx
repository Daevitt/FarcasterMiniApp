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
      imageUrl: "https://raw.githubusercontent.com/Daevitt/FarcasterMiniApp/refs/heads/main/logos/600x400-alpha.png", // Cambiar por tu dominio
      button: {
        title: "📋 Start TaskList",
        action: {
          type: "launch_miniapp",
          name: "TaskList",
          url: "https://farcaster-branderplus-mini-app.vercel.app/", // Cambiar por tu dominio
          splashImageUrl: "https://raw.githubusercontent.com/Daevitt/FarcasterMiniApp/refs/heads/main/logos/200x200.png", // Cambiar por tu dominio
          splashBackgroundColor: "#089bff"
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


