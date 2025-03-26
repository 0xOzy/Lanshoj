"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { BinaryText } from "./binary-text"

export function Tokenomics() {
  const [copied, setCopied] = useState(false)
  const contractAddress = "Coming Soon"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-mono font-bold mb-6">
        <BinaryText>Tokenomics</BinaryText>
      </h2>
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/30 px-4 py-2">
          <h3 className="font-mono font-bold">$SHOJO Token Overview</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="font-mono">
                <BinaryText>SHOJO LABS Token</BinaryText>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Ticker</div>
              <div className="font-mono">
                <BinaryText>$SHOJO</BinaryText>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Network</div>
              <div className="font-mono">
                <BinaryText>Solana</BinaryText>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Contract Address</div>
            <div
              className="flex items-center justify-between p-3 bg-muted/20 rounded border border-border cursor-pointer hover:bg-muted/40 transition-colors"
              onClick={copyToClipboard}
            >
              <code className="font-mono text-sm truncate">
                <BinaryText>{contractAddress}</BinaryText>
              </code>
              <button className="ml-2 p-1 rounded-md hover:bg-accent transition-colors">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

