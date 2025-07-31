'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Globe,
  Search,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  TrendingUp,
  Eye,
  Plus,
  ExternalLink,
  BarChart3,
  Target,
  ShoppingBag,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Competitor {
  id: string;
  name: string;
  domain: string;
  industry: string;
  addedAt: Date;
  status: 'active' | 'tracking' | 'error';
  platforms: {
    website: boolean;
    instagram: boolean;
    facebook: boolean;
    twitter: boolean;
    youtube: boolean;
    amazon: boolean;
  };
  lastUpdated: Date;
  insights: {
    adCount: number;
    socialPosts: number;
    trafficEstimate: string;
    topKeywords: string[];
  };
}

interface CompetitorPlatform {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  dataPoints: string[];
  urlPlaceholder: string;
  urlPattern: RegExp;
}

const platforms: CompetitorPlatform[] = [
  {
    id: 'website',
    name: 'Website',
    icon: Globe,
    description: 'Track website changes, SEO performance, and content updates',
    dataPoints: ['Page changes', 'SEO keywords', 'Content updates', 'Technology stack'],
    urlPlaceholder: 'https://competitor.com',
    urlPattern: /^https?:\/\/.+\..+/
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    description: 'Monitor posts, stories, ads, and engagement metrics',
    dataPoints: ['Posts & stories', 'Ad creatives', 'Engagement rates', 'Hashtag usage'],
    urlPlaceholder: 'https://instagram.com/username',
    urlPattern: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+/
  },
  {
    id: 'facebook',
    name: 'Facebook Page',
    icon: Facebook,
    description: 'Track page updates, ads, and audience engagement',
    dataPoints: ['Page posts', 'Facebook ads', 'Audience growth', 'Event promotion'],
    urlPlaceholder: 'https://facebook.com/pagename',
    urlPattern: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_.]+/
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: Twitter,
    description: 'Monitor tweets, engagement, and promotional content',
    dataPoints: ['Tweet content', 'Engagement metrics', 'Hashtag trends', 'Promotional tweets'],
    urlPlaceholder: 'https://twitter.com/username',
    urlPattern: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+/
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    description: 'Track video content, ads, and channel performance',
    dataPoints: ['Video uploads', 'YouTube ads', 'View counts', 'Channel growth'],
    urlPlaceholder: 'https://youtube.com/@channelname',
    urlPattern: /^https?:\/\/(www\.)?youtube\.com\/(channel\/|@)[a-zA-Z0-9_-]+/
  },
  {
    id: 'amazon',
    name: 'Amazon Store',
    icon: ShoppingBag,
    description: 'Monitor product listings, pricing, and reviews',
    dataPoints: ['Product listings', 'Price changes', 'Review monitoring', 'Sponsored products'],
    urlPlaceholder: 'https://amazon.com/stores/storename',
    urlPattern: /^https?:\/\/(www\.)?amazon\.(com|co\.uk|de|fr|it|es|ca)\/stores\/[a-zA-Z0-9-]+/
  }
];

export function CompetitiveIntelligence() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({
    name: '',
    domain: '',
    industry: '',
    platforms: {} as Record<string, string>
  });

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    try {
      setLoading(true);
      
      // Mock data following Aura D2C competitive intelligence patterns
      const mockCompetitors: Competitor[] = [
        {
          id: '1',
          name: 'GlossierInc',
          domain: 'glossier.com',
          industry: 'Beauty & Cosmetics',
          addedAt: new Date('2024-01-10'),
          status: 'active',
          platforms: {
            website: true,
            instagram: true,
            facebook: true,
            twitter: true,
            youtube: false,
            amazon: true
          },
          lastUpdated: new Date(Date.now() - 3600000), // 1 hour ago
          insights: {
            adCount: 47,
            socialPosts: 156,
            trafficEstimate: '2.1M/month',
            topKeywords: ['makeup', 'skincare', 'beauty routine', 'clean beauty']
          }
        },
        {
          id: '2',
          name: 'Rare Beauty',
          domain: 'rarebeauty.com',
          industry: 'Beauty & Cosmetics',
          addedAt: new Date('2024-01-15'),
          status: 'tracking',
          platforms: {
            website: true,
            instagram: true,
            facebook: false,
            twitter: true,
            youtube: true,
            amazon: false
          },
          lastUpdated: new Date(Date.now() - 7200000), // 2 hours ago
          insights: {
            adCount: 23,
            socialPosts: 89,
            trafficEstimate: '1.8M/month',
            topKeywords: ['mental health', 'makeup', 'inclusive beauty', 'self-acceptance']
          }
        }
      ];

      setCompetitors(mockCompetitors);
    } catch (error) {
      console.error('Failed to fetch competitors:', error);
      toast.error('Failed to load competitors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompetitor = async () => {
    try {
      if (!newCompetitor.name || !newCompetitor.domain) {
        toast.error('Please fill in required fields');
        return;
      }

      const platformsEnabled = Object.entries(newCompetitor.platforms).reduce((acc, [key, value]) => {
        acc[key] = !!value;
        return acc;
      }, {} as Record<string, boolean>);

      const competitor: Omit<Competitor, 'id'> = {
        name: newCompetitor.name,
        domain: newCompetitor.domain,
        industry: newCompetitor.industry || 'General',
        addedAt: new Date(),
        status: 'tracking',
        platforms: {
          website: platformsEnabled.website || false,
          instagram: platformsEnabled.instagram || false,
          facebook: platformsEnabled.facebook || false,
          twitter: platformsEnabled.twitter || false,
          youtube: platformsEnabled.youtube || false,
          amazon: platformsEnabled.amazon || false
        },
        lastUpdated: new Date(),
        insights: {
          adCount: 0,
          socialPosts: 0,
          trafficEstimate: 'Analyzing...',
          topKeywords: []
        }
      };

      const response = await fetch('/api/competitive/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(competitor)
      });

      if (!response.ok) throw new Error('Failed to add competitor');

      const { id } = await response.json();
      setCompetitors(prev => [...prev, { ...competitor, id }]);
      
      setNewCompetitor({ name: '', domain: '', industry: '', platforms: {} });
      setShowAddModal(false);
      toast.success('Competitor added successfully');
    } catch (error) {
      console.error('Failed to add competitor:', error);
      toast.error('Failed to add competitor');
    }
  };

  const handleRemoveCompetitor = async (competitorId: string) => {
    try {
      const response = await fetch(`/api/competitive/competitors/${competitorId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to remove competitor');

      setCompetitors(prev => prev.filter(c => c.id !== competitorId));
      toast.success('Competitor removed');
    } catch (error) {
      console.error('Failed to remove competitor:', error);
      toast.error('Failed to remove competitor');
    }
  };

  const validatePlatformUrl = (platformId: string, url: string): boolean => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.urlPattern.test(url) : false;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default' as const, text: 'Active' },
      tracking: { variant: 'secondary' as const, text: 'Tracking' },
      error: { variant: 'destructive' as const, text: 'Error' }
    };

    const config = variants[status as keyof typeof variants] || variants.tracking;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
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

  return (
    <div className="space-y-6">
      {/* Add Competitor Button - No duplicate header */}
      <div className="flex justify-end">
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Competitor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Competitor</DialogTitle>
              <DialogDescription>
                Track a competitor across multiple platforms and channels
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Competitor Name *</Label>
                  <Input
                    id="name"
                    value={newCompetitor.name}
                    onChange={(e) => setNewCompetitor(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Glossier, Rare Beauty, etc."
                  />
                </div>
                
                <div>
                  <Label htmlFor="domain">Website Domain *</Label>
                  <Input
                    id="domain"
                    value={newCompetitor.domain}
                    onChange={(e) => setNewCompetitor(prev => ({ ...prev, domain: e.target.value }))}
                    placeholder="glossier.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={newCompetitor.industry}
                  onChange={(e) => setNewCompetitor(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="Beauty & Cosmetics, Fashion, etc."
                />
              </div>

              <div>
                <Label className="text-base font-medium">Platforms to Track</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Add platform URLs to track competitor activity
                </p>
                
                <div className="space-y-3">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <platform.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1">
                        <Label className="font-medium">{platform.name}</Label>
                        <Input
                          placeholder={platform.urlPlaceholder}
                          value={newCompetitor.platforms[platform.id] || ''}
                          onChange={(e) => setNewCompetitor(prev => ({
                            ...prev,
                            platforms: { ...prev.platforms, [platform.id]: e.target.value }
                          }))}
                          className="mt-1"
                        />
                        {newCompetitor.platforms[platform.id] && 
                         !validatePlatformUrl(platform.id, newCompetitor.platforms[platform.id]) && (
                          <p className="text-xs text-red-600 mt-1">Invalid URL format</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCompetitor}>
                Add Competitor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Competitors List */}
      {competitors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Eye className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Competitors Added</h3>
            <p className="text-muted-foreground text-center">
              Start tracking your competitors across websites, social media, and advertising platforms.
            </p>
            <Button 
              onClick={() => setShowAddModal(true)} 
              className="mt-4 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Competitor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {competitors.map((competitor) => (
            <Card key={competitor.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {competitor.name}
                      {getStatusBadge(competitor.status)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {competitor.domain}
                      </span>
                      <span>•</span>
                      <span>{competitor.industry}</span>
                      <span>•</span>
                      <span>Last updated {formatLastUpdated(competitor.lastUpdated)}</span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveCompetitor(competitor.id)}
                  >
                    Remove
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="platforms">Platforms</TabsTrigger>
                    <TabsTrigger value="ads">Ads Tracking</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{competitor.insights.adCount}</div>
                        <div className="text-sm text-muted-foreground">Active Ads</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{competitor.insights.socialPosts}</div>
                        <div className="text-sm text-muted-foreground">Social Posts</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{competitor.insights.trafficEstimate}</div>
                        <div className="text-sm text-muted-foreground">Monthly Traffic</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {Object.values(competitor.platforms).filter(Boolean).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Platforms</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="platforms" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {platforms.map((platform) => (
                        <div 
                          key={platform.id} 
                          className={`p-4 border rounded-lg ${
                            competitor.platforms[platform.id as keyof typeof competitor.platforms] 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <platform.icon className="w-5 h-5" />
                            <div className="flex-1">
                              <div className="font-medium">{platform.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {competitor.platforms[platform.id as keyof typeof competitor.platforms] 
                                  ? 'Tracking active' 
                                  : 'Not tracked'
                                }
                              </div>
                            </div>
                            {competitor.platforms[platform.id as keyof typeof competitor.platforms] && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={`#`} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="ads" className="space-y-4">
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Ad Tracking Coming Soon</h3>
                      <p className="text-muted-foreground">
                        We're building advanced ad tracking capabilities to show you competitor campaigns across platforms.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="insights" className="space-y-4">
                    {competitor.insights.topKeywords.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Top Keywords</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {competitor.insights.topKeywords.map((keyword, index) => (
                            <Badge key={index} variant="outline">{keyword}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}