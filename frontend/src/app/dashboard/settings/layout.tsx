import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/ui/dashboard-sidebar';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <main className="p-6">
            <div className="space-y-6">
              {/* Settings Header */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Project Settings</h1>
                <p className="text-muted-foreground">
                  Manage your project configuration, team members, and integrations
                </p>
              </div>
              
              {/* Page Content */}
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}