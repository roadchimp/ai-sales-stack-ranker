"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { PipelineBubbleChart } from "@/components/pipeline-bubble-chart"
import { DollarSign, Calendar, TrendingUp, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getOpportunities, type OpportunityRecord } from "@/lib/api-client"
import { useState, useEffect } from "react"

const getHealthColor = (health: string) => {
  switch (health) {
    case "high":
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20"
    case "medium":
      return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20"
    case "low":
      return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20"
    default:
      return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20"
  }
}

const getStageColor = (stage: string) => {
  switch (stage) {
    case "Business Negotiation":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    case "Proof of Value":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400"
    case "Consensus / Demo":
      return "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400"
    case "Discovery (SAO)":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "Qualification (SAL)":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    case "Legal Review":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}

const getProbabilityColor = (score: number) => {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-yellow-600"
  return "text-red-600"
}

export default function PipelinePage() {
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const data = await getOpportunities()
        setOpportunities(data)
      } catch (error) {
        console.error('Failed to load opportunities:', error)
      } finally {
        setLoading(false)
      }
    }
    loadOpportunities()
  }, [])

  // Calculate total pipeline value
  const totalPipelineValue = opportunities.reduce((sum, opp) => sum + opp.amount, 0)
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">Pipeline Management</h1>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Pipeline Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="card-enhanced">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalPipelineValue / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">34 active opportunities</p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Weighted Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.1M</div>
              <p className="text-xs text-muted-foreground">Probability adjusted</p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Quarter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1.4M</div>
              <p className="text-xs text-muted-foreground">Expected to close</p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">$456K</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Bubble Chart */}
        <PipelineBubbleChart />

        {/* Active Pipeline Table */}
        <Card className="card-enhanced border-primary/20">
          <CardHeader>
            <CardTitle>Active Pipeline</CardTitle>
            <CardDescription>Opportunities ranked by AI-powered health score</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Opportunity</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Est. Close Date</TableHead>
                  <TableHead>Est. Revenue</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.map((opp) => (
                  <TableRow key={opp.id} className="hover:bg-muted/50" data-opportunity-id={opp.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{opp.name}</div>
                      <div className="text-sm text-muted-foreground">{opp.age} days old</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{opp.accountName}</div>
                      <div className="text-sm text-muted-foreground">{opp.region}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStageColor(opp.stage)}>
                        {opp.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(opp.closeDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="h-3 w-3" />${opp.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {opp.owner
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{opp.owner.split(" ")[0]}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getProbabilityColor(opp.predictionScore)}`}>
                          {opp.predictionScore}%
                        </span>
                        <Progress value={opp.predictionScore} className="h-2 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getHealthColor(opp.healthScore)}>
                        {opp.healthScore}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Update Stage
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Follow-up
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
