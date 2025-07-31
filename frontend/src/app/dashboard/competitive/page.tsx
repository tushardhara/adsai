'use client'

import { CompetitiveIntelligence } from '@/components/competitive/competitive-intelligence';
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function CompetitivePage() {
  return (
    <>
      {/* Page Header */}
      <div className="border-b bg-white">
        <div className="flex h-18 items-center px-6">
          <SidebarTrigger className="mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Competitive Intelligence</h1>
            <p className="text-sm text-gray-600">
              Monitor competitors across websites, social media, and advertising platforms
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <CompetitiveIntelligence />
      </main>
    </>
  );
}