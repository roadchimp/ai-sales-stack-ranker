"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  BarChart,
  Scatter,
  ScatterChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts"
import { sampleOpportunities } from "@/lib/sample-data"
import {
  ArrowLeft,
  Brain,
  Calendar,
  Mail,
  Phone,
  Video,
  Users,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Award,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo } from "react"

// Sample cumulative interaction data
const interactionData = [
  { date: "2024-09-01", email: 0, phone: 45, video: 90, inPerson: 0 },
  { date: "2024-10-01", email: 0, phone: 75, video: 90, inPerson: 0 },
  { date: "2024-11-01", email: 120, phone: 110, video: 90, inPerson: 0 },
  { date: "2024-12-01", email: 300, phone: 155, video: 90, inPerson: 0 },
  { date: "2025-01-01", email: 300, phone: 215, video: 90, inPerson: 0 },
  { date: "2025-02-01", email: 300, phone: 240, video: 90, inPerson: 0 },
]

// Benchmark interaction data for comparison
const benchmarkInteractionData = [
  { date: "2024-09-01", email: 0, phone: 30, video: 60, inPerson: 0 },
  { date: "2024-10-01", email: 0, phone: 55, video: 60, inPerson: 0 },
  { date: "2024-11-01", email: 80, phone: 80, video: 60, inPerson: 0 },
  { date: "2024-12-01", email: 200, phone: 105, video: 60, inPerson: 0 },
  { date: "2025-01-01", email: 200, phone: 140, video: 60, inPerson: 0 },
  { date: "2025-02-01", email: 200, phone: 165, video: 60, inPerson: 0 },
]

// Sample stage progress data
const stageProgressData = [
  { stage: "Lead", completed: 13, projected: 15, total: 15 },
  { stage: "Qualified", completed: 28, projected: 30, total: 30 },
  { stage: "Discovery", completed: 46, projected: 50, total: 50 },
  { stage: "Proof of Value", completed: 110, projected: 120, total: 120 },
  { stage: "Business Negotiation", completed: 118, projected: 130, total: 130 },
  { stage: "Closed Won", completed: 0, projected: 140, total: 140 },
]

// Sample benchmark data with orange current deal
const benchmarkData = [
  { size: 45000, days: 280, type: "benchmark" },
  { size: 89000, days: 295, type: "benchmark" },
  { size: 120000, days: 320, type: "benchmark" },
  { size: 156000, days: 275, type: "benchmark" },
  { size: 200000, days: 310, type: "benchmark" },
  { size: 142500, days: 315, type: "current" }, // Current deal
]

// Sample MEDDICC data
const meddiccData = [
  { dimension: "Metrics", score: 8.5 },
  { dimension: "Economic Buyer", score: 9.0 },
  { dimension: "Decision Criteria", score: 7.5 },
  { dimension: "Decision Process", score: 6.0 },
  { dimension: "Identify Pain", score: 8.0 },
  { dimension: "Champion", score: 7.0 },
]

export default function OpportunityDetailPage() {
  const params = useParams()
  const opportunityId = params.id as string

  const opportunity = useMemo(() => {
    return sampleOpportunities.find((opp) => opp.id === opportunityId)
  }, [opportunityId])

  if (!opportunity) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Opportunity Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested opportunity could not be found.</p>
            <Button asChild>
              <Link href="/opportunities">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Predictive Analytics
              </Link>
            </Button>
          </div>
        </div>
      </SidebarInset>
    )
  }

  // Confidence scoring function
  const getConfidenceLevel = (score: number) => {
    if (score >= 80) return { level: "High confidence", color: "text-green-600" }
    if (score >= 60) return { level: "Medium confidence", color: "text-yellow-600" }
    if (score >= 40) return { level: "Low confidence", color: "text-orange-600" }
    return { level: "Very low confidence", color: "text-red-600" }
  }

  const confidenceInfo = getConfidenceLevel(opportunity.predictionScore)

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Calculate interaction totals from current data
  const latestInteraction = interactionData[interactionData.length - 1]
  const totalInteractions =
    latestInteraction.email + latestInteraction.phone + latestInteraction.video + latestInteraction.inPerson
  const emailPercentage = Math.round((latestInteraction.email / totalInteractions) * 100)
  const phonePercentage = Math.round((latestInteraction.phone / totalInteractions) * 100)
  const videoPercentage = Math.round((latestInteraction.video / totalInteractions) * 100)
  const inPersonPercentage = Math.round((latestInteraction.inPerson / totalInteractions) * 100)

  // Calculate engagement quality based on interaction data
  const calculateEngagementMetrics = () => {
    // Email response rate based on email interactions
    const emailResponseRate = Math.min(95, Math.max(60, (latestInteraction.email / 300) * 100))

    // Meeting attendance based on video/phone calls
    const totalMeetings = latestInteraction.phone + latestInteraction.video
    const meetingAttendance = Math.min(98, Math.max(70, (totalMeetings / 330) * 100))

    // Demo completion based on video interactions
    const demoCompletion = Math.min(90, Math.max(50, (latestInteraction.video / 90) * 100))

    // Stakeholder reach based on total interactions
    const stakeholderReach = Math.min(95, Math.max(60, (totalInteractions / 630) * 100))

    return {
      emailResponseRate: Math.round(emailResponseRate),
      meetingAttendance: Math.round(meetingAttendance),
      demoCompletion: Math.round(demoCompletion),
      stakeholderReach: Math.round(stakeholderReach),
    }
  }

  const engagementMetrics = calculateEngagementMetrics()

  // Custom scatter chart component to handle different colors
  const CustomScatter = (props: any) => {
    const { cx, cy, payload } = props
    const color = payload.type === "current" ? "#f97316" : "#3b82f6" // Orange for current, blue for benchmark
    return <circle cx={cx} cy={cy} r={6} fill={color} stroke={color} strokeWidth={2} />
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/opportunities">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Opportunity Analysis</h1>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Opportunity Header */}
        <Card className="card-enhanced border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{opportunity.name}</CardTitle>
                <CardDescription className="text-lg">{opportunity.accountName}</CardDescription>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={getHealthColor(opportunity.healthScore)}>
                    {opportunity.healthScore} health
                  </Badge>
                  <Badge variant="secondary">{opportunity.stage}</Badge>
                  <span className="text-sm text-muted-foreground">{opportunity.age} days old</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">${opportunity.amount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Expected Value</div>
                <div className="flex items-center gap-2 mt-2">
                  <Brain className="h-4 w-4" />
                  <span className="text-lg font-semibold text-primary">{opportunity.predictionScore}%</span>
                </div>
                <div className={`text-sm ${confidenceInfo.color}`}>{confidenceInfo.level}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Expected Close</div>
                  <div className="text-sm text-muted-foreground">{formatDate(opportunity.closeDate)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {opportunity.owner
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{opportunity.owner}</div>
                  <div className="text-sm text-muted-foreground">{opportunity.region}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Source</div>
                  <div className="text-sm text-muted-foreground">{opportunity.source}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Fiscal Period</div>
                  <div className="text-sm text-muted-foreground">{opportunity.fiscalPeriod}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interaction Summary */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Interaction Summary & Breakdown
            </CardTitle>
            <CardDescription>Customer engagement metrics across all communication channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <div className="text-2xl font-bold">{emailPercentage}%</div>
                <div className="text-xs text-muted-foreground">of interactions</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Phone</span>
                </div>
                <div className="text-2xl font-bold">{phonePercentage}%</div>
                <div className="text-xs text-muted-foreground">of interactions</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Video className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Video</span>
                </div>
                <div className="text-2xl font-bold">{videoPercentage}%</div>
                <div className="text-xs text-muted-foreground">of interactions</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">In-Person</span>
                </div>
                <div className="text-2xl font-bold">{inPersonPercentage}%</div>
                <div className="text-xs text-muted-foreground">of interactions</div>
              </div>
            </div>

            {/* Customer Interaction Timeline - Cumulative */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Customer Interaction Timeline</h4>
              <ChartContainer
                config={{
                  currentEmail: { label: "Current - Email", color: "#3b82f6" },
                  currentPhone: { label: "Current - Phone", color: "#10b981" },
                  currentVideo: { label: "Current - Video", color: "#8b5cf6" },
                  benchmarkEmail: { label: "Benchmark - Email", color: "#93c5fd" },
                  benchmarkPhone: { label: "Benchmark - Phone", color: "#86efac" },
                  benchmarkVideo: { label: "Benchmark - Video", color: "#c4b5fd" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
                      }
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis
                      label={{ value: "Cumulative Duration (min)", angle: -90, position: "insideLeft" }}
                      width={80}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />

                    {/* Current Deal Lines */}
                    {interactionData.map((_, index) => (
                      <Line
                        key={`current-email-${index}`}
                        data={interactionData}
                        type="monotone"
                        dataKey="email"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Current - Email"
                        strokeDasharray="0"
                      />
                    ))}
                    <Line
                      data={interactionData}
                      type="monotone"
                      dataKey="phone"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Current - Phone"
                    />
                    <Line
                      data={interactionData}
                      type="monotone"
                      dataKey="video"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      name="Current - Video"
                    />

                    {/* Benchmark Lines */}
                    <Line
                      data={benchmarkInteractionData}
                      type="monotone"
                      dataKey="email"
                      stroke="#93c5fd"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Benchmark - Email"
                    />
                    <Line
                      data={benchmarkInteractionData}
                      type="monotone"
                      dataKey="phone"
                      stroke="#86efac"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Benchmark - Phone"
                    />
                    <Line
                      data={benchmarkInteractionData}
                      type="monotone"
                      dataKey="video"
                      stroke="#c4b5fd"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Benchmark - Video"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Deal Stage Progress and Benchmark Comparison */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Deal Stage Progress */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Deal Stage Progress
              </CardTitle>
              <CardDescription>Time spent in each sales stage vs projections</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  completed: { label: "Completed", color: "hsl(var(--chart-1))" },
                  projected: { label: "Projected", color: "hsl(var(--chart-2))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stageProgressData}
                    layout="horizontal"
                    margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" label={{ value: "Days in Stage", position: "insideBottom", offset: -10 }} />
                    <YAxis dataKey="stage" type="category" width={120} tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="completed" fill="var(--color-completed)" />
                    <Bar dataKey="projected" fill="var(--color-projected)" fillOpacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Benchmark Comparison */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Benchmark Comparison
              </CardTitle>
              <CardDescription>Deal size vs days to close comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  benchmark: { label: "Benchmark", color: "#3b82f6" },
                  current: { label: "Current Deal", color: "#f97316" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={benchmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="size"
                      type="number"
                      domain={["dataMin - 10000", "dataMax + 10000"]}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      label={{ value: "Deal Size ($)", position: "insideBottom", offset: -10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      dataKey="days"
                      type="number"
                      domain={["dataMin - 10", "dataMax + 10"]}
                      label={{ value: "Days to Close", angle: -90, position: "insideLeft" }}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{data.type === "current" ? "Current Deal" : "Benchmark"}</p>
                              <p>Size: ${(data.size / 1000).toFixed(0)}K</p>
                              <p>Days: {data.days}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Scatter
                      dataKey="days"
                      shape={(props) => <CustomScatter {...props} />} // ✅ forward props so payload is defined
                    />
                    <Legend />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Quality and MEDDICC */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Engagement Quality Indicators */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Engagement Quality Indicators
              </CardTitle>
              <CardDescription>Key metrics indicating deal health and engagement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Email Response Rate</span>
                  <span
                    className={`text-sm font-bold ${engagementMetrics.emailResponseRate >= 80 ? "text-green-600" : engagementMetrics.emailResponseRate >= 60 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {engagementMetrics.emailResponseRate}%
                  </span>
                </div>
                <Progress value={engagementMetrics.emailResponseRate} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Meeting Attendance</span>
                  <span
                    className={`text-sm font-bold ${engagementMetrics.meetingAttendance >= 80 ? "text-green-600" : engagementMetrics.meetingAttendance >= 60 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {engagementMetrics.meetingAttendance}%
                  </span>
                </div>
                <Progress value={engagementMetrics.meetingAttendance} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Demo Completion</span>
                  <span
                    className={`text-sm font-bold ${engagementMetrics.demoCompletion >= 80 ? "text-green-600" : engagementMetrics.demoCompletion >= 60 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {engagementMetrics.demoCompletion}%
                  </span>
                </div>
                <Progress value={engagementMetrics.demoCompletion} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Stakeholder Reach</span>
                  <span
                    className={`text-sm font-bold ${engagementMetrics.stakeholderReach >= 80 ? "text-green-600" : engagementMetrics.stakeholderReach >= 60 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {engagementMetrics.stakeholderReach}%
                  </span>
                </div>
                <Progress value={engagementMetrics.stakeholderReach} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  {engagementMetrics.meetingAttendance >= 95 ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-600">High engagement quality</span>
                    </>
                  ) : engagementMetrics.meetingAttendance >= 80 ? (
                    <>
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-yellow-600">Medium engagement quality</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-red-600">Low engagement quality</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {engagementMetrics.meetingAttendance >= 95
                    ? "95%+ meeting attendance indicates 40% higher closure probability"
                    : "Improve meeting attendance to increase closure probability"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* MEDDICC Framework */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                MEDDICC Qualification Scoring
              </CardTitle>
              <CardDescription>Systematic evaluation across six critical dimensions</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  score: { label: "Score", color: "hsl(var(--chart-1))" },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={meddiccData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="var(--color-score)"
                      fill="var(--color-score)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall MEDDICC Score</span>
                  <span className="font-bold text-primary">
                    {(meddiccData.reduce((sum, item) => sum + item.score, 0) / meddiccData.length).toFixed(1)}/10
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Strong qualification across most dimensions. Focus on Decision Process improvement.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Summary */}
        <Card className="card-enhanced border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI-Powered Insights & Recommendations
            </CardTitle>
            <CardDescription>Machine learning analysis and next best actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-600">Positive Signals</span>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• High meeting attendance ({engagementMetrics.meetingAttendance}%)</li>
                  <li>• Strong email engagement ({engagementMetrics.emailResponseRate}%)</li>
                  <li>• Economic buyer identified</li>
                  <li>• Champion actively engaged</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium text-yellow-600">Areas of Focus</span>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Clarify decision process timeline</li>
                  <li>• Increase stakeholder reach ({engagementMetrics.stakeholderReach}%)</li>
                  <li>• Complete technical validation</li>
                  <li>• Confirm budget allocation</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-blue-600">Next Best Actions</span>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Schedule executive alignment call</li>
                  <li>• Prepare ROI business case</li>
                  <li>• Engage procurement team</li>
                  <li>• Plan implementation timeline</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Predicted Close Probability</div>
                  <div className="text-sm text-muted-foreground">Based on similar won deals and current engagement</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{opportunity.predictionScore}%</div>
                  <div className={`text-sm ${confidenceInfo.color}`}>{confidenceInfo.level}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
