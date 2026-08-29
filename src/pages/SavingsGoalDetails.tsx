import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, Minus, Pencil, Plus, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { cn, formatCurrency } from '@/lib/utils';
import { savingsGoalService, savingsTransactionService, type SavingsTransaction, type TransactionType } from '@/services/savingsService';
import { useSavingsGoalDetails } from '@/hooks/use-savings';
import { TransactionDialog } from '@/components/savings/TransactionDialog';
import { EditTransactionDialog } from '@/components/savings/EditTransactionDialog';
import { GoalDialog, type GoalFormValues } from '@/components/savings/GoalDialog';
import { SavingsStatusBadge } from '@/components/savings/SavingsStatusBadge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';


const SavingsGoalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { goal, transactions, balance, isLoading, error, refresh } = useSavingsGoalDetails(id);
  const [txMode, setTxMode] = useState<'DEPOSIT' | 'WITHDRAWAL' | null>(null);
  const [editingTx, setEditingTx] = useState<SavingsTransaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<SavingsTransaction | null>(null);
  const [busyTxId, setBusyTxId] = useState<number | null>(null);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [isSavingGoal, setIsSavingGoal] = useState(false);

  const backButton = (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1 text-muted-foreground hover:text-foreground"
      onClick={() => navigate('/savings')}
    >
      <ChevronLeft size={16} />
      <span>All Goals</span>
    </Button>
  );

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-4">
          {backButton}
          <div className="flex items-center justify-center gap-2 rounded-lg border border-border/40 bg-card p-12 text-muted-foreground">
            <Loader2 className="animate-spin" size={18} />
            Loading goal...
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !goal) {
    return (
      <AppLayout>
        <div className="space-y-4">
          {backButton}
          <div className="rounded-lg border border-destructive/40 bg-card p-12 text-center">
            <AlertCircle className="mx-auto mb-3 text-destructive" size={28} />
            <p className="text-muted-foreground mb-4">{error ? 'Could not load this savings goal.' : 'Savings goal not found.'}</p>
            <Button variant="outline" onClick={refresh}>
              Try again
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const percent = goal.targetAmount > 0 ? Math.min(100, Math.round((balance / goal.targetAmount) * 100)) : 0;

  const handleTransaction = async (amount: number, description?: string) => {
    if (!txMode) return;
    try {
      await savingsTransactionService.create({ goalId: Number(goal.id), amount, type: txMode, description });
      toast.success(txMode === 'DEPOSIT' ? 'Money added' : 'Withdrawal recorded');
      setTxMode(null);
      refresh();
      queryClient.invalidateQueries({ queryKey: ['savings-monthly'] });
    } catch {
      toast.error('Transaction failed');
    }
  };

  const handleDeleteGoal = async () => {
    try {
      await savingsGoalService.deleteGoal(goal.id);
      toast.success('Goal deleted');
      navigate('/savings');
    } catch {
      toast.error('Failed to delete goal');
    }
  };

  const goalFormValues: GoalFormValues = {
    name: goal.name,
    targetAmount: goal.targetAmount,
    targetDate: goal.targetDate,
    status: goal.status,
  };

  const handleUpdateGoal = async (values: GoalFormValues) => {
    setIsSavingGoal(true);
    try {
      await savingsGoalService.updateGoal(goal.id, {
        name: values.name,
        targetAmount: values.targetAmount,
        targetDate: values.targetDate,
        status: values.status,
      });
      toast.success('Goal updated');
      setIsEditingGoal(false);
      refresh();
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['savings-monthly'] });
    } catch {
      toast.error('Failed to update goal');
    } finally {
      setIsSavingGoal(false);
    }
  };

  const afterTxChange = () => {
    refresh();
    queryClient.invalidateQueries({ queryKey: ['savings-monthly'] });
  };

  const handleEditTransaction = async (values: { amount: number; type: TransactionType; description?: string }) => {
    if (!editingTx) return;
    setBusyTxId(editingTx.id);
    try {
      await savingsTransactionService.update(editingTx.id, {
        goalId: Number(goal.id),
        amount: values.amount,
        type: values.type,
        description: values.description,
      });
      toast.success('Transaction updated');
      setEditingTx(null);
      afterTxChange();
    } catch {
      toast.error('Failed to update transaction');
    } finally {
      setBusyTxId(null);
    }
  };

  const handleDeleteTransaction = async () => {
    if (!deletingTx) return;
    setBusyTxId(deletingTx.id);
    try {
      await savingsTransactionService.remove(deletingTx.id);
      toast.success('Transaction deleted');
      setDeletingTx(null);
      afterTxChange();
    } catch {
      toast.error('Failed to delete transaction');
    } finally {
      setBusyTxId(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {backButton}

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
                <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
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
              <Button variant="outline" className="gap-2" onClick={() => setIsEditingGoal(true)}>
                <Pencil size={16} /> Edit Goal
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleDeleteGoal}>
                <Trash2 size={16} /> Delete Goal
              </Button>
              {balance >= goal.targetAmount && goal.status === 'IN_PROGRESS' && (
                <Button
                  variant="ghost"
                  className="gap-2 text-primary hover:text-primary"
                  disabled={isSavingGoal}
                  onClick={() => handleUpdateGoal({ ...goalFormValues, status: 'COMPLETED' })}
                >
                  <CheckCircle2 size={16} /> Mark as Completed
                </Button>
              )}
            </div>

          </CardContent>
        </Card>

        <Card className="border-border/40 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg">Transaction history</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {transactions.length === 0 ? (
              <p className="text-muted-foreground py-6 text-center">No transactions yet.</p>
            ) : (
              <>
              {/* Mobile list */}
              <div className="md:hidden space-y-2">
                {transactions.map((tx) => {
                  const rawDate = tx.date ?? tx.createdAt;
                  const isBusy = busyTxId === tx.id;
                  return (
                    <div key={tx.id} className="rounded-lg border border-border/40 bg-card/60 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className={cn('font-medium', tx.type === 'DEPOSIT' ? 'text-primary' : 'text-destructive')}>
                            {tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {rawDate ? format(parseISO(rawDate), 'MMM d, yyyy') : '—'}
                          </p>
                        </div>
                        <p className={cn('shrink-0 font-semibold', tx.type === 'DEPOSIT' ? 'text-primary' : 'text-destructive')}>
                          {tx.type === 'DEPOSIT' ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground break-words">{tx.description ?? '—'}</p>
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          aria-label="Edit transaction"
                          disabled={busyTxId !== null}
                          onClick={() => setEditingTx(tx)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 text-destructive"
                          aria-label="Delete transaction"
                          disabled={busyTxId !== null}
                          onClick={() => setDeletingTx(tx)}
                        >
                          {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden md:block overflow-x-auto">                <Table>

                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => {
                    const rawDate = tx.date ?? tx.createdAt;
                    const isBusy = busyTxId === tx.id;
                    return (
                      <TableRow key={tx.id}>
                        <TableCell>{rawDate ? format(parseISO(rawDate), 'MMM d, yyyy') : '—'}</TableCell>
                        <TableCell className={cn(tx.type === 'DEPOSIT' ? 'text-primary' : 'text-destructive')}>
                          {tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                        </TableCell>
                        <TableCell className={cn('text-right font-medium', tx.type === 'DEPOSIT' ? 'text-primary' : 'text-destructive')}>
                          {tx.type === 'DEPOSIT' ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{tx.description ?? '—'}</TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                  aria-label="Edit transaction"
                                  disabled={busyTxId !== null}
                                  onClick={() => setEditingTx(tx)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">Edit</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  aria-label="Delete transaction"
                                  disabled={busyTxId !== null}
                                  onClick={() => setDeletingTx(tx)}
                                >
                                  {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">Delete</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>

                      </TableRow>
                    );
                  })}
                </TableBody>
                </Table>              </div>
            )}
          </CardContent>
        </Card>

        <GoalDialog
          isOpen={isEditingGoal}
          onOpenChange={(open) => !open && !isSavingGoal && setIsEditingGoal(false)}
          title="Edit Goal"
          initialValues={goalFormValues}
          onSubmit={handleUpdateGoal}
        />

        <TransactionDialog
          isOpen={txMode !== null}
          onOpenChange={(open) => !open && setTxMode(null)}
          mode={txMode ?? 'DEPOSIT'}
          currentBalance={balance}
          onSubmit={handleTransaction}
        />

        <EditTransactionDialog
          isOpen={editingTx !== null}
          onOpenChange={(open) => !open && busyTxId === null && setEditingTx(null)}
          transaction={editingTx}
          isSubmitting={busyTxId !== null && editingTx !== null}
          onSubmit={handleEditTransaction}
        />

        <AlertDialog open={deletingTx !== null} onOpenChange={(open) => !open && busyTxId === null && setDeletingTx(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete transaction</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to delete this transaction?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={busyTxId !== null}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteTransaction();
                }}
                disabled={busyTxId !== null}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default SavingsGoalDetails;
