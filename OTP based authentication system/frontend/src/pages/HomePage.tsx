import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Lock, ChevronRight, Github, Twitter, Mail, ShieldCheck, Users, MonitorSmartphone, ArrowRight, Sparkles } from 'lucide-react';
 import { useAuth } from '@/auth/useAuth';
import {type User } from "@/types/types";
import { getLocalUser } from '@/utils/getLocalUser';
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
       const UserInfo: User | null = user ?? getLocalUser();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "OTP Verification",
      description: "Secure time-based OTP with Redis expiry, resend limits, and brute-force protection.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Lock,
      title: "JWT Authentication",
      description: "Access & refresh token authentication with rotation and automatic renewal.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Fast & Scalable",
      description: "High-performance architecture using Redis caching and optimized database queries.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: ShieldCheck,
      title: "Two-Step Verification",
      description: "Additional verification layer for sensitive actions using OTP or email confirmation.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      title: "Session Management",
      description: "View active sessions and terminate all other sessions instantly for security.",
      color: "from-indigo-500 to-violet-500",
    },
    {
      icon: MonitorSmartphone,
      title: "Device Tracking",
      description: "Tracks device, browser, and IP metadata for every login session.",
      color: "from-teal-500 to-sky-500",
    },
  ];

 
 

  const handleNavigation = (path:string) => {
     navigate(path)
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto flex flex-col items-center justify-center text-center py-24 md:py-32 px-6">
          <div className="inline-block mb-6 animate-in slide-in-from-top duration-700">
            <span className="px-4 py-2 bg-blue-950/50 text-blue-300 rounded-full text-sm font-semibold border border-blue-800/50 inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Next-gen Authentication
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-br from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent animate-in slide-in-from-top duration-700 delay-150">
            Secure Authentication
            <br />
            <span className="bg-linear-to-br from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mb-10 leading-relaxed animate-in slide-in-from-top duration-700 delay-300">
            OTP-based authentication with Redis, JWT, and modern security practices.
            Build trust with your users through enterprise-grade security.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12 animate-in slide-in-from-top duration-700 delay-500">
            {UserInfo ? (
              <Button 
                size="lg" 
                onClick={() => handleNavigation('/dashboard')}
                className="bg-linear-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 text-base px-8 group"
              >
                Dashboard
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={() => handleNavigation('/register')}
                className="bg-linear-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 text-base px-8 group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
            <Button 
             onClick={()=> window.location.href = 'https://documenter.getpostman.com/view/47278131/2sBXVbGDPJ'}
              size="lg" 
              variant="outline"
              className="border-2 border-gray-700 text-gray-300 bg-transparent hover:bg-gray-900 hover:border-gray-600 hover:scale-105 transition-all duration-300 text-base px-8"
            >
              View Documentation
            </Button>
          </div>

          
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Everything you need for secure authentication
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Built with modern technologies and best practices to ensure your application's security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeFeature === index;
            
            return (
              <div
                key={index}
                className={`group relative border-2 rounded-2xl p-8 bg-gray-900/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer ${
                  isActive ? 'border-blue-500 shadow-xl shadow-blue-500/20 scale-105' : 'border-gray-800 hover:border-blue-500/50'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                
                <div className="relative">
                  <div className={`inline-block p-4 bg-linear-to-br ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {isActive && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg text-white">SecureAuth</span>
              </div>
              <p className="text-sm text-gray-400">
                Enterprise-grade authentication made simple for developers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-white">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://freakkyshivam.netlify.app/" className="hover:text-blue-400 transition-colors">Portfolio</a></li>
                <li><a href="https://documenter.getpostman.com/view/47278131/2sBXVbGDPJ" className="hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="https://blog-app-chi-sage.vercel.app/" className="hover:text-blue-400 transition-colors">Blog</a></li>
           
              </ul>
            </div>
            
            
            <div>
              <h4 className="font-semibold mb-3 text-white">Connect</h4>
              <div className="flex gap-3">
                <a href="https://github.com/freakkyshivam" target="_blank" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-blue-400 text-gray-400 transition-all duration-300 hover:scale-110">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://x.com/freakkyshivam" target="_blank" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-blue-400 text-gray-400 transition-all duration-300 hover:scale-110">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="mailto-skc722768@gmail.com" target="_blank" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-blue-400 text-gray-400 transition-all duration-300 hover:scale-110">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
            <p>© 2025 SecureAuth. All rights reserved. Built with ❤️ for developers.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
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

export default HomePage;
