"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FilterBar } from "@/components/filter-bar"
import { useFilters } from "@/contexts/filter-context"
import { sampleRepMetrics, sampleOpportunities, stages } from "@/lib/sample-data"
import { TrendingUp, TrendingDown, Phone, Calendar, Target } from "lucide-react"
import { useMemo } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export default function RepsPage() {
  const { filters } = useFilters()

  const filteredReps = useMemo(() => {
    return sampleRepMetrics.filter((rep) => {
      if (filters.selectedReps.length > 0 && !filters.selectedReps.includes(rep.name)) {
        return false
      }
      if (filters.selectedRegions.length > 0 && !filters.selectedRegions.includes(rep.region)) {
        return false
      }
      return true
    })
  }, [filters])

  // Calculate pipeline distribution by rep and stage
  const pipelineByRepAndStage = useMemo(() => {
    return filteredReps.map((rep) => {
      const repOpps = sampleOpportunities.filter((opp) => opp.owner === rep.name)
      const stageData = stages.reduce(
        (acc, stage) => {
          const stageOpps = repOpps.filter((opp) => opp.stage === stage)
          const stageValue = stageOpps.reduce((sum, opp) => sum + opp.amount, 0)
          acc[stage] = stageValue / 1000 // Convert to K
          return acc
        },
        {} as Record<string, number>,
      )

      return {
        rep: rep.name.split(" ")[0], // First name only for chart
        ...stageData,
      }
    })
  }, [filteredReps])

  const totalQuota = filteredReps.reduce((sum, rep) => sum + rep.quota, 0)
  const totalAchieved = filteredReps.reduce((sum, rep) => sum + rep.closedWon, 0)
  const avgWinRate = filteredReps.reduce((sum, rep) => sum + rep.winRate, 0) / filteredReps.length || 0

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">Sales Rep Analytics</h1>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <FilterBar />

        {/* Team Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="card-enhanced">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Quota</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalQuota / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground">Total target</p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Achievement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalAchieved / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground">
                {((totalAchieved / totalQuota) * 100).toFixed(0)}% of quota
              </p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgWinRate.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">Team average</p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Reps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredReps.length}</div>
              <p className="text-xs text-muted-foreground">In current view</p>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Distribution Chart */}
        <Card className="card-enhanced border-primary/20">
          <CardHeader>
            <CardTitle>Pipeline Distribution by Rep</CardTitle>
            <CardDescription>Pipeline value ($K) across different stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                Prospecting: { label: "Prospecting", color: "hsl(var(--chart-1))" },
                Qualification: { label: "Qualification", color: "hsl(var(--chart-2))" },
                "Needs Analysis": { label: "Needs Analysis", color: "hsl(var(--chart-3))" },
                Proposal: { label: "Proposal", color: "hsl(var(--chart-4))" },
                Negotiation: { label: "Negotiation", color: "hsl(var(--chart-5))" },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineByRepAndStage}>
                  <XAxis dataKey="rep" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="Prospecting" stackId="a" fill="var(--color-Prospecting)" />
                  <Bar dataKey="Qualification" stackId="a" fill="var(--color-Qualification)" />
                  <Bar dataKey="Needs Analysis" stackId="a" fill="var(--color-Needs Analysis)" />
                  <Bar dataKey="Proposal" stackId="a" fill="var(--color-Proposal)" />
                  <Bar dataKey="Negotiation" stackId="a" fill="var(--color-Negotiation)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Rep Performance Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Individual Rep Performance</h3>
          {filteredReps.map((rep) => (
            <Card className="card-enhanced border-border/50" key={rep.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {rep.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{rep.name}</CardTitle>
                      <CardDescription>
                        {rep.role} • {rep.region}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        rep.quotaAttainment >= 80 ? "default" : rep.quotaAttainment >= 60 ? "secondary" : "destructive"
                      }
                    >
                      {rep.quotaAttainment >= 80 ? "Exceeding" : rep.quotaAttainment >= 60 ? "On Track" : "Behind"}
                    </Badge>
                    {rep.quotaAttainment >= 70 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-5">
                  {/* Quota Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quota Progress</span>
                      <span className="font-medium">{rep.quotaAttainment}%</span>
                    </div>
                    <Progress value={rep.quotaAttainment} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      ${(rep.closedWon / 1000).toFixed(0)}K / ${(rep.quota / 1000).toFixed(0)}K
                    </div>
                  </div>

                  {/* Win Rate */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Win Rate</span>
                      <span className="font-medium">{rep.winRate}%</span>
                    </div>
                    <Progress value={rep.winRate} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Pipeline: ${(rep.pipelineValue / 1000).toFixed(0)}K
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Activities (30d)</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Phone className="h-3 w-3" />
                        <span>{rep.totalCalls} calls</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>{rep.callsPerWeek}/week</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Target className="h-3 w-3" />
                        <span>{rep.avgCallDuration}min avg</span>
                      </div>
                    </div>
                  </div>

                  {/* Deal Metrics */}
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Deal Metrics</div>
                    <div className="text-xs space-y-1">
                      <div>
                        <span className="text-muted-foreground">Active Deals: </span>
                        <span className="font-medium">{rep.opportunities}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Deal: </span>
                        <span className="font-medium">${(rep.avgDealSize / 1000).toFixed(0)}K</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Call Time: </span>
                        <span className="font-medium">{(rep.timeOnCalls / 60).toFixed(0)}h</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Indicator */}
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {rep.quotaAttainment >= 80 ? "🏆" : rep.quotaAttainment >= 60 ? "📈" : "⚠️"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {rep.quotaAttainment >= 80
                        ? "Top Performer"
                        : rep.quotaAttainment >= 60
                          ? "Good Progress"
                          : "Needs Focus"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SidebarInset>
  )
}
