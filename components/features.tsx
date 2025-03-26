"use client"

import { useState, useEffect } from "react"
import { BinaryText } from "./binary-text"
import { Brain, Search, Lock, Zap } from "lucide-react"

// Import the FeatureData interface
interface FeatureData {
  id: string
  title: string
  description: string
  icon: string
  details: string[]
}

export function Features() {
  const [features, setFeatures] = useState<FeatureData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeatures() {
      try {
        setLoading(true)
        const response = await fetch("/api/features")

        if (!response.ok) {
          throw new Error(`Failed to fetch features: ${response.status}`)
        }

        const data = await response.json()
        setFeatures(data)
      } catch (err) {
        console.error("Error fetching features:", err)
        setError("Failed to load features. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchFeatures()
  }, [])

  // Function to get the appropriate icon component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Brain":
        return <Brain className="h-5 w-5" />
      case "Search":
        return <Search className="h-5 w-5" />
      case "Lock":
        return <Lock className="h-5 w-5" />
      case "Zap":
        return <Zap className="h-5 w-5" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-mono font-bold">
            <BinaryText>Loading Features...</BinaryText>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-border rounded-lg p-6 bg-card/50 backdrop-blur-sm animate-pulse">
              <div className="h-6 bg-muted/30 rounded-md w-3/4 mb-3"></div>
              <div className="h-4 bg-muted/30 rounded-md w-full mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-muted/30 rounded-md w-full"></div>
                <div className="h-3 bg-muted/30 rounded-md w-5/6"></div>
                <div className="h-3 bg-muted/30 rounded-md w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-mono font-bold">
            <BinaryText>Shojo AI Features</BinaryText>
          </h2>
          <span className="px-2 py-1 text-xs font-mono bg-primary/20 text-primary rounded-md">Coming Soon</span>
        </div>
        <div className="text-center p-8 border border-border rounded-lg bg-card/50">
          <p className="text-destructive">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="flex flex-col gap-3 mb-8">
        <h2 className="text-3xl font-mono font-bold">
          <BinaryText>Shojo AI Features</BinaryText>
        </h2>
        <p className="text-muted-foreground">
          Powered by <span className="font-semibold text-primary">Shizu Agent</span>, our advanced AI agent designed for
          crypto market analysis
        </p>
        <span className="px-2 py-1 text-xs font-mono bg-primary/20 text-primary rounded-md self-start">
          Coming Soon
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            id={`feature-${feature.id}`}
            className="border border-border rounded-lg p-6 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">{getIconComponent(feature.icon)}</div>
              <h3 className="text-xl font-mono font-bold">
                <BinaryText>{feature.title}</BinaryText>
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">{feature.description}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {feature.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">→</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

