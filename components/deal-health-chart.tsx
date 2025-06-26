"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Scatter, ScatterChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const dealHealthData = [
  { value: 45, probability: 85, name: "Acme Corp" },
  { value: 120, probability: 75, name: "TechStart Inc" },
  { value: 80, probability: 60, name: "Global Systems" },
  { value: 200, probability: 90, name: "Enterprise Co" },
  { value: 35, probability: 40, name: "Small Biz" },
  { value: 150, probability: 70, name: "MidMarket LLC" },
  { value: 90, probability: 55, name: "Innovation Labs" },
]

export function DealHealthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Health Matrix</CardTitle>
        <CardDescription>Deal value vs. closure probability</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Deal Value ($K)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={dealHealthData}>
              <XAxis dataKey="value" name="Deal Value" unit="K" />
              <YAxis dataKey="probability" name="Probability" unit="%" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Scatter dataKey="probability" fill="var(--color-value)" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
