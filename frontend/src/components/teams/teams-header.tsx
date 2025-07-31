import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface TeamsHeaderProps {
  memberCount: number;
  onAddMember: () => void;
  variant?: 'page' | 'section';
}

export function TeamsHeader({ memberCount, onAddMember, variant = 'page' }: TeamsHeaderProps) {
  if (variant === 'section') {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Team Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your team members and project access ({memberCount} {memberCount === 1 ? 'member' : 'members'})
          </p>
        </div>
        <Button onClick={onAddMember} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add Member
        </Button>
      </div>
    );
  }

  // Default page variant for standalone team pages
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
        <p className="text-muted-foreground">
          Manage your team members and project access ({memberCount} {memberCount === 1 ? 'member' : 'members'})
        </p>
      </div>
      <Button onClick={onAddMember} className="gap-2">
        <UserPlus className="w-4 h-4" />
        Add Member
      </Button>
    </div>
  );
}