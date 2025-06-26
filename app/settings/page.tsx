"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/contexts/theme-context"
import { Moon, Sun, Monitor, Bell, Shield, Database, Palette } from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme, toggleTheme } = useTheme()

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">Settings</h1>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Appearance Settings */}
        <Card className="card-enhanced border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Theme</Label>
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    theme === "light" ? "border-primary" : "border-border"
                  }`}
                  onClick={() => setTheme("light")}
                >
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <span className="text-sm font-medium">Light</span>
                  </div>
                  <div className="mt-2 h-8 rounded bg-white border shadow-sm"></div>
                </div>

                <div
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    theme === "dark" ? "border-primary" : "border-border"
                  }`}
                  onClick={() => setTheme("dark")}
                >
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4" />
                    <span className="text-sm font-medium">Dark</span>
                  </div>
                  <div className="mt-2 h-8 rounded bg-slate-900 border"></div>
                </div>

                <div className="cursor-not-allowed rounded-lg border-2 border-border p-4 opacity-50">
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4" />
                    <span className="text-sm font-medium">System</span>
                  </div>
                  <div className="mt-2 h-8 rounded bg-gradient-to-r from-white to-slate-900 border"></div>
                  <span className="text-xs text-muted-foreground mt-1 block">Coming soon</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Quick Theme Toggle</Label>
                <div className="text-sm text-muted-foreground">Switch between light and dark themes instantly</div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Deal Alerts</Label>
                <div className="text-sm text-muted-foreground">Get notified when deals require attention</div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Pipeline Updates</Label>
                <div className="text-sm text-muted-foreground">Receive updates on pipeline changes</div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Weekly Reports</Label>
                <div className="text-sm text-muted-foreground">Get weekly performance summaries</div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data & Privacy
            </CardTitle>
            <CardDescription>Control your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Data Analytics</Label>
                <div className="text-sm text-muted-foreground">Allow usage analytics to improve the platform</div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Performance Tracking</Label>
                <div className="text-sm text-muted-foreground">Track performance metrics for optimization</div>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Policy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Update Profile
            </Button>
            <Separator />
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
