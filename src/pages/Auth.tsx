
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (isAuthenticated === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-background to-background/95">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-background pointer-events-none" />
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            Salary Tracker
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your fixed monthly expenses
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
