
type TranslationKey = 
  | 'auth.welcomeBack'
  | 'auth.createAccount'
  | 'auth.enterCredentials'
  | 'auth.createAccountDescription'
  | 'auth.email'
  | 'auth.password'
  | 'auth.username'
  | 'auth.signIn'
  | 'auth.signInLoading'
  | 'auth.createAccountButton'
  | 'auth.createAccountLoading'
  | 'auth.noAccount'
  | 'auth.haveAccount'
  | 'auth.trackIncome'
  | 'auth.manageExpenses'
  | 'auth.visualizeProgress'
  | 'auth.salaryTracker'
  | 'auth.takeControl';

type Translations = {
  en: Record<TranslationKey, string>;
  ar: Record<TranslationKey, string>;
}

// Our translations object with both English and Arabic
export const translations: Translations = {
  en: {
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
  },
  ar: {
    'auth.welcomeBack': 'مرحبًا بعودتك',
    'auth.createAccount': 'إنشاء حساب',
    'auth.enterCredentials': 'أدخل بيانات الاعتماد الخاصة بك للوصول إلى حسابك',
    'auth.createAccountDescription': 'املأ التفاصيل الخاصة بك لإنشاء حساب جديد',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.username': 'اسم المستخدم',
    'auth.signIn': 'تسجيل الدخول',
    'auth.signInLoading': 'جاري تسجيل الدخول...',
    'auth.createAccountButton': 'إنشاء حساب',
    'auth.createAccountLoading': 'جاري إنشاء الحساب...',
    'auth.noAccount': 'ليس لديك حساب؟ قم بإنشاء واحد',
    'auth.haveAccount': 'لديك حساب بالفعل؟ قم بتسجيل الدخول',
    'auth.trackIncome': 'تتبع دخلك',
    'auth.manageExpenses': 'إدارة المصاريف',
    'auth.visualizeProgress': 'تصور التقدم',
    'auth.salaryTracker': 'متتبع الرواتب',
    'auth.takeControl': 'تحكم في أموالك مع حلنا الشامل لتتبع الرواتب والنفقات.',
  }
};

// Create a language context to manage current language
import { createContext, useContext, useState, ReactNode } from 'react';

type LanguageContextType = {
  language: 'en' | 'ar';
  setLanguage: (language: 'en' | 'ar') => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'ar'>('ar'); // Default to Arabic

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} lang={language} className="h-full w-full">
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
