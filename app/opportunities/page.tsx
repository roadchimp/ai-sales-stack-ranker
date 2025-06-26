"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { FilterBar } from "@/components/filter-bar"
import { useFilters } from "@/contexts/filter-context"
import { sampleOpportunities } from "@/lib/sample-data"
import { DollarSign, Calendar, Search, Eye, Brain } from "lucide-react"
import { useMemo, useState } from "react"
import Link from "next/link"

export default function PredictiveAnalyticsPage() {
  const { filters } = useFilters()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOpportunities = useMemo(() => {
    return sampleOpportunities.filter((opp) => {
      // Stage filter
      if (filters.selectedStages.length > 0 && !filters.selectedStages.includes(opp.stage)) {
        return false
      }

      // Rep filter
      if (filters.selectedReps.length > 0 && !filters.selectedReps.includes(opp.owner)) {
        return false
      }

      // Region filter
      if (filters.selectedRegions.length > 0 && !filters.selectedRegions.includes(opp.region)) {
        return false
      }

      // Search filter
      if (
        searchTerm &&
        !opp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !opp.accountName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }, [filters, searchTerm])

  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.amount, 0)
  const avgPredictionScore =
    filteredOpportunities.reduce((sum, opp) => sum + opp.predictionScore, 0) / filteredOpportunities.length || 0

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "high":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getPredictionColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Predictive Analytics</h1>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <FilterBar />

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="card-enhanced">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredOpportunities.length}</div>
              <p className="text-xs text-muted-foreground">Active deals</p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(totalValue)}</div>
              <p className="text-xs text-muted-foreground">Pipeline value</p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Prediction Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgPredictionScore.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">AI confidence</p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">High Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredOpportunities.filter((opp) => opp.predictionScore >= 80).length}
              </div>
              <p className="text-xs text-muted-foreground">80%+ prediction</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Opportunities List */}
        <Card className="card-enhanced border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Predictive Analytics
            </CardTitle>
            <CardDescription>
              {filteredOpportunities.length} opportunities • {formatValue(totalValue)} total value • AI-powered insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOpportunities.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{opp.name}</h3>
                        <Badge variant="outline" className={getHealthColor(opp.healthScore)}>
                          {opp.healthScore}
                        </Badge>
                        <Badge variant="secondary">{opp.stage}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{opp.accountName}</span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />${opp.amount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(opp.closeDate).toLocaleDateString()}
                        </span>
                        <span>{opp.age} days old</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* AI Prediction Score */}
                    <div className="text-center min-w-[100px]">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        <span className="text-sm font-medium">AI Score</span>
                      </div>
                      <div className={`text-lg font-bold ${getPredictionColor(opp.predictionScore)}`}>
                        {opp.predictionScore}%
                      </div>
                      <Progress value={opp.predictionScore} className="h-1 w-20" />
                    </div>

                    {/* Owner */}
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {opp.owner
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{opp.owner}</div>
                        <div className="text-xs text-muted-foreground">{opp.region}</div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/opportunities/${opp.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
