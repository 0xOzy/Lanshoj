"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X, Home, Info, Zap, MessageSquare, Coins, Map, BarChart2 } from "lucide-react"

export function SideNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")

  // Toggle menu open/closed
  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Close menu when clicking a link (mobile)
  const handleLinkClick = (sectionId: string) => {
    setIsOpen(false)
    setActiveSection(sectionId)

    // Scroll to section with improved smooth scrolling
    const element = document.getElementById(sectionId)
    if (element) {
      // Use scrollIntoView with smooth behavior
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  // Track scroll position to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "market", "about", "features", "roadmap", "community", "tokenomics"]

      // Find the section that is currently in view
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          // If the section is in the viewport
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleMenu}
        className="fixed z-50 bottom-6 left-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg md:hidden"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Side navigation */}
      <nav
        className={`
        fixed z-40 top-0 left-0 h-full bg-background/80 backdrop-blur-md border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        w-64 md:w-16 lg:w-20
      `}
      >
        <div className="flex flex-col items-center h-full py-8">
          <div className="flex flex-col items-center space-y-8 mt-16">
            <NavItem
              icon={<Home />}
              label="Home"
              isActive={activeSection === "hero"}
              onClick={() => handleLinkClick("hero")}
            />
            <NavItem
              icon={<BarChart2 />}
              label="Market"
              isActive={activeSection === "market"}
              onClick={() => handleLinkClick("market")}
            />
            <NavItem
              icon={<Info />}
              label="About"
              isActive={activeSection === "about"}
              onClick={() => handleLinkClick("about")}
            />
            <NavItem
              icon={<Zap />}
              label="Features"
              isActive={activeSection === "features"}
              onClick={() => handleLinkClick("features")}
            />
            <NavItem
              icon={<Map />}
              label="Roadmap"
              isActive={activeSection === "roadmap"}
              onClick={() => handleLinkClick("roadmap")}
            />
            <NavItem
              icon={<MessageSquare />}
              label="Community"
              isActive={activeSection === "community"}
              onClick={() => handleLinkClick("community")}
            />
            <NavItem
              icon={<Coins />}
              label="Tokenomics"
              isActive={activeSection === "tokenomics"}
              onClick={() => handleLinkClick("tokenomics")}
            />
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200
        ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}
      `}
      aria-label={label}
    >
      <div className="w-6 h-6">{icon}</div>
      <span className="text-xs mt-1 hidden md:hidden lg:block">{label}</span>
    </button>
  )
}

