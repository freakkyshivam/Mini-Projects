
import { User2, Lock, Info, Users, LogOut, Home } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/auth/useAuth';
import {type User } from "@/types/types";
import { getLocalUser } from '@/utils/getLocalUser';
import { Button } from '@/components/ui/button';
import { logout } from '@/utils/logout';

interface SidebarContentProps {
    activeItem: string;
  setActiveItem: React.Dispatch<React.SetStateAction<string>>;
}
 
 export const SidebarContent = ({activeItem, setActiveItem}:SidebarContentProps) => {
     const { user } = useAuth();

const UserInfo: User | null = user ?? getLocalUser();

const sidebarItems = [
    { title: "Home", url: "", icon: Home },
    { title: "View & Update Profile", url: "", icon: User2 },
    { title: "Password and security", url: "", icon: Lock },
    { title: "Session Information", url: "", icon: Info },
    { title: "Other Sessions", url: "", icon: Users },
    { title: "Logout", url: "", icon: LogOut },
    { title: "Terminate all other sessions", url: "", icon: LogOut },
  ];

    return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.title;
            const isLogout = item.title === 'Logout'  || item.title === 'Terminate all other sessions';

            return (
              <Button
                key={item.title}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isLogout && !isActive ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''
                }`}
                onClick={() =>item.title === 'Logout'? logout(): setActiveItem(item.title)}
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </Button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-2 py-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{UserInfo?.name.slice(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{UserInfo?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{UserInfo?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )};