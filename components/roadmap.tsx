"use client"

import { useState } from "react"
import { BinaryText } from "./binary-text"

interface Milestone {
  quarter: string
  year: string
  title: string
  description: string
  status: "completed" | "in-progress" | "upcoming" | "planned"
}

export function Roadmap() {
  const milestones: Milestone[] = [
    {
      quarter: "Q2",
      year: "2025",
      title: "Shojo AI v1.0 Public Access",
      description: "Market Analysis AI",
      status: "completed",
    },
    {
      quarter: "Q3",
      year: "2025",
      title: "Shojo Chat v1.0",
      description: "Decentralized chat integration",
      status: "in-progress",
    },
    {
      quarter: "Q4",
      year: "2025",
      title: "AI Developer Hub",
      description: "API & AI integration tools",
      status: "in-progress",
    },
    {
      quarter: "Q1",
      year: "2026",
      title: "AI Expansion",
      description: "Biological intelligence research",
      status: "planned",
    },
  ]

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-yellow-500"
      case "planned":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-mono font-bold mb-8">
        <BinaryText>Roadmap – Development Milestones</BinaryText>
      </h2>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-ml-0.5"></div>

        <div className="space-y-12">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-4 w-8 h-8 rounded-full border-4 border-background ${getStatusColor(milestone.status)} z-10 flex items-center justify-center md:left-1/2 md:-ml-4`}
              >
                <span className="text-xs font-bold text-white">{milestone.quarter}</span>
              </div>

              {/* Content */}
              <div
                className={`relative ml-16 p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 md:w-5/12 md:ml-0 ${
                  index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                } ${hoveredIndex === index ? "shadow-lg shadow-primary/10 border-primary/30 bg-card/80" : ""}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono text-muted-foreground">{milestone.year}</span>
                  <h3 className="text-xl font-mono font-bold">
                    {hoveredIndex === index ? <BinaryText>{milestone.title}</BinaryText> : milestone.title}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  {hoveredIndex === index ? <BinaryText>{milestone.description}</BinaryText> : milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

