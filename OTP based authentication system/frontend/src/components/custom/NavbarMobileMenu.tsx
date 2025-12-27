import { useState  } from "react";
import { Button } from "@/components/ui/button";
import {  Menu, X, User2, Settings, LogOut, Home } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
 
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
 import {type User } from "@/types/types";
import { getLocalUser } from '@/utils/getLocalUser';

type Props = {
  handleLogout: () => void;
};


const NavbarMobileMenu = ({handleLogout}:Props) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
       const navigate = useNavigate();
          const { user } = useAuth();
         const UserInfo: User | null = user ?? getLocalUser();

   
  return (
      <div className="md:hidden flex items-center gap-3">
          {UserInfo && (
            <Avatar 
              className="h-9 w-9 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <AvatarImage src="" alt={UserInfo.name} />
              <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                {UserInfo.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-300">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-gray-950 border-gray-800">
              <div className="flex flex-col gap-6 mt-8">
               

              
                {UserInfo ? (
                  <div className="flex flex-col gap-3 pt-6 border-t border-gray-800">
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium text-white">{UserInfo.name}</p>
                      <p className="text-xs text-gray-400">{UserInfo.email}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="justify-start text-gray-300 hover:text-white"
                      onClick={() => {
                        navigate('/dashboard');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start text-gray-300 hover:text-white"
                      onClick={() => {
                        navigate('/profile');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <User2 className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start text-gray-300 hover:text-white"
                      onClick={() => {
                        navigate('/settings');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start text-red-600 hover:text-red-500 hover:bg-red-950/20"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 pt-6 border-t border-gray-800">
                    <Button 
                      variant="ghost" 
                      className="justify-start text-gray-300 hover:text-white"
                      onClick={() => {
                        navigate('/login');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      className="bg-linear-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      onClick={() => {
                        navigate('/register');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
  )
}

export default NavbarMobileMenu