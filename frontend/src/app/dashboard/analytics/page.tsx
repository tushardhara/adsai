'use client'

import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function AnalyticsPage() {
  return (
    <>
      {/* Page Header */}
      <div className="border-b bg-white">
        <div className="flex h-18 items-center px-6">
          <SidebarTrigger className="mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-600">
              Deep insights and performance analysis across all your data sources
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <AnalyticsDashboard />
      </main>
    </>
  );
}