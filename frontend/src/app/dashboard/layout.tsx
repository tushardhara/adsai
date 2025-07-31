'use client'

import { SessionProvider } from 'next-auth/react'
import { DashboardProvider } from './providers/dashboard-provider'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SessionProvider>
      <DashboardProvider>
        {children}
      </DashboardProvider>
    </SessionProvider>
  )
}