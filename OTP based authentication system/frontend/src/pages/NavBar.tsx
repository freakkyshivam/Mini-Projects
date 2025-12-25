 import { useState, useEffect } from 'react';
 import { Button
  } from "@/components/ui/button"
  import { Shield } from "lucide-react"
import { useNavigate } from 'react-router-dom';
const NavBar = () => {
    const [scrollY, setScrollY] = useState(0);
      const navigate = useNavigate();

        useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header 
        className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-gray-800 transition-all duration-300"
        style={{
          boxShadow: scrollY > 10 ? '0 4px 6px -1px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div 
          onClick={()=>navigate('/')}
          className="flex items-center gap-2 group cursor-pointer">
            <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Auth
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button 
            onClick={()=>navigate('/login')}
              variant="ghost" 
              className="text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
            >
              Login
            </Button>
            <Button 
            onClick={()=>navigate('/register')}
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300">
              Register
            </Button>
          </div>
        </div>
      </header>
  )
}

export default NavBar