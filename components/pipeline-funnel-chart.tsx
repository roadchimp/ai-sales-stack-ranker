"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { sampleOpportunities } from "@/lib/sample-data"

// Calculate actual stage data from our 34 opportunities
const calculateStageData = () => {
  const stageMap = {
    "Qualification (SAL)": { probability: 8, color: "from-gray-300 to-gray-400" },
    "Discovery (SAO)": { probability: 10, color: "from-green-300 to-green-400" },
    "Consensus / Demo": { probability: 20, color: "from-teal-300 to-teal-400" },
    "Proof of Value": { probability: 55, color: "from-cyan-400 to-blue-400" },
    "Business Negotiation": { probability: 65, color: "from-blue-400 to-blue-500" },
    "Legal Review": { probability: 95, color: "from-blue-500 to-blue-600" },
  }

  return Object.entries(stageMap)
    .map(([stageName, stageInfo], index) => {
      const stageOpps = sampleOpportunities.filter((opp) => opp.stage === stageName)
      const count = stageOpps.length
      const value = stageOpps.reduce((sum, opp) => sum + opp.amount, 0)

      return {
        id: index,
        name: stageName,
        probability: stageInfo.probability,
        count,
        value,
        color: stageInfo.color,
      }
    })
    .filter((stage) => stage.count > 0) // Only show stages with opportunities
}

export function PipelineFunnelChart() {
  const [viewMode, setViewMode] = useState<"count" | "value">("value")
  const salesStages = calculateStageData()

  const maxValue = Math.max(...salesStages.map((stage) => (viewMode === "count" ? stage.count : stage.value)))

  const formatValue = (value: number) => {
    if (viewMode === "count") {
      return `${value} deals`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  const getStageWidth = (stage: any) => {
    const value = viewMode === "count" ? stage.count : stage.value
    return Math.max((value / maxValue) * 100, 15) // Minimum 15% width for visibility
  }

  const totalOpportunities = sampleOpportunities.length
  const totalValue = sampleOpportunities.reduce((sum, opp) => sum + opp.amount, 0)
  const closedWonCount = 3 // Simulated closed won deals
  const closedWonValue = 285000 // Simulated closed won value

  return (
    <Card className="card-enhanced border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales Pipeline Funnel</CardTitle>
            <CardDescription>
              Opportunity progression through sales stages ({totalOpportunities} total opportunities)
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "count" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("count")}
            >
              Count
            </Button>
            <Button
              variant={viewMode === "value" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("value")}
            >
              Value
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {salesStages.map((stage, index) => {
            const width = getStageWidth(stage)
            const value = viewMode === "count" ? stage.count : stage.value

            return (
              <div key={stage.id} className="flex items-center gap-4">
                {/* Stage Info */}
                <div className="w-48 text-right">
                  <div className="text-sm font-medium">{stage.name}</div>
                  <div className="text-xs text-muted-foreground">{formatValue(value)}</div>
                </div>

                {/* Funnel Bar */}
                <div className="flex-1 flex justify-center">
                  <div
                    className={`h-12 bg-gradient-to-r ${stage.color} rounded-sm flex items-center justify-end px-4 transition-all duration-300 hover:opacity-80`}
                    style={{ width: `${width}%` }}
                  >
                    <span className="text-white text-sm font-medium">{formatValue(value)}</span>
                  </div>
                </div>

                {/* Stage Badge */}
                <div className="w-20">
                  <Badge variant="outline" className="text-xs">
                    Stage {stage.id}
                  </Badge>
                </div>
              </div>
            )
          })}

          {/* Closed Won */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <div className="w-48 text-right">
              <div className="text-sm font-medium">Closed Won</div>
              <div className="text-xs text-muted-foreground">
                {viewMode === "count" ? `${closedWonCount} deals` : `$${(closedWonValue / 1000).toFixed(0)}K`}
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-sm flex items-center justify-end px-4 w-3/4">
                <span className="text-white text-sm font-medium">
                  {viewMode === "count" ? `${closedWonCount} deals` : `$${(closedWonValue / 1000).toFixed(0)}K`}
                </span>
              </div>
            </div>
            <div className="w-20">
              <Badge variant="default" className="text-xs bg-green-600">
                Won
              </Badge>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{totalOpportunities}</div>
              <div className="text-sm text-muted-foreground">Total Opportunities</div>
            </div>
            <div>
              <div className="text-2xl font-bold">${(totalValue / 1000).toFixed(0)}K</div>
              <div className="text-sm text-muted-foreground">Pipeline Value</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {(
                  (salesStages.reduce((sum, stage) => sum + stage.value * (stage.probability / 100), 0) / totalValue) *
                  100
                ).toFixed(0)}
                %
              </div>
              <div className="text-sm text-muted-foreground">Weighted Probability</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
