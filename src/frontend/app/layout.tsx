import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sliding Block Puzzle Solver",
  description: "A tool to solve sliding block puzzles using various pathfinding algorithms",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div
          className="min-h-screen"
          style={{ background: "radial-gradient(circle,rgba(156, 192, 240, 1) 0%, rgba(255, 255, 255, 1) 100%)" }}
        >
          <header className="border-b bg-secondary"></header>
          <main className="container mx-auto py-6">{children}</main>
          <footer className="border-t mt-12 bg-secondary"></footer>
        </div>
      </body>
    </html>
  )
}
