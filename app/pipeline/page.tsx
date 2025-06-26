"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, DollarSign } from "lucide-react"

const deals = [
  {
    id: 1,
    company: "Acme Corporation",
    value: 45000,
    stage: "Negotiation",
    probability: 85,
    rep: "Sarah Johnson",
    lastActivity: "2 hours ago",
    health: "high",
    meddicc: {
      metrics: true,
      economic: true,
      decision: false,
      process: true,
      pain: true,
      champion: true,
    },
  },
  {
    id: 2,
    company: "TechStart Inc",
    value: 120000,
    stage: "Proposal",
    probability: 75,
    rep: "Mike Chen",
    lastActivity: "1 day ago",
    health: "medium",
    meddicc: {
      metrics: true,
      economic: false,
      decision: true,
      process: true,
      pain: true,
      champion: false,
    },
  },
  {
    id: 3,
    company: "Global Systems",
    value: 80000,
    stage: "Qualification",
    probability: 60,
    rep: "Emily Davis",
    lastActivity: "3 days ago",
    health: "low",
    meddicc: {
      metrics: false,
      economic: true,
      decision: false,
      process: false,
      pain: true,
      champion: true,
    },
  },
]

export default function PipelinePage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">Pipeline Management</h1>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Pipeline Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.3M</div>
              <p className="text-xs text-muted-foreground">32 active deals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Weighted Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1.6M</div>
              <p className="text-xs text-muted-foreground">Probability adjusted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Quarter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$890K</div>
              <p className="text-xs text-muted-foreground">Expected to close</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">$340K</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Deal List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Deals</CardTitle>
            <CardDescription>Deals ranked by AI-powered health score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{deal.company}</h3>
                        <Badge
                          variant={
                            deal.health === "high" ? "default" : deal.health === "medium" ? "secondary" : "destructive"
                          }
                        >
                          {deal.health === "high" ? "Healthy" : deal.health === "medium" ? "Watch" : "At Risk"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />${deal.value.toLocaleString()}
                        </span>
                        <span>{deal.stage}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {deal.lastActivity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* MEDDICC Score */}
                    <div className="text-center">
                      <div className="text-sm font-medium">MEDDICC</div>
                      <div className="text-xs text-muted-foreground">
                        {Object.values(deal.meddicc).filter(Boolean).length}/6
                      </div>
                    </div>

                    {/* Probability */}
                    <div className="text-center min-w-[80px]">
                      <div className="text-sm font-medium">{deal.probability}%</div>
                      <Progress value={deal.probability} className="h-1 w-16" />
                    </div>

                    {/* Rep */}
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {deal.rep
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{deal.rep}</span>
                    </div>

                    <Button variant="outline" size="sm">
                      View Details
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
