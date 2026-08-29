import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, PiggyBank, Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { formatCurrency } from '@/lib/utils';
import { savingsGoalService } from '@/services/savingsService';
import { useSavingsGoals } from '@/hooks/use-savings';
import { GoalDialog, GoalFormValues } from '@/components/savings/GoalDialog';
import { SavingsStatusBadge } from '@/components/savings/SavingsStatusBadge';

const Savings = () => {
  const navigate = useNavigate();
  const { goals, isLoading, error, refresh } = useSavingsGoals();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = async (values: GoalFormValues) => {
    try {
      await savingsGoalService.createGoal({
        name: values.name,
        targetAmount: values.targetAmount,
        status: values.status,
        targetDate: values.targetDate,
      });
      setIsDialogOpen(false);
      toast.success('Savings goal created');
      refresh();
    } catch {
      toast.error('Failed to create savings goal');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Savings</h1>
            <p className="text-sm text-muted-foreground">Track your savings goals and balances</p>
          </div>
          <Button className="gap-2 h-11 sm:h-10 w-full sm:w-auto" onClick={() => setIsDialogOpen(true)}>
            <Plus size={16} />
            Create Goal
          </Button>
        </header>


        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-border/40 bg-card p-12 text-muted-foreground">
            <Loader2 className="animate-spin" size={18} />
            Loading savings goals...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/40 bg-card p-12 text-center">
            <AlertCircle className="mx-auto mb-3 text-destructive" size={28} />
            <p className="text-muted-foreground mb-4">Could not load savings goals.</p>
            <Button variant="outline" onClick={refresh}>
              Try again
            </Button>
          </div>
        ) : goals.length === 0 ? (
          <div className="card-hover bg-card rounded-lg border border-border/40 p-12 text-center">
            <PiggyBank className="mx-auto mb-3 text-muted-foreground" size={28} />
            <p className="text-muted-foreground">No savings goals yet. Create your first goal to get started.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
              const current = goal.currentAmount ?? 0;
              const percent = goal.targetAmount > 0 ? Math.min(100, Math.round((current / goal.targetAmount) * 100)) : 0;
              return (
                <Card
                  key={goal.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/savings/${goal.id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/savings/${goal.id}`)}
                  className="card-hover cursor-pointer border-border/40 animate-scale-in"
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    <SavingsStatusBadge status={goal.status} />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="text-foreground font-semibold">{formatCurrency(current)}</span> /{' '}
                      {formatCurrency(goal.targetAmount)}
                    </p>
                    <Progress value={percent} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{percent}% completed</span>
                      {goal.targetDate && <span>Target: {format(parseISO(goal.targetDate), 'MMMM yyyy')}</span>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <GoalDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} onSubmit={handleCreate} title="Create Goal" />
      </div>
    </AppLayout>
  );
};

export default Savings;
