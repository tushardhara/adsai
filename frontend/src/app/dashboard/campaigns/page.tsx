'use client'

import { CampaignDashboard } from '@/components/campaigns/campaign-dashboard';
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function CampaignsPage() {
  return (
    <>
      {/* Page Header */}
      <div className="border-b bg-white">
        <div className="flex h-18 items-center px-6">
          <SidebarTrigger className="mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-sm text-gray-600">
              Monitor and optimize campaigns across all advertising platforms
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <CampaignDashboard />
      </main>
    </>
  );
}