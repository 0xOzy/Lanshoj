"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { BinaryText } from "@/components/binary-text"
import type { NftData } from "@/lib/coingecko-api"

interface NftCardProps {
  nft: NftData
}

export function NftCard({ nft }: NftCardProps) {
  const [imageError, setImageError] = useState(false)

  // Format price change with color
  const priceChangeValue = Number.parseFloat(nft.priceChange.replace("%", "").replace("+", ""))
  const isPricePositive = !nft.priceChange.includes("-")

  return (
    <div className="border border-border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
            {!imageError ? (
              <Image
                src={nft.imageUrl || `/placeholder.svg?height=40&width=40&text=${nft.symbol.charAt(0)}`}
                alt={nft.name}
                width={40}
                height={40}
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-lg font-bold text-primary">{nft.symbol.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold">
              <BinaryText>{nft.name}</BinaryText>
            </h3>
            <div className="flex items-center gap-1 text-xs">
              <span className="bg-primary/10 text-primary px-1 rounded">{nft.symbol}</span>
            </div>
          </div>
        </div>
        <a
          href={nft.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-xs text-muted-foreground">Floor Price</div>
          <div className="font-mono text-sm">
            {nft.floorPrice} {nft.currencySymbol}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">24h Change</div>
          <div className={`font-mono text-sm ${isPricePositive ? "text-green-500" : "text-red-500"}`}>
            {nft.priceChange}
          </div>
        </div>
      </div>
    </div>
  )
}

