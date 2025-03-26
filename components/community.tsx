import { BinaryText } from "./binary-text"
import { MessageSquare, Lock, Shield, Bot, Rocket } from "lucide-react"

export function Community() {
  return (
    <section className="py-12">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-mono font-bold">
          <BinaryText>Shojo AI Chat Community</BinaryText>
        </h2>
        <span className="px-2 py-1 text-xs font-mono bg-primary/20 text-primary rounded-md">Coming Soon</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="border border-border rounded-lg p-5 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-mono font-bold">
              <BinaryText>Decentralized Chat Rooms</BinaryText>
            </h3>
            <p className="text-sm text-muted-foreground">
              Fully blockchain-based discussion platform with no central authority
            </p>
          </div>
        </div>

        <div className="border border-border rounded-lg p-5 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-mono font-bold">
              <BinaryText>Private Rooms</BinaryText>
            </h3>
            <p className="text-sm text-muted-foreground">
              Users can create rooms with custom access controls and permissions
            </p>
          </div>
        </div>

        <div className="border border-border rounded-lg p-5 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-mono font-bold">
              <BinaryText>Anonymity</BinaryText>
            </h3>
            <p className="text-sm text-muted-foreground">
              No KYC, no identity tracking, complete privacy for all users
            </p>
          </div>
        </div>

        <div className="border border-border rounded-lg p-5 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-mono font-bold">
              <BinaryText>AI-Powered Discussions</BinaryText>
            </h3>
            <p className="text-sm text-muted-foreground">
              Shizu AI can provide insights and analysis directly in chat conversations
            </p>
          </div>
        </div>

        <div className="border border-border rounded-lg p-5 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Rocket className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-mono font-bold">
              <BinaryText>Public & Private Rooms</BinaryText>
            </h3>
            <p className="text-sm text-muted-foreground">Open for communities & projects to collaborate securely</p>
          </div>
        </div>
      </div>
    </section>
  )
}

