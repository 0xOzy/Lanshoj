"use client"

import Image from "next/image"
import { BinaryText } from "@/components/binary-text"
import type { CategoryData } from "@/lib/coingecko-api"

interface CategoryCardProps {
  category: CategoryData
}

export function CategoryCard({ category }: CategoryCardProps) {
  // Format market cap change with color
  const marketCapChangeValue = Number.parseFloat(category.marketCapChange.replace("%", "").replace("+", ""))
  const isPositive = !category.marketCapChange.includes("-")

  return (
    <div className="border border-border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold">
            <BinaryText>{category.name}</BinaryText>
          </h3>
          <div className={`text-sm font-mono ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {category.marketCapChange}
          </div>
        </div>
        <div className="flex -space-x-2">
          {category.topCoins && category.topCoins.length > 0 ? (
            category.topCoins.slice(0, 3).map((coin, index) => (
              <div key={index} className="w-8 h-8 rounded-full overflow-hidden border-2 border-background">
                <Image
                  src={coin || `/placeholder.svg?height=32&width=32&text=${index}`}
                  alt={`Top coin ${index + 1}`}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            ))
          ) : (
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-background bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold">{category.name.charAt(0)}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="text-xs text-muted-foreground">24h Volume</div>
        <div className="font-mono text-sm">{category.volume}</div>
      </div>
    </div>
  )
}

