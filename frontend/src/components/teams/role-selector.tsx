import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Shield, Edit, Eye } from 'lucide-react';
import { TeamRole } from '@/lib/types/team';

interface RoleSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRole: TeamRole;
  onRoleChange: (role: TeamRole) => void;
}

export function RoleSelector({ 
  open, 
  onOpenChange, 
  currentRole, 
  onRoleChange 
}: RoleSelectorProps) {
  const roles = [
    {
      name: 'viewer' as const,
      icon: Eye,
      title: 'Viewer',
      description: 'Can view projects and analytics',
      permissions: ['View projects', 'View analytics', 'Export reports']
    },
    {
      name: 'editor' as const,
      icon: Edit,
      title: 'Editor',
      description: 'Can edit projects and manage integrations',
      permissions: ['View & edit projects', 'Manage data sources', 'Create campaigns', 'Export reports']
    },
    {
      name: 'admin' as const,
      icon: Shield,
      title: 'Admin',
      description: 'Full project access and team management',
      permissions: ['All project permissions', 'Manage team members', 'Billing access', 'Project settings']
    }
  ];

  const handleRoleSelect = (roleName: TeamRole['name']) => {
    const selectedRole: TeamRole = {
      id: roleName,
      name: roleName,
      permissions: []
    };
    onRoleChange(selectedRole);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Change Member Role</DialogTitle>
          <DialogDescription>
            Select a new role for this team member. This will immediately update their permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = currentRole.name === role.name;
            
            return (
              <Button
                key={role.name}
                variant={isSelected ? "default" : "outline"}
                className="w-full justify-start h-auto p-4"
                onClick={() => handleRoleSelect(role.name)}
              >
                <div className="flex items-start space-x-3 text-left">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{role.title}</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {role.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Permissions:</span> {role.permissions.join(', ')}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}