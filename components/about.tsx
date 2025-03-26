import { BinaryText } from "./binary-text"
import { Brain, Shield, Zap } from "lucide-react"

export function About() {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-mono font-bold mb-8">
        <BinaryText>About SHOJO LABS</BinaryText>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border border-border rounded-lg p-6 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-mono font-bold">
              <BinaryText>Overview</BinaryText>
            </h3>
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                SHOJO LABS is an <span className="font-semibold text-foreground">AI Research Lab & Community</span>{" "}
                focused on <span className="font-semibold text-foreground">crypto market analysis</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Powered by <span className="font-semibold text-foreground">Cognitive Intelligence</span> &{" "}
                <span className="font-semibold text-foreground">Solana Blockchain</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Features <span className="font-semibold text-foreground">decentralized chat rooms</span> with{" "}
                <span className="font-semibold text-foreground">full anonymity</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-mono font-bold">
              <BinaryText>Core Principles</BinaryText>
            </h3>
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <span className="font-semibold text-foreground">Cognitive AI:</span> Natural interpretation, not just
                pattern recognition
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <span className="font-semibold text-foreground">Decentralization:</span> Built on{" "}
                <span className="font-semibold text-foreground">Solana for speed & security</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <span className="font-semibold text-foreground">Anonymous Chat Rooms:</span> Blockchain-based
                discussions without identity tracking
              </span>
            </li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-mono font-bold">
              <BinaryText>Technology</BinaryText>
            </h3>
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <span className="font-semibold text-foreground">AI Models:</span> Custom-trained on financial data &
                market patterns
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <span className="font-semibold text-foreground">Blockchain Integration:</span> Solana Program Library
                (SPL) & smart contracts
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <span className="font-semibold text-foreground">Data Processing:</span> Real-time analysis of on-chain &
                social data
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

