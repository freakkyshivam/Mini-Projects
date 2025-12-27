import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Edit2, 
  Save, 
  X, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera
} from 'lucide-react';

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  joinedAt: string;
  isVerified: boolean;
  avatar?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface ViewProfileProps {
  onEdit?: () => void;
}

interface UpdateProfileProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

// Mock API functions - replace with your actual API calls
const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    success: true,
    data: {
      id: '1',
      name: 'Shivam Chaudhary',
      email: 'shivam@example.com',
      phone: '+91 98765 43210',
      location: 'Kanpur, Uttar Pradesh',
      joinedAt: '2024-01-15T10:30:00Z',
      isVerified: true,
      avatar: ''
    }
  };
};

const updateUserProfile = async (data: Partial<UserProfile>): Promise<ApiResponse<null>> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: 'Profile updated successfully' };
};

// View Profile Component
export const ViewProfile = ({ onEdit }: ViewProfileProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        if (res.success && res.data) {
          setProfile(res.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load profile</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>View your account details</CardDescription>
            </div>
            {onEdit && (
              <Button onClick={onEdit} className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-primary/10">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-semibold">
                {profile.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-bold">{profile.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={profile.isVerified ? "default" : "secondary"} className="gap-1">
                  {profile.isVerified && <CheckCircle2 className="h-3 w-3" />}
                  {profile.isVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{profile.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{profile.location || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{formatDate(profile.joinedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Update Profile Component
export const UpdateProfile = ({ onCancel, onSuccess }: UpdateProfileProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        if (res.success && res.data) {
          setProfile(res.data);
          setFormData({
            name: res.data.name,
            email: res.data.email,
            phone: res.data.phone || '',
            location: res.data.location || ''
          });
        }
      } catch (error) {
        setError('Failed to load profile');
        console.log(error);
        
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await updateUserProfile(formData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        setError(res.message || 'Failed to update profile');
      }
    } catch (err ) {
      setError('An error occurred while updating profile');
      console.log(err);
      
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </div>
            {onCancel && (
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                <AvatarImage src={profile?.avatar} alt={formData.name} />
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-2xl font-semibold">
                  {formData.name.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline" size="sm" className="gap-2">
                  <Camera className="h-4 w-4" />
                  Change Avatar
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <User className="inline h-4 w-4 mr-1" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Profile updated successfully!</AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Button 
                onClick={handleSubmit}
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              {onCancel && (
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Combined Profile Component (Toggle between View and Edit)
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="container max-w-4xl mx-auto p-6">
      {isEditing ? (
        <UpdateProfile 
          onCancel={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      ) : (
        <ViewProfile onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
};

export default Profile;