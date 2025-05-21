"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export function TriangleBackground() {
  const { theme } = useTheme()

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Large triangle bottom left */}
      <motion.div
        className="absolute -left-20 bottom-0 w-[600px] h-[600px] opacity-35 blur-[80px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div
          className={`w-full h-full ${theme === "light" ? "bg-blue-300" : "bg-[#237CFF]"} rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]`}
        />
      </motion.div>

      {/* Small triangle top right */}
      <motion.div
        className="absolute right-20 top-20 w-[300px] h-[300px] opacity-35 blur-[60px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
      >
        <div
          className={`w-full h-full ${theme === "light" ? "bg-amber-300" : "bg-[#F5C66F]"} rounded-[30%_70%_40%_60%_/_50%_60%_40%_50%]`}
        />
      </motion.div>
    </div>
  )
}
