import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'DEPOSIT' | 'WITHDRAWAL';
  currentBalance: number;
  onSubmit: (amount: number, description?: string) => void;
}

export const TransactionDialog: React.FC<Props> = ({ isOpen, onOpenChange, mode, currentBalance, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!amount || Number.isNaN(value) || value <= 0) {
      setError('Amount must be greater than zero');
      return;
    }
    if (mode === 'WITHDRAWAL' && value > currentBalance) {
      setError(`Withdrawal cannot exceed the current balance (${formatCurrency(currentBalance)})`);
      return;
    }
    setError(null);
    onSubmit(value, description.trim() || undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'DEPOSIT' ? 'Add Money' : 'Withdraw'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tx-amount">Amount</Label>
            <Input id="tx-amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tx-desc">Description (optional)</Label>
            <Input id="tx-desc" maxLength={200} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{mode === 'DEPOSIT' ? 'Add Money' : 'Withdraw'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
