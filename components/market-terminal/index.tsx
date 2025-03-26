"use client"

import { useState, useEffect, useCallback } from "react"
import { RefreshCw, Clock, TrendingUp, AlertCircle, ImageIcon } from "lucide-react"
import { BinaryText } from "@/components/binary-text"
import { TokenCard } from "./token-card"
import { TokenModal } from "./token-modal"
import { NftCard } from "./nft-card"
import { AiInsights } from "./ai-insights"
import type { TokenData, NftData } from "@/lib/coingecko-api"

export function MarketTerminal() {
  // State for token data
  const [trendingTokens, setTrendingTokens] = useState<TokenData[]>([])
  const [trendingNfts, setTrendingNfts] = useState<NftData[]>([])
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null)

  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Last updated timestamp
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Countdown timer state
  const [countdown, setCountdown] = useState(120) // 2 minutes in seconds

  // Fetch data from API with better error handling
  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true)
      let hasError = false

      // Fetch trending tokens
      try {
        const trendingResponse = await fetch("/api/market/trending?limit=15")

        if (!trendingResponse.ok) {
          console.error(`Failed to fetch trending tokens: ${trendingResponse.status}`)
          hasError = true
        } else {
          const trendingData = await trendingResponse.json()
          if (Array.isArray(trendingData) && trendingData.length > 0) {
            setTrendingTokens(trendingData)
          } else if (trendingData.error) {
            console.error("Error in trending tokens response:", trendingData.error)
            hasError = true
          }
        }
      } catch (tokenError) {
        console.error("Error fetching trending tokens:", tokenError)
        hasError = true
      }

      // Fetch trending NFTs
      try {
        const nftsResponse = await fetch("/api/market/trending-nfts?limit=7")

        if (!nftsResponse.ok) {
          console.error(`Failed to fetch trending NFTs: ${nftsResponse.status}`)
          hasError = true
        } else {
          const nftsData = await nftsResponse.json()
          if (Array.isArray(nftsData) && nftsData.length > 0) {
            setTrendingNfts(nftsData)
          } else if (nftsData.error) {
            console.error("Error in trending NFTs response:", nftsData.error)
            hasError = true
          }
        }
      } catch (nftError) {
        console.error("Error fetching trending NFTs:", nftError)
        hasError = true
      }

      // Update error state if needed
      if (hasError) {
        setError("Some data couldn't be loaded. Using cached or fallback data.")
      } else {
        setError(null)
      }

      setLastUpdated(new Date())
      setCountdown(120) // Reset countdown to 2 minutes
    } catch (error) {
      console.error("Error fetching market data:", error)
      setError("Failed to load market data. Using cached or fallback data.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchData()

    // Set up interval for automatic refresh (every 2 minutes)
    const interval = setInterval(() => {
      fetchData()
    }, 120000) // 2 minutes

    return () => clearInterval(interval)
  }, [fetchData])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  // Format countdown time
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Handle token selection
  const handleTokenSelect = (token: TokenData) => {
    setSelectedToken(token)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedToken(null)
  }

  // Loading state
  if (loading) {
    return (
      <section className="py-12">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-mono font-bold">
            <BinaryText>Market Terminal</BinaryText>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="border border-border rounded-lg p-6 bg-card shadow-sm animate-pulse">
            <div className="h-6 bg-muted/30 rounded-md w-3/4 mb-3"></div>
            <div className="h-4 bg-muted/30 rounded-md w-full mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-muted/30 rounded-md w-full"></div>
              <div className="h-3 bg-muted/30 rounded-md w-5/6"></div>
              <div className="h-3 bg-muted/30 rounded-md w-4/6"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12" id="market">
      <div className="flex items-center justify-between gap-3 mb-8">
        <h2 className="text-3xl font-mono font-bold">
          <BinaryText>Market Terminal</BinaryText>
        </h2>
        <div className="flex items-center gap-4">
          {error && (
            <div className="flex items-center text-yellow-500 text-sm" title={error}>
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline">Using fallback data</span>
            </div>
          )}
          <div className="flex items-center gap-1 bg-muted/20 px-2 py-1 rounded-md">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground hidden sm:inline">Refresh in: </span>
            <span className="text-xs font-mono">{formatCountdown(countdown)}</span>
          </div>
          <button
            onClick={fetchData}
            className="p-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors flex items-center gap-1"
            title="Refresh data manually"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="text-xs hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left column: Trending Tokens */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-mono font-bold">
              <BinaryText>Trending Tokens</BinaryText>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingTokens.length > 0 ? (
              trendingTokens.map((token, index) => (
                <TokenCard
                  key={`trending-${token.id}-${index}`}
                  token={token}
                  onClick={() => handleTokenSelect(token)}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                No trending tokens found. Please try refreshing.
              </div>
            )}
          </div>
        </div>

        {/* Right column: AI Insights */}
        <div className="space-y-6">
          <AiInsights refreshing={refreshing} onRefresh={fetchData} />
        </div>
      </div>

      {/* Trending NFTs */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <ImageIcon className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-mono font-bold">
            <BinaryText>Trending NFTs</BinaryText>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {trendingNfts.length > 0 ? (
            trendingNfts.map((nft, index) => <NftCard key={`nft-${nft.id}-${index}`} nft={nft} />)
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No trending NFTs found. Please try refreshing.
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-6 text-xs text-muted-foreground flex justify-between items-center">
        <div>Last updated: {lastUpdated.toLocaleString()}</div>
        <div>
          Scanning by <span className="text-purple-500 font-semibold">Shizu Agent</span> |{" "}
          <span className="text-purple-500 font-semibold">Shojo Labs</span>
        </div>
      </div>

      {/* Token modal */}
      {selectedToken && <TokenModal token={selectedToken} onClose={handleCloseModal} />}
    </section>
  )
}

