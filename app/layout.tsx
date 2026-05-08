import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MyTodo',
  description: '개인용 할 일 관리 앱',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch{}`,
          }}
        />
      </head>
      <body
        className={`${inter.className} bg-gray-50 dark:bg-[#0f0f1a] text-gray-900 dark:text-gray-100 min-h-screen`}
      >
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
