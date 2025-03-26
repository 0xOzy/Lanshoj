"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BinaryText } from "./binary-text"
import { TerminalText } from "./terminal-text"
import { Github, Twitter, Send } from "lucide-react"

interface HeroData {
  title: string
  subtitle: string
  backgroundEffects: {
    enabled: boolean
    type: "pulse" | "particles" | "grid"
  }
}

export function Hero() {
  const [loaded, setLoaded] = useState(false)
  const [heroData, setHeroData] = useState<HeroData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTerminal, setShowTerminal] = useState(false)

  useEffect(() => {
    async function fetchHeroData() {
      try {
        const response = await fetch("/api/hero")

        if (!response.ok) {
          throw new Error(`Failed to fetch hero data: ${response.status}`)
        }

        const data = await response.json()
        // Remove the imageUrl from the data since we're using the GIF directly
        const { imageUrl, ...rest } = data
        setHeroData(rest)
      } catch (err) {
        console.error("Error fetching hero data:", err)
        setError("Failed to load hero data")

        // Fallback data in case of error
        setHeroData({
          title: "The Future of Intelligence & Secure AI Collaboration",
          subtitle: "Pioneering AI research with a focus on security, transparency, and community-driven innovation.",
          backgroundEffects: {
            enabled: true,
            type: "pulse",
          },
        })
      } finally {
        setLoading(false)
        setLoaded(true)
        // Show terminal text after hero loads
        setTimeout(() => setShowTerminal(true), 800)
      }
    }

    fetchHeroData()
  }, [])

  if (loading) {
    return (
      <section className="py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-pulse">
            <div className="h-12 bg-muted/30 rounded-md w-3/4 mb-2"></div>
            <div className="h-12 bg-muted/30 rounded-md w-4/5"></div>
            <div className="h-6 bg-muted/30 rounded-md w-full mt-6"></div>
            <div className="h-6 bg-muted/30 rounded-md w-5/6"></div>
          </div>
          <div className="relative h-[300px] md:h-[400px] w-full flex justify-center items-center">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-primary/20 animate-pulse"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!heroData) return null

  return (
    <section className={`py-16 transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-mono font-bold leading-tight">
            <BinaryText>SHOJO LABS</BinaryText>
            <br />
            <BinaryText>{heroData.title.split(" & ")[1]}</BinaryText>
          </h1>
          <p className="text-lg text-muted-foreground">
            <BinaryText>{heroData.subtitle.split(",")[0]}</BinaryText>
            <br />
            <BinaryText>{heroData.subtitle.split(",").slice(1).join(",")}</BinaryText>
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="https://x.com/ShojoLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-muted/30 hover:bg-primary/20 hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/ShojoCo"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-muted/30 hover:bg-primary/20 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://t.me/ShojoLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-muted/30 hover:bg-primary/20 hover:text-primary transition-colors"
              aria-label="Telegram"
            >
              <Send className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="relative h-[300px] md:h-[400px] w-full flex justify-center items-center">
          {heroData.backgroundEffects.enabled && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-primary/20 animate-pulse"></div>
            </div>
          )}
          <div className="relative z-10 w-[300px] h-[300px] drop-shadow-glow">
            <Image src="/hero.gif" alt="SHOJO LABS" fill className="object-contain" priority />
          </div>
        </div>
      </div>

      {/* Terminal-style AI agent introduction */}
      {showTerminal && (
        <div className="mt-8 p-4 bg-black/80 border border-primary/30 rounded-md overflow-hidden">
          <div className="flex items-center gap-2 mb-2 border-b border-primary/20 pb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-muted-foreground ml-2">terminal@shojolabs:~</span>
          </div>
          <TerminalText text="Initializing Shizu Agent Beta..." typingSpeed={40} className="text-green-400 mb-2" />
          <TerminalText
            text="Shizu: The first AI agent from SHOJO LABS with advanced analytical intelligence."
            typingSpeed={30}
            className="text-primary-foreground mb-2"
          />
          <TerminalText
            text="Specialized in crypto market analysis, pattern recognition, and predictive modeling."
            typingSpeed={25}
            className="text-primary-foreground mb-2"
          />
          <TerminalText text="System ready. Awaiting your command..." typingSpeed={40} className="text-green-400" />
        </div>
      )}
    </section>
  )
}

