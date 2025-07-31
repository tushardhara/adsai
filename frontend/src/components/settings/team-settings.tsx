'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamsHeader } from '@/components/teams/teams-header';
import { MemberList } from '@/components/teams/member-list';
import { AddMemberDialog } from '@/components/teams/add-member-dialog';
import { InvitationsList } from '@/components/teams/invitations-list';
import { TeamMember } from '@/lib/types/team';
import { Users, Plus, Settings as SettingsIcon, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function TeamSettings() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      // Mock data for development - replace with actual API call
      const mockMembers: TeamMember[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@company.com',
          role: { id: 'owner', name: 'owner', permissions: [] },
          avatar: '',
          joinedAt: new Date('2024-01-15'),
          lastActive: new Date(),
          status: 'active',
          projectAccess: ['all']
        },
        {
          id: '2',
          name: 'Sarah Wilson',
          email: 'sarah@company.com',
          role: { id: 'admin', name: 'admin', permissions: [] },
          avatar: '',
          joinedAt: new Date('2024-02-01'),
          lastActive: new Date(Date.now() - 3600000),
          status: 'active',
          projectAccess: ['project-1', 'project-2']
        },
        {
          id: '3',
          name: 'Mike Chen',
          email: 'mike@company.com',
          role: { id: 'editor', name: 'editor', permissions: [] },
          avatar: '',
          joinedAt: new Date('2024-02-15'),
          lastActive: new Date(Date.now() - 7200000),
          status: 'active',
          projectAccess: ['project-1']
        }
      ];
      
      setMembers(mockMembers);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = (newMember: TeamMember) => {
    setMembers(prev => [...prev, newMember]);
    setIsAddMemberOpen(false);
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await fetch(`/api/teams/members/${memberId}`, { method: 'DELETE' });
      setMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: TeamMember['role']) => {
    try {
      await fetch(`/api/teams/members/${memberId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole.name }),
      });
      
      setMembers(prev => 
        prev.map(member => 
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );
    } catch (error) {
      console.error('Failed to update member role:', error);
    }
  };

  return (
    <div className="space-y-6">
      <TeamsHeader 
        memberCount={members.length}
        onAddMember={() => setIsAddMemberOpen(true)}
        variant="section"
      />

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members" className="gap-2">
            <Users className="w-4 h-4" />
            Members ({members.length})
          </TabsTrigger>
          <TabsTrigger value="invitations" className="gap-2">
            <Plus className="w-4 h-4" />
            Invitations
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <SettingsIcon className="w-4 h-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your team members and their access to this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MemberList
                members={members}
                loading={loading}
                onRemoveMember={handleRemoveMember}
                onUpdateRole={handleUpdateMemberRole}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                View and manage pending team invitations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvitationsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Permissions</CardTitle>
              <CardDescription>
                Configure default roles and access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Default Role</h4>
                    <p className="text-sm text-muted-foreground">
                      Default role assigned to new team members
                    </p>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Shield className="w-3 h-3" />
                    Viewer
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Team Size Limit</h4>
                    <p className="text-sm text-muted-foreground">
                      Maximum number of team members allowed
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {members.length}/10
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Invitation Expiry</h4>
                    <p className="text-sm text-muted-foreground">
                      How long invitations remain valid
                    </p>
                  </div>
                  <Badge variant="outline">
                    7 days
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Project Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow team members to access all projects by default
                    </p>
                  </div>
                  <Badge variant="destructive">
                    Restricted
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddMemberDialog
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        onAddMember={handleAddMember}
      />
    </div>
  );
}