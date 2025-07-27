// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Build MLOps - Production ML Engineering",
  description: "Learn to build production-ready MLOps systems",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <nav className="border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Build MLOps
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-blue-500 transition">
                Home
              </Link>
              <Link href="/blog" className="hover:text-blue-500 transition">
                Blog
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}