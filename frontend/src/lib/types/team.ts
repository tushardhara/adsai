export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatar?: string;
  joinedAt: Date;
  lastActive: Date;
  status: 'active' | 'pending' | 'inactive';
  projectAccess: string[];
}

export interface TeamRole {
  id: string;
  name: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface TeamInvitation {
  email: string;
  role: TeamRole['name'];
  projectIds: string[];
  allProjects: boolean;
}