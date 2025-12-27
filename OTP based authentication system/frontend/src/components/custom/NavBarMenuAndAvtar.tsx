import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User2, Settings, LogOut, Home } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
 import {type User } from "@/types/types";
import { getLocalUser } from '@/utils/getLocalUser';
 
type Props = {
  handleLogout: () => void;
};


const NavBarMenuAndAvtar = ({handleLogout}:Props) => {
      const navigate = useNavigate();
  
      const { user } = useAuth();
     const UserInfo: User | null = user ?? getLocalUser();
  return (
    <div className="hidden md:flex items-center gap-3">
          {UserInfo ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-transparent hover:ring-blue-500 transition-all duration-300">
                    <AvatarImage src="" alt={UserInfo.name} />
                    <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                      {UserInfo.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{UserInfo.name}</p>
                    <p className="text-xs text-muted-foreground">{UserInfo.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User2 className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                onClick={() => navigate('/login')}
                variant="ghost" 
                className="text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-linear-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
              >
                Register
              </Button>
            </>
          )}
        </div>
  )
}

export default NavBarMenuAndAvtar