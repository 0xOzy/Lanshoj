import { NextResponse } from "next/server"
import { getTrendingTokens } from "@/lib/coingecko-api"

// Cache for API responses
let cachedTokens: any = null
let cacheTimestamp = 0
const CACHE_DURATION = 120 * 1000 // 2 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "15", 10)

    // Check if we have valid cached data
    const now = Date.now()
    if (cachedTokens && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json(cachedTokens.slice(0, limit))
    }

    // Fetch new data
    const tokens = await getTrendingTokens(limit)

    // Update cache only if we got valid data
    if (tokens && tokens.length > 0) {
      cachedTokens = tokens
      cacheTimestamp = now
    } else if (!cachedTokens) {
      // If we don't have any data at all, generate mock data
      cachedTokens = Array.from({ length: limit }).map((_, i) => ({
        id: `mock-token-${i}`,
        name: `Mock Token ${i + 1}`,
        symbol: `MT${i + 1}`,
        price: `$${(Math.random() * 1000).toFixed(2)}`,
        priceChange: `${Math.random() > 0.5 ? "+" : "-"}${(Math.random() * 10).toFixed(2)}%`,
        volume: `$${(Math.random() * 10).toFixed(2)}M`,
        marketCap: `$${(Math.random() * 100).toFixed(2)}M`,
        marketCapRank: i + 1,
        logoUrl: `/placeholder.svg?height=40&width=40&text=MT${i + 1}`,
        lastUpdated: new Date().toISOString(),
        trending: true,
        riskLevel: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
      }))
      cacheTimestamp = now
    }

    return NextResponse.json(cachedTokens.slice(0, limit))
  } catch (error) {
    console.error("Error in trending tokens API:", error)

    // Return cached data if available, even if expired
    if (cachedTokens) {
      console.log("Returning expired cached tokens due to error")
      return NextResponse.json(cachedTokens)
    }

    // If no cached data, return mock data instead of an error
    const mockTokens = Array.from({ length: 15 }).map((_, i) => ({
      id: `mock-token-${i}`,
      name: `Mock Token ${i + 1}`,
      symbol: `MT${i + 1}`,
      price: `$${(Math.random() * 1000).toFixed(2)}`,
      priceChange: `${Math.random() > 0.5 ? "+" : "-"}${(Math.random() * 10).toFixed(2)}%`,
      volume: `$${(Math.random() * 10).toFixed(2)}M`,
      marketCap: `$${(Math.random() * 100).toFixed(2)}M`,
      marketCapRank: i + 1,
      logoUrl: `/placeholder.svg?height=40&width=40&text=MT${i + 1}`,
      lastUpdated: new Date().toISOString(),
      trending: true,
      riskLevel: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
    }))

    return NextResponse.json(mockTokens)
  }
}

