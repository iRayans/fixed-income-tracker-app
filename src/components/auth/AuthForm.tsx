
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { authService } from "@/services/authService";
import { AuthMode, LoginFormValues, RegisterFormValues } from '@/types/auth';

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginFormValues | RegisterFormValues) => {
    try {
      setIsLoading(true);
      
      if (mode === 'register') {
        const registerData = values as RegisterFormValues;
        const response = await authService.register({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
        });
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('isAuthenticated', 'true');
        
        toast({
          title: "Registration successful",
          description: "Your account has been created.",
        });
        
        navigate('/dashboard');
      } else {
        // Handle login
        const loginData = values as LoginFormValues;
        const response = await authService.login({
          email: loginData.email,
          password: loginData.password,
        });
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('isAuthenticated', 'true');
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        navigate('/dashboard');
      }
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
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
