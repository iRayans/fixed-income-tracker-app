
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { authService } from "@/services/authService";
import { AuthMode, LoginFormValues, RegisterFormValues } from '@/types/auth';
import { setAuthToken } from '@/utils/auth';
import { toast } from "@/components/ui/sonner";
import { useToast } from '@/hooks/use-toast';

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
    const { toast } = useToast();
  

  const handleSubmit = async (values: LoginFormValues | RegisterFormValues) => {
    try {
      setIsLoading(true);
      
      if (mode === 'register') {
        const registerData = values as RegisterFormValues;
        await authService.register({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
        });
        

        toast({
            description: "Registration successful. Please login.",
          });
        
        setMode('login');
      } else {
        // Handle login
        const loginData = values as LoginFormValues;
        const response = await authService.login({
          email: loginData.email,
          password: loginData.password,
        });
        
        setAuthToken(response.token);
        
        // Display welcome back toast with username
        if (response.user?.username) {
            toast({
                description: `Welcome back, ${response.user.username}!`,
              });
        }
        
        navigate('/dashboard');
      }
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Use error toast for destructive/red variant
      toast({
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px] bg-gradient-to-b from-card to-background border-purple-900/20">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center font-bold">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === 'login' 
            ? 'Enter your email and password to sign in' 
            : 'Enter your information to create an account'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === 'login' ? (
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
        ) : (
          <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="link" 
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')} 
          className="w-full text-primary"
          disabled={isLoading}
        >
          {mode === 'login' 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Sign in"}
        </Button>
      </CardFooter>
    </Card>
  );
}
