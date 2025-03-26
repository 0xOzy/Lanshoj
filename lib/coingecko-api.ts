/**
 * Utility functions for fetching and processing data from CoinGecko API
 */

// Update the CoinGecko API interface to match the public API response structure
export interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  price_change_percentage_1h_in_currency?: number
  price_change_percentage_24h_in_currency?: number
  price_change_percentage_7d_in_currency?: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
}

// Interface for trending coins from CoinGecko
export interface TrendingCoin {
  item: {
    id: string
    coin_id: number
    name: string
    symbol: string
    market_cap_rank: number
    thumb: string
    small: string
    large: string
    slug: string
    price_btc: number
    score: number
    data?: {
      price?: string
      price_btc?: string
      price_change_percentage_24h?: {
        usd?: number
      }
      market_cap?: {
        usd?: string
      }
      market_cap_btc?: string
      total_volume?: {
        usd?: string
      }
      total_volume_btc?: string
      sparkline?: string
      content?: string
    }
  }
}

// Interface for trending NFTs
export interface TrendingNft {
  id: string
  name: string
  symbol: string
  thumb: string
  floor_price_in_native_currency: number
  floor_price_24h_percentage_change: number
  native_currency_symbol: string
  url: string
}

// Interface for trending categories
export interface TrendingCategory {
  id: string
  name: string
  market_cap_change_24h: number
  top_3_coins: string[]
  volume_24h: number
}

// Mapped token data for our application
export interface TokenData {
  id: string
  name: string
  symbol: string
  address?: string
  price: string
  priceChange: string
  priceChange1h?: string
  priceChange24h?: string
  priceChange7d?: string
  volume: string
  marketCap: string
  marketCapRank: number
  logoUrl: string
  lastUpdated: string
  trending?: boolean
  riskLevel?: "low" | "medium" | "high"
}

// NFT data for our application
export interface NftData {
  id: string
  name: string
  symbol: string
  imageUrl: string
  floorPrice: string
  priceChange: string
  currencySymbol: string
  url: string
}

// Category data for our application
export interface CategoryData {
  id: string
  name: string
  marketCapChange: string
  topCoins: string[]
  volume: string
}

// Cache for API responses
const cache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_DURATION = 120 * 1000 // 2 minutes (updated from 60 seconds)
const NFT_CACHE_DURATION = 600 * 1000 // 10 minutes for NFTs and categories

// Track used tokens to avoid showing the same ones repeatedly
let usedTokenIds: Set<string> = new Set()

// Track API request times to avoid rate limiting
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1500 // 1.5 seconds between requests

// Reset used tokens periodically
setInterval(
  () => {
    usedTokenIds = new Set()
  },
  30 * 60 * 1000,
) // Reset every 30 minutes

/**
 * Sleep function to delay execution
 * @param ms Milliseconds to sleep
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Fetch data from CoinGecko API with caching and rate limiting
 * @param endpoint The API endpoint to fetch from
 * @param params Additional query parameters
 * @param cacheDuration Optional custom cache duration
 */
export async function fetchCoinGeckoData(
  endpoint: string,
  params: Record<string, string> = {},
  cacheDuration: number = CACHE_DURATION,
): Promise<any> {
  // Build URL with query parameters
  const queryParams = new URLSearchParams(params)

  // Check cache
  const cacheKey = `${endpoint}?${queryParams.toString()}`
  const now = Date.now()
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < cacheDuration) {
    return cache[cacheKey].data
  }

  try {
    // Rate limiting protection
    const timeSinceLastRequest = now - lastRequestTime
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    }

    // Update last request time
    lastRequestTime = Date.now()

    // Use the public CoinGecko API directly
    const baseUrl = "https://api.coingecko.com/api/v3"
    const url = `${baseUrl}/${endpoint}?${queryParams.toString()}`

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Shojo-Market-Terminal/1.0",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`CoinGecko API error (${response.status}): ${errorText}`)

      // If rate limited, use cached data if available
      if (response.status === 429 && cache[cacheKey]) {
        console.log(`Using cached data for ${endpoint} due to rate limiting`)
        return cache[cacheKey].data
      }

      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    // Cache the response
    cache[cacheKey] = { data, timestamp: now }

    return data
  } catch (error) {
    console.error("Error fetching from CoinGecko:", error)

    // Return cached data if available, even if expired
    if (cache[cacheKey]) {
      console.log(`Using expired cached data for ${endpoint} due to error`)
      return cache[cacheKey].data
    }

    throw error
  }
}

/**
 * Get trending tokens from CoinGecko
 * @param limit Number of tokens to return
 */
export async function getTrendingTokens(limit = 15): Promise<TokenData[]> {
  try {
    // Get trending coins from the trending endpoint
    const url = "https://api.coingecko.com/api/v3/search/trending"
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "User-Agent": "Shojo-Market-Terminal/1.0",
      },
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`Failed to fetch trending tokens: ${response.status}`)
    }

    const trendingResponse = await response.json()

    if (!trendingResponse || !trendingResponse.coins || !Array.isArray(trendingResponse.coins)) {
      throw new Error("Invalid response from CoinGecko trending API")
    }

    // Extract trending coin data
    const trendingCoins = trendingResponse.coins.map((item: TrendingCoin) => item.item)

    // Get additional market data for these coins to ensure we have volume and market cap
    const coinIds = trendingCoins.map((coin) => coin.id).join(",")
    let marketData: any[] = []

    try {
      // Fetch market data for the trending coins
      const marketDataUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      const marketDataResponse = await fetch(marketDataUrl, options)

      if (marketDataResponse.ok) {
        marketData = await marketDataResponse.json()
      }
    } catch (error) {
      console.error("Error fetching additional market data:", error)
      // Continue with what we have
    }

    // Create a map for quick lookup of market data
    const marketDataMap = new Map()
    marketData.forEach((coin) => {
      marketDataMap.set(coin.id, coin)
    })

    // Map to TokenData format
    const tokens = trendingCoins.slice(0, limit).map((coin: any) => {
      // Check if we have additional market data for this coin
      const additionalData = marketDataMap.get(coin.id)

      // Format price with safety checks
      const price = coin.data?.price
        ? `$${Number.parseFloat(coin.data.price).toLocaleString("en-US", {
            minimumFractionDigits: Number.parseFloat(coin.data.price) < 1 ? 4 : 2,
            maximumFractionDigits: Number.parseFloat(coin.data.price) < 1 ? 8 : 2,
          })}`
        : additionalData?.current_price
          ? `$${additionalData.current_price.toLocaleString("en-US", {
              minimumFractionDigits: additionalData.current_price < 1 ? 4 : 2,
              maximumFractionDigits: additionalData.current_price < 1 ? 8 : 2,
            })}`
          : `$${(coin.price_btc * getBtcPrice()).toLocaleString("en-US", { maximumFractionDigits: 2 })}`

      // Format price changes with safety checks
      const priceChange = coin.data?.price_change_percentage_24h?.usd
        ? `${coin.data.price_change_percentage_24h.usd > 0 ? "+" : ""}${coin.data.price_change_percentage_24h.usd.toFixed(2)}%`
        : additionalData?.price_change_percentage_24h
          ? `${additionalData.price_change_percentage_24h > 0 ? "+" : ""}${additionalData.price_change_percentage_24h.toFixed(2)}%`
          : "0%"

      // Format volume with safety checks
      let volume = "N/A"
      if (coin.data?.total_volume?.usd) {
        volume = formatCurrency(Number.parseFloat(coin.data.total_volume.usd))
      } else if (additionalData?.total_volume) {
        volume = formatCurrency(additionalData.total_volume)
      } else if (coin.market_cap_rank && coin.market_cap_rank <= 200) {
        // Estimate volume based on rank if it's a known coin
        const estimatedVolume = 10000000 / (coin.market_cap_rank || 100)
        volume = formatCurrency(estimatedVolume * 1000000)
      }

      // Format market cap with safety checks
      let marketCap = "N/A"
      if (coin.data?.market_cap?.usd) {
        marketCap = formatCurrency(Number.parseFloat(coin.data.market_cap.usd))
      } else if (additionalData?.market_cap) {
        marketCap = formatCurrency(additionalData.market_cap)
      } else if (coin.market_cap_rank && coin.market_cap_rank <= 200) {
        // Estimate market cap based on rank if it's a known coin
        const estimatedMarketCap = 100000000 / (coin.market_cap_rank || 100)
        marketCap = formatCurrency(estimatedMarketCap * 1000000)
      }

      return {
        id: coin.id,
        name: coin.name || "Unknown",
        symbol: (coin.symbol || "???").toUpperCase(),
        price,
        priceChange,
        volume,
        marketCap,
        marketCapRank: coin.market_cap_rank || additionalData?.market_cap_rank || 9999,
        logoUrl:
          coin.large ||
          coin.small ||
          coin.thumb ||
          `/placeholder.svg?height=40&width=40&text=${coin.symbol?.charAt(0) || "?"}`,
        lastUpdated: additionalData?.last_updated || new Date().toISOString(),
        trending: true,
        riskLevel:
          (coin.market_cap_rank || additionalData?.market_cap_rank) <= 20
            ? "low"
            : (coin.market_cap_rank || additionalData?.market_cap_rank) <= 100
              ? "medium"
              : "high",
      }
    })

    return tokens
  } catch (error) {
    console.error("Error getting trending tokens:", error)

    // Return mock data as fallback
    return generateMockTokens(limit)
  }
}

/**
 * Get an approximate BTC price for calculations
 * This is a fallback when we don't have exact price data
 */
function getBtcPrice(): number {
  // Try to get from cache first
  if (cache["btc_price"] && Date.now() - cache["btc_price"].timestamp < CACHE_DURATION) {
    return cache["btc_price"].data
  }

  // Default fallback price if we can't get real data
  return 60000 // Approximate BTC price
}

/**
 * Get trending NFTs from CoinGecko
 * @param limit Number of NFTs to return
 */
export async function getTrendingNfts(limit = 7): Promise<NftData[]> {
  try {
    // Get trending NFTs from the trending endpoint
    const trendingResponse = await fetchCoinGeckoData("search/trending", {}, NFT_CACHE_DURATION)

    if (!trendingResponse || !trendingResponse.nfts || !Array.isArray(trendingResponse.nfts)) {
      throw new Error("Invalid response from CoinGecko trending NFTs API")
    }

    // Map to NftData format
    const nfts = trendingResponse.nfts.slice(0, limit).map((nft: TrendingNft) => ({
      id: nft.id || `nft-${Math.random().toString(36).substring(2, 9)}`,
      name: nft.name || "Unknown NFT",
      symbol: nft.symbol || "NFT",
      imageUrl: nft.thumb || `/placeholder.svg?height=40&width=40&text=NFT`,
      floorPrice:
        typeof nft.floor_price_in_native_currency === "number" ? nft.floor_price_in_native_currency.toFixed(4) : "N/A",
      priceChange:
        typeof nft.floor_price_24h_percentage_change === "number"
          ? `${nft.floor_price_24h_percentage_change > 0 ? "+" : ""}${nft.floor_price_24h_percentage_change.toFixed(2)}%`
          : "0%",
      currencySymbol: (nft.native_currency_symbol || "ETH").toUpperCase(),
      url: nft.url || "#",
    }))

    return nfts
  } catch (error) {
    console.error("Error getting trending NFTs:", error)

    // Return mock data as fallback
    return generateMockNfts(limit)
  }
}

/**
 * Get trending categories from CoinGecko
 * @param limit Number of categories to return
 */
export async function getTrendingCategories(limit = 5): Promise<CategoryData[]> {
  try {
    // Get trending categories from the trending endpoint
    const trendingResponse = await fetchCoinGeckoData("search/trending", {}, NFT_CACHE_DURATION)

    if (!trendingResponse || !trendingResponse.categories || !Array.isArray(trendingResponse.categories)) {
      throw new Error("Invalid response from CoinGecko trending categories API")
    }

    // Map to CategoryData format with safety checks
    const categories = trendingResponse.categories.slice(0, limit).map((category: TrendingCategory) => ({
      id: category.id || `category-${Math.random().toString(36).substring(2, 9)}`,
      name: category.name || "Unknown Category",
      marketCapChange:
        typeof category.market_cap_change_24h === "number"
          ? `${category.market_cap_change_24h > 0 ? "+" : ""}${category.market_cap_change_24h.toFixed(2)}%`
          : "0%",
      topCoins: Array.isArray(category.top_3_coins) ? category.top_3_coins : [],
      volume: typeof category.volume_24h === "number" ? formatCurrency(category.volume_24h) : "N/A",
    }))

    return categories
  } catch (error) {
    console.error("Error getting trending categories:", error)

    // Try to get categories from the categories endpoint as a fallback
    try {
      const categoriesResponse = await fetchCoinGeckoData("coins/categories", {
        order: "market_cap_desc",
      })

      if (Array.isArray(categoriesResponse) && categoriesResponse.length > 0) {
        return categoriesResponse.slice(0, limit).map((category: any) => ({
          id: category.id || `category-${Math.random().toString(36).substring(2, 9)}`,
          name: category.name || "Unknown Category",
          marketCapChange:
            typeof category.market_cap_change_24h === "number"
              ? `${category.market_cap_change_24h > 0 ? "+" : ""}${category.market_cap_change_24h.toFixed(2)}%`
              : "0%",
          topCoins: Array.isArray(category.top_3_coins) ? category.top_3_coins : [],
          volume: typeof category.volume_24h === "number" ? formatCurrency(category.volume_24h) : "N/A",
        }))
      }
    } catch (fallbackError) {
      console.error("Error getting categories fallback:", fallbackError)
    }

    // Return mock data as last resort fallback
    return generateMockCategories(limit)
  }
}

/**
 * Get categories data directly from CoinGecko's categories endpoint
 * This is used as a fallback when trending categories are not available
 */
async function getCategoriesData(limit = 5): Promise<CategoryData[]> {
  try {
    const response = await fetchCoinGeckoData("coins/categories", {
      order: "market_cap_desc",
    })

    if (!Array.isArray(response)) {
      throw new Error("Invalid response from CoinGecko categories API")
    }

    return response.slice(0, limit).map((category: any) => ({
      id: category.id || `category-${Math.random().toString(36).substring(2, 9)}`,
      name: category.name || "Unknown Category",
      marketCapChange:
        typeof category.market_cap_change_24h === "number"
          ? `${category.market_cap_change_24h > 0 ? "+" : ""}${category.market_cap_change_24h.toFixed(2)}%`
          : "0%",
      topCoins: [], // Categories endpoint doesn't provide top coins
      volume: typeof category.volume_24h === "number" ? formatCurrency(category.volume_24h) : "N/A",
    }))
  } catch (error) {
    console.error("Error fetching categories data:", error)
    throw error
  }
}

/**
 * Generate mock token data for fallback
 */
function generateMockTokens(count: number): TokenData[] {
  const mockTokens: TokenData[] = []

  const symbols = [
    "BTC",
    "ETH",
    "SOL",
    "BNB",
    "XRP",
    "ADA",
    "DOGE",
    "SHIB",
    "AVAX",
    "DOT",
    "LINK",
    "MATIC",
    "UNI",
    "ATOM",
    "LTC",
  ]
  const names = [
    "Bitcoin",
    "Ethereum",
    "Solana",
    "Binance Coin",
    "Ripple",
    "Cardano",
    "Dogecoin",
    "Shiba Inu",
    "Avalanche",
    "Polkadot",
    "Chainlink",
    "Polygon",
    "Uniswap",
    "Cosmos",
    "Litecoin",
  ]

  for (let i = 0; i < Math.min(count, symbols.length); i++) {
    const price = Math.random() * (i === 0 ? 50000 : 5000)
    const priceChange = (Math.random() * 10 - 5).toFixed(2)
    const volume = Math.random() * 1000000000
    const marketCap = Math.random() * 1000000000000

    mockTokens.push({
      id: `mock-${symbols[i].toLowerCase()}`,
      name: names[i],
      symbol: symbols[i],
      price: `$${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      priceChange: `${priceChange.startsWith("-") ? "" : "+"}${priceChange}%`,
      volume: formatCurrency(volume),
      marketCap: formatCurrency(marketCap),
      marketCapRank: i + 1,
      logoUrl: `/images/tokens/${symbols[i].toLowerCase()}.png`,
      lastUpdated: new Date().toISOString(),
      trending: true,
      riskLevel: i < 3 ? "low" : i < 7 ? "medium" : "high",
    })
  }

  return mockTokens
}

/**
 * Generate mock NFT data for fallback
 */
function generateMockNfts(count: number): NftData[] {
  const mockNfts: NftData[] = []

  const collections = [
    { name: "Bored Ape Yacht Club", symbol: "BAYC" },
    { name: "CryptoPunks", symbol: "PUNK" },
    { name: "Azuki", symbol: "AZUKI" },
    { name: "Doodles", symbol: "DOODLE" },
    { name: "CloneX", symbol: "CLONEX" },
    { name: "Moonbirds", symbol: "MOONBIRD" },
    { name: "Pudgy Penguins", symbol: "PUDGY" },
  ]

  for (let i = 0; i < Math.min(count, collections.length); i++) {
    const floorPrice = (Math.random() * 10 + 0.5).toFixed(4)
    const priceChange = (Math.random() * 20 - 10).toFixed(2)

    mockNfts.push({
      id: `mock-${collections[i].symbol.toLowerCase()}`,
      name: collections[i].name,
      symbol: collections[i].symbol,
      imageUrl: `/placeholder.svg?height=40&width=40&text=${collections[i].symbol}`,
      floorPrice: floorPrice,
      priceChange: `${priceChange.startsWith("-") ? "" : "+"}${priceChange}%`,
      currencySymbol: "ETH",
      url: `https://opensea.io/collection/${collections[i].name.toLowerCase().replace(/\s+/g, "-")}`,
    })
  }

  return mockNfts
}

/**
 * Generate mock category data for fallback
 */
function generateMockCategories(count: number): CategoryData[] {
  const mockCategories: CategoryData[] = []

  const categories = [
    { name: "DeFi", volume: 2500000000 },
    { name: "Gaming", volume: 1800000000 },
    { name: "Layer 1", volume: 3200000000 },
    { name: "Meme", volume: 1200000000 },
    { name: "NFT", volume: 900000000 },
    { name: "AI", volume: 1500000000 },
    { name: "Metaverse", volume: 800000000 },
  ]

  for (let i = 0; i < Math.min(count, categories.length); i++) {
    const marketCapChange = (Math.random() * 20 - 10).toFixed(2)
    const volume = categories[i].volume * (0.8 + Math.random() * 0.4) // Add some randomness

    mockCategories.push({
      id: `mock-${categories[i].name.toLowerCase()}`,
      name: categories[i].name,
      marketCapChange: `${marketCapChange.startsWith("-") ? "" : "+"}${marketCapChange}%`,
      topCoins: ["/images/tokens/btc.png", "/images/tokens/eth.png", "/images/tokens/sol.png"],
      volume: formatCurrency(volume),
    })
  }

  return mockCategories
}

/**
 * Map CoinGecko coin data to our TokenData format
 */
function mapCoinToToken(coin: CoinData, trending = false): TokenData {
  // Format price with safety checks
  const price =
    typeof coin.current_price === "number"
      ? `$${coin.current_price.toLocaleString("en-US", {
          minimumFractionDigits: coin.current_price < 1 ? 4 : 2,
          maximumFractionDigits: coin.current_price < 1 ? 8 : 2,
        })}`
      : "N/A"

  // Format price changes with safety checks
  const priceChange24h =
    typeof coin.price_change_percentage_24h === "number"
      ? `${coin.price_change_percentage_24h > 0 ? "+" : ""}${coin.price_change_percentage_24h.toFixed(2)}%`
      : "0%"

  const priceChange1h =
    typeof coin.price_change_percentage_1h_in_currency === "number"
      ? `${coin.price_change_percentage_1h_in_currency > 0 ? "+" : ""}${coin.price_change_percentage_1h_in_currency.toFixed(2)}%`
      : undefined

  const priceChange7d =
    typeof coin.price_change_percentage_7d_in_currency === "number"
      ? `${coin.price_change_percentage_7d_in_currency > 0 ? "+" : ""}${coin.price_change_percentage_7d_in_currency.toFixed(2)}%`
      : undefined

  // Format volume and market cap with safety checks
  const volume = typeof coin.total_volume === "number" ? formatCurrency(coin.total_volume) : "N/A"
  const marketCap = typeof coin.market_cap === "number" ? formatCurrency(coin.market_cap) : "N/A"

  // Calculate risk level based on market cap, volatility, and rank
  const riskLevel = calculateRiskLevel(coin)

  return {
    id: coin.id,
    name: coin.name || "Unknown",
    symbol: (coin.symbol || "???").toUpperCase(),
    price,
    priceChange: priceChange24h,
    priceChange1h,
    priceChange24h,
    priceChange7d,
    volume,
    marketCap,
    marketCapRank: coin.market_cap_rank || 9999,
    logoUrl: coin.image || `/placeholder.svg?height=40&width=40&text=${coin.symbol?.charAt(0) || "?"}`,
    lastUpdated: coin.last_updated || new Date().toISOString(),
    trending,
    riskLevel,
  }
}

/**
 * Calculate risk level based on coin metrics
 */
function calculateRiskLevel(coin: CoinData): "low" | "medium" | "high" {
  // Default to medium risk
  let risk: "low" | "medium" | "high" = "medium"

  // Check market cap with safety checks
  if (typeof coin.market_cap === "number") {
    if (coin.market_cap > 10000000000) {
      // $10B+
      risk = "low"
    } else if (coin.market_cap < 100000000) {
      // Less than $100M
      risk = "high"
    }
  }

  // Check market cap rank with safety checks
  if (typeof coin.market_cap_rank === "number") {
    if (coin.market_cap_rank <= 20) {
      risk = "low"
    } else if (coin.market_cap_rank >= 200) {
      risk = risk === "low" ? "medium" : "high"
    }
  }

  // Check price volatility with safety checks
  const volatility = Math.abs(coin.price_change_percentage_24h || 0)
  if (volatility > 20) {
    // 20% change in 24 hours is significant
    risk = "high"
  } else if (volatility < 5 && risk === "high") {
    risk = "medium"
  }

  return risk
}

/**
 * Format currency values
 */
function formatCurrency(value: number): string {
  if (!value && value !== 0) return "N/A"

  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`
  } else {
    return `$${value.toFixed(2)}`
  }
}

/**
 * Generate AI insights based on market data
 */
export async function generateAiInsights(): Promise<{
  marketSummary: string
  topTrends: string[]
  riskAssessment: string
  prediction: string
}> {
  try {
    // Get global market data
    const globalData = await fetchCoinGeckoData("global")

    // Get top coins by market cap
    const topCoinsResponse = await fetchCoinGeckoData("coins/markets", {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: "20",
      page: "1",
      sparkline: "false",
      price_change_percentage: "1h,24h,7d",
    })

    if (!Array.isArray(topCoinsResponse)) {
      throw new Error("Invalid response from CoinGecko markets API")
    }

    // Get trending data
    const trendingResponse = await fetchCoinGeckoData("search/trending", {}, NFT_CACHE_DURATION)
    const trendingCoins = trendingResponse?.coins || []
    const trendingNfts = trendingResponse?.nfts || []
    const trendingCategories = trendingResponse?.categories || []

    // Map to TokenData format
    const tokens = topCoinsResponse.map((coin: CoinData) => mapCoinToToken(coin))

    // Calculate market metrics with safety checks
    const totalMarketCap = globalData?.data?.total_market_cap?.usd || 0
    const marketCapChangePercentage = globalData?.data?.market_cap_change_percentage_24h_usd || 0
    const btcDominance = globalData?.data?.market_cap_percentage?.btc || 0
    const ethDominance = globalData?.data?.market_cap_percentage?.eth || 0
    const totalVolume = globalData?.data?.total_volume?.usd || 0

    const positiveChanges = tokens.filter((t) => {
      const change = Number.parseFloat(t.priceChange.replace("%", "").replace("+", ""))
      return !isNaN(change) && change > 0
    }).length

    const marketSentiment = marketCapChangePercentage > 0 ? "bullish" : "bearish"
    const highRiskCount = tokens.filter((t) => t.riskLevel === "high").length

    // Get top gainers and losers
    const topGainers = [...tokens]
      .sort((a, b) => {
        const aChange = Number.parseFloat(a.priceChange.replace("%", "").replace("+", "")) || 0
        const bChange = Number.parseFloat(b.priceChange.replace("%", "").replace("+", "")) || 0
        return bChange - aChange
      })
      .slice(0, 5)

    const topLosers = [...tokens]
      .sort((a, b) => {
        const aChange = Number.parseFloat(a.priceChange.replace("%", "").replace("+", "")) || 0
        const bChange = Number.parseFloat(b.priceChange.replace("%", "").replace("+", "")) || 0
        return aChange - bChange
      })
      .slice(0, 5)

    // Generate market summary
    const marketSummary = `The global crypto market is currently ${marketSentiment} with a total market cap of ${formatCurrency(totalMarketCap)} (${marketCapChangePercentage > 0 ? "+" : ""}${marketCapChangePercentage.toFixed(2)}% in 24h). Total volume is ${formatCurrency(totalVolume)}. BTC dominance is at ${btcDominance.toFixed(2)}% and ETH at ${ethDominance.toFixed(2)}%.`

    // Generate top trends with safety checks
    const topTrends = [
      `${positiveChanges} out of top ${tokens.length} coins are showing positive price movement in the last 24 hours.`,
      topGainers.length > 0
        ? `${topGainers[0]?.name || "Unknown"} (${topGainers[0]?.symbol || "?"}) is the top gainer with ${topGainers[0]?.priceChange || "?"} in 24h.`
        : "No significant gainers in the last 24 hours.",
      trendingCoins.length > 0
        ? `${trendingCoins[0]?.item?.name || "Unknown"} (${(trendingCoins[0]?.item?.symbol || "?").toUpperCase()}) is currently the most searched token on CoinGecko.`
        : "Trending data is currently unavailable.",
      trendingCategories.length > 0 && typeof trendingCategories[0]?.market_cap_change_24h === "number"
        ? `${trendingCategories[0]?.name || "Unknown"} is the most trending category with ${trendingCategories[0]?.market_cap_change_24h > 0 ? "+" : ""}${trendingCategories[0]?.market_cap_change_24h.toFixed(2)}% change.`
        : "Category trend data is currently unavailable.",
    ]

    // Generate risk assessment
    const riskAssessment =
      highRiskCount > tokens.length / 3
        ? `Market risk is elevated with ${highRiskCount} high-risk tokens detected among the top ${tokens.length}. Exercise caution when trading.`
        : `Market risk is moderate with most tokens showing stable metrics. Always conduct your own research before trading.`

    // Generate prediction
    const prediction =
      marketSentiment === "bullish"
        ? `Short-term market outlook appears positive with continued momentum likely for top trending tokens, especially in the ${trendingCategories.length > 0 ? trendingCategories[0]?.name || "DeFi" : "DeFi"} sector.`
        : `Short-term market outlook suggests caution with potential consolidation before next directional move.`

    return {
      marketSummary,
      topTrends,
      riskAssessment,
      prediction,
    }
  } catch (error) {
    console.error("Error generating AI insights:", error)

    // Return fallback insights
    return {
      marketSummary: "Market analysis temporarily unavailable. Please check back later for updated insights.",
      topTrends: [
        "Data collection in progress for trend analysis.",
        "Check individual token metrics for the latest performance data.",
        "Market conditions are constantly changing, always do your own research.",
      ],
      riskAssessment: "Risk assessment requires current market data. Please refresh or try again later.",
      prediction: "Predictions will resume when sufficient market data is available.",
    }
  }
}

