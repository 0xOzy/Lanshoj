"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ExternalLink, AlertTriangle, Shield, Clock, TrendingUp, BarChart2 } from "lucide-react"
import { BinaryText } from "@/components/binary-text"
import type { TokenData } from "@/lib/coingecko-api"

interface TokenModalProps {
  token: TokenData
  onClose: () => void
}

export function TokenModal({ token, onClose }: TokenModalProps) {
  const [imageError, setImageError] = useState(false)

  // Format price changes with color
  const isPricePositive24h = !token.priceChange.includes("-")
  const isPricePositive1h = token.priceChange1h ? !token.priceChange1h.includes("-") : false
  const isPricePositive7d = token.priceChange7d ? !token.priceChange7d.includes("-") : false

  // Get risk level badge
  const getRiskBadge = () => {
    switch (token.riskLevel) {
      case "low":
        return (
          <div className="flex items-center gap-1 text-green-500">
            <Shield className="h-4 w-4" />
            <span>Low Risk</span>
          </div>
        )
      case "medium":
        return (
          <div className="flex items-center gap-1 text-yellow-500">
            <Clock className="h-4 w-4" />
            <span>Medium Risk</span>
          </div>
        )
      case "high":
        return (
          <div className="flex items-center gap-1 text-red-500">
            <AlertTriangle className="h-4 w-4" />
            <span>High Risk</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-card border border-border rounded-lg shadow-lg p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Token header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
            {!imageError ? (
              <Image
                src={token.logoUrl || `/placeholder.svg?height=64&width=64&text=${token.symbol.charAt(0)}`}
                alt={token.name}
                width={64}
                height={64}
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-2xl font-bold text-primary">{token.symbol.charAt(0)}</span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              <BinaryText>{token.name}</BinaryText>
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">${token.symbol}</span>
              <span className="bg-muted/30 px-2 py-0.5 rounded">Rank #{token.marketCapRank}</span>
              {token.trending && (
                <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Trending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Token metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/10 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Price</div>
            <div className="font-mono text-lg">{token.price}</div>
          </div>
          <div className="bg-muted/10 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">24h Change</div>
            <div className={`font-mono text-lg ${isPricePositive24h ? "text-green-500" : "text-red-500"}`}>
              {token.priceChange}
            </div>
          </div>
          <div className="bg-muted/10 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">24h Volume</div>
            <div className="font-mono text-lg">{token.volume}</div>
          </div>
          <div className="bg-muted/10 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Market Cap</div>
            <div className="font-mono text-lg">{token.marketCap}</div>
          </div>
        </div>

        {/* Additional price changes */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {token.priceChange1h && (
            <div className="bg-muted/10 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">1h Change</div>
              <div className={`font-mono ${isPricePositive1h ? "text-green-500" : "text-red-500"}`}>
                {token.priceChange1h}
              </div>
            </div>
          )}
          <div className="bg-muted/10 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">24h Change</div>
            <div className={`font-mono ${isPricePositive24h ? "text-green-500" : "text-red-500"}`}>
              {token.priceChange}
            </div>
          </div>
          {token.priceChange7d && (
            <div className="bg-muted/10 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">7d Change</div>
              <div className={`font-mono ${isPricePositive7d ? "text-green-500" : "text-red-500"}`}>
                {token.priceChange7d}
              </div>
            </div>
          )}
        </div>

        {/* Token details */}
        <div className="space-y-4 mb-6">
          {/* Market cap & risk level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Market Cap Rank</div>
              <div className="font-mono">#{token.marketCapRank}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Risk Level</div>
              {getRiskBadge()}
            </div>
          </div>

          {/* Last updated */}
          <div>
            <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
            <div className="text-sm">{new Date(token.lastUpdated).toLocaleString()}</div>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://www.coingecko.com/en/coins/${token.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View on CoinGecko</span>
          </a>
          <a
            href={`https://www.tradingview.com/symbols/${token.symbol}USD/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm bg-muted/30 hover:bg-muted/50 px-3 py-1.5 rounded transition-colors"
          >
            <BarChart2 className="h-4 w-4" />
            <span>View Chart</span>
          </a>
        </div>
      </div>
    </div>
  )
}

