"use client"

import { BarChart3, Users, TrendingUp, Database, Settings, Home, Brain } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"

const navigation = [
  {
    title: "Analytics",
    items: [
      { title: "Overview", url: "/", icon: Home },
      { title: "Pipeline", url: "/pipeline", icon: TrendingUp },
      { title: "Predictive Analytics", url: "/opportunities", icon: Brain },
      { title: "Reps", url: "/reps", icon: Users },
      { title: "Sources", url: "/sources", icon: Database },
    ],
  },
  {
    title: "Management",
    items: [{ title: "Settings", url: "/settings", icon: Settings }],
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Predictive Sales Analytics</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
