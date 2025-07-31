'use client'

import { SessionProvider } from 'next-auth/react'
import { DashboardProvider } from './providers/dashboard-provider'
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from '@/components/ui/dashboard-sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SessionProvider>
      <DashboardProvider>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <DashboardSidebar />
            <div className="flex-1">
              {children}
            </div>
          </div>
        </SidebarProvider>
      </DashboardProvider>
    </SessionProvider>
  )
}