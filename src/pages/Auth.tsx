
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { authService } from '@/services/authService';
import { CircleIcon, SquareIcon, TriangleIcon } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const isValid = await authService.validateToken();
      
      if (isValid) {
        navigate('/dashboard');
      }
    };

    checkTokenValidity();
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#0A0118] overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-96 h-96 rounded-full bg-purple-700/20 blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-purple-500/20 blur-[128px] animate-pulse delay-1000"></div>
      </div>
      
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CircleIcon className="absolute top-20 left-20 w-8 h-8 text-purple-500/20 animate-float" />
        <SquareIcon className="absolute bottom-32 right-20 w-6 h-6 text-purple-400/20 animate-float-delayed" />
        <TriangleIcon className="absolute top-1/2 right-32 w-7 h-7 text-purple-300/20 animate-float-slow" />
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
            Salary Tracker
          </h1>
          <p className="text-muted-foreground/80 text-lg max-w-md mx-auto">
            Track and manage your monthly expenses with our modern and intuitive platform
          </p>
        </div>
        <div className="animate-scale-in">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Auth;
