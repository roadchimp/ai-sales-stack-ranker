"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar } from "lucide-react"
import { PipelineChart } from "@/components/pipeline-chart"
import { RevenueChart } from "@/components/revenue-chart"
import { DealHealthChart } from "@/components/deal-health-chart"

export default function OverviewPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Sales Analytics Overview</h1>
          <Badge variant="secondary">Live</Badge>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Executive Summary
            </CardTitle>
            <CardDescription>AI-generated insights from your sales pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                <strong>Pipeline Health:</strong> Your Q4 pipeline is tracking 15% above target with $2.3M in qualified
                opportunities. The Enterprise segment shows strong momentum with 3 deals in final stages. However, 2
                high-value deals in the SMB segment require immediate attention due to extended decision cycles.
              </p>
              <div className="flex gap-2">
                <Badge variant="default">High Confidence</Badge>
                <Badge variant="secondary">Updated 5 min ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.3M</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-500" />
                +15% from last quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-500" />
                +5% from last quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45K</div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3 text-red-500" />
                -8% from last quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales Cycle</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42 days</div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3 text-green-500" />
                -3 days from last quarter
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <PipelineChart />
          <RevenueChart />
        </div>

        {/* Deal Health and Predictions */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <DealHealthChart />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Predictions</CardTitle>
              <CardDescription>Next 30 days forecast</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Likely to Close</span>
                  <span className="font-medium">$890K</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground">85% confidence</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>At Risk</span>
                  <span className="font-medium">$340K</span>
                </div>
                <Progress value={35} className="h-2" />
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>New Opportunities</span>
                  <span className="font-medium">$520K</span>
                </div>
                <Progress value={60} className="h-2" />
                <p className="text-xs text-muted-foreground">Projected pipeline</p>
              </div>

              <Button className="w-full mt-4" variant="outline">
                View Detailed Forecast
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
