export interface ProjectSettings {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  timezone: string;
  currency: string;
  industry?: string;
  website?: string;
  businessType: 'b2c' | 'b2b' | 'marketplace';
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationSettings {
  id: string;
  projectId: string;
  emailNotifications: boolean;
  slackNotifications: boolean;
  alertThresholds: {
    roasDecrease: number;
    spendIncrease: number;
    conversionDrop: number;
  };
  reportFrequency: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingInfo {
  subscription: {
    plan: 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'cancelled' | 'past_due';
    currentPeriodEnd: Date;
  };
  usage: {
    apiCalls: number;
    dataStorage: number;
    teamMembers: number;
    limits: {
      apiCalls: number;
      dataStorage: number;
      teamMembers: number;
    };
  };
}