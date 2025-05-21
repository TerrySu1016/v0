"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Onboarding } from "@/components/onboarding"
import Console from "@/components/console"
import { Dashboard } from "@/components/dashboard"
import { TriangleBackground } from "@/components/triangle-background"
import { Logo } from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  const [currentView, setCurrentView] = useState<"onboarding" | "console" | "dashboard">("onboarding")
  const [strategy, setStrategy] = useState<any>(null)

  const handleStrategyGenerated = (strategyData: any) => {
    setStrategy(strategyData)
    // After strategy is generated, we can move to console view
  }

  const handleStartAutopilot = () => {
    setCurrentView("console")
  }

  const handleViewDashboard = () => {
    setCurrentView("dashboard")
  }

  const handleViewConsole = () => {
    setCurrentView("console")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-[#001428] text-gray-900 dark:text-white overflow-hidden relative">
      <TriangleBackground />

      <header className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="w-10 h-10 text-gray-900 dark:text-white" />
          <span className="font-semibold tracking-tight text-lg">Multi-Agent E-commerce Autopilot</span>
        </div>

        <div className="flex items-center gap-4">
          {currentView !== "onboarding" && (
            <nav className="flex gap-4">
              <button
                onClick={handleViewConsole}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm transition-all duration-300",
                  currentView === "console"
                    ? "bg-blue-500 dark:bg-[#237CFF] text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white",
                )}
              >
                Console
              </button>
              <button
                onClick={handleViewDashboard}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm transition-all duration-300",
                  currentView === "dashboard"
                    ? "bg-blue-500 dark:bg-[#237CFF] text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white",
                )}
              >
                Dashboard
              </button>
            </nav>
          )}
          <ModeToggle />
        </div>
      </header>

      <main className="container mx-auto p-4">
        <AnimatePresence mode="wait">
          {currentView === "onboarding" && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Onboarding onStrategyGenerated={handleStrategyGenerated} onStartAutopilot={handleStartAutopilot} />
            </motion.div>
          )}

          {currentView === "console" && (
            <motion.div
              key="console"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Console />
            </motion.div>
          )}

          {currentView === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
