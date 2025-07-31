import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, Clock } from 'lucide-react';

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  sentAt: Date;
  expiresAt: Date;
  status: 'pending' | 'expired';
}

export function InvitationsList() {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockInvitations: PendingInvitation[] = [
        {
          id: '1',
          email: 'alex@company.com',
          role: 'editor',
          sentAt: new Date(Date.now() - 86400000), // 1 day ago
          expiresAt: new Date(Date.now() + 518400000), // 6 days from now
          status: 'pending'
        }
      ];
      setInvitations(mockInvitations);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      await fetch(`/api/teams/invitations/${invitationId}/resend`, {
        method: 'POST'
      });
      // Update the invitation's sent date
      setInvitations(prev => 
        prev.map(inv => 
          inv.id === invitationId 
            ? { ...inv, sentAt: new Date(), expiresAt: new Date(Date.now() + 604800000) }
            : inv
        )
      );
    } catch (error) {
      console.error('Failed to resend invitation:', error);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await fetch(`/api/teams/invitations/${invitationId}`, {
        method: 'DELETE'
      });
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (error) {
      console.error('Failed to cancel invitation:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading invitations...</div>;
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending invitations</h3>
        <p className="text-muted-foreground">
          All team invitations have been accepted or expired.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invitations.map((invitation) => (
        <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium">{invitation.email}</h3>
              <Badge variant="outline">{invitation.role}</Badge>
              <Badge variant={invitation.status === 'pending' ? 'secondary' : 'destructive'}>
                {invitation.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Sent {invitation.sentAt.toLocaleDateString()} • 
              Expires {invitation.expiresAt.toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResendInvitation(invitation.id)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleCancelInvitation(invitation.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}