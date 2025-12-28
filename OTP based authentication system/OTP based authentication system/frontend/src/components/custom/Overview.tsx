import { useState, useEffect } from 'react';
import { Shield, User, Mail, Calendar, MapPin, Smartphone, Monitor, Globe, Clock, CheckCircle, AlertTriangle, Lock, Key, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/auth/useAuth';
import { type User } from "@/types/types";
import { getLocalUser } from '@/utils/getLocalUser';
import { formatDate } from '@/utils/formatdate';
import { getDeviceIcon } from '@/utils/getDeviceIcon';

const Overview = () => {
  const { user } = useAuth();
  const UserInfo: User | null = user ?? getLocalUser();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { title: "Total Sessions", value: "3", icon: Activity, color: "text-blue-500" },
    { title: "Active Devices", value: "2", icon: Smartphone, color: "text-green-500" },
    { title: "Security Score", value: "95%", icon: Shield, color: "text-purple-500" },
    { title: "Last Login", value: "2h ago", icon: Clock, color: "text-orange-500" },
  ];

  const recentSessions = [
    {
      device: "MacBook Pro",
      browser: "Chrome",
      location: "New York, US",
      ip: "192.168.1.1",
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      current: true
    },
    {
      device: "iPhone 13",
      browser: "Safari",
      location: "New York, US",
      ip: "192.168.1.2",
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
      current: false
    },
    {
      device: "Windows PC",
      browser: "Firefox",
      location: "Los Angeles, US",
      ip: "192.168.1.3",
      lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      current: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {UserInfo?.name}!</h1>
          <p className="text-gray-400">Here's your account overview</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{currentTime.toLocaleDateString()}</p>
          <p className="text-lg font-mono text-white">{currentTime.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5" />
              Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg">{UserInfo?.name.slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{UserInfo?.name}</h3>
                <p className="text-sm text-gray-400 truncate">{UserInfo?.email}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>{UserInfo?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(UserInfo?.createdAt || new Date())}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="h-4 w-4" />
                <span>2FA Enabled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <Lock className="h-5 w-5" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Account Security</span>
              <Badge className="bg-green-600">Excellent</Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-300">Password strength: Strong</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-300">Two-factor authentication</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-300">Recent security scan</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-300">Review login locations</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full border-gray-700">
              <Key className="h-4 w-4 mr-2" />
              Security Settings
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start border-gray-700">
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start border-gray-700">
              <Shield className="h-4 w-4 mr-2" />
              Enable 2FA
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start border-gray-700">
              <Activity className="h-4 w-4 mr-2" />
              View Sessions
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start border-gray-700 text-red-400 border-red-800 hover:bg-red-950">
              <Lock className="h-4 w-4 mr-2" />
              Logout All Devices
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white">
            <Monitor className="h-5 w-5" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getDeviceIcon(session.device)}
                  <div>
                    <p className="text-sm font-medium text-white">
                      {session.device}
                      {session.current && <Badge className="ml-2 text-xs bg-green-600">Current</Badge>}
                    </p>
                    <p className="text-xs text-gray-400">
                      {session.browser} • {session.location} • {session.ip}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Last active</p>
                  <p className="text-xs text-white">{formatDate(session.lastActive)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
