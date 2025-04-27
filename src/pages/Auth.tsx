
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { authService } from '@/services/authService';
import { useTranslation } from '@/utils/translations';

const Auth = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-background via-background to-background/95">
      {/* Left side hero section (on medium screens and up) */}
      <div className="hidden md:flex md:w-1/2 p-10 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-700/20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 animate-fade-in">
          <h1 className="text-6xl font-bold text-gradient mb-6">
            {t('auth.salaryTracker')} <span className="text-primary">Tracker</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-md">
            {t('auth.takeControl')}
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22V8"/><path d="m5 12 7-4 7 4"/><path d="M19 21v-6"/><path d="M5 21v-6"/><path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/></svg>
              </div>
              <div>
                <h3 className="font-medium">{t('auth.trackIncome')}</h3>
                <p className="text-muted-foreground text-sm">Monitor your salary and income sources</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
              </div>
              <div>
                <h3 className="font-medium">{t('auth.manageExpenses')}</h3>
                <p className="text-muted-foreground text-sm">Categorize and track all your spending</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div>
                <h3 className="font-medium">{t('auth.visualizeProgress')}</h3>
                <p className="text-muted-foreground text-sm">Get insights with comprehensive reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side authentication form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        {/* Abstract background elements (mobile only) */}
        <div className="md:hidden absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-purple-700/10 blur-3xl"></div>
          <div className="absolute top-1/2 right-10 w-60 h-60 rounded-full bg-purple-600/5 blur-3xl"></div>
          <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-purple-800/10 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-md animate-fade-in">
          <div className="text-center mb-8 animate-slide-up md:hidden">
            <h1 className="text-5xl font-bold text-gradient mb-2">
              {t('auth.salaryTracker')}
            </h1>
            <p className="text-muted-foreground text-lg">
              Track and manage your monthly expenses with ease
            </p>
          </div>
          <div className="w-full animate-scale-in">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
