import type React from "react"
import { Plus_Jakarta_Sans } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus-jakarta-sans",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Multi-Agent E-commerce Autopilot</title>
        <meta name="description" content="Multi-Agent E-commerce Autopilot Dashboard" />
      </head>
      <body className={cn("min-h-screen antialiased", plusJakartaSans.variable, plusJakartaSans.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
