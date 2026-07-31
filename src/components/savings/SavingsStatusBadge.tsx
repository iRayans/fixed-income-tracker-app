import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GoalStatus, statusLabel } from '@/services/savingsService';
import { cn } from '@/lib/utils';

export const SavingsStatusBadge: React.FC<{ status: GoalStatus; className?: string }> = ({ status, className }) => (
  <Badge
    variant="outline"
    className={cn(
      'border',
      status === 'COMPLETED' && 'border-primary/40 bg-primary/10 text-primary',
      status === 'IN_PROGRESS' && 'border-border bg-muted/40 text-muted-foreground',
      status === 'CANCELLED' && 'border-destructive/40 bg-destructive/10 text-destructive',
      className
    )}
  >
    {statusLabel[status]}
  </Badge>
);
