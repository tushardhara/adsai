'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  BarChart3,
  Eye,
  ExternalLink,
  Filter,
  Search,
  Calendar,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  Settings,
  MoreHorizontal,
  Facebook,
  Globe,
  ShoppingBag,
  Activity,
  Zap,
  Users,
  MousePointer
} from 'lucide-react';
import { toast } from 'sonner';
import { useDashboard } from '@/app/dashboard/providers/dashboard-provider';

interface Campaign {
  id: string;
  name: string;
  provider: 'facebook' | 'google' | 'tiktok' | 'amazon';
  status: 'active' | 'paused' | 'ended' | 'draft';
  objective: string;
  dailyBudget: number;
  totalBudget?: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cpm: number;
  cpc: number;
  ctr: number;
  roas: number;
  cpa: number;
  startDate: Date;
  endDate?: Date;
  lastUpdated: Date;
  accountName: string;
  insights?: {
    trend: 'up' | 'down' | 'stable';
    recommendation?: string;
    optimization?: string;
  };
}

interface CampaignMetrics {
  totalSpend: number;
  totalRevenue: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  avgROAS: number;
  avgCTR: number;
  avgCPA: number;
  activeCampaigns: number;
}

const platformConfig = {
  facebook: {
    name: 'Facebook Ads',
    icon: Facebook,
    color: 'bg-blue-600',
    textColor: 'text-blue-600'
  },
  google: {
    name: 'Google Ads',
    icon: Globe,
    color: 'bg-green-600',
    textColor: 'text-green-600'
  },
  tiktok: {
    name: 'TikTok Ads',
    icon: Activity,
    color: 'bg-purple-600',
    textColor: 'text-purple-600'
  },
  amazon: {
    name: 'Amazon Ads',
    icon: ShoppingBag,
    color: 'bg-orange-600',
    textColor: 'text-orange-600'
  }
};

export function CampaignDashboard() {
  const { currentProject } = useDashboard();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'spend' | 'roas' | 'conversions' | 'ctr'>('spend');
  const [dateRange, setDateRange] = useState('7d');
  const [showOptimizationDialog, setShowOptimizationDialog] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, [dateRange, currentProject]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      
      // Mock data following Aura D2C campaign analytics patterns
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          name: 'Summer Beauty Collection - Prospecting',
          provider: 'facebook',
          status: 'active',
          objective: 'Purchase',
          dailyBudget: 150,
          totalBudget: 5000,
          spent: 2340.50,
          impressions: 485000,
          clicks: 12400,
          conversions: 234,
          revenue: 8925.30,
          cpm: 4.83,
          cpc: 0.19,
          ctr: 2.56,
          roas: 3.81,
          cpa: 10.00,
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-02-15'),
          lastUpdated: new Date(Date.now() - 1800000),
          accountName: 'Glossy Beauty Co',
          insights: {
            trend: 'up',
            recommendation: 'Increase budget by 20% - performing above target ROAS',
            optimization: 'Consider expanding to similar audiences'
          }
        },
        {
          id: '2',
          name: 'Retargeting - Website Visitors 30D',
          provider: 'facebook',
          status: 'active',
          objective: 'Purchase',
          dailyBudget: 80,
          spent: 1245.75,
          impressions: 145000,
          clicks: 4850,
          conversions: 89,
          revenue: 3420.60,
          cpm: 8.59,
          cpc: 0.26,
          ctr: 3.34,
          roas: 2.75,
          cpa: 14.00,
          startDate: new Date('2024-01-10'),
          lastUpdated: new Date(Date.now() - 3600000),
          accountName: 'Glossy Beauty Co',
          insights: {
            trend: 'stable',
            recommendation: 'Good performance, continue current strategy'
          }
        },
        {
          id: '3',
          name: 'Brand Keywords - Exact Match',
          provider: 'google',
          status: 'active',
          objective: 'Conversions',
          dailyBudget: 50,
          spent: 890.25,
          impressions: 89000,
          clicks: 2340,
          conversions: 78,
          revenue: 2890.80,
          cpm: 10.00,
          cpc: 0.38,
          ctr: 2.63,
          roas: 3.25,
          cpa: 11.42,
          startDate: new Date('2024-01-05'),
          lastUpdated: new Date(Date.now() - 900000),
          accountName: 'Glossy Beauty - Google',
          insights: {
            trend: 'up',
            recommendation: 'Strong brand performance, consider expanding to broader match'
          }
        },
        {
          id: '4',
          name: 'Skincare Tutorial - Video Ads',
          provider: 'tiktok',
          status: 'active',
          objective: 'Video Views',
          dailyBudget: 100,
          spent: 1560.00,
          impressions: 780000,
          clicks: 15600,
          conversions: 156,
          revenue: 4890.40,
          cpm: 2.00,
          cpc: 0.10,
          ctr: 2.00,
          roas: 3.13,
          cpa: 10.00,
          startDate: new Date('2024-01-20'),
          lastUpdated: new Date(Date.now() - 1200000),
          accountName: 'GlossyBeauty TikTok',
          insights: {
            trend: 'up',
            recommendation: 'High engagement rate, consider increasing budget'
          }
        },
        {
          id: '5',
          name: 'Sponsored Products - Best Sellers',
          provider: 'amazon',
          status: 'active',
          objective: 'Product Sales',
          dailyBudget: 200,
          spent: 3450.75,
          impressions: 234000,
          clicks: 5850,
          conversions: 195,
          revenue: 12480.30,
          cpm: 14.75,
          cpc: 0.59,
          ctr: 2.50,
          roas: 3.62,
          cpa: 17.70,
          startDate: new Date('2024-01-12'),
          lastUpdated: new Date(Date.now() - 600000),
          accountName: 'Glossy Beauty Amazon',
          insights: {
            trend: 'stable',
            recommendation: 'Optimize product titles and images for better CTR'
          }
        },
        {
          id: '6',
          name: 'Black Friday - Flash Sale',
          provider: 'facebook',
          status: 'paused',
          objective: 'Purchase',
          dailyBudget: 500,
          totalBudget: 10000,
          spent: 9850.00,
          impressions: 2400000,
          clicks: 48000,
          conversions: 890,
          revenue: 45670.50,
          cpm: 4.10,
          cpc: 0.21,
          ctr: 2.00,
          roas: 4.64,
          cpa: 11.07,
          startDate: new Date('2023-11-24'),
          endDate: new Date('2023-11-27'),
          lastUpdated: new Date('2023-11-27'),
          accountName: 'Glossy Beauty Co',
          insights: {
            trend: 'up',
            recommendation: 'Excellent performance - use this creative for future sales'
          }
        }
      ];

      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (): CampaignMetrics => {
    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    
    return {
      totalSpend: campaigns.reduce((sum, c) => sum + c.spent, 0),
      totalRevenue: campaigns.reduce((sum, c) => sum + c.revenue, 0),
      totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
      totalClicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
      totalConversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
      avgROAS: campaigns.length > 0 ? campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length : 0,
      avgCTR: campaigns.length > 0 ? campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length : 0,
      avgCPA: campaigns.length > 0 ? campaigns.reduce((sum, c) => sum + c.cpa, 0) / campaigns.length : 0,
      activeCampaigns: activeCampaigns.length
    };
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesPlatform = selectedPlatform === 'all' || campaign.provider === selectedPlatform;
    const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.accountName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesPlatform && matchesStatus && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'spend': return b.spent - a.spent;
      case 'roas': return b.roas - a.roas;
      case 'conversions': return b.conversions - a.conversions;
      case 'ctr': return b.ctr - a.ctr;
      default: return 0;
    }
  });

  const metrics = calculateMetrics();

  const getStatusBadge = (status: Campaign['status']) => {
    const statusConfig = {
      active: { variant: 'default' as const, text: 'Active', icon: CheckCircle },
      paused: { variant: 'secondary' as const, text: 'Paused', icon: Pause },
      ended: { variant: 'outline' as const, text: 'Ended', icon: AlertTriangle },
      draft: { variant: 'secondary' as const, text: 'Draft', icon: Settings }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <IconComponent className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <BarChart3 className="w-4 h-4 text-gray-500" />;
  };

  const handleCampaignAction = async (campaignId: string, action: 'pause' | 'resume' | 'duplicate') => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: currentProject?.id })
      });

      if (!response.ok) throw new Error(`Failed to ${action} campaign`);

      // Update local state
      setCampaigns(prev => prev.map(c => 
        c.id === campaignId 
          ? { ...c, status: action === 'pause' ? 'paused' : action === 'resume' ? 'active' : c.status }
          : c
      ));

      toast.success(`Campaign ${action}d successfully`);
    } catch (error) {
      console.error(`Failed to ${action} campaign:`, error);
      toast.error(`Failed to ${action} campaign`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number) => `${num.toFixed(2)}%`;

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
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
      {/* Campaign Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spend</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalSpend)}</p>
                <p className="text-sm text-gray-500">Across {metrics.activeCampaigns} active campaigns</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
                <p className="text-sm text-green-600">ROAS: {metrics.avgROAS.toFixed(2)}x</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Conversions</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalConversions)}</p>
                <p className="text-sm text-blue-600">CPA: {formatCurrency(metrics.avgCPA)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg CTR</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(metrics.avgCTR)}</p>
                <p className="text-sm text-purple-600">{formatNumber(metrics.totalClicks)} total clicks</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <MousePointer className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Monitor and optimize your advertising campaigns across all platforms
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => fetchCampaigns()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="amazon">Amazon</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spend">Spend</SelectItem>
                <SelectItem value="roas">ROAS</SelectItem>
                <SelectItem value="conversions">Conversions</SelectItem>
                <SelectItem value="ctr">CTR</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campaign Table */}
          <div className="space-y-4">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Campaigns Found</h3>
                <p className="text-gray-600">
                  {searchTerm || selectedPlatform !== 'all' || selectedStatus !== 'all'
                    ? 'Try adjusting your filters to see more campaigns.'
                    : 'Connect your advertising platforms to start tracking campaigns.'
                  }
                </p>
              </div>
            ) : (
              filteredCampaigns.map((campaign) => {
                const Platform = platformConfig[campaign.provider];
                return (
                  <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Campaign Info */}
                        <div className="lg:col-span-2">
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 ${Platform.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <Platform.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-gray-900 truncate">{campaign.name}</h3>
                                {getStatusBadge(campaign.status)}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {Platform.name} • {campaign.accountName} • {campaign.objective}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Budget: {formatCurrency(campaign.dailyBudget)}/day</span>
                                <span>•</span>
                                <span>Spent: {formatCurrency(campaign.spent)}</span>
                                {campaign.totalBudget && (
                                  <>
                                    <span>•</span>
                                    <span>Total: {formatCurrency(campaign.totalBudget)}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">ROAS</span>
                              <div className="flex items-center gap-1">
                                {getTrendIcon(campaign.insights?.trend || 'stable', campaign.roas)}
                                <span className="font-medium">{campaign.roas.toFixed(2)}x</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">CTR</span>
                              <span className="font-medium">{formatPercentage(campaign.ctr)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">CPA</span>
                              <span className="font-medium">{formatCurrency(campaign.cpa)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Performance */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Revenue</span>
                            <span className="font-medium text-green-600">{formatCurrency(campaign.revenue)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Conversions</span>
                            <span className="font-medium">{campaign.conversions}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Clicks</span>
                            <span className="font-medium">{formatNumber(campaign.clicks)}</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Insights */}
                      {campaign.insights?.recommendation && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-medium text-blue-900 mb-1">Aura AI Insight</h4>
                              <p className="text-sm text-blue-800">{campaign.insights.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="text-xs text-gray-500">
                          Last updated: {campaign.lastUpdated.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2">
                          {campaign.status === 'active' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCampaignAction(campaign.id, 'pause')}
                            >
                              <Pause className="w-4 h-4 mr-1" />
                              Pause
                            </Button>
                          )}
                          {campaign.status === 'paused' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCampaignAction(campaign.id, 'resume')}
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Resume
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Campaign Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setShowOptimizationDialog(campaign.id)}>
                                <Zap className="w-4 h-4 mr-2" />
                                AI Optimization
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCampaignAction(campaign.id, 'duplicate')}>
                                <Settings className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View in {Platform.name}
                                </a>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Optimization Dialog */}
      <Dialog open={!!showOptimizationDialog} onOpenChange={() => setShowOptimizationDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Aura AI Campaign Optimization
            </DialogTitle>
            <DialogDescription>
              AI-powered recommendations for improving campaign performance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {showOptimizationDialog && (() => {
              const campaign = campaigns.find(c => c.id === showOptimizationDialog);
              if (!campaign) return null;

              return (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-900 mb-2">Current Performance</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">ROAS:</span>
                        <span className="font-medium ml-1">{campaign.roas.toFixed(2)}x</span>
                      </div>
                      <div>
                        <span className="text-gray-600">CTR:</span>
                        <span className="font-medium ml-1">{formatPercentage(campaign.ctr)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">CPA:</span>
                        <span className="font-medium ml-1">{formatCurrency(campaign.cpa)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">AI Recommendations</h4>
                    
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm text-green-700 mb-1">Budget Optimization</h5>
                      <p className="text-sm text-gray-600">
                        Increase daily budget by 25% to capture more high-intent users. 
                        Current ROAS of {campaign.roas.toFixed(2)}x is above your target threshold.
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm text-blue-700 mb-1">Audience Expansion</h5>
                      <p className="text-sm text-gray-600">
                        Your current audience is showing strong performance. Consider testing 
                        a 10% lookalike audience to scale reach while maintaining quality.
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm text-purple-700 mb-1">Creative Testing</h5>
                      <p className="text-sm text-gray-600">
                        Test user-generated content (UGC) creatives. Similar brands see 
                        15-20% improvement in CTR with authentic customer testimonials.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      Apply Recommendations
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Schedule A/B Test
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}