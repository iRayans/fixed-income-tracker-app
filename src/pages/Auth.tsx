
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { authService } from '@/services/authService';

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
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background/95 p-4">
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-purple-700/10 blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-60 h-60 rounded-full bg-purple-600/5 blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-purple-800/10 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md mx-auto animate-fade-in">
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-5xl font-bold text-gradient mb-2">
            Salary Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Track and manage your monthly expenses with ease
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
