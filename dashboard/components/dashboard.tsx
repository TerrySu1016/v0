"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronRight, Clock, Activity, FileText } from "lucide-react"

type Agent = {
  id: string
  name: string
  avatar: string
  state: "idle" | "running" | "error"
  progress: number
  runningDays: number
  tools: { name: string; lastUsed: string }[]
}

const mockAgents: Agent[] = [
  {
    id: "traffic-agent",
    name: "Traffic Analysis Agent",
    avatar: "T",
    state: "running",
    progress: 78,
    runningDays: 42,
    tools: [
      { name: "Keyword Analyzer", lastUsed: "10 mins ago" },
      { name: "Traffic Source Attribution", lastUsed: "25 mins ago" },
      { name: "User Behavior Tracking", lastUsed: "1 hour ago" },
      { name: "Competitor Traffic Monitor", lastUsed: "3 hours ago" },
      { name: "SEO Performance Scanner", lastUsed: "5 hours ago" },
      { name: "Conversion Path Analyzer", lastUsed: "Yesterday" },
      { name: "Search Intent Classifier", lastUsed: "Yesterday" },
    ],
  },
  {
    id: "content-agent",
    name: "Content Generation Agent",
    avatar: "C",
    state: "idle",
    progress: 100,
    runningDays: 38,
    tools: [
      { name: "Content Generator", lastUsed: "30 mins ago" },
      { name: "SEO Optimizer", lastUsed: "30 mins ago" },
      { name: "Image Generator", lastUsed: "2 hours ago" },
      { name: "Content Performance Tracker", lastUsed: "4 hours ago" },
      { name: "Topic Research Assistant", lastUsed: "Yesterday" },
      { name: "Readability Analyzer", lastUsed: "Yesterday" },
      { name: "Content Scheduler", lastUsed: "2 days ago" },
      { name: "A/B Headline Tester", lastUsed: "3 days ago" },
    ],
  },
  {
    id: "social-agent",
    name: "Social Media Agent",
    avatar: "S",
    state: "running",
    progress: 45,
    runningDays: 35,
    tools: [
      { name: "Social Publisher", lastUsed: "5 mins ago" },
      { name: "Engagement Tracker", lastUsed: "15 mins ago" },
      { name: "Comment Analyzer", lastUsed: "1 hour ago" },
      { name: "Audience Insights", lastUsed: "2 hours ago" },
      { name: "Hashtag Optimizer", lastUsed: "3 hours ago" },
      { name: "Content Calendar", lastUsed: "Yesterday" },
      { name: "Competitor Social Monitor", lastUsed: "2 days ago" },
      { name: "Trend Detector", lastUsed: "3 days ago" },
    ],
  },
  {
    id: "support-agent",
    name: "Customer Service Agent",
    avatar: "CS",
    state: "idle",
    progress: 100,
    runningDays: 56,
    tools: [
      { name: "Chat Responder", lastUsed: "1 hour ago" },
      { name: "Ticket Manager", lastUsed: "2 hours ago" },
      { name: "Knowledge Base", lastUsed: "45 mins ago" },
      { name: "Sentiment Analyzer", lastUsed: "3 hours ago" },
      { name: "Customer History Scanner", lastUsed: "4 hours ago" },
      { name: "Response Template Manager", lastUsed: "Yesterday" },
      { name: "Issue Categorizer", lastUsed: "Yesterday" },
      { name: "Escalation Protocol", lastUsed: "3 days ago" },
      { name: "Customer Satisfaction Monitor", lastUsed: "4 days ago" },
    ],
  },
  {
    id: "analytics-agent",
    name: "Data Analysis Agent",
    avatar: "A",
    state: "error",
    progress: 60,
    runningDays: 28,
    tools: [
      { name: "Data Analyzer", lastUsed: "Error" },
      { name: "Report Generator", lastUsed: "3 hours ago" },
      { name: "Trend Predictor", lastUsed: "1 day ago" },
      { name: "Anomaly Detector", lastUsed: "2 days ago" },
      { name: "KPI Dashboard", lastUsed: "2 days ago" },
      { name: "Cohort Analysis", lastUsed: "3 days ago" },
      { name: "Revenue Forecaster", lastUsed: "4 days ago" },
      { name: "Customer Segmentation", lastUsed: "5 days ago" },
      { name: "Inventory Optimization", lastUsed: "1 week ago" },
    ],
  },
  {
    id: "pricing-agent",
    name: "Dynamic Pricing Agent",
    avatar: "P",
    state: "running",
    progress: 85,
    runningDays: 31,
    tools: [
      { name: "Price Optimizer", lastUsed: "15 mins ago" },
      { name: "Competitor Price Monitor", lastUsed: "1 hour ago" },
      { name: "Elasticity Calculator", lastUsed: "3 hours ago" },
      { name: "Margin Analyzer", lastUsed: "5 hours ago" },
      { name: "Discount Strategy Manager", lastUsed: "Yesterday" },
      { name: "Seasonal Pricing Adjuster", lastUsed: "2 days ago" },
      { name: "Bundle Pricing Optimizer", lastUsed: "3 days ago" },
      { name: "Promotional Impact Analyzer", lastUsed: "5 days ago" },
    ],
  },
  {
    id: "inventory-agent",
    name: "Inventory Management Agent",
    avatar: "I",
    state: "idle",
    progress: 100,
    runningDays: 45,
    tools: [
      { name: "Stock Level Monitor", lastUsed: "2 hours ago" },
      { name: "Demand Forecaster", lastUsed: "4 hours ago" },
      { name: "Reorder Point Calculator", lastUsed: "Yesterday" },
      { name: "Supplier Performance Tracker", lastUsed: "2 days ago" },
      { name: "Warehouse Optimization", lastUsed: "3 days ago" },
      { name: "Seasonal Stock Planner", lastUsed: "1 week ago" },
      { name: "Inventory Turnover Analyzer", lastUsed: "1 week ago" },
      { name: "Dead Stock Identifier", lastUsed: "2 weeks ago" },
    ],
  },
]

type Metric = {
  id: string
  name: string
  value: string
  change: number
  trend: number[]
}

const mockMetrics: Metric[] = [
  {
    id: "sales",
    name: "Sales",
    value: "$24,531",
    change: 12.5,
    trend: [30, 40, 35, 50, 49, 60, 70, 91, 125],
  },
  {
    id: "orders",
    name: "Orders",
    value: "94",
    change: 8.2,
    trend: [20, 25, 30, 35, 25, 30, 35, 40, 50],
  },
  {
    id: "aov",
    name: "Avg. Order Value",
    value: "$261",
    change: 4.3,
    trend: [250, 230, 240, 250, 265, 270, 255, 260, 270],
  },
  {
    id: "ctr",
    name: "Click-through Rate",
    value: "3.2%",
    change: 0.8,
    trend: [2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.2],
  },
  {
    id: "conversion",
    name: "Conversion Rate",
    value: "2.8%",
    change: 0.5,
    trend: [2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8],
  },
  {
    id: "roas",
    name: "ROAS",
    value: "4.2x",
    change: 1.2,
    trend: [3.0, 3.2, 3.4, 3.5, 3.6, 3.8, 4.0, 4.1, 4.2],
  },
]

const mockReport = `
# Multi-Agent Operations Weekly Report

## Summary
This week, the multi-agent system successfully processed 94 orders with total sales of $24,531, a 12.5% increase from last week. The system operated stably overall, though the Data Analysis Agent experienced a brief error that has been fixed.

## Key Metrics
- **Sales**: $24,531 (+12.5%)
- **Orders**: 94 (+8.2%)
- **Average Order Value**: $261 (+4.3%)
- **Click-through Rate**: 3.2% (+0.8%)
- **Conversion Rate**: 2.8% (+0.5%)
- **ROAS**: 4.2x (+1.2%)

## Agent Performance
1. **Traffic Analysis Agent**: Successfully identified 3 high-potential keywords and optimized search engine strategy
2. **Content Generation Agent**: Generated 12 SEO-optimized articles that received high organic traffic
3. **Social Media Agent**: Published 8 posts on Instagram, receiving 3,200 views
4. **Customer Service Agent**: Automatically responded to 85% of customer inquiries, reducing average response time by 50%
5. **Data Analysis Agent**: Experienced an API connection error, which has been fixed and normal operation restored

## Recommendations
1. Increase social media platform coverage by adding TikTok and Twitter channels
2. Optimize product detail pages to improve conversion rate
3. Expand the Customer Service Agent knowledge base to improve automatic response accuracy

## Next Week's Plan
- Implement new social media marketing strategy
- Optimize product detail pages
- Upgrade Data Analysis Agent to prevent API errors from recurring
`

export function Dashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  // 移除showReport状态，改为使用expandedSection
  const [expandedSection, setExpandedSection] = useState<"agents" | "metrics" | "report" | null>("agents")

  const toggleAgentTools = (agentId: string) => {
    if (selectedAgent === agentId) {
      setSelectedAgent(null)
    } else {
      setSelectedAgent(agentId)
    }
  }

  const toggleSection = (section: "agents" | "metrics" | "report") => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Agent Status Section */}
      <div className="bg-[#0B0E17] rounded-xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleSection("agents")}>
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-[#237CFF]" />
            <h2 className="text-xl font-medium">Agent Status</h2>
          </div>
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${expandedSection === "agents" ? "rotate-180" : ""}`}
          />
        </div>

        <AnimatePresence>
          {expandedSection === "agents" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mockAgents.map((agent) => (
                    <div key={agent.id} className="relative">
                      <motion.div
                        className="bg-[#0B0E17] rounded-xl border border-white/10 p-4 h-full"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                                agent.state === "running"
                                  ? "bg-[#237CFF]"
                                  : agent.state === "idle"
                                    ? "bg-gray-500"
                                    : "bg-red-500"
                              }`}
                            >
                              {agent.avatar}
                            </div>
                            <div>
                              <h3 className="font-medium">{agent.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div
                                  className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                                    agent.state === "running"
                                      ? "bg-green-500/20 text-green-400"
                                      : agent.state === "idle"
                                        ? "bg-gray-500/20 text-gray-400"
                                        : "bg-red-500/20 text-red-400"
                                  }`}
                                >
                                  {agent.state === "running" ? "Running" : agent.state === "idle" ? "Idle" : "Error"}
                                </div>
                                <div className="flex items-center text-xs text-white/70">
                                  <Clock size={12} className="mr-1" />
                                  <span>{agent.runningDays} days</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            className="text-white/70 hover:text-white transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleAgentTools(agent.id)
                            }}
                          >
                            <ChevronDown
                              size={18}
                              className={`transition-transform duration-300 ${selectedAgent === agent.id ? "rotate-180" : ""}`}
                            />
                          </button>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-white/70">Task Progress</span>
                            <span>{agent.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${
                                agent.state === "running"
                                  ? "bg-[#237CFF]"
                                  : agent.state === "idle"
                                    ? "bg-gray-500"
                                    : "bg-red-500"
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${agent.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </motion.div>

                      <AnimatePresence>
                        {selectedAgent === agent.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 bg-[#0B0E17] rounded-xl border border-white/10 p-4 overflow-hidden"
                          >
                            <h4 className="text-sm font-medium mb-3">Tool List</h4>
                            <div className="space-y-2">
                              {agent.tools.map((tool) => (
                                <div key={tool.name} className="flex items-center justify-between text-sm">
                                  <span>{tool.name}</span>
                                  <span className="text-white/50 text-xs">{tool.lastUsed}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Business Metrics Section */}
      <div className="bg-[#0B0E17] rounded-xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleSection("metrics")}>
          <div className="flex items-center gap-2">
            <ChevronRight size={20} className="text-[#F5C66F]" />
            <h2 className="text-xl font-medium">Business Metrics</h2>
          </div>
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${expandedSection === "metrics" ? "rotate-180" : ""}`}
          />
        </div>

        <AnimatePresence>
          {expandedSection === "metrics" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockMetrics.map((metric) => (
                    <motion.div
                      key={metric.id}
                      className="bg-[#0B0E17] rounded-xl border border-white/10 p-4"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm text-white/70">{metric.name}</h3>
                          <div className="text-2xl font-semibold mt-1">{metric.value}</div>
                          <div className={`text-xs mt-1 ${metric.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {metric.change >= 0 ? "+" : ""}
                            {metric.change}% vs last week
                          </div>
                        </div>

                        <div className="h-10 flex items-end gap-[2px]">
                          {metric.trend.map((value, index) => (
                            <div
                              key={index}
                              className="w-1 bg-[#237CFF]/70 rounded-t-sm"
                              style={{
                                height: `${(value / Math.max(...metric.trend)) * 100}%`,
                                opacity: 0.3 + (index / metric.trend.length) * 0.7,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Operation Report Section - 新增 */}
      <div className="bg-[#0B0E17] rounded-xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleSection("report")}>
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-[#F5C66F]" />
            <h2 className="text-xl font-medium">Operation Report</h2>
          </div>
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${expandedSection === "report" ? "rotate-180" : ""}`}
          />
        </div>

        <AnimatePresence>
          {expandedSection === "report" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0">
                <div className="bg-[#0B0E17] rounded-xl border border-white/10 p-6">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="whitespace-pre-wrap font-mono">{mockReport}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
