
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { getAuthToken, isTokenExpired } from '@/utils/auth';
import { toast } from "@/components/ui/sonner";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
    
    if (token) {
      // If there's a token, make a simple API call to test its validity
      const checkTokenValidity = async () => {
        try {
          // Make a lightweight API call to any protected endpoint
          const response = await fetch('http://localhost:8080/api/v1/auth', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            // Token is valid, redirect to dashboard
            navigate('/dashboard');
          } else if (response.status === 401) {
            // Token is invalid or expired
            toast.error("Session expired. Please login again.");
          }
        } catch (error) {
          console.error('API request error:', error);
          // We don't show a toast here as it might just be a network error
          // and we want to let the user try logging in
        }
      };
      
      checkTokenValidity();
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
