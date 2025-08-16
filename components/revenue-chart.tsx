"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// Get current month for determining where actuals should end
const getCurrentMonth = () => {
  const now = new Date()
  return now.getMonth() // 0-based (0 = Jan, 7 = Aug)
}

const currentMonth = getCurrentMonth()

const revenueData = [
  { month: "Jan", actual: 120, forecast: 115, monthIndex: 0 },
  { month: "Feb", actual: 135, forecast: 130, monthIndex: 1 },
  { month: "Mar", actual: 148, forecast: 145, monthIndex: 2 },
  { month: "Apr", actual: 162, forecast: 160, monthIndex: 3 },
  { month: "May", actual: 178, forecast: 175, monthIndex: 4 },
  { month: "Jun", actual: 195, forecast: 190, monthIndex: 5 },
  { month: "Jul", actual: 205, forecast: 205, monthIndex: 6 },
  { month: "Aug", actual: 218, forecast: 220, monthIndex: 7 }, 
  { month: "Sep", actual: 236, forecast: 235, monthIndex: 8 },  // Current month
  { month: "Oct", actual: null, forecast: 250, monthIndex: 9 }, // Future months - no actuals
  { month: "Nov", actual: null, forecast: 265, monthIndex: 10 },
  { month: "Dec", actual: null, forecast: 280, monthIndex: 11 },
]
// Filter data to show actuals only up to current month
const processedData = revenueData.map((item) => ({
  ...item,
  actual: item.monthIndex <= currentMonth ? item.actual : null,
}))

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
              <Line
                type="monotone"
                dataKey="actual"
                stroke="var(--color-actual)"
                strokeWidth={3}
                connectNulls={false} // Don't connect across null values
                dot={{ fill: "var(--color-actual)", strokeWidth: 2, r: 4 }}
              />
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
