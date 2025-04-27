
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
import { useTranslation } from '@/utils/translations';

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
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
            description: "تم التسجيل بنجاح. الرجاء تسجيل الدخول.",
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
                description: `أهلاً بعودتك، ${response.user.username}!`,
              });
        }
        
        navigate('/dashboard');
      }
    } catch (error) {
      let errorMessage = "حدث خطأ ما. يرجى المحاولة مرة أخرى.";
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
    <Card className="w-full bg-gradient-to-b from-card/80 to-background/90 border-purple-900/20 shadow-lg backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-2xl text-center font-bold">
          {mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === 'login' 
            ? t('auth.enterCredentials')
            : t('auth.createAccountDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
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
            ? t('auth.noAccount')
            : t('auth.haveAccount')}
        </Button>
      </CardFooter>
    </Card>
  );
}
