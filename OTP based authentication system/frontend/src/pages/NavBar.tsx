import { useState, useEffect } from 'react';
import { Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import NavBarMenuAndAvtar from '@/components/custom/NavBarMenuAndAvtar';
import NavbarMobileMenu from '@/components/custom/NavbarMobileMenu';
import { logout } from '@/utils/logout';
 
const NavBar = () => {
  const [scrollY, setScrollY] = useState(0);

   const navigate = useNavigate();  
 
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    // Add your logout logic here
  };

 

  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-md bg-black/80 border-b border-gray-800 transition-all duration-300"
      style={{
        boxShadow: scrollY > 10 ? '0 4px 6px -1px rgba(0,0,0,0.5)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold bg-linear-to-br from-blue-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
              SecureAuth
            </h1>
            <p className="text-[10px] md:text-xs text-gray-500 -mt-0.5">by Shivam Chaudhary</p>
          </div>
        </div>

         <NavBarMenuAndAvtar handleLogout={handleLogout}/>
      <NavbarMobileMenu handleLogout={handleLogout}/>
      
      </div>
    </header>
  );
};

export default NavBar;