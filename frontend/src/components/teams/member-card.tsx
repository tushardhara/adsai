import { useState } from 'react';
import { MoreHorizontal, Trash2, Crown, Shield, Edit, Eye, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { TeamMember } from '@/lib/types/team';
import { RoleSelector } from './role-selector';

interface MemberCardProps {
  member: TeamMember;
  onRemove: (memberId: string) => void;
  onUpdateRole: (memberId: string, newRole: TeamMember['role']) => void;
}

export function MemberCard({ member, onRemove, onUpdateRole }: MemberCardProps) {
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const getRoleIcon = (role: TeamMember['role']['name']) => {
    switch (role) {
      case 'owner': return <Crown className="w-3 h-3" />;
      case 'admin': return <Shield className="w-3 h-3" />;
      case 'editor': return <Edit className="w-3 h-3" />;
      case 'viewer': return <Eye className="w-3 h-3" />;
    }
  };

  const getRoleVariant = (role: TeamMember['role']['name']) => {
    switch (role) {
      case 'owner': return 'default';
      case 'admin': return 'destructive';
      case 'editor': return 'secondary';
      case 'viewer': return 'outline';
    }
  };

  const getStatusVariant = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'outline';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium">{member.name}</h3>
            <Badge variant={getRoleVariant(member.role.name)} className="gap-1">
              {getRoleIcon(member.role.name)}
              {member.role.name}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{member.email}</p>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Joined {member.joinedAt.toLocaleDateString()}</span>
            <span>•</span>
            <span>Active {formatLastActive(member.lastActive)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Badge variant={getStatusVariant(member.status)}>
          {member.status}
        </Badge>
        
        {member.role.name !== 'owner' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowRoleSelector(true)}>
                <Shield className="w-4 h-4 mr-2" />
                Change Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onRemove(member.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <RoleSelector
        open={showRoleSelector}
        onOpenChange={setShowRoleSelector}
        currentRole={member.role}
        onRoleChange={(newRole) => onUpdateRole(member.id, newRole)}
      />
    </div>
  );
}