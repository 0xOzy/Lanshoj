"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility, { passive: true })
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  // Scroll to top function with improved smooth scrolling
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed z-50 bottom-6 right-6 p-3 rounded-full 
        bg-primary text-primary-foreground shadow-lg
        transform transition-all duration-300 ease-in-out
        hover:scale-110 hover:shadow-xl
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
      `}
      aria-label="Back to top"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  )
}

