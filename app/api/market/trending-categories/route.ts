import { NextResponse } from "next/server"
import { getTrendingCategories } from "@/lib/coingecko-api"

// Cache for API responses
let cachedCategories: any = null
let cacheTimestamp = 0
const CACHE_DURATION = 300 * 1000 // 5 minutes (reduced from 10 minutes for more frequent updates)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "5", 10)

    // Check if we have valid cached data
    const now = Date.now()
    if (cachedCategories && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json(cachedCategories.slice(0, limit))
    }

    // Fetch new data
    const categories = await getTrendingCategories(limit)

    // Update cache only if we got valid data
    if (categories && categories.length > 0) {
      cachedCategories = categories
      cacheTimestamp = now
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error in trending categories API:", error)

    // Return cached data if available, even if expired
    if (cachedCategories) {
      console.log("Returning expired cached categories due to error")
      return NextResponse.json(cachedCategories)
    }

    return NextResponse.json({ error: "Failed to fetch trending categories" }, { status: 500 })
  }
}

