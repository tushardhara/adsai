'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Database, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Settings, 
  Trash2,
  Clock,
  TrendingUp,
  ShoppingCart,
  Search,
  Zap,
  ExternalLink,
  Plus,
  Target,
  Globe,
  Code,
  BarChart3,
  Wrench
} from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  provider: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'ads' | 'ecommerce' | 'website' | 'api';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  availabilityStatus: 'available' | 'in_development' | 'coming_soon';
  connectedAt?: Date;
  lastSyncAt?: Date;
  accountInfo?: {
    name: string;
    id: string;
    permissions?: string[];
  };
  settings: {
    syncFrequency: number; // minutes
    autoSync: boolean;
    dataRetention: number; // days
  };
  healthStatus: {
    uptime: number;
    lastError?: string;
    syncSuccess: number;
  };
}

// Advertising Platforms
const adsProviders = [
  {
    id: 'meta-ads',
    name: 'Meta Ads Manager',
    description: 'Facebook and Instagram advertising campaigns, audience insights, and performance metrics',
    icon: Target,
    category: 'ads' as const,
    requiresOAuth: true,
    availabilityStatus: 'in_development' as const,
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    description: 'Search campaigns, display ads, YouTube campaigns, and conversion tracking',
    icon: Search,
    category: 'ads' as const,
    requiresOAuth: true,
    availabilityStatus: 'in_development' as const,
  },
  {
    id: 'amazon-ads',
    name: 'Amazon Ads',
    description: 'Amazon advertising campaigns, sponsored products, and marketplace performance',
    icon: Database,
    category: 'ads' as const,
    requiresOAuth: true,
    availabilityStatus: 'in_development' as const,
  },
  {
    id: 'tiktok-ads',
    name: 'TikTok Ads Manager',
    description: 'TikTok advertising campaigns, audience data, and creative performance',
    icon: TrendingUp,
    category: 'ads' as const,
    requiresOAuth: true,
    availabilityStatus: 'coming_soon' as const,
  },
  {
    id: 'pinterest-ads',
    name: 'Pinterest Ads',
    description: 'Pinterest advertising campaigns and shopping ads performance',
    icon: Target,
    category: 'ads' as const,
    requiresOAuth: true,
    availabilityStatus: 'coming_soon' as const,
  },
  {
    id: 'snapchat-ads',
    name: 'Snapchat Ads',
    description: 'Snapchat advertising campaigns and audience insights',
    icon: Target,
    category: 'ads' as const,
    requiresOAuth: true,
    availabilityStatus: 'coming_soon' as const,
  }
];

// E-commerce & Data Source Providers
const dataProviders = [
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Orders, products, customers, inventory, and sales analytics',
    icon: ShoppingCart,
    category: 'ecommerce' as const,
    requiresOAuth: true,
    availabilityStatus: 'in_development' as const,
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'WordPress e-commerce orders, products, and customer data',
    icon: ShoppingCart,
    category: 'ecommerce' as const,
    requiresOAuth: true,
    availabilityStatus: 'coming_soon' as const,
  },
  {
    id: 'amazon-seller',
    name: 'Amazon Seller Central',
    description: 'Marketplace sales, inventory, advertising spend, and customer metrics',
    icon: Database,
    category: 'ecommerce' as const,
    requiresOAuth: true,
    availabilityStatus: 'coming_soon' as const,
  },
  {
    id: 'etsy',
    name: 'Etsy Shop',
    description: 'Etsy shop orders, listings, and marketplace performance',
    icon: ShoppingCart,
    category: 'ecommerce' as const,
    requiresOAuth: true,
    availabilityStatus: 'coming_soon' as const,
  },
  {
    id: 'magento',
    name: 'Magento',
    description: 'Magento commerce platform orders, products, and analytics',
    icon: ShoppingCart,
    category: 'ecommerce' as const,
    requiresOAuth: true,
    availabilityStatus: 'coming_soon' as const,
  },
  {
    id: 'bigcommerce',
    name: 'BigCommerce',
    description: 'BigCommerce store data, orders, and customer analytics',
    icon: ShoppingCart,
    category: 'ecommerce' as const,
    requiresOAuth: true,
    availabilityStatus: 'coming_soon' as const,
  }
];

// Website & Analytics Providers
const websiteProviders = [
  {
    id: 'google-analytics',
    name: 'Google Analytics 4',
    description: 'Website traffic, user behavior, conversions, and audience insights',
    icon: BarChart3,
    category: 'website' as const,
    requiresOAuth: true,
    availabilityStatus: 'coming_soon' as const,
  },
  {
    id: 'google-search-console',
    name: 'Google Search Console',
    description: 'Search performance, keywords, and SEO insights',
    icon: Search,
    category: 'website' as const,
    requiresOAuth: true,
    availabilityStatus: 'coming_soon' as const,
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    description: 'Website content, posts, pages, and basic analytics',
    icon: Globe,
    category: 'website' as const,
    requiresOAuth: true,
    availabilityStatus: 'coming_soon' as const,
  },
  {
    id: 'hotjar',
    name: 'Hotjar',
    description: 'User behavior analytics, heatmaps, and session recordings',
    icon: BarChart3,
    category: 'website' as const,
    requiresOAuth: true,
    availabilityStatus: 'coming_soon' as const,
  }
];

// Custom API Providers
const apiProviders = [
  {
    id: 'custom-api',
    name: 'Custom API',
    description: 'Connect your custom data sources via REST API endpoints',
    icon: Code,
    category: 'api' as const,
    requiresOAuth: false,
    availabilityStatus: 'coming_soon' as const,
  },
  {
    id: 'webhook',
    name: 'Webhook Integration',
    description: 'Real-time data updates through webhook endpoints',
    icon: Zap,
    category: 'api' as const,
    requiresOAuth: false,
    availabilityStatus: 'coming_soon' as const,
  },
  {
    id: 'csv-import',
    name: 'CSV Data Import',
    description: 'Upload and sync data from CSV files',
    icon: Database,
    category: 'api' as const,
    requiresOAuth: false,
    availabilityStatus: 'coming_soon' as const,
  }
];

export function IntegrationSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      
      // Mock data - only show connected integrations that are in development
      const mockIntegrations: Integration[] = [
        {
          id: '1',
          provider: 'meta-ads',
          name: 'Meta Ads Manager',
          description: 'Facebook and Instagram advertising campaigns, audience insights, and performance metrics',
          icon: Target,
          category: 'ads',
          status: 'connected',
          availabilityStatus: 'in_development',
          connectedAt: new Date('2024-01-15'),
          lastSyncAt: new Date(Date.now() - 1800000), // 30 minutes ago
          accountInfo: {
            name: 'Acme D2C Store',
            id: 'act_123456789',
            permissions: ['ads_read', 'ads_management']
          },
          settings: {
            syncFrequency: 60,
            autoSync: true,
            dataRetention: 90
          },
          healthStatus: {
            uptime: 99.5,
            syncSuccess: 98.2
          }
        },
        {
          id: '2',
          provider: 'shopify',
          name: 'Shopify',
          description: 'Orders, products, customers, inventory, and sales analytics',
          icon: ShoppingCart,
          category: 'ecommerce',
          status: 'connected',
          availabilityStatus: 'in_development',
          connectedAt: new Date('2024-01-10'),
          lastSyncAt: new Date(Date.now() - 900000), // 15 minutes ago
          accountInfo: {
            name: 'acme-store.myshopify.com',
            id: 'shop_987654321',
            permissions: ['read_orders', 'read_products', 'read_customers']
          },
          settings: {
            syncFrequency: 30,
            autoSync: true,
            dataRetention: 365
          },
          healthStatus: {
            uptime: 99.8,
            syncSuccess: 99.1
          }
        }
      ];

      setIntegrations(mockIntegrations);
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
      toast.error('Failed to load integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (providerId: string) => {
    try {
      setConnectingProvider(providerId);
      
      // Find provider across all categories
      const allProviders = [...adsProviders, ...dataProviders, ...websiteProviders, ...apiProviders];
      const provider = allProviders.find(p => p.id === providerId);
      
      if (provider?.availabilityStatus === 'coming_soon') {
        toast.info(`${provider.name} integration is coming soon! We'll notify you when it's available.`);
        setConnectingProvider(null);
        return;
      }

      if (provider?.availabilityStatus === 'in_development') {
        if (provider?.requiresOAuth) {
          // OAuth flow for external services
          const authUrl = `/api/integrations/${providerId}/auth`;
          window.location.href = authUrl;
        } else {
          toast.info('Integration setup will be available soon');
        }
      }
    } catch (error) {
      console.error('Failed to connect integration:', error);
      toast.error('Failed to connect integration');
    } finally {
      setConnectingProvider(null);
    }
  };

  // ... (keep existing handler functions unchanged)
  const handleDisconnect = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to disconnect');

      setIntegrations(prev => prev.filter(int => int.id !== integrationId));
      toast.success('Integration disconnected successfully');
    } catch (error) {
      console.error('Failed to disconnect integration:', error);
      toast.error('Failed to disconnect integration');
    }
  };

  const handleSync = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}/sync`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to trigger sync');

      setIntegrations(prev => 
        prev.map(int => 
          int.id === integrationId 
            ? { ...int, lastSyncAt: new Date() }
            : int
        )
      );
      
      toast.success('Data sync started');
    } catch (error) {
      console.error('Failed to sync integration:', error);
      toast.error('Failed to start sync');
    }
  };

  const handleUpdateSettings = async (integrationId: string, settings: Partial<Integration['settings']>) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('Failed to update settings');

      setIntegrations(prev => 
        prev.map(int => 
          int.id === integrationId 
            ? { ...int, settings: { ...int.settings, ...settings } }
            : int
        )
      );
      
      toast.success('Settings updated');
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'default';
      case 'error': return 'destructive';
      case 'pending': return 'secondary';
      case 'disconnected': return 'outline';
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'disconnected': return <Database className="w-4 h-4" />;
    }
  };

  const getAvailabilityBadge = (availabilityStatus: string) => {
    switch (availabilityStatus) {
      case 'available':
        return null;
      case 'in_development':
        return (
          <Badge variant="secondary" className="gap-1">
            <Wrench className="w-3 h-3" />
            In Development
          </Badge>
        );
      case 'coming_soon':
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            Coming Soon
          </Badge>
        );
      default:
        return null;
    }
  };

  const getConnectButtonText = (availabilityStatus: string, isConnecting: boolean) => {
    if (isConnecting) return 'Connecting...';
    
    switch (availabilityStatus) {
      case 'available':
        return 'Connect';
      case 'in_development':
        return 'Connect (Beta)';
      case 'coming_soon':
        return 'Notify Me';
      default:
        return 'Connect';
    }
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'ads': return 'Advertising Platforms';
      case 'ecommerce': return 'E-commerce Platforms';
      case 'website': return 'Website & Analytics';
      case 'api': return 'Custom Integrations';
      default: return category;
    }
  };

  const getCategoryProviders = (category: string) => {
    switch (category) {
      case 'ads': return adsProviders;
      case 'ecommerce': return dataProviders;
      case 'website': return websiteProviders;
      case 'api': return apiProviders;
      default: return [];
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const connectedIntegrations = integrations.filter(int => int.status === 'connected' || int.status === 'error');
  const integrationsByCategory = connectedIntegrations.reduce((acc, integration) => {
    if (!acc[integration.category]) acc[integration.category] = [];
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  const categories = ['ads', 'ecommerce', 'website', 'api'] as const;

  return (
    <div className="space-y-8">
      {/* Currently Working On Banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Wrench className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">Currently in Development</h3>
              <p className="text-sm text-blue-700">
                We're actively working on Meta Ads Manager, Google Ads, Amazon Ads, and Shopify integrations. 
                Other platforms will be available soon!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Integrations by Category */}
      {Object.keys(integrationsByCategory).length > 0 && (
        <div className="space-y-8">
          <h2 className="text-xl font-semibold">Connected Data Sources</h2>
          
          {categories.map((category) => {
            const categoryIntegrations = integrationsByCategory[category];
            if (!categoryIntegrations?.length) return null;

            return (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-medium text-muted-foreground">
                  {getCategoryTitle(category)} ({categoryIntegrations.length})
                </h3>
                
                <div className="space-y-4">
                  {categoryIntegrations.map((integration) => (
                    <Card key={integration.id} className="relative">
                      {/* Show development status badge */}
                      {integration.availabilityStatus === 'in_development' && (
                        <div className="absolute top-3 right-3">
                          {getAvailabilityBadge(integration.availabilityStatus)}
                        </div>
                      )}
                      
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              <integration.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <CardDescription>{integration.description}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusColor(integration.status)} className="gap-1">
                              {getStatusIcon(integration.status)}
                              {integration.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        {/* Rest of the connected integration content remains the same */}
                        {integration.accountInfo && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div>
                              <Label className="text-xs text-muted-foreground">Account</Label>
                              <p className="font-medium">{integration.accountInfo.name}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Connected</Label>
                              <p className="font-medium">
                                {integration.connectedAt?.toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Last Sync</Label>
                              <p className="font-medium">
                                {integration.lastSyncAt ? formatLastSync(integration.lastSyncAt) : 'Never'}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Health Status & Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Health Metrics</Label>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Uptime</span>
                                <span>{integration.healthStatus.uptime}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Sync Success Rate</span>
                                <span>{integration.healthStatus.syncSuccess}%</span>
                              </div>
                              {integration.healthStatus.lastError && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Last Error</span>
                                  <span className="text-destructive text-xs">
                                    {integration.healthStatus.lastError}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Sync Settings</Label>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`auto-sync-${integration.id}`} className="text-sm">
                                  Auto Sync
                                </Label>
                                <Switch
                                  id={`auto-sync-${integration.id}`}
                                  checked={integration.settings.autoSync}
                                  onCheckedChange={(checked) => 
                                    handleUpdateSettings(integration.id, { autoSync: checked })
                                  }
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-sm">Sync Frequency</Label>
                                <Select
                                  value={integration.settings.syncFrequency.toString()}
                                  onValueChange={(value) => 
                                    handleUpdateSettings(integration.id, { syncFrequency: parseInt(value) })
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="15">Every 15 minutes</SelectItem>
                                    <SelectItem value="30">Every 30 minutes</SelectItem>
                                    <SelectItem value="60">Every hour</SelectItem>
                                    <SelectItem value="120">Every 2 hours</SelectItem>
                                    <SelectItem value="360">Every 6 hours</SelectItem>
                                    <SelectItem value="720">Every 12 hours</SelectItem>
                                    <SelectItem value="1440">Daily</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSync(integration.id)}
                              className="gap-2"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Sync Now
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="gap-2"
                            >
                              <a href={`/dashboard/integrations/${integration.id}`}>
                                <Settings className="w-4 h-4" />
                                Configure
                              </a>
                            </Button>
                          </div>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="gap-2">
                                <Trash2 className="w-4 h-4" />
                                Disconnect
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Disconnect {integration.name}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will stop data synchronization and remove access to {integration.name} data.
                                  Historical data will be preserved but no new data will be imported.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDisconnect(integration.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Disconnect
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Available Integrations by Category */}
      {categories.map((category) => {
  const providers = getCategoryProviders(category);
  const availableProviders = providers.filter(
    provider => !integrations.some(int => int.provider === provider.id)
  );

  if (availableProviders.length === 0) return null;

  return (
    <div key={`available-${category}`} className="space-y-4">
      <h2 className="text-xl font-semibold">
        Available {getCategoryTitle(category)}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableProviders.map((provider) => (
          <Card 
            key={provider.id} 
            className={`relative flex flex-col h-full ${
              provider.availabilityStatus === 'coming_soon' 
                ? 'opacity-75 bg-muted/30' 
                : provider.availabilityStatus === 'in_development'
                ? 'border-blue-200 bg-blue-50/50'
                : ''
            }`}
          >
            <CardHeader className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <provider.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <CardTitle className="text-lg leading-tight">{provider.name}</CardTitle>
                      {getAvailabilityBadge(provider.availabilityStatus)}
                    </div>
                    <CardDescription className="text-sm leading-relaxed line-clamp-3">
                      {provider.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Button
                onClick={() => handleConnect(provider.id)}
                disabled={connectingProvider === provider.id}
                variant={provider.availabilityStatus === 'coming_soon' ? 'outline' : 'default'}
                className="w-full gap-2"
              >
                {connectingProvider === provider.id ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    {provider.availabilityStatus === 'coming_soon' ? (
                      <Clock className="w-4 h-4" />
                    ) : provider.availabilityStatus === 'in_development' ? (
                      <Wrench className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {getConnectButtonText(provider.availabilityStatus, connectingProvider === provider.id)}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
})}

      {/* Empty State */}
      {connectedIntegrations.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Data Sources Connected</h3>
            <p className="text-muted-foreground text-center">
              Connect your advertising platforms and data sources to start analyzing your D2C performance.
              We're currently working on Meta Ads, Google Ads, Amazon Ads, and Shopify integrations!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}