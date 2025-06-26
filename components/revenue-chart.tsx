"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const revenueData = [
  { month: "Jan", actual: 120, forecast: 115 },
  { month: "Feb", actual: 135, forecast: 130 },
  { month: "Mar", actual: 148, forecast: 145 },
  { month: "Apr", actual: 162, forecast: 160 },
  { month: "May", actual: 178, forecast: 175 },
  { month: "Jun", actual: 195, forecast: 190 },
  { month: "Jul", actual: 0, forecast: 205 },
  { month: "Aug", actual: 0, forecast: 220 },
  { month: "Sep", actual: 0, forecast: 235 },
]

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>Actual vs. AI-predicted revenue ($K)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            actual: {
              label: "Actual",
              color: "hsl(var(--chart-1))",
            },
            forecast: {
              label: "Forecast",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" strokeWidth={2} />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="var(--color-forecast)"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
