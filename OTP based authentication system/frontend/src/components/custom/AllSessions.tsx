import { useState, useEffect } from 'react'
import { allSessions } from '@/api/userApi'
import type { UserSession } from '@/types/types'
import {  Globe, Calendar, MapPin, Shield, Loader2, AlertCircle } from 'lucide-react';
 import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import formatDate from '@/utils/formatdate';
import { getDeviceIcon } from '@/utils/getDeviceIcon';
import { revokeSessionApi } from '@/api/authApi';

const AllSessions = () => {
  const [sessions, setSessions] = useState<UserSession[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        setLoading(true);
        setError(null);
        const res = await allSessions();

        if (!res.success) {
          setError('Failed to load sessions');
          return;
        }

        if (res.success && res.data) {
          setSessions(res.data);
        }
      } catch (err) {
        setError('An error occurred while fetching sessions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  const handleRevokeSession = async (sid:string)=>{
     const res = await revokeSessionApi(sid)
    console.log(res);
    
    
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading sessions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No sessions found.</AlertDescription>
      </Alert>
    );
  }


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          You have {sessions.length} others session{sessions.length !== 1 ? 's' : ''} across your devices
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {sessions.map((session) => {
          const DeviceIcon = getDeviceIcon(session.deviceType);
          
          return (
            <div
              key={session.id}
              className="bg-card/50 backdrop-blur-sm rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow relative"
            >
              {session.isActive ? (
                <Badge className="absolute top-4 right-4 bg-green-500/10 text-green-600 border-green-500/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                  Active
                </Badge>
              ):(
                <Badge className="absolute top-4 right-4 bg-red-500/10 text-red-600 border-red-500/20">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
                  Revoked
                </Badge>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <DeviceIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{session.deviceName}</h3>
                  <p className="text-sm text-muted-foreground">{session.deviceType}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Browser:</span>
                  <span className="font-medium">{session.browser}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last used:</span>
                  <span className="font-medium">{formatDate(session.lastUsedAt)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">IP:</span>
                  <span className="font-mono text-xs font-medium">{session.ipAddress}</span>
                </div>
              </div>

              {session.isActive && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-destructive hover:text-destructive"
                    onClick={() => handleRevokeSession(session.id)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Revoke Session
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllSessions;