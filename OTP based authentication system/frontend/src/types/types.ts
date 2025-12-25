
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

export interface APIResponse {
  success: boolean;
  msg: string;
  data: unknown;
}