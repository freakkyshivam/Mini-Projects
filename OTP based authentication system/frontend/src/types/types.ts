
export interface User {
  id: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
}

export interface DeviceInfo {
  deviceType: string;
  deviceName: string;
  os: string;
  browser: string;
  ipAddress: string;
}

export interface LoginResponse {
  success: boolean;
  msg: string;
  user: User;
  accessToken?: string;  
  device?: DeviceInfo;   
}

export interface LoginSuccessResponse {
  success: true;
  msg: string;
  user: User;
}

export interface LoginErrorResponse {
  success: false;
  msg: string;
}

export interface signupResponse {
  success: false;
  msg: string;
}

export interface APIResponse<T> {
  success: boolean;
  msg: string;
  data?: T;
}



export interface UserSession {
  id: string;
  userId: string;
  refreshToken: string;
  deviceName: string;
  deviceType: string;
  os: string;
  browser: string;
  ipAddress: string;
  isActive: boolean;
  lastUsedAt: string;    
  createdAt: string;   
  revokedAt: string | null;
}
