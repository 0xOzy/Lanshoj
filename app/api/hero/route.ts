import { NextResponse } from "next/server"

export interface HeroData {
  title: string
  subtitle: string
  backgroundEffects: {
    enabled: boolean
    type: "pulse" | "particles" | "grid"
  }
}

const heroData: HeroData = {
  title: "The Future of Intelligence & Secure AI Collaboration",
  subtitle: "Pioneering AI research with a focus on security, transparency, and community-driven innovation.",
  backgroundEffects: {
    enabled: true,
    type: "pulse",
  },
}

export async function GET() {
  try {
    // Simulate a small delay to mimic a real API call
    await new Promise((resolve) => setTimeout(resolve, 200))

    return NextResponse.json(heroData)
  } catch (error) {
    console.error("Error fetching hero data:", error)
    return NextResponse.json({ error: "Failed to fetch hero data" }, { status: 500 })
  }
}

