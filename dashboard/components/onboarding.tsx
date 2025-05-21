"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Info, Zap, Cpu, Network, BarChart3, Lock, Code, Layers } from "lucide-react"
import { Logo } from "@/components/logo"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type OnboardingProps = {
  onStrategyGenerated: (strategy: any) => void
  onStartAutopilot: () => void
}

type Step = {
  id: number
  title: string
  description?: string
  options: Array<{
    value: string
    label: string
    description?: string
    icon?: React.ReactNode
  }>
  multiSelect?: boolean
  textInput?: boolean
  placeholder?: string
  category?: string
}

const steps: Step[] = [
  {
    id: 1,
    title: "What product categories do you sell?",
    description: "Select all product categories that apply to your business",
    options: [
      { value: "apparel", label: "Apparel & Fashion", description: "Clothing, shoes, accessories, jewelry" },
      { value: "electronics", label: "Electronics & Gadgets", description: "Computers, phones, smart devices" },
      { value: "home", label: "Home & Furniture", description: "Furniture, decor, kitchen, garden" },
      { value: "beauty", label: "Beauty & Personal Care", description: "Cosmetics, skincare, haircare" },
      { value: "food", label: "Food & Beverages", description: "Groceries, specialty foods, drinks" },
      { value: "health", label: "Health & Wellness", description: "Supplements, fitness equipment" },
      { value: "toys", label: "Toys & Games", description: "Children's toys, board games, puzzles" },
      { value: "sports", label: "Sports & Outdoors", description: "Athletic gear, camping, outdoor recreation" },
      { value: "books", label: "Books & Media", description: "Books, e-books, music, movies" },
      { value: "art", label: "Art & Collectibles", description: "Artwork, collectibles, antiques" },
      { value: "pets", label: "Pet Supplies", description: "Pet food, toys, accessories" },
      { value: "auto", label: "Automotive", description: "Car parts, accessories, tools" },
    ],
    multiSelect: true,
  },
  {
    id: 2,
    title: "What type of e-commerce platform do you use?",
    description: "Select your primary e-commerce platform",
    options: [
      { value: "shopify", label: "Shopify" },
      { value: "woocommerce", label: "WooCommerce" },
      { value: "magento", label: "Magento" },
      { value: "bigcommerce", label: "BigCommerce" },
      { value: "custom", label: "Custom-built Platform" },
      { value: "amazon", label: "Amazon Marketplace" },
      { value: "ebay", label: "eBay" },
      { value: "etsy", label: "Etsy" },
      { value: "walmart", label: "Walmart Marketplace" },
      { value: "multi", label: "Multiple Platforms" },
    ],
  },
  {
    id: 3,
    title: "Target monthly GMV?",
    description: "What is your target monthly Gross Merchandise Value?",
    options: [
      { value: "below10k", label: "Below $10K", description: "Early stage or small business" },
      { value: "10k-50k", label: "$10K-$50K", description: "Growing small business" },
      { value: "50k-100k", label: "$50K-$100K", description: "Established small business" },
      { value: "100k-500k", label: "$100K-$500K", description: "Medium-sized business" },
      { value: "500k-1m", label: "$500K-$1M", description: "Large business" },
      { value: "above1m", label: "Above $1M", description: "Enterprise level" },
    ],
  },
  {
    id: 4,
    title: "Main pain points?",
    description: "What are your biggest challenges in e-commerce?",
    options: [
      { value: "traffic", label: "Traffic Acquisition", description: "Difficulty attracting visitors to your store" },
      { value: "conversion", label: "Conversion Rate", description: "Visitors not converting to customers" },
      { value: "retention", label: "Customer Retention", description: "Difficulty keeping customers coming back" },
      { value: "fulfillment", label: "Order Fulfillment", description: "Shipping, delivery, and logistics issues" },
      {
        value: "inventory",
        label: "Inventory Management",
        description: "Stock tracking, forecasting, and optimization",
      },
      { value: "customer_service", label: "Customer Service", description: "Support ticket volume and response time" },
      { value: "pricing", label: "Pricing Strategy", description: "Determining optimal pricing" },
      { value: "marketing", label: "Marketing Effectiveness", description: "ROI on marketing campaigns" },
      { value: "competition", label: "Competitive Pressure", description: "Standing out in a crowded market" },
      { value: "tech", label: "Technical Issues", description: "Website performance, integrations" },
      { value: "analytics", label: "Data Analysis", description: "Making sense of business data" },
      { value: "scaling", label: "Scaling Operations", description: "Growing while maintaining quality" },
    ],
    multiSelect: true,
  },
  {
    id: 5,
    title: "Average order value range?",
    description: "What is your typical order value?",
    options: [
      { value: "below15", label: "Below $15", description: "Low-cost items, high volume" },
      { value: "15-50", label: "$15-$50", description: "Moderate price point" },
      { value: "50-80", label: "$50-$80", description: "Mid-range products" },
      { value: "80-150", label: "$80-$150", description: "Premium products" },
      { value: "150-300", label: "$150-$300", description: "High-value items" },
      { value: "above300", label: "Above $300", description: "Luxury or specialized products" },
    ],
  },
  {
    id: 6,
    title: "Primary marketing channels?",
    description: "Which marketing channels are most important to your business?",
    options: [
      { value: "social", label: "Social Media", description: "Facebook, Instagram, TikTok, etc." },
      { value: "search", label: "Search Engine Marketing", description: "Google Ads, Bing Ads" },
      { value: "seo", label: "SEO", description: "Organic search traffic" },
      { value: "email", label: "Email Marketing", description: "Newsletters, promotional emails" },
      { value: "content", label: "Content Marketing", description: "Blogs, videos, guides" },
      { value: "influencer", label: "Influencer Marketing", description: "Partnerships with influencers" },
      { value: "affiliate", label: "Affiliate Marketing", description: "Commission-based partnerships" },
      { value: "pr", label: "PR & Media", description: "Press releases, media coverage" },
      { value: "direct", label: "Direct Mail", description: "Physical mail campaigns" },
      { value: "events", label: "Events & Trade Shows", description: "In-person marketing" },
    ],
    multiSelect: true,
  },
  {
    id: 7,
    title: "Target audience markets?",
    description: "Where are your customers located?",
    options: [
      { value: "domestic", label: "Domestic Only", description: "Single country focus" },
      { value: "north_america", label: "North America", description: "US, Canada, Mexico" },
      { value: "europe", label: "Europe", description: "EU countries, UK" },
      { value: "asia_pacific", label: "Asia-Pacific", description: "China, Japan, Australia, etc." },
      { value: "latin_america", label: "Latin America", description: "Brazil, Argentina, etc." },
      { value: "middle_east", label: "Middle East & Africa", description: "UAE, Saudi Arabia, South Africa, etc." },
      { value: "global", label: "Global", description: "Worldwide customer base" },
    ],
    multiSelect: true,
    textInput: true,
    placeholder: "Enter specific countries or regions...",
  },
  {
    id: 8,
    title: "Customer service approach?",
    description: "How do you handle customer service?",
    options: [
      { value: "email_only", label: "Email Support Only", description: "Email-based customer service" },
      { value: "chat", label: "Live Chat", description: "Real-time chat support" },
      { value: "phone", label: "Phone Support", description: "Call center or phone-based support" },
      { value: "self_service", label: "Self-Service", description: "FAQs, knowledge base" },
      { value: "social_support", label: "Social Media Support", description: "Support via social platforms" },
      { value: "omnichannel", label: "Omnichannel Support", description: "Integrated across multiple channels" },
      { value: "outsourced", label: "Outsourced Support", description: "Third-party customer service" },
      { value: "minimal", label: "Minimal Support", description: "Basic or limited support options" },
    ],
  },
  {
    id: 9,
    title: "Inventory management needs?",
    description: "What are your inventory management requirements?",
    options: [
      { value: "basic", label: "Basic Tracking", description: "Simple stock counts" },
      { value: "forecasting", label: "Demand Forecasting", description: "Predicting future inventory needs" },
      { value: "multi_location", label: "Multi-location", description: "Managing inventory across locations" },
      { value: "dropshipping", label: "Dropshipping", description: "Third-party fulfillment" },
      { value: "just_in_time", label: "Just-in-time", description: "Minimal inventory holding" },
      { value: "seasonal", label: "Seasonal Planning", description: "Managing seasonal fluctuations" },
      { value: "batch", label: "Batch & Expiry Tracking", description: "For perishable or dated items" },
      { value: "automated", label: "Automated Replenishment", description: "Automatic reordering" },
    ],
    multiSelect: true,
  },
  {
    id: 10,
    title: "Desired automation depth?",
    description: "How much automation do you want in your e-commerce operations?",
    options: [
      {
        value: "basic_monitoring",
        label: "Basic Monitoring",
        description: "Agents provide insights but decisions remain manual",
      },
      {
        value: "semi_automated",
        label: "Semi-Automated",
        description: "Agents suggest actions for human approval",
      },
      {
        value: "mostly_automated",
        label: "Mostly Automated",
        description: "Agents handle routine tasks with human oversight for exceptions",
      },
      {
        value: "fully_automated",
        label: "Fully Automated",
        description: "Agents make and execute decisions with minimal human intervention",
      },
      {
        value: "advanced_ai",
        label: "Advanced AI Decision Making",
        description: "AI-driven strategic decisions and autonomous optimization",
      },
    ],
  },
  {
    id: 11,
    title: "Data analysis priorities?",
    description: "What data insights are most valuable to your business?",
    options: [
      { value: "sales_trends", label: "Sales Trends", description: "Patterns in sales performance" },
      { value: "customer_behavior", label: "Customer Behavior", description: "How customers interact with your store" },
      { value: "product_performance", label: "Product Performance", description: "Which products sell best" },
      { value: "marketing_roi", label: "Marketing ROI", description: "Return on marketing investments" },
      { value: "inventory_optimization", label: "Inventory Optimization", description: "Stock level efficiency" },
      { value: "pricing_analysis", label: "Pricing Analysis", description: "Optimal price points" },
      { value: "customer_lifetime", label: "Customer Lifetime Value", description: "Long-term customer worth" },
      { value: "competitive_analysis", label: "Competitive Analysis", description: "Market position vs competitors" },
      { value: "predictive_analytics", label: "Predictive Analytics", description: "Forecasting future trends" },
    ],
    multiSelect: true,
  },
  {
    id: 12,
    title: "Business growth stage?",
    description: "What stage is your e-commerce business in?",
    options: [
      { value: "startup", label: "Startup", description: "New business, establishing market presence" },
      { value: "growth", label: "Growth", description: "Expanding customer base and sales" },
      { value: "established", label: "Established", description: "Stable business with consistent sales" },
      { value: "scaling", label: "Scaling", description: "Rapidly expanding operations" },
      { value: "enterprise", label: "Enterprise", description: "Large, complex operations" },
      { value: "transformation", label: "Digital Transformation", description: "Traditional business moving online" },
    ],
  },
]

// Agent types and data
type AgentType = {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  capabilities: string[]
  techStack: string[]
  synergy: string[]
  optimizationFocus: string[]
}

const agentTypes: AgentType[] = [
  {
    id: "seo",
    name: "SEO Optimization Agent",
    description: "Optimizes search engine visibility through keyword analysis and content strategy",
    icon: <Network className="w-5 h-5 text-[#3ABFF8]" />,
    capabilities: ["Content analysis", "SERP position tracking", "Competitor analysis", "Search intent optimization"],
    techStack: ["Natural language processing", "Predictive analytics", "Graph analysis", "Vector embedding"],
    synergy: ["social", "content", "analytics"],
    optimizationFocus: ["Organic traffic", "Domain authority", "Content relevance"],
  },
  {
    id: "social",
    name: "Social Media Management Agent",
    description: "Manages social media presence with automated content scheduling and engagement tracking",
    icon: <Zap className="w-5 h-5 text-[#FB7185]" />,
    capabilities: [
      "Multi-platform publishing",
      "Engagement analytics",
      "Content performance tracking",
      "Audience sentiment analysis",
    ],
    techStack: ["Content analysis", "Temporal analytics", "Machine learning", "Sentiment analysis"],
    synergy: ["seo", "content", "customer"],
    optimizationFocus: ["Brand awareness", "Community engagement", "Content performance"],
  },
  {
    id: "conversion",
    name: "Conversion Rate Optimization Agent",
    description: "Improves conversion paths through behavioral analysis and A/B testing",
    icon: <BarChart3 className="w-5 h-5 text-[#34D399]" />,
    capabilities: ["Conversion tracking", "A/B testing", "Funnel analysis", "Personalization"],
    techStack: ["Statistical analysis", "Testing algorithms", "Behavioral analytics", "Decision trees"],
    synergy: ["pricing", "customer", "analytics"],
    optimizationFocus: ["Conversion rate", "Average order value", "Checkout completion"],
  },
  {
    id: "customer",
    name: "Customer Service Agent",
    description: "Automates customer support with contextual understanding and knowledge management",
    icon: <Cpu className="w-5 h-5 text-[#A78BFA]" />,
    capabilities: ["Intent recognition", "Response generation", "Knowledge base management", "Issue prediction"],
    techStack: ["Language models", "Conversation analysis", "Knowledge management", "Sentiment analysis"],
    synergy: ["social", "retention", "analytics"],
    optimizationFocus: ["Response time", "Resolution rate", "Customer satisfaction"],
  },
  {
    id: "inventory",
    name: "Inventory Management Agent",
    description: "Optimizes stock levels with demand forecasting and automated reordering",
    icon: <Layers className="w-5 h-5 text-[#F59E0B]" />,
    capabilities: ["Demand forecasting", "Supply chain optimization", "Reorder automation", "Seasonal trend analysis"],
    techStack: ["Time series analysis", "Predictive modeling", "Optimization algorithms", "Pattern recognition"],
    synergy: ["pricing", "analytics", "fulfillment"],
    optimizationFocus: ["Stock turnover", "Carrying costs", "Stockout prevention"],
  },
  {
    id: "analytics",
    name: "Data Analytics Agent",
    description: "Provides business intelligence with comprehensive data analysis and reporting",
    icon: <Code className="w-5 h-5 text-[#60A5FA]" />,
    capabilities: ["Anomaly detection", "Correlation analysis", "Performance forecasting", "Strategic insights"],
    techStack: ["Advanced analytics", "Data visualization", "Machine learning", "Explanatory AI"],
    synergy: ["seo", "conversion", "pricing"],
    optimizationFocus: ["Data-driven decisions", "Business intelligence", "Strategic planning"],
  },
  {
    id: "pricing",
    name: "Dynamic Pricing Agent",
    description: "Optimizes pricing strategy based on market conditions and competitive analysis",
    icon: <Lock className="w-5 h-5 text-[#F43F5E]" />,
    capabilities: [
      "Competitor price monitoring",
      "Price elasticity analysis",
      "Profit margin optimization",
      "Promotion impact analysis",
    ],
    techStack: ["Economic modeling", "Statistical analysis", "Optimization algorithms", "Machine learning"],
    synergy: ["conversion", "inventory", "analytics"],
    optimizationFocus: ["Profit margins", "Market competitiveness", "Revenue optimization"],
  },
]

// Radar chart component for optimization potential
const RadarChart = ({ data }: { data: { area: string; value: number }[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const size = 300
  const centerX = size / 2
  const centerY = size / 2
  const radius = size * 0.4

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw background
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fill()

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius * i) / 3, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw axes
    const angleStep = (Math.PI * 2) / data.length
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.lineWidth = 1
    data.forEach((_, i) => {
      const angle = i * angleStep - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
      ctx.stroke()

      // Draw labels
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const labelX = centerX + Math.cos(angle) * (radius + 15)
      const labelY = centerY + Math.sin(angle) * (radius + 15)
      ctx.fillText(data[i].area, labelX, labelY)
    })

    // Draw data
    ctx.fillStyle = "rgba(35, 124, 255, 0.2)"
    ctx.strokeStyle = "rgba(35, 124, 255, 0.8)"
    ctx.lineWidth = 2
    ctx.beginPath()
    data.forEach((d, i) => {
      const angle = i * angleStep - Math.PI / 2
      const value = d.value / 100
      const pointX = centerX + Math.cos(angle) * radius * value
      const pointY = centerY + Math.sin(angle) * radius * value
      if (i === 0) {
        ctx.moveTo(pointX, pointY)
      } else {
        ctx.lineTo(pointX, pointY)
      }
    })
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Draw points
    ctx.fillStyle = "#237CFF"
    data.forEach((d, i) => {
      const angle = i * angleStep - Math.PI / 2
      const value = d.value / 100
      const pointX = centerX + Math.cos(angle) * radius * value
      const pointY = centerY + Math.sin(angle) * radius * value
      ctx.beginPath()
      ctx.arc(pointX, pointY, 4, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [data])

  return <canvas ref={canvasRef} width={size} height={size} className="mx-auto" />
}

// Agent network visualization
const AgentNetworkGraph = ({ agents }: { agents: AgentType[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const size = 300
  const centerX = size / 2
  const centerY = size / 2
  const radius = size * 0.35

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Calculate positions (circular layout)
    const positions: { [key: string]: { x: number; y: number } } = {}
    const angleStep = (Math.PI * 2) / agents.length

    agents.forEach((agent, i) => {
      const angle = i * angleStep
      positions[agent.id] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      }
    })

    // Draw connections based on synergy
    ctx.strokeStyle = "rgba(35, 124, 255, 0.3)"
    ctx.lineWidth = 1

    agents.forEach((agent) => {
      const pos = positions[agent.id]
      agent.synergy.forEach((targetId) => {
        if (positions[targetId]) {
          const targetPos = positions[targetId]
          ctx.beginPath()
          ctx.moveTo(pos.x, pos.y)
          ctx.lineTo(targetPos.x, targetPos.y)
          ctx.stroke()
        }
      })
    })

    // Draw nodes
    agents.forEach((agent) => {
      const pos = positions[agent.id]

      // Node background
      ctx.fillStyle = "rgba(35, 124, 255, 0.2)"
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2)
      ctx.fill()

      // Node border
      ctx.strokeStyle = "rgba(35, 124, 255, 0.8)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2)
      ctx.stroke()

      // Node label
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.font = "9px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(agent.id.toUpperCase(), pos.x, pos.y)
    })
  }, [agents])

  return <canvas ref={canvasRef} width={size} height={size} className="mx-auto" />
}

// KPI projection chart
const KPIProjectionChart = ({ kpis }: { kpis: { name: string; target: string; timeframe: string }[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const width = 500
  const height = 200
  const padding = 40

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.lineWidth = 1

    // X axis
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Y axis
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Parse KPI targets to get numeric values
    const kpiValues = kpis.map((kpi) => {
      const match = kpi.target.match(/([+-])(\d+)%/)
      if (match) {
        const sign = match[1] === "+" ? 1 : -1
        return sign * Number.parseInt(match[2])
      }
      return 0
    })

    // Draw bars
    const barWidth = (width - 2 * padding) / kpis.length - 10
    const maxValue = Math.max(...kpiValues.map((v) => Math.abs(v)))

    kpis.forEach((kpi, i) => {
      const value = kpiValues[i]
      const barHeight = (Math.abs(value) / maxValue) * (height - 2 * padding - 20)
      const x = padding + i * (barWidth + 10) + 5

      // Bar
      ctx.fillStyle = value >= 0 ? "rgba(52, 211, 153, 0.7)" : "rgba(251, 113, 133, 0.7)"

      if (value >= 0) {
        // Positive bar (goes up)
        const y = height - padding - barHeight
        ctx.fillRect(x, y, barWidth, barHeight)
      } else {
        // Negative bar (goes down)
        const y = height - padding
        ctx.fillRect(x, y, barWidth, barHeight)
      }

      // Label
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // KPI name
      ctx.fillText(kpi.name, x + barWidth / 2, height - padding + 15)

      // Target value
      const targetY = value >= 0 ? height - padding - barHeight - 15 : height - padding + barHeight + 15
      ctx.fillText(kpi.target, x + barWidth / 2, targetY)

      // Timeframe
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
      ctx.font = "8px sans-serif"
      ctx.fillText(kpi.timeframe, x + barWidth / 2, height - padding + 25)
    })
  }, [kpis])

  return <canvas ref={canvasRef} width={width} height={height} className="mx-auto" />
}

export function Onboarding({ onStrategyGenerated, onStartAutopilot }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string[]>>({})
  const [showSummary, setShowSummary] = useState(false)
  const [textInputs, setTextInputs] = useState<Record<number, string>>({})
  const [selectedAgents, setSelectedAgents] = useState<AgentType[]>([])
  const [optimizationPotential, setOptimizationPotential] = useState<{ area: string; value: number }[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "agents" | "projections">("overview")

  const handleOptionSelect = (option: string) => {
    const step = steps[currentStep]

    if (step.multiSelect) {
      // For multi-select, toggle the option
      setAnswers((prev) => {
        const current = prev[step.id] || []
        if (current.includes(option)) {
          return { ...prev, [step.id]: current.filter((o) => o !== option) }
        } else {
          return { ...prev, [step.id]: [...current, option] }
        }
      })
    } else {
      // For single select, just set the option
      setAnswers((prev) => ({ ...prev, [step.id]: [option] }))

      // Auto advance to next step after selection
      if (currentStep < steps.length - 1) {
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1)
        }, 300)
      }
    }
  }

  const handleTextInputChange = (stepId: number, value: string) => {
    setTextInputs((prev) => ({ ...prev, [stepId]: value }))
  }

  const handleTextInputSubmit = (stepId: number) => {
    if (textInputs[stepId]?.trim()) {
      setAnswers((prev) => {
        const current = prev[stepId] || []
        if (!current.includes(textInputs[stepId])) {
          return { ...prev, [stepId]: [...current, textInputs[stepId]] }
        }
        return prev
      })
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      generateStrategy()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const generateStrategy = () => {
    // Select agents based on answers
    const painPoints = answers[4] || []
    const recommendedAgents: AgentType[] = []

    // Map pain points to agent types
    if (painPoints.includes("traffic")) {
      recommendedAgents.push(agentTypes.find((a) => a.id === "seo")!)
    }

    if (painPoints.includes("conversion")) {
      recommendedAgents.push(agentTypes.find((a) => a.id === "conversion")!)
    }

    if (painPoints.includes("customer_service")) {
      recommendedAgents.push(agentTypes.find((a) => a.id === "customer")!)
    }

    if (painPoints.includes("inventory")) {
      recommendedAgents.push(agentTypes.find((a) => a.id === "inventory")!)
    }

    if (painPoints.includes("analytics")) {
      recommendedAgents.push(agentTypes.find((a) => a.id === "analytics")!)
    }

    if (painPoints.includes("pricing")) {
      recommendedAgents.push(agentTypes.find((a) => a.id === "pricing")!)
    }

    if (painPoints.includes("marketing")) {
      recommendedAgents.push(agentTypes.find((a) => a.id === "social")!)
    }

    // Ensure we have at least 3 agents
    const essentialAgents = ["seo", "conversion", "analytics"]
    essentialAgents.forEach((agentId) => {
      if (!recommendedAgents.some((a) => a.id === agentId)) {
        recommendedAgents.push(agentTypes.find((a) => a.id === agentId)!)
      }
    })

    // Limit to 5 agents maximum
    setSelectedAgents(recommendedAgents.slice(0, 5))

    // Generate optimization potential data
    setOptimizationPotential([
      { area: "Traffic", value: 85 },
      { area: "Conversion", value: 70 },
      { area: "Retention", value: 65 },
      { area: "Efficiency", value: 80 },
      { area: "Revenue", value: 75 },
      { area: "Scalability", value: 60 },
    ])

    // Mock strategy generation
    const mockStrategy = {
      painPoints: [
        "Difficulty acquiring traffic",
        "Low conversion rate",
        "Slow customer service response",
        "Inventory management inefficiencies",
        "Data analysis challenges",
      ],
      recommendations: recommendedAgents.map((a) => a.name),
      kpis: [
        { name: "Traffic", target: "+30%", timeframe: "3 months" },
        { name: "Conversion Rate", target: "+15%", timeframe: "2 months" },
        { name: "Customer Service Response Time", target: "-50%", timeframe: "1 month" },
        { name: "Inventory Turnover", target: "+20%", timeframe: "4 months" },
        { name: "Customer Retention", target: "+25%", timeframe: "6 months" },
      ],
    }

    onStrategyGenerated(mockStrategy)
    setShowSummary(true)
  }

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const hasSelectedOption = currentStepData && answers[currentStepData.id]?.length > 0

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <motion.div
        className="w-[80%] bg-[#0B0E17]/70 backdrop-blur-[25px] rounded-3xl border border-white/10 shadow-lg overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Logo className="w-10 h-10" />
            <h1 className="text-3xl font-semibold tracking-tight">Launch Your Multi-Agent E-commerce Autopilot</h1>
          </div>

          <AnimatePresence mode="wait">
            {!showSummary ? (
              <motion.div
                key="steps"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2 text-sm text-white/60">
                  <span>
                    Step {currentStep + 1}/{steps.length}
                  </span>
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#237CFF]"
                      initial={{ width: `${(currentStep / steps.length) * 100}%` }}
                      animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <div className="min-h-[300px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-medium">{currentStepData.title}</h2>
                        {currentStepData.description && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info size={16} className="text-white/60 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{currentStepData.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>

                      {currentStepData.multiSelect && (
                        <div className="text-sm text-white/60 mb-4">
                          <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 11L12 14L20 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M20 12V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            You can select multiple options
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        {currentStepData.options.map((option) => {
                          const isSelected = answers[currentStepData.id]?.includes(option.value)

                          return (
                            <motion.button
                              key={option.value}
                              className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                                isSelected
                                  ? "border-[#237CFF] bg-[#237CFF]/10"
                                  : "border-white/10 hover:border-white/30"
                              }`}
                              onClick={() => handleOptionSelect(option.value)}
                              whileHover={{ y: -4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex flex-col gap-1">
                                <span className="font-medium">{option.label}</span>
                                {option.description && (
                                  <span className="text-sm text-white/60">{option.description}</span>
                                )}
                              </div>
                            </motion.button>
                          )
                        })}
                      </div>

                      {currentStepData.textInput && (
                        <div className="mt-6">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={textInputs[currentStepData.id] || ""}
                              onChange={(e) => handleTextInputChange(currentStepData.id, e.target.value)}
                              placeholder={currentStepData.placeholder || "Enter custom option..."}
                              className="flex-1 px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-[#237CFF]/50 outline-none transition-colors"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleTextInputSubmit(currentStepData.id)
                                  setTextInputs((prev) => ({ ...prev, [currentStepData.id]: "" }))
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                handleTextInputSubmit(currentStepData.id)
                                setTextInputs((prev) => ({ ...prev, [currentStepData.id]: "" }))
                              }}
                              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                            >
                              Add
                            </button>
                          </div>

                          {answers[currentStepData.id]?.filter(
                            (ans) => !currentStepData.options.map((o) => o.value).includes(ans),
                          ).length > 0 && (
                            <div className="mt-4 space-y-2">
                              <div className="text-sm text-white/60">Custom options:</div>
                              <div className="flex flex-wrap gap-2">
                                {answers[currentStepData.id]
                                  ?.filter((ans) => !currentStepData.options.map((o) => o.value).includes(ans))
                                  .map((customOption) => (
                                    <div
                                      key={customOption}
                                      className="px-3 py-1.5 rounded-full bg-[#237CFF]/10 border border-[#237CFF]/30 flex items-center gap-1"
                                    >
                                      {customOption}
                                      <button
                                        className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                                        onClick={() => {
                                          setAnswers((prev) => ({
                                            ...prev,
                                            [currentStepData.id]: prev[currentStepData.id].filter(
                                              (o) => o !== customOption,
                                            ),
                                          }))
                                        }}
                                      >
                                        <svg
                                          width="8"
                                          height="8"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M18 6L6 18M6 6L18 18"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    onClick={() => setCurrentStep(steps.length - 1)}
                    className="px-4 py-2 rounded-full text-white/70 hover:text-white transition-colors"
                  >
                    Skip
                  </button>

                  {currentStepData?.multiSelect ? (
                    <button
                      onClick={handleNext}
                      className={`px-6 py-2 rounded-full bg-[#237CFF] text-white font-medium transition-all duration-300 ${
                        hasSelectedOption ? "opacity-100" : "opacity-70"
                      }`}
                      disabled={!hasSelectedOption}
                    >
                      {isLastStep ? "Generate Base Strategy" : "Next"}
                      {!isLastStep && <ChevronRight size={16} className="ml-1 inline" />}
                    </button>
                  ) : (
                    isLastStep && (
                      <button
                        onClick={generateStrategy}
                        className="px-6 py-2 rounded-full bg-[#237CFF] text-white font-medium transition-all duration-300"
                      >
                        Generate Base Strategy
                      </button>
                    )
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="py-4"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-medium mb-4">
                    <span className="text-gradient bg-gradient-to-r from-[#3ABFF8] to-[#237CFF]">
                      Multi-Agent Strategy Summary
                    </span>
                  </h2>

                  <div className="flex border-b border-white/10">
                    <button
                      className={`px-4 py-2 ${
                        activeTab === "overview" ? "border-b-2 border-[#237CFF] text-white" : "text-white/60"
                      }`}
                      onClick={() => setActiveTab("overview")}
                    >
                      Overview
                    </button>
                    <button
                      className={`px-4 py-2 ${
                        activeTab === "agents" ? "border-b-2 border-[#237CFF] text-white" : "text-white/60"
                      }`}
                      onClick={() => setActiveTab("agents")}
                    >
                      Agent Configuration
                    </button>
                    <button
                      className={`px-4 py-2 ${
                        activeTab === "projections" ? "border-b-2 border-[#237CFF] text-white" : "text-white/60"
                      }`}
                      onClick={() => setActiveTab("projections")}
                    >
                      KPI Projections
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-2 gap-8"
                    >
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-[#F5C66F]">Pain Points Analysis</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C66F] mt-2" />
                            <span>Difficulty acquiring traffic</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C66F] mt-2" />
                            <span>Low conversion rate</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C66F] mt-2" />
                            <span>Slow customer service response</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C66F] mt-2" />
                            <span>Inventory management inefficiencies</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C66F] mt-2" />
                            <span>Data analysis challenges</span>
                          </li>
                        </ul>

                        <div className="mt-8">
                          <h3 className="text-lg font-medium mb-4 text-[#3ABFF8]">Optimization Potential</h3>
                          <RadarChart data={optimizationPotential} />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4 text-[#237CFF]">Agent System Configuration</h3>

                        <div className="space-y-4">
                          {selectedAgents.map((agent) => (
                            <div
                              key={agent.id}
                              className="p-3 rounded-lg border border-white/10 bg-gradient-to-r from-black/30 to-[#237CFF]/10"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 rounded-full bg-[#237CFF]/20 flex items-center justify-center">
                                  {agent.icon}
                                </div>
                                <h4 className="font-medium">{agent.name}</h4>
                              </div>
                              <p className="text-sm text-white/70 mb-2">{agent.description}</p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 p-3 rounded-lg border border-white/10 bg-black/20">
                          <div className="text-xs text-white/60 uppercase tracking-wider mb-1">
                            System Initialization
                          </div>
                          <div className="font-mono text-xs text-white/80 bg-black/30 p-2 rounded">
                            <div>$ initialize_agent_system --agents={selectedAgents.length}</div>
                            <div>$ configure_integration --level=advanced</div>
                            <div>$ deploy_optimization --target=e-commerce</div>
                            <div className="text-[#3ABFF8]">{">"} System ready. Awaiting activation...</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "agents" && (
                    <motion.div
                      key="agents"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-medium mb-4 text-[#237CFF]">Agent Integration Network</h3>
                          <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                            <AgentNetworkGraph agents={selectedAgents} />
                          </div>
                          <div className="mt-4 text-sm text-white/70 text-center">
                            Agent communication and data flow pathways
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4 text-[#237CFF]">Agent Technical Specifications</h3>
                          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {selectedAgents.map((agent) => (
                              <div key={agent.id} className="p-4 rounded-xl border border-white/10 bg-black/30">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-8 h-8 rounded-full bg-[#237CFF]/20 flex items-center justify-center">
                                    {agent.icon}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{agent.name}</h4>
                                    <div className="text-xs text-white/60">
                                      ID: {agent.id.toUpperCase()}-
                                      {Math.floor(Math.random() * 1000)
                                        .toString()
                                        .padStart(3, "0")}
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <div className="text-xs text-white/60 uppercase tracking-wider mb-1">
                                    Core Capabilities
                                  </div>
                                  <ul className="grid grid-cols-2 gap-1">
                                    {agent.capabilities.map((cap, i) => (
                                      <li key={i} className="text-sm flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-[#3ABFF8]" />
                                        <span>{cap}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="mb-3">
                                  <div className="text-xs text-white/60 uppercase tracking-wider mb-1">
                                    Technology Stack
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {agent.techStack.map((tech, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-0.5 text-xs rounded-full bg-[#237CFF]/20 border border-[#237CFF]/30"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-xs text-white/60 uppercase tracking-wider mb-1">
                                    Optimization Focus
                                  </div>
                                  <ul className="space-y-1">
                                    {agent.optimizationFocus.map((focus, i) => (
                                      <li key={i} className="text-sm flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-[#F5C66F]" />
                                        <span>{focus}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                        <h3 className="text-lg font-medium mb-3 text-[#237CFF]">System Integration Architecture</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-3 rounded-lg bg-black/20">
                            <div className="text-xs text-white/60 uppercase tracking-wider mb-1">
                              Data Flow Architecture
                            </div>
                            <div className="text-sm">
                              Bidirectional data pathways with real-time synchronization for efficient agent
                              communication
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-black/20">
                            <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Decision System</div>
                            <div className="text-sm">
                              Probabilistic model with reinforcement learning and adaptive weighting based on
                              performance
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-black/20">
                            <div className="text-xs text-white/60 uppercase tracking-wider mb-1">
                              Execution Framework
                            </div>
                            <div className="text-sm">
                              Parallel processing with distributed tasks and fault-tolerant recovery mechanisms
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "projections" && (
                    <motion.div
                      key="projections"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-[#237CFF]">KPI Projection Analysis</h3>
                        <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                          <KPIProjectionChart
                            kpis={[
                              { name: "Traffic", target: "+30%", timeframe: "3 months" },
                              { name: "Conversion Rate", target: "+15%", timeframe: "2 months" },
                              { name: "Response Time", target: "-50%", timeframe: "1 month" },
                              { name: "Inventory Turnover", target: "+20%", timeframe: "4 months" },
                              { name: "Customer Retention", target: "+25%", timeframe: "6 months" },
                            ]}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-medium mb-4 text-[#F5C66F]">Implementation Timeline</h3>
                          <div className="space-y-4">
                            <div className="p-3 rounded-lg border border-white/10 bg-black/20">
                              <div className="flex justify-between items-center mb-2">
                                <div className="font-medium">Phase 1: Initialization</div>
                                <div className="text-sm text-white/60">Week 1-2</div>
                              </div>
                              <div className="text-sm">
                                System setup, data integration, and agent calibration. Initial learning phase with
                                supervised training.
                              </div>
                            </div>

                            <div className="p-3 rounded-lg border border-white/10 bg-black/20">
                              <div className="flex justify-between items-center mb-2">
                                <div className="font-medium">Phase 2: Optimization</div>
                                <div className="text-sm text-white/60">Week 3-6</div>
                              </div>
                              <div className="text-sm">
                                Fine-tuning agent parameters, establishing baseline metrics, and implementing initial
                                automation protocols.
                              </div>
                            </div>

                            <div className="p-3 rounded-lg border border-white/10 bg-black/20">
                              <div className="flex justify-between items-center mb-2">
                                <div className="font-medium">Phase 3: Autonomous Operation</div>
                                <div className="text-sm text-white/60">Week 7+</div>
                              </div>
                              <div className="text-sm">
                                Full deployment with continuous learning, self-optimization, and adaptive
                                decision-making.
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4 text-[#3ABFF8]">Resource Allocation</h3>
                          <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                            <div className="space-y-3">
                              <div>
                                <div className="text-sm text-white/60 mb-1">Computational Resources</div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Processing Units</span>
                                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#3ABFF8]" style={{ width: "70%" }} />
                                  </div>
                                  <span className="text-sm font-mono">70%</span>
                                </div>
                              </div>

                              <div>
                                <div className="text-sm text-white/60 mb-1">Data Storage</div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Memory Allocation</span>
                                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#3ABFF8]" style={{ width: "55%" }} />
                                  </div>
                                  <span className="text-sm font-mono">55%</span>
                                </div>
                              </div>

                              <div>
                                <div className="text-sm text-white/60 mb-1">API Bandwidth</div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Integration Channels</span>
                                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#3ABFF8]" style={{ width: "85%" }} />
                                  </div>
                                  <span className="text-sm font-mono">85%</span>
                                </div>
                              </div>

                              <div>
                                <div className="text-sm text-white/60 mb-1">Human Oversight</div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Required Intervention</span>
                                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#3ABFF8]" style={{ width: "25%" }} />
                                  </div>
                                  <span className="text-sm font-mono">25%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8 flex justify-center">
                  <motion.button
                    onClick={onStartAutopilot}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-[#237CFF] to-[#3ABFF8] text-white font-medium"
                    whileHover={{ y: -4, boxShadow: "0 8px 16px rgba(35, 124, 255, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Autopilot
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
