'use client'

import { SidebarTrigger } from "@/components/ui/sidebar"

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      {/* Settings Header */}
      <div className="border-b bg-white">
        <div className="flex h-18 items-center px-6">
          <SidebarTrigger className="mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Settings</h1>
            <p className="text-sm text-gray-600">
              Manage your project configuration, team members, and integrations
            </p>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <main className="p-6">
        {children}
      </main>
    </>
  );
}