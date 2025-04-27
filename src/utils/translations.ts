
import { createContext, useContext, useState, ReactNode } from 'react';

// Simple translation object with just English
const translations = {
  'auth.welcomeBack': 'Welcome Back',
  'auth.createAccount': 'Create Account',
  'auth.enterCredentials': 'Enter your credentials to access your account',
  'auth.createAccountDescription': 'Fill in your details to create a new account',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.username': 'Username',
  'auth.signIn': 'Sign In',
  'auth.signInLoading': 'Signing in...',
  'auth.createAccountButton': 'Create Account',
  'auth.createAccountLoading': 'Creating account...',
  'auth.noAccount': "Don't have an account? Create one",
  'auth.haveAccount': 'Already have an account? Sign in',
  'auth.trackIncome': 'Track Your Income',
  'auth.manageExpenses': 'Manage Expenses',
  'auth.visualizeProgress': 'Visualize Progress',
  'auth.salaryTracker': 'Salary Tracker',
  'auth.takeControl': 'Take control of your finances with our comprehensive salary and expense tracking solution.',
};

type TranslationKey = keyof typeof translations;

type LanguageContextType = {
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const t = (key: TranslationKey): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      <div className="h-full w-full">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  
  return context;
}
