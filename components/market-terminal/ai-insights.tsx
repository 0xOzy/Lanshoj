"use client"

import { useState, useEffect } from "react"
import { Brain, RefreshCw, AlertTriangle, TrendingUp, BarChart2, Zap } from "lucide-react"
import { BinaryText } from "@/components/binary-text"

interface AiInsightsProps {
  refreshing: boolean
  onRefresh: () => void
}

interface InsightsData {
  marketSummary: string
  topTrends: string[]
  riskAssessment: string
  prediction: string
  timestamp: string
}

export function AiInsights({ refreshing, onRefresh }: AiInsightsProps) {
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchInsights = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/market/insights")

      if (!response.ok) {
        throw new Error(`Failed to fetch insights: ${response.status}`)
      }

      const data = await response.json()

      if (data && data.marketSummary) {
        setInsights(data)
      } else {
        throw new Error("Invalid insights data format")
      }
    } catch (error) {
      console.error("Error fetching insights:", error)
      setError("Failed to load market insights. Using fallback data.")

      // Use fallback data if we don't have insights yet
      if (!insights) {
        setInsights({
          marketSummary: "Market analysis temporarily unavailable. Please check back later for updated insights.",
          topTrends: [
            "Data collection in progress for trend analysis.",
            "Check individual token metrics for the latest performance data.",
            "Market conditions are constantly changing, always do your own research.",
          ],
          riskAssessment: "Risk assessment requires current market data. Please refresh or try again later.",
          prediction: "Predictions will resume when sufficient market data is available.",
          timestamp: new Date().toISOString(),
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()

    // Set up interval for automatic refresh (every 2 minutes)
    const interval = setInterval(() => {
      fetchInsights()
    }, 120000) // 2 minutes

    return () => clearInterval(interval)
  }, [retryCount])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  if (loading && !insights) {
    return (
      <div className="border border-border rounded-lg p-4 bg-card shadow-sm h-full max-h-[500px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">
              <BinaryText>AI Market Insights</BinaryText>
            </h3>
          </div>
          <div className="animate-pulse">
            <div className="h-4 w-24 bg-muted/30 rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-muted/30 rounded w-full mb-2"></div>
            <div className="h-4 bg-muted/30 rounded w-5/6"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-muted/30 rounded w-full mb-2"></div>
            <div className="h-4 bg-muted/30 rounded w-4/6"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-muted/30 rounded w-full mb-2"></div>
            <div className="h-4 bg-muted/30 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !insights) {
    return (
      <div className="border border-border rounded-lg p-4 bg-card shadow-sm h-full max-h-[500px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">
              <BinaryText>AI Market Insights</BinaryText>
            </h3>
          </div>
          <button
            onClick={handleRetry}
            className="p-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-6">
          <AlertTriangle className="h-10 w-10 text-yellow-500 mb-2" />
          <p className="text-sm text-muted-foreground text-center">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!insights) {
    return null
  }

  return (
    <div className="border border-border rounded-lg p-4 bg-card shadow-sm h-full max-h-[500px] overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">
            <BinaryText>AI Market Insights</BinaryText>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{new Date(insights.timestamp).toLocaleTimeString()}</span>
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-yellow-500/10 text-yellow-500 rounded-md text-xs flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1" />
          <span>Using cached data due to API error</span>
        </div>
      )}

      <div className="space-y-3">
        {/* Market Summary */}
        <div className="p-3 bg-muted/10 rounded-lg">
          <div className="flex items-center gap-1 text-sm font-medium mb-1">
            <BarChart2 className="h-4 w-4 text-primary" />
            <span>Market Summary</span>
          </div>
          <p className="text-sm text-muted-foreground">{insights.marketSummary}</p>
        </div>

        {/* Top Trends */}
        <div className="p-3 bg-muted/10 rounded-lg">
          <div className="flex items-center gap-1 text-sm font-medium mb-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>Top Trends</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            {insights.topTrends.map((trend, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-primary mt-1">•</span>
                <span>{trend}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risk Assessment & Prediction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-muted/10 rounded-lg">
            <div className="flex items-center gap-1 text-sm font-medium mb-1">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>Risk Assessment</span>
            </div>
            <p className="text-sm text-muted-foreground">{insights.riskAssessment}</p>
          </div>

          <div className="p-3 bg-muted/10 rounded-lg">
            <div className="flex items-center gap-1 text-sm font-medium mb-1">
              <Zap className="h-4 w-4 text-primary" />
              <span>Market Prediction</span>
            </div>
            <p className="text-sm text-muted-foreground">{insights.prediction}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

