
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { authService } from '@/services/authService';
import { PiggyBank, BarChart2, Wallet } from 'lucide-react';

const features = [
  {
    icon: Wallet,
    title: 'Monthly expenses',
    description: 'Log and categorise every expense in a clear monthly view.',
  },
  {
    icon: PiggyBank,
    title: 'Savings goals',
    description: 'Set targets, deposit money, and watch your progress grow.',
  },
  {
    icon: BarChart2,
    title: 'Yearly insights',
    description: 'Spot trends across months and categories at a glance.',
  },
];

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
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-background/95 flex items-center justify-center p-4 sm:p-8">
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-purple-700/10 blur-3xl" />
        <div className="absolute top-1/2 right-10 w-60 h-60 rounded-full bg-purple-600/5 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-purple-800/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid gap-10 lg:grid-cols-2 lg:gap-16 items-center animate-fade-in">
        {/* Branding panel */}
        <section className="text-center lg:text-left animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-4">
            Salary Tracker
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto lg:mx-0">
            Track expenses, build savings goals, and understand where your salary goes.
          </p>

          <ul className="hidden lg:flex flex-col gap-4 mt-10">
            {features.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="glass-morphism rounded-lg p-4 flex items-start gap-4 border border-purple-900/20"
              >
                <span className="rounded-md bg-primary/10 text-primary p-2.5">
                  <Icon size={20} />
                </span>
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="block text-sm text-muted-foreground">{description}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Auth card */}
        <div className="w-full max-w-md mx-auto lg:mx-0 animate-scale-in">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Auth;
