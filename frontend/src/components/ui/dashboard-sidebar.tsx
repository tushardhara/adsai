'use client'

import { useSession } from "next-auth/react"
import { useDashboard } from '@/app/dashboard/providers/dashboard-provider'
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  BarChart3, 
  Home, 
  Settings, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  LogOut,
  Database,
  ChevronDown,
  ChevronRight,
  Bell,
  CreditCard,
  Shield,
  Building2
} from 'lucide-react'
import { signOut } from "next-auth/react"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface NavigationItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

interface SettingsItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

interface DashboardSidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const { data: session } = useSession()
  const { currentProject, projects } = useDashboard()
  const pathname = usePathname()

  const navigationPages: NavigationItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics", 
      icon: BarChart3,
    },
    {
      title: "Campaigns",
      url: "/dashboard/campaigns",
      icon: TrendingUp,
    },
    {
      title: "Data Sources",
      url: "/dashboard/integrations",
      icon: Database,
    },
    {
      title: "Aura AI",
      url: "/dashboard/aura",
      icon: MessageSquare,
    }
  ]

  const settingsPages: SettingsItem[] = [
    {
      title: "General",
      url: "/dashboard/settings/general",
      icon: Building2,
    },
    {
      title: "Team",
      url: "/dashboard/settings/team",
      icon: Users,
    },
    {
      title: "Integrations",
      url: "/dashboard/settings/integrations",
      icon: Database,
    },
    {
      title: "Notifications",
      url: "/dashboard/settings/notifications",
      icon: Bell,
    },
    {
      title: "Billing",
      url: "/dashboard/settings/billing",
      icon: CreditCard,
    },
    {
      title: "Advanced",
      url: "/dashboard/settings/advanced",
      icon: Shield,
    }
  ]

  const handleSignOut = () => {
    signOut({ redirectTo: "/" })
  }

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || "U"
  }

  const isSettingsActive = pathname.startsWith('/dashboard/settings')
  const isSettingsOpen = isSettingsActive

  return (
    <Sidebar className={`border-r ${className}`}>
      {/* Sidebar Header - Current Project */}
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {currentProject?.name || "No Project"}
              </h2>
              <p className="text-xs text-gray-500">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </SidebarHeader>
      
      {/* Sidebar Content - Navigation Pages */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationPages.map((page) => {
                const isActive = pathname === page.url
                return (
                  <SidebarMenuItem key={page.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={page.url} className="flex items-center space-x-3">
                        <page.icon className="w-4 h-4" />
                        <span>{page.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Group with Collapsible Dropdown */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen={isSettingsOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <Settings className="w-4 h-4" />
                        <span>Project Settings</span>
                      </div>
                      <ChevronRight className="w-4 h-4 transition-transform data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {settingsPages.map((setting) => {
                        const isActive = pathname === setting.url
                        return (
                          <SidebarMenuSubItem key={setting.title}>
                            <SidebarMenuSubButton asChild isActive={isActive}>
                              <Link href={setting.url} className="flex items-center space-x-3">
                                <setting.icon className="w-4 h-4" />
                                <span>{setting.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer - Profile */}
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm">
                {getInitials(session?.user?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session?.user?.email || "user@example.com"}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSignOut}
            className="p-2"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}