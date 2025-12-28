import { Shield, CheckCircle, XCircle, Smartphone, Clock, AlertTriangle, Lock, LogIn, Key, UserX } from 'lucide-react';

// Types
interface LastLogin {
  timestamp: string;
  device: string;
  browser: string;
  os: string;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'otp' | 'password_change' | 'session_revoked';
  description: string;
  timestamp: string;
  device?: string;
}

interface OverviewData {
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  activeSessionsCount: number;
  lastLogin: LastLogin;
  currentSession: {
    browser: string;
    os: string;
  };
  recentActivity: SecurityEvent[];
}

// Placeholder data
const SECURITY_DATA: OverviewData = {
  emailVerified: true,
  twoFactorEnabled: false,
  activeSessionsCount: 2,
  lastLogin: {
    timestamp: '28 Dec 2025, 2:30 PM',
    device: 'Desktop',
    browser: 'Chrome',
    os: 'Windows',
  },
  currentSession: {
    browser: 'Chrome',
    os: 'Windows',
  },
  recentActivity: [
    {
      id: '1',
      type: 'login',
      description: 'Login successful',
      timestamp: '2 hours ago',
      device: 'Chrome (Windows)',
    },
    {
      id: '2',
      type: 'otp',
      description: 'OTP verified',
      timestamp: '2 hours ago',
      device: 'Email verification',
    },
    {
      id: '3',
      type: 'session_revoked',
      description: 'Session revoked',
      timestamp: '1 day ago',
      device: 'Mobile (Android)',
    },
    {
      id: '4',
      type: 'password_change',
      description: 'Password changed',
      timestamp: '3 days ago',
      device: 'Chrome (Windows)',
    },
    {
      id: '5',
      type: 'login',
      description: 'Login successful',
      timestamp: '5 days ago',
      device: 'Safari (macOS)',
    },
  ],
};

// Subcomponents
const StatusBadge = ({ status }: { status: 'secure' | 'warning' | 'risk' }) => {
  const config = {
    secure: { text: 'Secure', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/50' },
    warning: { text: 'Warning', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50' },
    risk: { text: 'At Risk', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/50' },
  };

  const { text, color, bg, border } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${color} ${bg} border ${border}`}>
      {status === 'secure' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
      {text}
    </span>
  );
};

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card/50  backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-xl ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) => (
  <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-3">
    {Icon && <Icon className="w-4 h-4 text-gray-300" />}
    {children}
  </h2>
);

const SecurityEventIcon = ({ type }: { type: SecurityEvent['type'] }) => {
  const icons = {
    login: <LogIn className="w-4 h-4 text-green-400" />,
    otp: <Key className="w-4 h-4 text-blue-400" />,
    password_change: <Lock className="w-4 h-4 text-purple-400" />,
    session_revoked: <UserX className="w-4 h-4 text-red-400" />,
  };

  return <div className="shrink-0">{icons[type]}</div>;
};

// Main Component
export default function SecurityOverview() {
  const data = SECURITY_DATA;

  // Calculate overall security status
  const getSecurityStatus = (): 'secure' | 'warning' | 'risk' => {
    if (!data.emailVerified || !data.twoFactorEnabled) return 'risk';
    if (data.activeSessionsCount > 3) return 'warning';
    return 'secure';
  };

  const securityStatus = getSecurityStatus();

  // Check for warnings
  const warnings = [
    !data.emailVerified && { type: 'email', message: 'Email not verified', action: 'Verify your email address' },
    !data.twoFactorEnabled && { type: '2fa', message: 'Two-factor authentication disabled', action: 'Enable 2FA for better security' },
    data.activeSessionsCount > 3 && { type: 'sessions', message: `${data.activeSessionsCount} active sessions detected`, action: 'Review your active sessions' },
  ].filter(Boolean);

  return (
    <div className=" overflow-hidden bg-transparent p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        {/* <div className="mb-4">
          <h1 className="text-2xl font-bold text-white mb-1">Security Overview</h1>
          <p className="text-sm text-gray-400">Monitor your account security and recent activity</p>
        </div> */}

        {/* Security Warnings - Conditional */}
        {warnings.length > 0 && (
          <div className="bg-red-950/50 border border-red-500/50 rounded-lg p-3">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-400 mb-1">Security Warnings</h3>
                <p className="text-xs text-red-300">Action required to secure your account</p>
              </div>
            </div>
            <div className="ml-7 space-y-2">
              {warnings.map((warning: any, index) => (
                <div key={index} className="flex items-start justify-between gap-2 bg-card/50 backdrop-blur-sm p-2 rounded-lg border border-red-500/20">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-red-300">{warning.message}</p>
                    <p className="text-xs text-red-200/80">{warning.action}</p>
                  </div>
                  <button className="text-xs text-red-400 hover:text-red-300 font-medium whitespace-nowrap">
                    Fix →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Security Status Card */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <CardTitle icon={Shield}>Account Security Status</CardTitle>
            <StatusBadge status={securityStatus} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Email Verification */}
            <div className="flex items-start gap-2 p-3 bg-gray-800/60 rounded-lg border border-gray-700">
              <div className={`p-1.5 rounded-lg ${data.emailVerified ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {data.emailVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-400">Email Status</p>
                <p className={`text-xs font-semibold ${data.emailVerified ? 'text-green-400' : 'text-red-400'}`}>
                  {data.emailVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>

            {/* 2FA Status */}
            <div className="flex items-start gap-2 p-3 bg-gray-800/60 rounded-lg border border-gray-700">
              <div className={`p-1.5 rounded-lg ${data.twoFactorEnabled ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <Lock className={`w-4 h-4 ${data.twoFactorEnabled ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-400">Two-Factor Auth</p>
                <p className={`text-xs font-semibold ${data.twoFactorEnabled ? 'text-green-400' : 'text-red-400'}`}>
                  {data.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="flex items-start gap-2 p-3 bg-gray-800/60 rounded-lg border border-gray-700">
              <div className="p-1.5 rounded-lg bg-blue-500/20">
                <Smartphone className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-400">Active Sessions</p>
                <p className="text-xs font-semibold text-white">{data.activeSessionsCount} devices</p>
              </div>
            </div>

            {/* Last Login */}
            <div className="flex items-start gap-2 p-3 bg-gray-800/60 rounded-lg border border-gray-700">
              <div className="p-1.5 rounded-lg bg-purple-500/20">
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-400">Last Login</p>
                <p className="text-xs font-semibold text-white">{data.lastLogin.timestamp}</p>
                <p className="text-xs text-gray-500">{data.lastLogin.browser} ({data.lastLogin.os})</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - 2FA and Active Sessions */}
          <div className="lg:col-span-1 space-y-4">
            {/* Two-Factor Authentication Card */}
            <Card>
              <CardTitle icon={Lock}>Two-Factor Authentication</CardTitle>

              {data.twoFactorEnabled ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">2FA is enabled</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Your account is protected with an additional layer of security.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-red-300 bg-red-950/50 p-3 rounded-lg border border-red-500/30">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium">2FA is disabled</p>
                      <p className="text-xs text-red-400 mt-1">
                        Enable two-factor authentication to add an extra layer of security.
                      </p>
                    </div>
                  </div>
                  <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Enable 2FA
                  </button>
                </div>
              )}
            </Card>

            {/* Active Sessions Summary */}
            <Card>
              <CardTitle icon={Smartphone}>Active Sessions</CardTitle>

              <div className="space-y-3">
                <div className="text-center py-3">
                  <div className="text-3xl font-bold text-white">{data.activeSessionsCount}</div>
                  <div className="text-xs text-gray-400">Total Active Sessions</div>
                </div>

                <div className="bg-blue-950/50 border border-blue-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-medium text-gray-400 uppercase">Current Session</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {data.currentSession.browser} on {data.currentSession.os}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">This device</p>
                </div>

                <button className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors border border-gray-700">
                  View All Sessions
                </button>
              </div>
            </Card>
          </div>

          {/* Right Column - Recent Activity */}
          <Card className="lg:col-span-2">
            <CardTitle icon={Clock}>Recent Activity</CardTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.recentActivity.map((event) => (
                <div key={event.id} className="flex items-start gap-2 p-3 bg-gray-800/60 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                  <SecurityEventIcon type={event.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white">{event.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{event.timestamp}</p>
                    {event.device && <p className="text-xs text-gray-500 mt-0.5">{event.device}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}