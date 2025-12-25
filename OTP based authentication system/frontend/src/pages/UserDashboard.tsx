import React, { useState } from 'react';
import { Home, User, Lock, Info, Users, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/auth/useAuth';
const UserDashboard = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const {user} = useAuth();
  const sidebarItems = [
    { title: "Home", url: "", icon: Home },
    { title: "Update Profile", url: "", icon: User },
    { title: "Update Password", url: "", icon: Lock },
    { title: "Session Information", url: "", icon: Info },
    { title: "Other Sessions", url: "", icon: Users },
    { title: "Logout", url: "", icon: LogOut },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.title;
            const isLogout = item.title === 'Logout';

            return (
              <Button
                key={item.title}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isLogout && !isActive ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''
                }`}
                onClick={() => setActiveItem(item.title)}
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
            <AvatarFallback>{user?.name.slice(0,2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen fixed">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar - Always present */}
      <header className="fixed  z-50 w-full ">
        <div className="container flex  items-center px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden m-5 border">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r bg-background/50 backdrop-blur-sm sticky top-16 h-[calc(100vh-4rem)]">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:relative mt-10 fixed">
          <div className="container max-w-6xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-6">{activeItem}</h2>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border shadow-sm p-6">
              <p className="text-muted-foreground">
                Content for <span className="font-semibold text-foreground">{activeItem}</span> will be displayed here.
              </p>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;