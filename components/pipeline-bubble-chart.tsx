"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Scatter, ScatterChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { sampleOpportunities } from "@/lib/sample-data"

// Convert opportunities to bubble chart format
const bubbleData = sampleOpportunities.map((opp) => ({
  x: new Date(opp.closeDate).getTime(),
  y: opp.predictionScore,
  z: opp.amount,
  name: opp.name,
  account: opp.accountName,
  stage: opp.stage,
}))

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm text-muted-foreground">{data.account}</p>
        <p className="text-sm">Stage: {data.stage}</p>
        <p className="text-sm">Value: ${(data.z / 1000).toFixed(0)}K</p>
        <p className="text-sm">Probability: {data.y}%</p>
        <p className="text-sm">Close Date: {formatDate(data.x)}</p>
      </div>
    )
  }
  return null
}

export function PipelineBubbleChart() {
  return (
    <Card className="card-enhanced border-primary/20">
      <CardHeader>
        <CardTitle>Opportunity Timeline</CardTitle>
        <CardDescription>Deal probability vs expected close date (bubble size = deal value)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            probability: {
              label: "Probability (%)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[500px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={bubbleData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                dataKey="x"
                domain={["dataMin", "dataMax"]}
                tickFormatter={formatDate}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                type="number"
                dataKey="y"
                domain={[40, 90]}
                label={{ value: "Probability (%)", angle: -90, position: "insideLeft" }}
                stroke="hsl(var(--muted-foreground))"
              />
              <ChartTooltip content={<CustomTooltip />} />
              <Scatter
                dataKey="y"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.6}
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
