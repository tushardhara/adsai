'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  PieChart,
  Users,
  ShoppingCart,
  MousePointer,
  Eye,
  Calendar,
  Download,
  RefreshCw,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Globe,
  MessageSquare,
  Filter,
  Share
} from 'lucide-react';
import { toast } from 'sonner';
import { useDashboard } from '@/app/dashboard/providers/dashboard-provider';

interface AnalyticsMetrics {
  revenue: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  roas: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  conversions: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  aov: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  cac: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  ltv: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
}

interface ChannelPerformance {
  channel: string;
  source: 'facebook' | 'google' | 'tiktok' | 'amazon' | 'organic' | 'email';
  spend: number;
  revenue: number;
  roas: number;
  conversions: number;
  ctr: number;
  cpm: number;
  trend: 'up' | 'down' | 'stable';
}

interface CustomerInsights {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  avgOrderValue: number;
  customerLifetimeValue: number;
  retentionRate: number;
  topSegments: Array<{
    name: string;
    percentage: number;
    revenue: number;
  }>;
}

interface ProductAnalytics {
  topProducts: Array<{
    name: string;
    revenue: number;
    units: number;
    margin: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  categories: Array<{
    name: string;
    revenue: number;
    percentage: number;
  }>;
}

interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'recommendation' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  metrics?: {
    potential_revenue?: number;
    confidence?: number;
  };
}

const channelConfig = {
  facebook: { name: 'Facebook Ads', color: 'bg-blue-600', textColor: 'text-blue-600' },
  google: { name: 'Google Ads', color: 'bg-green-600', textColor: 'text-green-600' },
  tiktok: { name: 'TikTok Ads', color: 'bg-purple-600', textColor: 'text-purple-600' },
  amazon: { name: 'Amazon Ads', color: 'bg-orange-600', textColor: 'text-orange-600' },
  organic: { name: 'Organic', color: 'bg-gray-600', textColor: 'text-gray-600' },
  email: { name: 'Email Marketing', color: 'bg-pink-600', textColor: 'text-pink-600' }
};

export function AnalyticsDashboard() {
  const { currentProject } = useDashboard();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [channelData, setChannelData] = useState<ChannelPerformance[]>([]);
  const [customerInsights, setCustomerInsights] = useState<CustomerInsights | null>(null);
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, currentProject]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Mock data following Aura D2C analytics patterns
      const mockMetrics: AnalyticsMetrics = {
        revenue: { current: 127450.30, previous: 98320.15, change: 29.6, trend: 'up' },
        roas: { current: 4.2, previous: 3.8, change: 10.5, trend: 'up' },
        conversions: { current: 2847, previous: 2234, change: 27.4, trend: 'up' },
        aov: { current: 78.50, previous: 72.30, change: 8.6, trend: 'up' },
        cac: { current: 18.75, previous: 22.40, change: -16.3, trend: 'up' },
        ltv: { current: 245.80, previous: 198.60, change: 23.8, trend: 'up' }
      };

      const mockChannelData: ChannelPerformance[] = [
        {
          channel: 'Facebook Ads',
          source: 'facebook',
          spend: 45230.50,
          revenue: 186450.25,
          roas: 4.12,
          conversions: 1245,
          ctr: 2.8,
          cpm: 12.50,
          trend: 'up'
        },
        {
          channel: 'Google Ads',
          source: 'google',
          spend: 32100.75,
          revenue: 142680.90,
          roas: 4.44,
          conversions: 892,
          ctr: 3.2,
          cpm: 15.80,
          trend: 'up'
        },
        {
          channel: 'TikTok Ads',
          source: 'tiktok',
          spend: 18750.00,
          revenue: 67320.45,
          roas: 3.59,
          conversions: 543,
          ctr: 2.1,
          cpm: 8.90,
          trend: 'stable'
        },
        {
          channel: 'Amazon Ads',
          source: 'amazon',
          spend: 28900.25,
          revenue: 98760.80,
          roas: 3.42,
          conversions: 789,
          ctr: 1.9,
          cpm: 22.30,
          trend: 'down'
        },
        {
          channel: 'Organic Search',
          source: 'organic',
          spend: 0,
          revenue: 45230.15,
          roas: 0,
          conversions: 567,
          ctr: 4.1,
          cpm: 0,
          trend: 'up'
        },
        {
          channel: 'Email Marketing',
          source: 'email',
          spend: 2450.00,
          revenue: 34680.75,
          roas: 14.15,
          conversions: 234,
          ctr: 6.8,
          cpm: 3.20,
          trend: 'up'
        }
      ];

      const mockCustomerInsights: CustomerInsights = {
        totalCustomers: 12847,
        newCustomers: 3456,
        returningCustomers: 9391,
        avgOrderValue: 78.50,
        customerLifetimeValue: 245.80,
        retentionRate: 68.4,
        topSegments: [
          { name: 'Beauty Enthusiasts', percentage: 34.2, revenue: 43580.25 },
          { name: 'Skincare Focused', percentage: 28.7, revenue: 36920.80 },
          { name: 'New Customer', percentage: 22.1, revenue: 28460.15 },
          { name: 'VIP Customers', percentage: 15.0, revenue: 18489.10 }
        ]
      };

      const mockProductAnalytics: ProductAnalytics = {
        topProducts: [
          { name: 'Vitamin C Serum', revenue: 24580.50, units: 892, margin: 68.2, trend: 'up' },
          { name: 'Hydrating Moisturizer', revenue: 18960.25, units: 654, margin: 72.5, trend: 'up' },
          { name: 'Gentle Cleanser', revenue: 15230.80, units: 1234, margin: 58.9, trend: 'stable' },
          { name: 'Night Repair Cream', revenue: 12890.45, units: 432, margin: 75.3, trend: 'up' },
          { name: 'SPF 30 Sunscreen', revenue: 9876.30, units: 567, margin: 64.7, trend: 'down' }
        ],
        categories: [
          { name: 'Serums', revenue: 45230.75, percentage: 35.5 },
          { name: 'Moisturizers', revenue: 32450.20, percentage: 25.4 },
          { name: 'Cleansers', revenue: 24680.15, percentage: 19.3 },
          { name: 'Suncare', revenue: 15890.40, percentage: 12.5 },
          { name: 'Treatments', revenue: 9198.80, percentage: 7.3 }
        ]
      };

      const mockAIInsights: AIInsight[] = [
        {
          id: '1',
          type: 'opportunity',
          title: 'Facebook Audience Expansion Opportunity',
          description: 'Your current Facebook campaigns are performing 23% above target ROAS. Consider expanding to lookalike audiences to scale efficiently.',
          impact: 'high',
          actionable: true,
          metrics: { potential_revenue: 15420.50, confidence: 87 }
        },
        {
          id: '2',
          type: 'warning',
          title: 'Amazon Ads Performance Decline',
          description: 'Amazon campaigns have shown a 12% decrease in ROAS over the past 7 days. Review keyword bids and product listings.',
          impact: 'medium',
          actionable: true,
          metrics: { confidence: 92 }
        },
        {
          id: '3',
          type: 'recommendation',
          title: 'Email Marketing Optimization',
          description: 'Your email campaigns have the highest ROAS at 14.15x. Increase email frequency and implement cart abandonment sequences.',
          impact: 'high',
          actionable: true,
          metrics: { potential_revenue: 8920.30, confidence: 94 }
        },
        {
          id: '4',
          type: 'trend',
          title: 'Seasonal Product Demand Spike',
          description: 'Vitamin C Serum showing 45% increase in demand. Consider increasing inventory and ad spend for this product.',
          impact: 'medium',
          actionable: true,
          metrics: { potential_revenue: 12340.80, confidence: 78 }
        }
      ];

      setMetrics(mockMetrics);
      setChannelData(mockChannelData);
      setCustomerInsights(mockCustomerInsights);
      setProductAnalytics(mockProductAnalytics);
      setAiInsights(mockAIInsights);

    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
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

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const getTrendIcon = (trend: string, isInverted = false) => {
    const isPositive = isInverted ? trend === 'down' : trend === 'up';
    if (isPositive) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'warning': return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'recommendation': return <Zap className="w-5 h-5 text-blue-600" />;
      case 'trend': return <BarChart3 className="w-5 h-5 text-purple-600" />;
    }
  };

  const getInsightBadge = (impact: AIInsight['impact']) => {
    const impactConfig = {
      high: { variant: 'default' as const, text: 'High Impact' },
      medium: { variant: 'secondary' as const, text: 'Medium Impact' },
      low: { variant: 'outline' as const, text: 'Low Impact' }
    };
    return <Badge variant={impactConfig[impact].variant}>{impactConfig[impact].text}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
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

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
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
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" onClick={fetchAnalyticsData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.revenue.current)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(metrics.revenue.trend)}
                  <span className={`text-sm ${metrics.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(metrics.revenue.change)} vs previous period
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ROAS</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.roas.current.toFixed(2)}x</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(metrics.roas.trend)}
                  <span className={`text-sm ${metrics.roas.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(metrics.roas.change)} vs previous period
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.conversions.current)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(metrics.conversions.trend)}
                  <span className={`text-sm ${metrics.conversions.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(metrics.conversions.change)} vs previous period
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Order Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.aov.current)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(metrics.aov.trend)}
                  <span className={`text-sm ${metrics.aov.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(metrics.aov.change)} vs previous period
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customer Acquisition Cost</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.cac.current)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(metrics.cac.trend, true)}
                  <span className={`text-sm ${metrics.cac.trend === 'down' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(Math.abs(metrics.cac.change))} vs previous period
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customer Lifetime Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.ltv.current)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(metrics.ltv.trend)}
                  <span className={`text-sm ${metrics.ltv.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(metrics.ltv.change)} vs previous period
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Aura AI Insights
          </CardTitle>
          <CardDescription>
            AI-powered recommendations and observations from your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  </div>
                  {getInsightBadge(insight.impact)}
                </div>
                
                <p className="text-sm text-gray-600">{insight.description}</p>
                
                {insight.metrics && (
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {insight.metrics.potential_revenue && (
                      <span>Potential: {formatCurrency(insight.metrics.potential_revenue)}</span>
                    )}
                    {insight.metrics.confidence && (
                      <span>Confidence: {insight.metrics.confidence}%</span>
                    )}
                  </div>
                )}
                
                {insight.actionable && (
                  <Button size="sm" variant="outline" className="w-full">
                    Take Action
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Channel Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="products">Product Analytics</TabsTrigger>
          <TabsTrigger value="attribution">Attribution Model</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance Breakdown</CardTitle>
              <CardDescription>
                Compare performance across all your marketing channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channelData.map((channel) => {
                  const config = channelConfig[channel.source];
                  return (
                    <div key={channel.channel} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 ${config.color} rounded-full`}></div>
                            <div>
                              <h4 className="font-medium text-gray-900">{channel.channel}</h4>
                              <p className="text-sm text-gray-600">
                                {channel.spend > 0 ? `Spend: ${formatCurrency(channel.spend)}` : 'Organic'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="font-medium text-green-600">{formatCurrency(channel.revenue)}</div>
                          <div className="text-xs text-gray-500">Revenue</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="font-medium">
                            {channel.roas > 0 ? `${channel.roas.toFixed(2)}x` : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">ROAS</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="font-medium">{channel.conversions}</div>
                          <div className="text-xs text-gray-500">Conversions</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            {getTrendIcon(channel.trend)}
                            <span className="font-medium">{formatPercentage(channel.ctr)}</span>
                          </div>
                          <div className="text-xs text-gray-500">CTR</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          {customerInsights && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(customerInsights.totalCustomers)}</p>
                    <p className="text-sm text-gray-600">Total Customers</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatPercentage(customerInsights.retentionRate)}</p>
                    <p className="text-sm text-gray-600">Retention Rate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(customerInsights.customerLifetimeValue)}</p>
                    <p className="text-sm text-gray-600">Avg. LTV</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Segments</CardTitle>
                  <CardDescription>
                    Revenue breakdown by customer segments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerInsights.topSegments.map((segment, index) => (
                      <div key={segment.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{segment.name}</h4>
                            <p className="text-sm text-gray-600">{formatPercentage(segment.percentage)} of customers</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">{formatCurrency(segment.revenue)}</div>
                          <div className="text-xs text-gray-500">Revenue</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {productAnalytics && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                  <CardDescription>
                    Products driving the most revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productAnalytics.topProducts.map((product, index) => (
                      <div key={product.name} className="p-4 border rounded-lg">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                          <div className="lg:col-span-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {index + 1}
                              </div>
                              <h4 className="font-medium text-gray-900">{product.name}</h4>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-medium text-green-600">{formatCurrency(product.revenue)}</div>
                            <div className="text-xs text-gray-500">Revenue</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-medium">{product.units}</div>
                            <div className="text-xs text-gray-500">Units Sold</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              {getTrendIcon(product.trend)}
                              <span className="font-medium">{formatPercentage(product.margin)}</span>
                            </div>
                            <div className="text-xs text-gray-500">Margin</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>
                    Product category performance breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {productAnalytics.categories.map((category) => (
                      <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{category.name}</h4>
                          <p className="text-sm text-gray-600">{formatPercentage(category.percentage)} of total revenue</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">{formatCurrency(category.revenue)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="attribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attribution Model Analysis</CardTitle>
              <CardDescription>
                Understanding the customer journey across touchpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Attribution Coming Soon</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We're building advanced multi-touch attribution models to help you understand 
                  the complete customer journey across all touchpoints.
                </p>
                <Button className="mt-4" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat with Aura about Attribution
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}