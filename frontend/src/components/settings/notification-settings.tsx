'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Bell,
    Mail,
    MessageSquare,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    Smartphone,
    Monitor,
    Volume2,
    VolumeX,
    Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface NotificationChannel {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    enabled: boolean;
    settings: {
        timing?: string;
        frequency?: string;
        quietHours?: boolean;
    };
}

interface NotificationCategory {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    notifications: NotificationType[];
}

interface NotificationType {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    channels: {
        email: boolean;
        push: boolean;
        inApp: boolean;
    };
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
    threshold?: number;
}

interface NotificationPreferences {
    channels: NotificationChannel[];
    categories: NotificationCategory[];
    globalSettings: {
        enabled: boolean;
        quietHours: {
            enabled: boolean;
            start: string;
            end: string;
        };
        timezone: string;
    };
}

export function NotificationSettings() {
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        channels: [],
        categories: [],
        globalSettings: {
            enabled: true,
            quietHours: {
                enabled: false,
                start: '22:00',
                end: '08:00'
            },
            timezone: 'UTC'
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchNotificationPreferences();
    }, []);

    const fetchNotificationPreferences = async () => {
        try {
            setLoading(true);

            // Mock data following Aura D2C analytics patterns
            const mockPreferences: NotificationPreferences = {
                channels: [
                    {
                        id: 'email',
                        name: 'Email Notifications',
                        description: 'Receive notifications via email',
                        icon: Mail,
                        enabled: true,
                        settings: {
                            timing: 'immediate',
                            frequency: 'daily'
                        }
                    },
                    {
                        id: 'push',
                        name: 'Push Notifications',
                        description: 'Browser and mobile push notifications',
                        icon: Smartphone,
                        enabled: false,
                        settings: {
                            timing: 'immediate'
                        }
                    },
                    {
                        id: 'in-app',
                        name: 'In-App Notifications',
                        description: 'Notifications within the Aura dashboard',
                        icon: Bell,
                        enabled: true,
                        settings: {
                            timing: 'immediate'
                        }
                    }
                ],
                categories: [
                    {
                        id: 'insights',
                        name: 'AI Insights & Recommendations',
                        description: 'Aura AI-generated insights and recommendations',
                        icon: MessageSquare,
                        notifications: [
                            {
                                id: 'performance-insights',
                                name: 'Performance Insights',
                                description: 'AI-powered analysis of campaign and sales performance',
                                enabled: true,
                                channels: { email: true, push: false, inApp: true },
                                frequency: 'daily'
                            },
                            {
                                id: 'optimization-recommendations',
                                name: 'Optimization Recommendations',
                                description: 'Actionable recommendations to improve D2C performance',
                                enabled: true,
                                channels: { email: true, push: false, inApp: true },
                                frequency: 'weekly'
                            },
                            {
                                id: 'trend-alerts',
                                name: 'Trend Alerts',
                                description: 'Notifications about significant trends in your data',
                                enabled: true,
                                channels: { email: false, push: false, inApp: true },
                                frequency: 'immediate'
                            }
                        ]
                    },
                    {
                        id: 'performance',
                        name: 'Performance Alerts',
                        description: 'Alerts for significant changes in key metrics',
                        icon: TrendingUp,
                        notifications: [
                            {
                                id: 'revenue-changes',
                                name: 'Revenue Changes',
                                description: 'Significant increases or decreases in revenue',
                                enabled: true,
                                channels: { email: true, push: true, inApp: true },
                                frequency: 'immediate',
                                threshold: 20
                            },
                            {
                                id: 'conversion-rate',
                                name: 'Conversion Rate Changes',
                                description: 'Notable changes in conversion rates',
                                enabled: true,
                                channels: { email: true, push: false, inApp: true },
                                frequency: 'immediate',
                                threshold: 15
                            },
                            {
                                id: 'ad-spend-alerts',
                                name: 'Ad Spend Alerts',
                                description: 'Alerts when ad spend exceeds thresholds',
                                enabled: true,
                                channels: { email: true, push: true, inApp: true },
                                frequency: 'immediate',
                                threshold: 100
                            },
                            {
                                id: 'roas-changes',
                                name: 'ROAS Changes',
                                description: 'Return on ad spend performance alerts',
                                enabled: false,
                                channels: { email: false, push: false, inApp: true },
                                frequency: 'daily',
                                threshold: 10
                            }
                        ]
                    },
                    {
                        id: 'system',
                        name: 'System & Integration',
                        description: 'System updates and integration status',
                        icon: Settings,
                        notifications: [
                            {
                                id: 'integration-failures',
                                name: 'Integration Failures',
                                description: 'When data source connections fail or need attention',
                                enabled: true,
                                channels: { email: true, push: false, inApp: true },
                                frequency: 'immediate'
                            },
                            {
                                id: 'data-sync-issues',
                                name: 'Data Sync Issues',
                                description: 'Problems with data synchronization from sources',
                                enabled: true,
                                channels: { email: false, push: false, inApp: true },
                                frequency: 'hourly'
                            },
                            {
                                id: 'system-maintenance',
                                name: 'System Maintenance',
                                description: 'Scheduled maintenance and platform updates',
                                enabled: true,
                                channels: { email: true, push: false, inApp: true },
                                frequency: 'immediate'
                            },
                            {
                                id: 'feature-updates',
                                name: 'Feature Updates',
                                description: 'New features and platform improvements',
                                enabled: false,
                                channels: { email: true, push: false, inApp: false },
                                frequency: 'weekly'
                            }
                        ]
                    },
                    {
                        id: 'billing',
                        name: 'Billing & Account',
                        description: 'Account, billing, and subscription notifications',
                        icon: AlertTriangle,
                        notifications: [
                            {
                                id: 'billing-alerts',
                                name: 'Billing Alerts',
                                description: 'Payment failures, invoice reminders, and billing issues',
                                enabled: true,
                                channels: { email: true, push: false, inApp: true },
                                frequency: 'immediate'
                            },
                            {
                                id: 'usage-limits',
                                name: 'Usage Limit Warnings',
                                description: 'Approaching or exceeding plan limits',
                                enabled: true,
                                channels: { email: true, push: true, inApp: true },
                                frequency: 'immediate'
                            },
                            {
                                id: 'subscription-updates',
                                name: 'Subscription Updates',
                                description: 'Plan changes, renewals, and subscription status',
                                enabled: true,
                                channels: { email: true, push: false, inApp: true },
                                frequency: 'immediate'
                            }
                        ]
                    }
                ],
                globalSettings: {
                    enabled: true,
                    quietHours: {
                        enabled: true,
                        start: '22:00',
                        end: '08:00'
                    },
                    timezone: 'America/New_York'
                }
            };

            setPreferences(mockPreferences);
        } catch (error) {
            console.error('Failed to fetch notification preferences:', error);
            toast.error('Failed to load notification preferences');
        } finally {
            setLoading(false);
        }
    };

    const handleChannelToggle = async (channelId: string, enabled: boolean) => {
        try {
            setPreferences(prev => ({
                ...prev,
                channels: prev.channels.map(channel =>
                    channel.id === channelId ? { ...channel, enabled } : channel
                )
            }));

            // API call to update channel preference
            const response = await fetch(`/api/notifications/channels/${channelId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled })
            });

            if (!response.ok) throw new Error('Failed to update channel');

            toast.success(`${enabled ? 'Enabled' : 'Disabled'} notification channel`);
        } catch (error) {
            console.error('Failed to update channel:', error);
            toast.error('Failed to update notification channel');

            // Revert on error
            setPreferences(prev => ({
                ...prev,
                channels: prev.channels.map(channel =>
                    channel.id === channelId ? { ...channel, enabled: !enabled } : channel
                )
            }));
        }
    };

    const handleNotificationToggle = async (categoryId: string, notificationId: string, enabled: boolean) => {
        try {
            setPreferences(prev => ({
                ...prev,
                categories: prev.categories.map(category =>
                    category.id === categoryId
                        ? {
                            ...category,
                            notifications: category.notifications.map(notification =>
                                notification.id === notificationId
                                    ? { ...notification, enabled }
                                    : notification
                            )
                        }
                        : category
                )
            }));

            const response = await fetch(`/api/notifications/${categoryId}/${notificationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled })
            });

            if (!response.ok) throw new Error('Failed to update notification');

        } catch (error) {
            console.error('Failed to update notification:', error);
            toast.error('Failed to update notification preference');
        }
    };

    const handleChannelUpdate = async (categoryId: string, notificationId: string, channel: string, enabled: boolean) => {
        try {
            setPreferences(prev => ({
                ...prev,
                categories: prev.categories.map(category =>
                    category.id === categoryId
                        ? {
                            ...category,
                            notifications: category.notifications.map(notification =>
                                notification.id === notificationId
                                    ? {
                                        ...notification,
                                        channels: { ...notification.channels, [channel]: enabled }
                                    }
                                    : notification
                            )
                        }
                        : category
                )
            }));

            const response = await fetch(`/api/notifications/${categoryId}/${notificationId}/channels`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ channel, enabled })
            });

            if (!response.ok) throw new Error('Failed to update channel');

        } catch (error) {
            console.error('Failed to update channel:', error);
            toast.error('Failed to update notification channel');
        }
    };

    const handleGlobalSettingsUpdate = async (setting: string, value: any) => {
        try {
            setSaving(true);

            setPreferences(prev => ({
                ...prev,
                globalSettings: { ...prev.globalSettings, [setting]: value }
            }));

            const response = await fetch('/api/notifications/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [setting]: value })
            });

            if (!response.ok) throw new Error('Failed to update settings');

            toast.success('Settings updated successfully');
        } catch (error) {
            console.error('Failed to update settings:', error);
            toast.error('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const getFrequencyBadge = (frequency: string) => {
        const variants = {
            'immediate': 'destructive',
            'hourly': 'secondary',
            'daily': 'default',
            'weekly': 'outline'
        } as const;

        return (
            <Badge variant={variants[frequency as keyof typeof variants] || 'outline'} className="text-xs">
                {frequency}
            </Badge>
        );
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
            {/* Global Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Global Notification Settings
                    </CardTitle>
                    <CardDescription>
                        Configure global notification preferences and quiet hours
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-sm font-medium">Enable All Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Master toggle for all notification types
                            </p>
                        </div>
                        <Switch
                            checked={preferences.globalSettings.enabled}
                            onCheckedChange={(checked) => handleGlobalSettingsUpdate('enabled', checked)}
                        />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium">Quiet Hours</Label>
                                <p className="text-sm text-muted-foreground">
                                    Disable notifications during specified hours
                                </p>
                            </div>
                            <Switch
                                checked={preferences.globalSettings.quietHours.enabled}
                                onCheckedChange={(checked) =>
                                    handleGlobalSettingsUpdate('quietHours', {
                                        ...preferences.globalSettings.quietHours,
                                        enabled: checked
                                    })
                                }
                            />
                        </div>

                        {preferences.globalSettings.quietHours.enabled && (
                            <div className="grid grid-cols-2 gap-4 pl-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Start Time</Label>
                                    <Select
                                        value={preferences.globalSettings.quietHours.start}
                                        onValueChange={(value) =>
                                            handleGlobalSettingsUpdate('quietHours', {
                                                ...preferences.globalSettings.quietHours,
                                                start: value
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 24 }, (_, i) => {
                                                const hour = i.toString().padStart(2, '0');
                                                return (
                                                    <SelectItem key={hour} value={`${hour}:00`}>
                                                        {hour}:00
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-xs text-muted-foreground">End Time</Label>
                                    <Select
                                        value={preferences.globalSettings.quietHours.end}
                                        onValueChange={(value) =>
                                            handleGlobalSettingsUpdate('quietHours', {
                                                ...preferences.globalSettings.quietHours,
                                                end: value
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 24 }, (_, i) => {
                                                const hour = i.toString().padStart(2, '0');
                                                return (
                                                    <SelectItem key={hour} value={`${hour}:00`}>
                                                        {hour}:00
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div>
                        <Label className="text-sm font-medium">Timezone</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                            Your timezone for notification scheduling
                        </p>
                        <Select
                            value={preferences.globalSettings.timezone}
                            onValueChange={(value) => handleGlobalSettingsUpdate('timezone', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="UTC">UTC</SelectItem>
                                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                                <SelectItem value="America/Chicago">Central Time</SelectItem>
                                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                                <SelectItem value="Europe/London">London</SelectItem>
                                <SelectItem value="Europe/Paris">Paris</SelectItem>
                                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Channels */}
            <Card>
                <CardHeader>
                    <CardTitle>Notification Channels</CardTitle>
                    <CardDescription>
                        Choose how you want to receive notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {preferences.channels.map((channel) => (
                        <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                                <channel.icon className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <Label className="font-medium">{channel.name}</Label>
                                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                                </div>
                            </div>
                            <Switch
                                checked={channel.enabled}
                                onCheckedChange={(checked) => handleChannelToggle(channel.id, checked)}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Notification Categories */}
            {preferences.categories.map((category) => (
                <Card key={category.id}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <category.icon className="w-5 h-5" />
                            {category.name}
                        </CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {category.notifications.map((notification) => (
                            <div key={notification.id} className="space-y-3 p-4 border rounded-lg">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Label className="font-medium">{notification.name}</Label>
                                            {getFrequencyBadge(notification.frequency)}
                                            {notification.threshold && (
                                                <Badge variant="outline" className="text-xs">
                                                    ±{notification.threshold}%
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                                    </div>
                                    <Switch
                                        checked={notification.enabled}
                                        onCheckedChange={(checked) =>
                                            handleNotificationToggle(category.id, notification.id, checked)
                                        }
                                    />
                                </div>

                                {notification.enabled && (
                                    <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">Email</span>
                                            </div>
                                            <Switch
                                                checked={notification.channels.email}
                                                onCheckedChange={(checked) =>
                                                    handleChannelUpdate(category.id, notification.id, 'email', checked)
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Smartphone className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">Push</span>
                                            </div>
                                            <Switch
                                                checked={notification.channels.push}
                                                onCheckedChange={(checked) =>
                                                    handleChannelUpdate(category.id, notification.id, 'push', checked)
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Monitor className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">In-App</span>
                                            </div>
                                            <Switch
                                                checked={notification.channels.inApp}
                                                onCheckedChange={(checked) =>
                                                    handleChannelUpdate(category.id, notification.id, 'inApp', checked)
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}