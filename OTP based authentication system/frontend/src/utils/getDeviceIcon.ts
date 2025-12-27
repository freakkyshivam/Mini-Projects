import { Laptop, Smartphone, Monitor } from 'lucide-react';

export const getDeviceIcon = (deviceType: string) => {
    const type = deviceType.toLowerCase();
    if (type.includes('mobile') || type.includes('phone')) return Smartphone;
    if (type.includes('desktop') || type.includes('pc')) return Monitor;
    return Laptop;
  };