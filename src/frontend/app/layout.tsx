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
        <div className="min-h-screen bg-background">
          <header className="border-b bg-secondary">
            <div className="container mx-auto py-4">
              <h1 className="text-2xl font-bold text-foreground">Sliding Block Puzzle Solver</h1>
            </div>
          </header>
          <main className="container mx-auto py-6">{children}</main>
          <footer className="border-t mt-12 bg-secondary">
            <div className="container mx-auto py-4 text-center text-sm text-muted-foreground">
              <p>Sliding Block Puzzle Solver &copy; {new Date().getFullYear()}</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
