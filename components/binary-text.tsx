"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"

interface BinaryTextProps {
  children: React.ReactNode
  className?: string
}

export function BinaryText({ children, className = "" }: BinaryTextProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [displayText, setDisplayText] = useState<string>("")
  const originalText = useRef<string>("")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Store the original text on first render
  useEffect(() => {
    if (typeof children === "string") {
      originalText.current = children
      setDisplayText(children)
    } else if (React.isValidElement(children)) {
      const childText = React.Children.toArray(children.props.children).join("")
      originalText.current = childText
      setDisplayText(childText)
    }
  }, [children])

  // Handle hover effect with improved animation
  useEffect(() => {
    if (!isHovering || !originalText.current) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      setDisplayText(originalText.current)
      return
    }

    let iteration = 0
    const maxIterations = originalText.current.length * 2
    const iterationStep = 0.5 // Smaller step for smoother animation

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Use requestAnimationFrame for smoother animation
    const animate = () => {
      setDisplayText(
        originalText.current
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return originalText.current[index]
            }
            return Math.random() > 0.5 ? "0" : "1"
          })
          .join(""),
      )

      iteration += iterationStep

      if (iteration < maxIterations) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayText(originalText.current)
      }
    }

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovering])

  return (
    <span
      className={`inline-block ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {displayText}
    </span>
  )
}

