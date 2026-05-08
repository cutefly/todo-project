// app/layout.tsx
import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

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
      <body className={`${notoSansKR.className} bg-spotify-base text-white min-h-screen`}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
