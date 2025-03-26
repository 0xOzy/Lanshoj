"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink, TrendingUp, Clock, AlertTriangle, Shield } from "lucide-react"
import { BinaryText } from "@/components/binary-text"
import type { TokenData } from "@/lib/coingecko-api"

interface TokenCardProps {
  token: TokenData
  onClick: () => void
}

export function TokenCard({ token, onClick }: TokenCardProps) {
  const [imageError, setImageError] = useState(false)

  // Format price change with color
  const priceChangeValue = Number.parseFloat(token.priceChange.replace("%", "").replace("+", ""))
  const isPricePositive = !token.priceChange.includes("-")

  // Risk level styling
  const getRiskBadge = () => {
    switch (token.riskLevel) {
      case "low":
        return (
          <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-500 rounded-md flex items-center gap-1">
            <Shield className="h-3 w-3" /> Low Risk
          </span>
        )
      case "medium":
        return (
          <span className="px-2 py-0.5 text-xs bg-yellow-500/10 text-yellow-500 rounded-md flex items-center gap-1">
            <Clock className="h-3 w-3" /> Medium Risk
          </span>
        )
      case "high":
        return (
          <span className="px-2 py-0.5 text-xs bg-red-500/10 text-red-500 rounded-md flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> High Risk
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div
      className="border border-border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
            {!imageError ? (
              <Image
                src={token.logoUrl || `/placeholder.svg?height=40&width=40&text=${token.symbol.charAt(0)}`}
                alt={token.name}
                width={40}
                height={40}
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-lg font-bold text-primary">{token.symbol.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold flex items-center gap-1">
              <BinaryText>{token.name}</BinaryText>
              {token.trending && <TrendingUp className="h-3.5 w-3.5 text-primary ml-1" />}
            </h3>
            <div className="flex items-center gap-1 text-xs">
              <span className="bg-primary/10 text-primary px-1 rounded">${token.symbol}</span>
              <span className="bg-muted/30 px-1 rounded">#{token.marketCapRank}</span>
            </div>
          </div>
        </div>
        <a
          href={`https://www.coingecko.com/en/coins/${token.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <div className="text-xs text-muted-foreground">Price</div>
          <div className="font-mono text-sm">{token.price}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">24h Change</div>
          <div className={`font-mono text-sm ${isPricePositive ? "text-green-500" : "text-red-500"}`}>
            {token.priceChange}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">24h Volume</div>
          <div className="font-mono text-sm">{token.volume}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Market Cap</div>
          <div className="font-mono text-sm">{token.marketCap}</div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {getRiskBadge()}
        <span className="text-xs text-muted-foreground">Click for details</span>
      </div>
    </div>
  )
}

