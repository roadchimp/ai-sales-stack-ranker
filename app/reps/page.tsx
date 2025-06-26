"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, TrendingDown, Phone, Mail, Calendar } from "lucide-react"

const reps = [
  {
    id: 1,
    name: "Sarah Johnson",
    quota: 500000,
    achieved: 420000,
    deals: 12,
    winRate: 75,
    avgDealSize: 35000,
    activities: {
      calls: 45,
      emails: 120,
      meetings: 18,
    },
    trend: "up",
    performance: "excellent",
  },
  {
    id: 2,
    name: "Mike Chen",
    quota: 450000,
    achieved: 380000,
    deals: 10,
    winRate: 68,
    avgDealSize: 38000,
    activities: {
      calls: 38,
      emails: 95,
      meetings: 15,
    },
    trend: "up",
    performance: "good",
  },
  {
    id: 3,
    name: "Emily Davis",
    quota: 400000,
    achieved: 280000,
    deals: 8,
    winRate: 62,
    avgDealSize: 35000,
    activities: {
      calls: 32,
      emails: 78,
      meetings: 12,
    },
    trend: "down",
    performance: "needs_improvement",
  },
]

export default function RepsPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">Sales Rep Performance</h1>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Team Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Quota</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1.35M</div>
              <p className="text-xs text-muted-foreground">Q4 target</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Achievement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1.08M</div>
              <p className="text-xs text-muted-foreground">80% of quota</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">Team average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Sarah J.</div>
              <p className="text-xs text-muted-foreground">84% quota achieved</p>
            </CardContent>
          </Card>
        </div>

        {/* Rep Performance Cards */}
        <div className="space-y-4">
          {reps.map((rep) => (
            <Card key={rep.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
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
                        ${rep.achieved.toLocaleString()} / ${rep.quota.toLocaleString()} quota
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        rep.performance === "excellent"
                          ? "default"
                          : rep.performance === "good"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {rep.performance === "excellent"
                        ? "Excellent"
                        : rep.performance === "good"
                          ? "Good"
                          : "Needs Improvement"}
                    </Badge>
                    {rep.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  {/* Quota Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quota Progress</span>
                      <span className="font-medium">{Math.round((rep.achieved / rep.quota) * 100)}%</span>
                    </div>
                    <Progress value={(rep.achieved / rep.quota) * 100} className="h-2" />
                  </div>

                  {/* Win Rate */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Win Rate</span>
                      <span className="font-medium">{rep.winRate}%</span>
                    </div>
                    <Progress value={rep.winRate} className="h-2" />
                  </div>

                  {/* Activities */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Activities (30d)</div>
                    <div className="flex gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {rep.activities.calls}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {rep.activities.emails}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {rep.activities.meetings}
                      </span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Deals: </span>
                      <span className="font-medium">{rep.deals}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Avg Deal: </span>
                      <span className="font-medium">${rep.avgDealSize.toLocaleString()}</span>
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
