'use client'

import { AuraChat } from '@/components/aura/aura-chat';
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function AuraPage() {
  return (
    <div className="flex flex-col h-screen"> {/* Added flex container with full height */}
      {/* Page Header */}
      <div className="border-b bg-white flex-shrink-0"> {/* Added flex-shrink-0 */}
        <div className="flex h-18 items-center px-6">
          <SidebarTrigger className="mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Aura AI</h1>
            <p className="text-sm text-gray-600">
              Your AI-powered analytics assistant for optimization insights
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Full Height Chat Interface */}
      <main className="flex-1 min-h-0"> {/* Changed from flex-1 overflow-hidden to flex-1 min-h-0 */}
        <AuraChat />
      </main>
    </div>
  );
}