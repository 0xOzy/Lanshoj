"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { BinaryText } from "./binary-text"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-mono text-xl font-bold hover:text-primary transition-colors">
          <BinaryText>SHOJO LABS</BinaryText>
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          </button>
        </div>
      </div>
    </nav>
  )
}

