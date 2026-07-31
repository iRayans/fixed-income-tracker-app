import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, Minus, Pencil, Plus } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { cn, formatCurrency } from '@/lib/utils';
import { savingsService } from '@/services/savingsService';
import { useSavingsGoal } from '@/hooks/use-savings';
import { GoalDialog, GoalFormValues } from '@/components/savings/GoalDialog';
import { TransactionDialog } from '@/components/savings/TransactionDialog';
import { SavingsStatusBadge } from '@/components/savings/SavingsStatusBadge';

const SavingsGoalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goal = useSavingsGoal(id);
  const [txMode, setTxMode] = useState<'DEPOSIT' | 'WITHDRAWAL' | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!goal) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/savings')}>
            <ChevronLeft size={16} /> Savings
          </Button>
          <p className="text-muted-foreground">Savings goal not found.</p>
        </div>
      </AppLayout>
    );
  }

  const percent = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;

  const handleTransaction = (amount: number, description?: string) => {
    if (!txMode) return;
    savingsService.addTransaction(goal.id, txMode, amount, description);
    toast.success(txMode === 'DEPOSIT' ? 'Money added' : 'Withdrawal recorded');
    setTxMode(null);
  };

  const handleEdit = (values: GoalFormValues) => {
    savingsService.updateGoal(goal.id, values);
    setIsEditOpen(false);
    toast.success('Goal updated');
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/savings')}
        >
          <ChevronLeft size={16} />
          <span>All Goals</span>
        </Button>

        <Card className="border-border/40 animate-scale-in">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle className="text-2xl">{goal.name}</CardTitle>
              <p className="text-muted-foreground mt-1">
                {goal.targetDate ? `Target date: ${format(parseISO(goal.targetDate), 'MMMM yyyy')}` : 'No target date'}
              </p>
            </div>
            <SavingsStatusBadge status={goal.status} />
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Current balance</p>
                <p className="text-2xl font-bold">{formatCurrency(goal.currentAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target amount</p>
                <p className="text-2xl font-bold">{formatCurrency(goal.targetAmount)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={percent} className="h-2" />
              <p className="text-sm text-muted-foreground">{percent}% completed</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="gap-2" onClick={() => setTxMode('DEPOSIT')}>
                <Plus size={16} /> Add Money
              </Button>
              <Button variant="secondary" className="gap-2" onClick={() => setTxMode('WITHDRAWAL')}>
                <Minus size={16} /> Withdraw
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setIsEditOpen(true)}>
                <Pencil size={16} /> Edit Goal
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg">Transaction history</CardTitle>
          </CardHeader>
          <CardContent>
            {goal.transactions.length === 0 ? (
              <p className="text-muted-foreground py-6 text-center">No transactions yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goal.transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{format(parseISO(tx.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell className={cn(tx.type === 'DEPOSIT' ? 'text-primary' : 'text-destructive')}>
                        {tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                      </TableCell>
                      <TableCell className={cn('text-right font-medium', tx.type === 'DEPOSIT' ? 'text-primary' : 'text-destructive')}>
                        {tx.type === 'DEPOSIT' ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{tx.description ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <TransactionDialog
          isOpen={txMode !== null}
          onOpenChange={(open) => !open && setTxMode(null)}
          mode={txMode ?? 'DEPOSIT'}
          currentBalance={goal.currentAmount}
          onSubmit={handleTransaction}
        />

        <GoalDialog
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSubmit={handleEdit}
          title="Edit Goal"
          initialValues={{
            name: goal.name,
            targetAmount: goal.targetAmount,
            targetDate: goal.targetDate,
            status: goal.status,
          }}
        />
      </div>
    </AppLayout>
  );
};

export default SavingsGoalDetails;
