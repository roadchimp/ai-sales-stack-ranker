"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Clock, Database, Zap, RefreshCw } from "lucide-react"

const dataSources = [
  {
    id: 1,
    name: "Salesforce CRM",
    type: "CRM",
    status: "connected",
    lastSync: "2 minutes ago",
    records: 15420,
    health: "excellent",
  },
  {
    id: 2,
    name: "HubSpot",
    type: "Marketing",
    status: "connected",
    lastSync: "5 minutes ago",
    records: 8930,
    health: "good",
  },
  {
    id: 3,
    name: "Gmail Integration",
    type: "Email",
    status: "connected",
    lastSync: "1 hour ago",
    records: 45230,
    health: "good",
  },
  {
    id: 4,
    name: "Zoom Meetings",
    type: "Communication",
    status: "pending",
    lastSync: "Never",
    records: 0,
    health: "pending",
  },
  {
    id: 5,
    name: "LinkedIn Sales Navigator",
    type: "Social",
    status: "error",
    lastSync: "2 days ago",
    records: 2340,
    health: "error",
  },
]

export default function SourcesPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">Data Sources</h1>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Data Health Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Connected Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3/5</div>
              <p className="text-xs text-muted-foreground">Active integrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">71.9K</div>
              <p className="text-xs text-muted-foreground">Synced data points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Data Freshness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">Up to date</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Sources List */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>Monitor and manage your data source connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                      <Database className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{source.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{source.type}</span>
                        <span>•</span>
                        <span>{source.records.toLocaleString()} records</span>
                        <span>•</span>
                        <span>Last sync: {source.lastSync}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Status Badge */}
                    <Badge
                      variant={
                        source.status === "connected"
                          ? "default"
                          : source.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {source.status === "connected" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {source.status === "error" && <AlertCircle className="h-3 w-3 mr-1" />}
                      {source.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                      {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                    </Badge>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {source.status === "connected" && (
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Sync Now
                        </Button>
                      )}
                      {source.status === "pending" && (
                        <Button size="sm">
                          <Zap className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                      )}
                      {source.status === "error" && (
                        <Button variant="destructive" size="sm">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Fix Issue
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add New Source */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Data Source</CardTitle>
            <CardDescription>Connect additional platforms to enhance your analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="h-20 flex-col">
                <Database className="h-6 w-6 mb-2" />
                <span>CRM Platform</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Zap className="h-6 w-6 mb-2" />
                <span>Communication Tool</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <RefreshCw className="h-6 w-6 mb-2" />
                <span>Custom API</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
