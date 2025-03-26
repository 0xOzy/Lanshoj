import { NextResponse } from "next/server"
import { generateAiInsights } from "@/lib/coingecko-api"

// Cache for API responses
let cachedInsights: any = null
let cacheTimestamp = 0
const CACHE_DURATION = 120 * 1000 // 2 minutes

export async function GET() {
  try {
    // Check if we have valid cached data
    const now = Date.now()
    if (cachedInsights && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json(cachedInsights)
    }

    // Generate AI insights based on CoinGecko data
    const insights = await generateAiInsights()

    // Add timestamp
    const insightsWithTimestamp = {
      ...insights,
      timestamp: new Date().toISOString(),
    }

    // Update cache
    cachedInsights = insightsWithTimestamp
    cacheTimestamp = now

    return NextResponse.json(insightsWithTimestamp)
  } catch (error) {
    console.error("Error generating market insights:", error)

    // Return cached data if available, even if expired
    if (cachedInsights) {
      console.log("Returning expired cached insights due to error")
      return NextResponse.json(cachedInsights)
    }

    // If no cached data, return fallback insights
    const fallbackInsights = {
      marketSummary: "Market analysis temporarily unavailable. Please check back later for updated insights.",
      topTrends: [
        "Data collection in progress for trend analysis.",
        "Check individual token metrics for the latest performance data.",
        "Market conditions are constantly changing, always do your own research.",
      ],
      riskAssessment: "Risk assessment requires current market data. Please refresh or try again later.",
      prediction: "Predictions will resume when sufficient market data is available.",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(fallbackInsights)
  }
}

