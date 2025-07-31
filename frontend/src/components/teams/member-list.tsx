import { TeamMember } from '@/lib/types/team';
import { MemberCard } from './member-card';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus } from 'lucide-react';


interface MemberListProps {
  members: TeamMember[];
  loading: boolean;
  onRemoveMember: (memberId: string) => void;
  onUpdateRole: (memberId: string, newRole: TeamMember['role']) => void;
}

export function MemberList({ 
  members, 
  loading, 
  onRemoveMember, 
  onUpdateRole 
}: MemberListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-60" />
            </div>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No team members</h3>
        <p className="text-muted-foreground mb-4">
          Start building your team by adding your first member.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          onRemove={onRemoveMember}
          onUpdateRole={onUpdateRole}
        />
      ))}
    </div>
  );
}