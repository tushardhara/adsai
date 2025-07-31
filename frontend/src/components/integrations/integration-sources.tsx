'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Facebook,
  Instagram,
  ShoppingBag,
  Database,
  Settings,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Calendar,
  DollarSign,
  BarChart3,
  Zap,
  Globe,
  MessageSquare,
  Key,
  Plus,
  Trash2,
  Eye,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { useDashboard } from '@/app/dashboard/providers/dashboard-provider';

interface Integration {
  id: string;
  name: string;
  type: 'ads' | 'ecommerce' | 'analytics' | 'ai';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  provider: string;
  connectedAt?: Date;
  lastSync?: Date;
  accountInfo?: {
    accountId: string;
    accountName: string;
    currency?: string;
    timezone?: string;
  };
  settings: {
    autoSync: boolean;
    syncFrequency: 'realtime' | 'hourly' | 'daily';
    dataRetention: number; // days
  };
  metrics?: {
    totalSpend?: number;
    impressions?: number;
    clicks?: number;
    conversions?: number;
    revenue?: number;
  };
}

interface DataSource {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'ads' | 'ecommerce' | 'analytics' | 'ai';
  category: string;
  features: string[];
  isPopular?: boolean;
  requiresApproval?: boolean;
  setupComplexity: 'easy' | 'medium' | 'advanced';
  estimatedSetupTime: string;
}

const availableDataSources: DataSource[] = [
  // Advertising Platforms
  {
    id: 'facebook-ads',
    name: 'Facebook Ads',
    description: 'Connect your Facebook and Instagram ad campaigns for comprehensive performance tracking',
    icon: Facebook,
    type: 'ads',
    category: 'Social Media Advertising',
    features: ['Campaign metrics', 'Audience insights', 'Creative performance', 'Attribution tracking'],
    isPopular: true,
    setupComplexity: 'easy',
    estimatedSetupTime: '2-3 minutes'
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    description: 'Import Google Ads campaign data including search, display, and shopping campaigns',
    icon: Globe,
    type: 'ads',
    category: 'Search & Display Advertising',
    features: ['Search campaigns', 'Shopping ads', 'Display network', 'YouTube ads'],
    isPopular: true,
    setupComplexity: 'easy',
    estimatedSetupTime: '3-5 minutes'
  },
  {
    id: 'tiktok-ads',
    name: 'TikTok Ads',
    description: 'Track TikTok advertising performance and audience engagement',
    icon: Activity,
    type: 'ads',
    category: 'Social Media Advertising',
    features: ['Video ad performance', 'Audience targeting', 'Creative insights', 'Conversion tracking'],
    setupComplexity: 'medium',
    estimatedSetupTime: '5-10 minutes'
  },
  {
    id: 'amazon-ads',
    name: 'Amazon Advertising',
    description: 'Monitor Amazon sponsored products, brands, and display campaigns',
    icon: ShoppingBag,
    type: 'ads',
    category: 'E-commerce Advertising',
    features: ['Sponsored products', 'Brand campaigns', 'Display ads', 'ACOS tracking'],
    setupComplexity: 'medium',
    estimatedSetupTime: '10-15 minutes'
  },

  // E-commerce Platforms
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Sync orders, customers, products, and inventory data from your Shopify store',
    icon: ShoppingBag,
    type: 'ecommerce',
    category: 'E-commerce Platform',
    features: ['Order data', 'Customer analytics', 'Product performance', 'Inventory tracking'],
    isPopular: true,
    setupComplexity: 'easy',
    estimatedSetupTime: '2-3 minutes'
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Connect your WordPress WooCommerce store for sales and customer insights',
    icon: ShoppingBag,
    type: 'ecommerce',
    category: 'E-commerce Platform',
    features: ['Sales analytics', 'Customer data', 'Product insights', 'Order tracking'],
    setupComplexity: 'medium',
    estimatedSetupTime: '5-10 minutes'
  },
  {
    id: 'amazon-seller',
    name: 'Amazon Seller Central',
    description: 'Import sales data, inventory levels, and performance metrics from Amazon',
    icon: ShoppingBag,
    type: 'ecommerce',
    category: 'Marketplace',
    features: ['Sales data', 'Inventory management', 'Performance metrics', 'Fee analysis'],
    setupComplexity: 'advanced',
    estimatedSetupTime: '15-20 minutes'
  },

  // Analytics Platforms
  {
    id: 'google-analytics',
    name: 'Google Analytics 4',
    description: 'Track website traffic, user behavior, and conversion funnels',
    icon: BarChart3,
    type: 'analytics',
    category: 'Web Analytics',
    features: ['Traffic analysis', 'User behavior', 'Conversion tracking', 'Audience insights'],
    isPopular: true,
    setupComplexity: 'easy',
    estimatedSetupTime: '3-5 minutes'
  },
  {
    id: 'klaviyo',
    name: 'Klaviyo',
    description: 'Connect email marketing performance and customer segmentation data',
    icon: MessageSquare,
    type: 'analytics',
    category: 'Email Marketing',
    features: ['Email performance', 'Customer segments', 'Automation metrics', 'Revenue attribution'],
    setupComplexity: 'medium',
    estimatedSetupTime: '5-10 minutes'
  },

  // AI Providers
  {
    id: 'openai',
    name: 'OpenAI GPT-4',
    description: 'Use your own OpenAI API key for enhanced AI analysis and insights',
    icon: MessageSquare,
    type: 'ai',
    category: 'AI Provider',
    features: ['Custom AI analysis', 'Advanced insights', 'Personalized recommendations', 'Cost optimization'],
    setupComplexity: 'easy',
    estimatedSetupTime: '1-2 minutes'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Connect your Claude API for advanced reasoning and analysis',
    icon: MessageSquare,
    type: 'ai',
    category: 'AI Provider',
    features: ['Advanced reasoning', 'Long-form analysis', 'Code generation', 'Data interpretation'],
    setupComplexity: 'easy',
    estimatedSetupTime: '1-2 minutes'
  }
];

export function IntegrationSources() {
  const { currentProject } = useDashboard();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingSource, setConnectingSource] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'ads' | 'ecommerce' | 'analytics' | 'ai'>('all');

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      
      // Mock data following Aura D2C analytics integration patterns
      const mockIntegrations: Integration[] = [
        {
          id: '1',
          name: 'Facebook Ads',
          type: 'ads',
          status: 'connected',
          provider: 'facebook-ads',
          connectedAt: new Date('2024-01-15'),
          lastSync: new Date(Date.now() - 1800000), // 30 minutes ago
          accountInfo: {
            accountId: 'act_123456789',
            accountName: 'Glossy Beauty Co',
            currency: 'USD',
            timezone: 'America/New_York'
          },
          settings: {
            autoSync: true,
            syncFrequency: 'hourly',
            dataRetention: 90
          },
          metrics: {
            totalSpend: 15420.50,
            impressions: 2450000,
            clicks: 48900,
            conversions: 1250
          }
        },
        {
          id: '2',
          name: 'Shopify Store',
          type: 'ecommerce',
          status: 'connected',
          provider: 'shopify',
          connectedAt: new Date('2024-01-10'),
          lastSync: new Date(Date.now() - 900000), // 15 minutes ago
          accountInfo: {
            accountId: 'shop_987654321',
            accountName: 'glossy-beauty.myshopify.com',
            currency: 'USD',
            timezone: 'America/New_York'
          },
          settings: {
            autoSync: true,
            syncFrequency: 'realtime',
            dataRetention: 365
          },
          metrics: {
            revenue: 45670.25,
            conversions: 892
          }
        },
        {
          id: '3',
          name: 'Google Analytics 4',
          type: 'analytics',
          status: 'syncing',
          provider: 'google-analytics',
          connectedAt: new Date('2024-01-20'),
          lastSync: new Date(Date.now() - 300000), // 5 minutes ago
          accountInfo: {
            accountId: 'GA4-123456789',
            accountName: 'Glossy Beauty Website'
          },
          settings: {
            autoSync: true,
            syncFrequency: 'hourly',
            dataRetention: 180
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

  const handleConnect = async (sourceId: string) => {
    try {
      setConnectingSource(sourceId);
      
      const source = availableDataSources.find(s => s.id === sourceId);
      if (!source) throw new Error('Data source not found');

      // Handle AI providers with API key input
      if (source.type === 'ai') {
        setShowApiKeyModal(sourceId);
        setConnectingSource(null);
        return;
      }

      // For OAuth providers, redirect to authorization URL
      const response = await fetch('/api/integrations/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          provider: sourceId,
          projectId: currentProject?.id 
        })
      });

      if (!response.ok) throw new Error('Failed to initiate connection');

      const { authUrl } = await response.json();
      window.location.href = authUrl;

    } catch (error) {
      console.error('Failed to connect integration:', error);
      toast.error('Failed to connect data source');
    } finally {
      setConnectingSource(null);
    }
  };

  const handleConnectWithApiKey = async () => {
    try {
      if (!apiKeyInput.trim()) {
        toast.error('Please enter a valid API key');
        return;
      }

      const response = await fetch('/api/integrations/connect-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: showApiKeyModal,
          apiKey: apiKeyInput.trim(),
          projectId: currentProject?.id
        })
      });

      if (!response.ok) throw new Error('Failed to connect with API key');

      const newIntegration = await response.json();
      setIntegrations(prev => [...prev, newIntegration]);
      
      setShowApiKeyModal(null);
      setApiKeyInput('');
      toast.success('AI provider connected successfully');

    } catch (error) {
      console.error('Failed to connect AI provider:', error);
      toast.error('Failed to connect AI provider');
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}/disconnect`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to disconnect integration');

      setIntegrations(prev => prev.filter(i => i.id !== integrationId));
      toast.success('Integration disconnected successfully');

    } catch (error) {
      console.error('Failed to disconnect integration:', error);
      toast.error('Failed to disconnect integration');
    }
  };

  const handleSyncNow = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}/sync`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to trigger sync');

      setIntegrations(prev => prev.map(i => 
        i.id === integrationId 
          ? { ...i, status: 'syncing' as const }
          : i
      ));

      toast.success('Data sync initiated');

    } catch (error) {
      console.error('Failed to sync integration:', error);
      toast.error('Failed to sync data');
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

      setIntegrations(prev => prev.map(i => 
        i.id === integrationId 
          ? { ...i, settings: { ...i.settings, ...settings } }
          : i
      ));

      toast.success('Settings updated successfully');

    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const getStatusBadge = (status: Integration['status']) => {
    const statusConfig = {
      connected: { variant: 'default' as const, text: 'Connected', icon: CheckCircle },
      disconnected: { variant: 'secondary' as const, text: 'Disconnected', icon: AlertTriangle },
      error: { variant: 'destructive' as const, text: 'Error', icon: AlertTriangle },
      syncing: { variant: 'secondary' as const, text: 'Syncing', icon: RefreshCw }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <IconComponent className={`w-3 h-3 ${status === 'syncing' ? 'animate-spin' : ''}`} />
        {config.text}
      </Badge>
    );
  };

  const getComplexityBadge = (complexity: DataSource['setupComplexity']) => {
    const complexityConfig = {
      easy: { variant: 'default' as const, text: 'Easy Setup' },
      medium: { variant: 'secondary' as const, text: 'Medium Setup' },
      advanced: { variant: 'outline' as const, text: 'Advanced Setup' }
    };

    return (
      <Badge variant={complexityConfig[complexity].variant} className="text-xs">
        {complexityConfig[complexity].text}
      </Badge>
    );
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const filteredDataSources = selectedTab === 'all' 
    ? availableDataSources 
    : availableDataSources.filter(source => source.type === selectedTab);

  const connectedIntegrations = integrations.filter(i => i.status === 'connected');

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

  return (
    <div className="space-y-6">
      {/* Current Integrations Overview */}
      {connectedIntegrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Connected Data Sources ({connectedIntegrations.length})
            </CardTitle>
            <CardDescription>
              Manage your connected integrations and sync settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {integration.type === 'ads' && <DollarSign className="w-5 h-5 text-blue-600" />}
                      {integration.type === 'ecommerce' && <ShoppingBag className="w-5 h-5 text-green-600" />}
                      {integration.type === 'analytics' && <BarChart3 className="w-5 h-5 text-purple-600" />}
                      {integration.type === 'ai' && <MessageSquare className="w-5 h-5 text-orange-600" />}
                    </div>
                    <div>
                      <h3 className="font-medium">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {integration.accountInfo?.accountName || 'No account info'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(integration.status)}
                  </div>
                </div>

                {/* Integration Metrics */}
                {integration.metrics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {integration.metrics.totalSpend && (
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-lg font-semibold text-blue-600">
                          ${integration.metrics.totalSpend.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Spend</div>
                      </div>
                    )}
                    {integration.metrics.revenue && (
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-lg font-semibold text-green-600">
                          ${integration.metrics.revenue.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                    )}
                    {integration.metrics.impressions && (
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-lg font-semibold text-purple-600">
                          {(integration.metrics.impressions / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-muted-foreground">Impressions</div>
                      </div>
                    )}
                    {integration.metrics.conversions && (
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-lg font-semibold text-orange-600">
                          {integration.metrics.conversions.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Conversions</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Integration Settings */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Last sync: {integration.lastSync ? formatLastSync(integration.lastSync) : 'Never'}</span>
                    <span>•</span>
                    <span>Auto-sync: {integration.settings.autoSync ? 'On' : 'Off'}</span>
                    <span>•</span>
                    <span>Frequency: {integration.settings.syncFrequency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSyncNow(integration.id)}
                      disabled={integration.status === 'syncing'}
                    >
                      <RefreshCw className={`w-4 h-4 mr-1 ${integration.status === 'syncing' ? 'animate-spin' : ''}`} />
                      Sync Now
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Settings
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Integration Settings</DialogTitle>
                          <DialogDescription>
                            Configure sync settings for {integration.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="auto-sync">Auto-sync enabled</Label>
                            <Switch
                              id="auto-sync"
                              checked={integration.settings.autoSync}
                              onCheckedChange={(checked) => 
                                handleUpdateSettings(integration.id, { autoSync: checked })
                              }
                            />
                          </div>
                          <div>
                            <Label>Sync Frequency</Label>
                            <select 
                              className="w-full mt-1 p-2 border rounded"
                              value={integration.settings.syncFrequency}
                              onChange={(e) => 
                                handleUpdateSettings(integration.id, { 
                                  syncFrequency: e.target.value as any 
                                })
                              }
                            >
                              <option value="realtime">Real-time</option>
                              <option value="hourly">Hourly</option>
                              <option value="daily">Daily</option>
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">
                                <Trash2 className="w-4 h-4 mr-1" />
                                Disconnect
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Disconnect Integration</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to disconnect {integration.name}? 
                                  This will stop data synchronization and may affect your analytics.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDisconnect(integration.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Disconnect
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Available Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Data Source
          </CardTitle>
          <CardDescription>
            Connect additional platforms to enhance your analytics insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Sources</TabsTrigger>
              <TabsTrigger value="ads">Advertising</TabsTrigger>
              <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="ai">AI Providers</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDataSources.map((source) => {
                  const isConnected = integrations.some(i => i.provider === source.id);
                  const isConnecting = connectingSource === source.id;
                  
                  return (
                    <Card key={source.id} className={`relative ${isConnected ? 'border-green-200 bg-green-50' : ''}`}>
                      {source.isPopular && (
                        <Badge className="absolute -top-2 -right-2 bg-blue-600">
                          Popular
                        </Badge>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white border rounded-lg flex items-center justify-center">
                              <source.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{source.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                {getComplexityBadge(source.setupComplexity)}
                                <Badge variant="outline" className="text-xs">
                                  {source.estimatedSetupTime}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {isConnected && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {source.description}
                        </p>
                        
                        <div>
                          <Label className="text-sm font-medium">Key Features:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {source.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {source.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{source.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {isConnected ? (
                            <Button variant="outline" disabled className="flex-1">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Connected
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleConnect(source.id)}
                              disabled={isConnecting}
                              className="flex-1"
                            >
                              {isConnecting ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Connect
                                </>
                              )}
                            </Button>
                          )}
                          
                          <Button variant="outline" size="icon" asChild>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Provider API Key Modal */}
      <Dialog open={!!showApiKeyModal} onOpenChange={() => setShowApiKeyModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect AI Provider</DialogTitle>
            <DialogDescription>
              Enter your API key to connect {availableDataSources.find(s => s.id === showApiKeyModal)?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your API key is encrypted and stored securely
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApiKeyModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleConnectWithApiKey}>
              <Key className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}