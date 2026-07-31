import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GoalStatus } from '@/services/savingsService';

export interface GoalFormValues {
  name: string;
  targetAmount: number;
  targetDate?: string;
  status: GoalStatus;
}

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GoalFormValues) => void;
  initialValues?: GoalFormValues;
  title?: string;
}

export const GoalDialog: React.FC<Props> = ({ isOpen, onOpenChange, onSubmit, initialValues, title }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [status, setStatus] = useState<GoalStatus>('IN_PROGRESS');
  const [errors, setErrors] = useState<{ name?: string; targetAmount?: string }>({});

  useEffect(() => {
    if (!isOpen) return;
    setName(initialValues?.name ?? '');
    setTargetAmount(initialValues ? String(initialValues.targetAmount) : '');
    setTargetDate(initialValues?.targetDate?.slice(0, 10) ?? '');
    setStatus(initialValues?.status ?? 'IN_PROGRESS');
    setErrors({});
  }, [isOpen, initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = 'Goal name is required';
    if (name.trim().length > 100) nextErrors.name = 'Goal name must be less than 100 characters';
    const amount = Number(targetAmount);
    if (!targetAmount || Number.isNaN(amount) || amount <= 0) nextErrors.targetAmount = 'Target amount must be positive';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    onSubmit({ name: name.trim(), targetAmount: amount, targetDate: targetDate || undefined, status });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title ?? 'Create Goal'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Goal name</Label>
            <Input id="goal-name" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} placeholder="Emergency Fund" />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-target">Target amount</Label>
            <Input
              id="goal-target"
              type="number"
              min="0"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="30000"
            />
            {errors.targetAmount && <p className="text-sm text-destructive">{errors.targetAmount}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-date">Target date (optional)</Label>
            <Input id="goal-date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as GoalStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
