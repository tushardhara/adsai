'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  AlertTriangle,
  Trash2,
  Download,
  Archive,
  Shield,
  Database,
  Users,
  MessageSquare,
  Clock,
  Key,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface DangerousAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  severity: 'medium' | 'high' | 'critical';
  confirmationText: string;
  requiresPassword?: boolean;
  requiresDataExport?: boolean;
}

export function DangerZone() {
  const router = useRouter();
  const [confirmationInputs, setConfirmationInputs] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [exportInProgress, setExportInProgress] = useState(false);

  const dangerousActions: DangerousAction[] = [
    {
      id: 'reset-integrations',
      title: 'Reset All Integrations',
      description: 'Disconnect and remove all data source integrations. This will stop data synchronization.',
      icon: RotateCcw,
      severity: 'medium',
      confirmationText: 'reset integrations',
      requiresPassword: false
    },
    {
      id: 'revoke-api-keys',
      title: 'Revoke All API Keys',
      description: 'Revoke all generated API keys and tokens. This will break any custom integrations.',
      icon: Key,
      severity: 'medium',
      confirmationText: 'revoke keys',
      requiresPassword: true
    },
    {
      id: 'clear-conversation-history',
      title: 'Clear Aura AI History',
      description: 'Permanently delete all conversation history with Aura AI. This cannot be undone.',
      icon: MessageSquare,
      severity: 'high',
      confirmationText: 'clear conversations',
      requiresPassword: false
    },
    {
      id: 'remove-team-members',
      title: 'Remove All Team Members',
      description: 'Remove all team members from your projects. They will lose access immediately.',
      icon: Users,
      severity: 'high',
      confirmationText: 'remove team',
      requiresPassword: true
    },
    {
      id: 'delete-project-data',
      title: 'Delete All Project Data',
      description: 'Permanently delete all analytics data, insights, and project configurations.',
      icon: Database,
      severity: 'critical',
      confirmationText: 'delete all data',
      requiresPassword: true,
      requiresDataExport: true
    },
    {
      id: 'delete-account',
      title: 'Delete Account',
      description: 'Permanently delete your Aura account. All data, projects, and settings will be lost forever.',
      icon: Trash2,
      severity: 'critical',
      confirmationText: 'delete my account',
      requiresPassword: true,
      requiresDataExport: true
    }
  ];

  const handleExportData = async () => {
    try {
      setExportInProgress(true);
      
      const response = await fetch('/api/account/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to initiate data export');

      const { exportId } = await response.json();
      
      toast.success('Data export started. You\'ll receive an email when it\'s ready for download.');
      
      // Start polling for export completion
      const pollExport = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/account/export/${exportId}`);
          const { status, downloadUrl } = await statusResponse.json();
          
          if (status === 'completed') {
            clearInterval(pollExport);
            setExportInProgress(false);
            
            // Auto-download the export
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `aura-data-export-${new Date().toISOString().split('T')[0]}.zip`;
            link.click();
            
            toast.success('Data export completed and downloaded.');
          } else if (status === 'failed') {
            clearInterval(pollExport);
            setExportInProgress(false);
            toast.error('Data export failed. Please try again.');
          }
        } catch (error) {
          console.error('Export polling error:', error);
        }
      }, 5000);

    } catch (error) {
      console.error('Failed to export data:', error);
      toast.error('Failed to start data export');
      setExportInProgress(false);
    }
  };

  const handleDangerousAction = async (actionId: string, password?: string) => {
    try {
      setActionLoading(actionId);

      const payload: any = { action: actionId };
      if (password) payload.password = password;

      const response = await fetch('/api/account/dangerous-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Action failed');
      }

      // Handle different action outcomes
      switch (actionId) {
        case 'delete-account':
          toast.success('Account deletion initiated. You will be logged out.');
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          break;
        
        case 'delete-project-data':
          toast.success('All project data has been deleted.');
          router.push('/dashboard');
          break;
        
        case 'reset-integrations':
          toast.success('All integrations have been reset.');
          break;
        
        case 'revoke-api-keys':
          toast.success('All API keys have been revoked.');
          break;
        
        case 'clear-conversation-history':
          toast.success('Aura AI conversation history has been cleared.');
          break;
        
        case 'remove-team-members':
          toast.success('All team members have been removed.');
          break;
        
        default:
          toast.success('Action completed successfully.');
      }

      // Clear confirmation inputs
      setConfirmationInputs({});

    } catch (error) {
      console.error('Dangerous action failed:', error);
      toast.error(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'medium': return 'border-orange-200 bg-orange-50';
      case 'high': return 'border-red-200 bg-red-50';
      case 'critical': return 'border-red-300 bg-red-100';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-200 text-red-900 font-semibold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isConfirmationValid = (action: DangerousAction) => {
    return confirmationInputs[action.id]?.toLowerCase() === action.confirmationText.toLowerCase();
  };

  return (
    <div className="space-y-6">
      {/* Warning Header */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-700">
            These actions are destructive and cannot be undone. Please proceed with extreme caution.
            We recommend exporting your data before performing any of these actions.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Data Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Your Data
          </CardTitle>
          <CardDescription>
            Download a complete backup of your Aura data before performing destructive actions.
            Includes projects, analytics data, AI conversations, and settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleExportData}
            disabled={exportInProgress}
            className="gap-2"
          >
            {exportInProgress ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Preparing Export...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export All Data
              </>
            )}
          </Button>
          {exportInProgress && (
            <p className="text-sm text-muted-foreground mt-2">
              Your data export is being prepared. This may take several minutes for large datasets.
            </p>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Dangerous Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-red-900">Destructive Actions</h2>
        
        {dangerousActions.map((action) => (
          <Card key={action.id} className={`${getSeverityColor(action.severity)} border-2`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <action.icon className="w-5 h-5 text-red-600 mt-1" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-red-900">{action.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getSeverityBadgeColor(action.severity)}`}>
                        {action.severity}
                      </span>
                    </div>
                    <p className="text-sm text-red-700">{action.description}</p>
                    
                    {action.requiresDataExport && (
                      <div className="flex items-center gap-2 p-2 bg-amber-100 border border-amber-200 rounded text-amber-800 text-xs">
                        <Shield className="w-4 h-4" />
                        Data export strongly recommended before proceeding
                      </div>
                    )}
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      disabled={actionLoading === action.id}
                    >
                      {actionLoading === action.id ? 'Processing...' : 'Execute'}
                    </Button>
                  </AlertDialogTrigger>
                  
                  <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-red-900">
                        <AlertTriangle className="w-5 h-5" />
                        Confirm {action.title}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-3">
                        <p>{action.description}</p>
                        
                        {action.severity === 'critical' && (
                          <div className="p-3 bg-red-100 border border-red-200 rounded text-red-800 text-sm">
                            ⚠️ This action is irreversible and will permanently delete data.
                          </div>
                        )}

                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">
                              Type "{action.confirmationText}" to confirm:
                            </Label>
                            <Input
                              value={confirmationInputs[action.id] || ''}
                              onChange={(e) => setConfirmationInputs(prev => ({
                                ...prev,
                                [action.id]: e.target.value
                              }))}
                              placeholder={action.confirmationText}
                              className="mt-1"
                            />
                          </div>

                          {action.requiresPassword && (
                            <div>
                              <Label className="text-sm font-medium">
                                Enter your password:
                              </Label>
                              <Input
                                type="password"
                                value={confirmationInputs[`${action.id}_password`] || ''}
                                onChange={(e) => setConfirmationInputs(prev => ({
                                  ...prev,
                                  [`${action.id}_password`]: e.target.value
                                }))}
                                placeholder="Your account password"
                                className="mt-1"
                              />
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`${action.id}_understand`}
                              checked={confirmationInputs[`${action.id}_understand`] === 'true'}
                              onCheckedChange={(checked) => setConfirmationInputs(prev => ({
                                ...prev,
                                [`${action.id}_understand`]: checked ? 'true' : 'false'
                              }))}
                            />
                            <Label htmlFor={`${action.id}_understand`} className="text-sm">
                              I understand this action cannot be undone
                            </Label>
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setConfirmationInputs({})}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDangerousAction(
                          action.id, 
                          confirmationInputs[`${action.id}_password`]
                        )}
                        disabled={
                          !isConfirmationValid(action) ||
                          confirmationInputs[`${action.id}_understand`] !== 'true' ||
                          (action.requiresPassword && !confirmationInputs[`${action.id}_password`]) ||
                          actionLoading === action.id
                        }
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {actionLoading === action.id ? 'Processing...' : `Yes, ${action.title}`}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recovery Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Data Recovery
          </CardTitle>
          <CardDescription>
            Information about data recovery and account restoration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p><strong>Account Deletion:</strong> Once confirmed, accounts are permanently deleted after 30 days. Contact support within this period for restoration.</p>
            <p><strong>Data Retention:</strong> Exported data includes all recoverable information. Some aggregated analytics may not be recoverable.</p>
            <p><strong>Integration Data:</strong> Third-party data (Facebook, Shopify) remains in their systems and can be reconnected to new accounts.</p>
            <p><strong>Billing:</strong> Final invoices and refunds are processed according to our terms of service.</p>
          </div>
          
          <div className="pt-3 border-t">
            <p className="text-sm text-muted-foreground">
              Questions about data deletion or account recovery? {' '}
              <a href="mailto:support@aura-analytics.com" className="text-blue-600 hover:underline">
                Contact our support team
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}