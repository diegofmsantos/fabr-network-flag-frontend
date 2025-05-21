import type { Metadata } from "next"
import "./globals.css"
import { Poppins } from "next/font/google"
import Image from "next/image"
import { Tab } from "@/components/Tab"
import Link from "next/link"
import { Analytics } from '@vercel/analytics/react'
import { Suspense } from "react"
import { QueryProvider } from "@/providers/query-provider"
import Sidebar from "@/components/Sidebar"

const poppins = Poppins({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  metadataBase: new URL('https://fabrnetwork.com.br/'),
  title: {
    default: 'FABR-Network - Flag',
    template: '%s | FABR Network'
  },
  description: "O banco de dados do Flag Football brasileiro.",
  keywords: [ ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" className={poppins.className}>
      <head>
        {/* Viewport e configurações básicas */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Configurações para Safari/iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FABR-Network" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FABR-Network" />
        <meta property="og:locale" content="pt_BR" />

        {/* Links */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/assets/favicon.png" type="image/x-icon" />
      </head>
      <body className="bg-[#ECECEC]">
        <header className="w-full h-20 bg-[#18187c] flex justify-center items-center px-2 fixed z-50 xl:hidden">
          <Link href="/" className="w-56 h-16 flex justify-center items-center sm:w-44 sm:h-18 md:w-48 md:h-20">
            <Image
              src="/assets/flag-brasileiro.png"
              alt="Fabr Network Logo"
              width={190}
              height={95}
              className="w-full h-auto object-contain"
              priority
              quality={100}
            />
          </Link>
        </header>
        <Sidebar />
        <QueryProvider>
          <Suspense fallback={<div></div>}>
            {children}
          </Suspense>
        </QueryProvider>
        <Analytics />
        <Tab />
      </body>
    </html>
  )
}