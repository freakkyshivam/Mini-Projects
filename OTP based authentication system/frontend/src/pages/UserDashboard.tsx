import  {  useState } from 'react';
import {   Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarContent } from '@/components/custom/SidebarContent';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AllSessions from '@/components/custom/AllSessions';
import Profile from '@/components/custom/Profile';
 

const UserDashboard = () => {
  const [activeItem, setActiveItem] = useState<string>('Home');
  

  return (
    <div className="min-h-screen ">
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
              <SidebarContent activeItem={activeItem} setActiveItem={setActiveItem }/>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r bg-background/50 backdrop-blur-sm sticky top-16 h-[calc(100vh-4rem)]">
          <SidebarContent activeItem={activeItem} setActiveItem={setActiveItem}/>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:relative mt-10">
          <div className="container max-w-6xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-6">{activeItem}</h2>
             {activeItem === "View & Update Profile" && (
              <Profile/>
             )}
             {activeItem === "Other Sessions" && (
              <AllSessions/>
             )}
          </div>
        </main>

    
         
      </div>
    </div>
  );
};

export default UserDashboard;