'use client'

import { IntegrationSources } from '@/components/integrations/integration-sources';
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function IntegrationsPage() {
  return (
    <>
      {/* Page Header */}
      <div className="border-b bg-white">
        <div className="flex h-18 items-center px-6">
          <SidebarTrigger className="mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Sources</h1>
            <p className="text-sm text-gray-600">
              Connect your advertising platforms, e-commerce stores, and analytics tools
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <IntegrationSources />
      </main>
    </>
  );
}