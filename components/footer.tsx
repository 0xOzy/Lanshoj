import Link from "next/link"
import { Github, Twitter, Send } from "lucide-react"
import { BinaryText } from "./binary-text"

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="https://x.com/ShojoLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/ShojoCo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://t.me/ShojoLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Telegram"
            >
              <Send className="h-5 w-5" />
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              <BinaryText>Privacy & Security</BinaryText>
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SHOJO LABS. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

