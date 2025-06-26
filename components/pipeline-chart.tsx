"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const pipelineData = [
  { stage: "Prospecting", value: 450, deals: 12 },
  { stage: "Qualification", value: 380, deals: 8 },
  { stage: "Proposal", value: 290, deals: 6 },
  { stage: "Negotiation", value: 180, deals: 4 },
  { stage: "Closed Won", value: 120, deals: 3 },
]

export function PipelineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline by Stage</CardTitle>
        <CardDescription>Deal value and count by sales stage</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Value ($K)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineData}>
              <XAxis dataKey="stage" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
