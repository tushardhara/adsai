'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Download,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  Database,
  MessageSquare,
  Zap,
  Crown,
  ArrowUpRight,
  FileText,
  DollarSign,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '../ui/label';

interface BillingInfo {
  subscription: {
    plan: 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    trialEndsAt?: Date;
  };
  usage: {
    projects: { current: number; limit: number };
    integrations: { current: number; limit: number };
    auraRequests: { current: number; limit: number };
    teamMembers: { current: number; limit: number };
  };
  billing: {
    amount: number;
    currency: string;
    interval: 'month' | 'year';
    nextBillingDate: Date;
    paymentMethod?: {
      type: 'card' | 'bank';
      last4: string;
      brand: string;
      expiryMonth: number;
      expiryYear: number;
    };
  };
  invoices: Invoice[];
}

interface Invoice {
  id: string;
  number: string;
  date: Date;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
  description: string;
}

interface PlanFeatures {
  name: string;
  price: { monthly: number; yearly: number };
  features: {
    projects: number;
    integrations: number;
    auraRequests: number;
    teamMembers: number;
    support: string;
    advanced: string[];
  };
}

const plans: Record<string, PlanFeatures> = {
  starter: {
    name: 'Starter',
    price: { monthly: 49, yearly: 490 },
    features: {
      projects: 1,
      integrations: 3,
      auraRequests: 1000,
      teamMembers: 2,
      support: 'Email support',
      advanced: ['Basic analytics', 'Standard dashboards']
    }
  },
  professional: {
    name: 'Professional',
    price: { monthly: 149, yearly: 1490 },
    features: {
      projects: 5,
      integrations: 10,
      auraRequests: 5000,
      teamMembers: 10,
      support: 'Priority support',
      advanced: ['Advanced analytics', 'Custom dashboards', 'API access', 'Webhooks']
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: { monthly: 499, yearly: 4990 },
    features: {
      projects: -1, // unlimited
      integrations: -1, // unlimited
      auraRequests: 25000,
      teamMembers: -1, // unlimited
      support: 'Dedicated success manager',
      advanced: ['White-label', 'SSO', 'Advanced security', 'Custom integrations']
    }
  }
};

export function BillingSettings() {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [changingPlan, setChangingPlan] = useState(false);

  useEffect(() => {
    fetchBillingInfo();
  }, []);

  const fetchBillingInfo = async () => {
    try {
      setLoading(true);
      
      // Mock data following Aura D2C analytics billing patterns
      const mockBillingInfo: BillingInfo = {
        subscription: {
          plan: 'professional',
          status: 'active',
          currentPeriodStart: new Date('2024-01-01'),
          currentPeriodEnd: new Date('2024-02-01'),
          cancelAtPeriodEnd: false
        },
        usage: {
          projects: { current: 3, limit: 5 },
          integrations: { current: 7, limit: 10 },
          auraRequests: { current: 2847, limit: 5000 },
          teamMembers: { current: 4, limit: 10 }
        },
        billing: {
          amount: 149,
          currency: 'USD',
          interval: 'month',
          nextBillingDate: new Date('2024-02-01'),
          paymentMethod: {
            type: 'card',
            last4: '4242',
            brand: 'Visa',
            expiryMonth: 12,
            expiryYear: 2025
          }
        },
        invoices: [
          {
            id: 'inv_1',
            number: 'INV-2024-001',
            date: new Date('2024-01-01'),
            amount: 149,
            currency: 'USD',
            status: 'paid',
            downloadUrl: '/api/invoices/inv_1/download',
            description: 'Aura Professional - January 2024'
          },
          {
            id: 'inv_2',
            number: 'INV-2023-012',
            date: new Date('2023-12-01'),
            amount: 149,
            currency: 'USD',
            status: 'paid',
            downloadUrl: '/api/invoices/inv_2/download',
            description: 'Aura Professional - December 2023'
          },
          {
            id: 'inv_3',
            number: 'INV-2023-011',
            date: new Date('2023-11-01'),
            amount: 149,
            currency: 'USD',
            status: 'paid',
            downloadUrl: '/api/invoices/inv_3/download',
            description: 'Aura Professional - November 2023'
          }
        ]
      };

      setBillingInfo(mockBillingInfo);
    } catch (error) {
      console.error('Failed to fetch billing info:', error);
      toast.error('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (newPlan: string) => {
    try {
      setChangingPlan(true);
      
      const response = await fetch('/api/billing/subscription', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan })
      });

      if (!response.ok) throw new Error('Failed to change plan');

      setBillingInfo(prev => prev ? {
        ...prev,
        subscription: { ...prev.subscription, plan: newPlan as any }
      } : null);

      toast.success(`Successfully upgraded to ${plans[newPlan].name} plan`);
    } catch (error) {
      console.error('Failed to change plan:', error);
      toast.error('Failed to change subscription plan');
    } finally {
      setChangingPlan(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('/api/billing/subscription/cancel', {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to cancel subscription');

      setBillingInfo(prev => prev ? {
        ...prev,
        subscription: { ...prev.subscription, cancelAtPeriodEnd: true }
      } : null);

      toast.success('Subscription will be canceled at the end of the current period');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  const handleUpdatePaymentMethod = () => {
    // Redirect to Stripe customer portal or payment method update
    window.location.href = '/api/billing/customer-portal';
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/download`);
      if (!response.ok) throw new Error('Failed to download invoice');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default' as const, icon: CheckCircle, text: 'Active' },
      trialing: { variant: 'secondary' as const, icon: Clock, text: 'Trial' },
      canceled: { variant: 'destructive' as const, icon: AlertTriangle, text: 'Canceled' },
      past_due: { variant: 'destructive' as const, icon: AlertTriangle, text: 'Past Due' }
    };

    const config = variants[status as keyof typeof variants] || variants.active;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <IconComponent className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const formatUsageLimit = (limit: number) => {
    return limit === -1 ? 'Unlimited' : limit.toLocaleString();
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

  if (!billingInfo) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Unable to Load Billing Information</h3>
          <p className="text-muted-foreground text-center">
            There was an error loading your billing details. Please try again or contact support.
          </p>
          <Button onClick={fetchBillingInfo} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentPlan = plans[billingInfo.subscription.plan];
  const isTrialing = billingInfo.subscription.status === 'trialing';

  return (
    <div className="space-y-6">
      {/* Current Plan & Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Current Plan: {currentPlan.name}
              </CardTitle>
              <CardDescription>
                Manage your Aura subscription and billing preferences
              </CardDescription>
            </div>
            {getStatusBadge(billingInfo.subscription.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Monthly Cost</Label>
              <div className="text-2xl font-bold">
                ${billingInfo.billing.amount}
                <span className="text-sm font-normal text-muted-foreground">
                  /{billingInfo.billing.interval}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {isTrialing ? 'Trial Ends' : 'Next Billing'}
              </Label>
              <div className="text-lg font-medium">
                {isTrialing 
                  ? billingInfo.subscription.trialEndsAt?.toLocaleDateString()
                  : billingInfo.billing.nextBillingDate.toLocaleDateString()
                }
              </div>
            </div>

            {billingInfo.billing.paymentMethod && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Payment Method</Label>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-lg font-medium">
                    {billingInfo.billing.paymentMethod.brand} •••• {billingInfo.billing.paymentMethod.last4}
                  </span>
                </div>
              </div>
            )}
          </div>

          {billingInfo.subscription.cancelAtPeriodEnd && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">Subscription Ending</p>
                  <p className="text-sm text-orange-600">
                    Your subscription will be canceled on {billingInfo.subscription.currentPeriodEnd.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={() => window.location.href = '/dashboard/settings/billing/plans'}>
              Change Plan
            </Button>
            
            <Button variant="outline" onClick={handleUpdatePaymentMethod}>
              Update Payment Method
            </Button>

            {!billingInfo.subscription.cancelAtPeriodEnd && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Cancel Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel your Aura subscription? You'll lose access to all features 
                      at the end of your current billing period ({billingInfo.subscription.currentPeriodEnd.toLocaleDateString()}).
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelSubscription}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Cancel Subscription
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage & Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Usage & Limits
          </CardTitle>
          <CardDescription>
            Track your current usage against plan limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Projects */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-medium">Projects</Label>
                </div>
                <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(billingInfo.usage.projects.current, billingInfo.usage.projects.limit))}`}>
                  {billingInfo.usage.projects.current} / {formatUsageLimit(billingInfo.usage.projects.limit)}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(billingInfo.usage.projects.current, billingInfo.usage.projects.limit)} 
                className="h-2"
              />
            </div>

            {/* Integrations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-medium">Integrations</Label>
                </div>
                <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(billingInfo.usage.integrations.current, billingInfo.usage.integrations.limit))}`}>
                  {billingInfo.usage.integrations.current} / {formatUsageLimit(billingInfo.usage.integrations.limit)}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(billingInfo.usage.integrations.current, billingInfo.usage.integrations.limit)} 
                className="h-2"
              />
            </div>

            {/* Aura AI Requests */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-medium">Aura AI Requests</Label>
                </div>
                <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(billingInfo.usage.auraRequests.current, billingInfo.usage.auraRequests.limit))}`}>
                  {billingInfo.usage.auraRequests.current.toLocaleString()} / {formatUsageLimit(billingInfo.usage.auraRequests.limit)}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(billingInfo.usage.auraRequests.current, billingInfo.usage.auraRequests.limit)} 
                className="h-2"
              />
            </div>

            {/* Team Members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-medium">Team Members</Label>
                </div>
                <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(billingInfo.usage.teamMembers.current, billingInfo.usage.teamMembers.limit))}`}>
                  {billingInfo.usage.teamMembers.current} / {formatUsageLimit(billingInfo.usage.teamMembers.limit)}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(billingInfo.usage.teamMembers.current, billingInfo.usage.teamMembers.limit)} 
                className="h-2"
              />
            </div>
          </div>

          {/* Usage warnings */}
          {Object.entries(billingInfo.usage).some(([key, usage]) => {
            const percentage = getUsagePercentage(usage.current, usage.limit);
            return percentage >= 75;
          }) && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-800">Approaching Usage Limits</p>
                  <p className="text-sm text-orange-600">
                    You're approaching your plan limits. Consider upgrading to avoid service interruption.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Invoices
          </CardTitle>
          <CardDescription>
            View and download your billing history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingInfo.invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>{invoice.date.toLocaleDateString()}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell>
                    ${invoice.amount} {invoice.currency}
                  </TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'pending' ? 'secondary' : 'destructive'}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      className="gap-1"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}