import { NextResponse } from "next/server"

// Define the feature data structure
export interface FeatureData {
  id: string
  title: string
  description: string
  icon: string
  details: string[]
}

// Mock data for Shojo AI features
const featuresData: FeatureData[] = [
  {
    id: "ai-market-analysis",
    title: "AI Market Analysis",
    description: "Real-time sentiment analysis and trend detection across multiple blockchains and social platforms.",
    icon: "Brain",
    details: [
      "Pattern recognition across historical market data",
      "Social sentiment correlation with price movements",
      "Anomaly detection for early warning signals",
    ],
  },
  {
    id: "crypto-intelligence",
    title: "Crypto Intelligence",
    description: "Monitors new tokens and detects potential opportunities and risks in real-time.",
    icon: "Search",
    details: [
      "New token launch detection and analysis",
      "Smart contract risk assessment",
      "Liquidity and trading pattern monitoring",
    ],
  },
  {
    id: "privacy-security",
    title: "Privacy & Security",
    description: "Uses DID (Decentralized Identity) and encryption to ensure user privacy.",
    icon: "Lock",
    details: [
      "End-to-end encryption for all communications",
      "Decentralized identity management",
      "Zero-knowledge proofs for verification",
    ],
  },
  {
    id: "adaptive-ai",
    title: "Adaptive AI",
    description: "Can analyze financial markets and other sectors with adaptive learning.",
    icon: "Zap",
    details: [
      "Cross-market correlation analysis",
      "Continuous learning from market feedback",
      "Customizable analysis parameters",
    ],
  },
]

export async function GET() {
  try {
    // In a real application, you might fetch this data from a database
    // or another external API using your API key

    // Simulate a small delay to mimic a real API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json(featuresData)
  } catch (error) {
    console.error("Error fetching features data:", error)
    return NextResponse.json({ error: "Failed to fetch features data" }, { status: 500 })
  }
}

