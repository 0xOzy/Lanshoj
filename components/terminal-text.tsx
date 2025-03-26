"use client"

import { useState, useEffect, useRef } from "react"

interface TerminalTextProps {
  text: string
  typingSpeed?: number
  className?: string
  onComplete?: () => void
}

export function TerminalText({ text, typingSpeed = 50, className = "", onComplete }: TerminalTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const [isTyping, setIsTyping] = useState(true)
  const textIndex = useRef(0)

  // Typing effect
  useEffect(() => {
    if (textIndex.current < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text.charAt(textIndex.current))
        textIndex.current += 1
      }, typingSpeed)

      return () => clearTimeout(timeout)
    } else {
      setIsTyping(false)
      if (onComplete) onComplete()
    }
  }, [displayText, text, typingSpeed, onComplete])

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <div className={`font-mono ${className}`}>
      <span className="text-primary">&gt;</span> {displayText}
      <span
        className={`inline-block w-2 h-4 ml-1 bg-primary ${cursorVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-100`}
        style={{ verticalAlign: "middle" }}
      />
      {!isTyping && <span className="text-muted-foreground text-xs ml-2 animate-pulse">_</span>}
    </div>
  )
}

