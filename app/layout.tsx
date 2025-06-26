import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { FilterProvider } from "@/contexts/filter-context"
import { ThemeProvider } from "@/contexts/theme-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sales Stack Ranker 2.0",
  description: "Predictive Analytics Platform for Sales Teams",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <FilterProvider>
            <SidebarProvider>
              <AppSidebar />
              {children}
            </SidebarProvider>
          </FilterProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
