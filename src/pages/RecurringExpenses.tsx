import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RecurringExpenseForm } from '@/components/expenses/RecurringExpenseForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, Edit, Trash2, Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';
import { recurringExpenseService, RecurringExpense, RecurringExpenseStatus, UpdateRecurringExpenseDto } from '@/services/recurringExpenseService';

import { formatCurrency } from '@/lib/utils';

const RecurringExpenses = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<RecurringExpense | null>(null);
    const [deletingExpenseId, setDeletingExpenseId] = useState<number | null>(null);
    const [archivingExpenseId, setArchivingExpenseId] = useState<number | null>(null);

    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories,
    });

    const { data: recurringExpenses = [], isLoading } = useQuery({
        queryKey: ['recurringExpenses'],
        queryFn: recurringExpenseService.getRecurringExpenses,
    });

    const createRecurringExpenseMutation = useMutation({
        mutationFn: recurringExpenseService.createRecurringExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recurringExpenses'] });
            toast({
                title: "Recurring Expense Added",
                description: "New recurring expense has been added successfully.",
            });
            setIsDialogOpen(false);
            setEditingExpense(null);
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to add recurring expense. Please try again.",
                variant: "destructive",
            });
        },
    });

    const updateRecurringExpenseMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateRecurringExpenseDto }) =>
            recurringExpenseService.updateRecurringExpense(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recurringExpenses'] });
            toast({
                title: "Recurring Expense Updated",
                description: "The recurring expense has been updated successfully.",
            });
            setIsDialogOpen(false);
            setEditingExpense(null);
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update recurring expense. Please try again.",
                variant: "destructive",
            });
        },
    });

    const deleteRecurringExpenseMutation = useMutation({
        mutationFn: recurringExpenseService.deleteRecurringExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recurringExpenses'] });
            toast({
                title: "Recurring Expense Deleted",
                description: "The recurring expense has been deleted successfully.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to delete recurring expense. Please try again.",
                variant: "destructive",
            });
        },
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: RecurringExpenseStatus }) =>
            recurringExpenseService.updateRecurringExpenseStatus(id, status),
        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: ['recurringExpenses'] });
            const previousRecurringExpenses = queryClient.getQueryData<RecurringExpense[]>(['recurringExpenses']);

            queryClient.setQueryData<RecurringExpense[]>(['recurringExpenses'], (current = []) =>
                current.map((expense) => expense.id === id ? { ...expense, status } : expense)
            );

            return { previousRecurringExpenses };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recurringExpenses'] });
            toast({
                title: "Status Updated",
                description: "Recurring expense status has been updated successfully.",
            });
        },
        onError: (_error, _variables, context) => {
            if (context?.previousRecurringExpenses) {
                queryClient.setQueryData(['recurringExpenses'], context.previousRecurringExpenses);
            }
            toast({
                title: "Error",
                description: "Failed to update recurring expense status. Please try again.",
                variant: "destructive",
            });
        },
    });

    const handleConfirmDelete = () => {
        if (deletingExpenseId) {
            deleteRecurringExpenseMutation.mutate(deletingExpenseId);
            setDeletingExpenseId(null);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeletingExpenseId(id);
    };

    const handleSubmit = (values: any) => {
        const expenseData = {
            name: values.name,
            amount: values.amount,
            categoryId: parseInt(values.categoryId),
            dueDayOfMonth: values.dueDay,
            description: values.description || "",
            status: (editingExpense?.status ?? "ACTIVE") as RecurringExpenseStatus,
        };

        if (editingExpense?.id) {
            updateRecurringExpenseMutation.mutate({
                id: editingExpense.id,
                data: expenseData,
            });
        } else {
            createRecurringExpenseMutation.mutate(expenseData);
        }
    };

    const handleEdit = (expense: RecurringExpense) => {
        setEditingExpense(expense);
        setIsDialogOpen(true);
    };

    const handleToggleStatus = (id: number, status: RecurringExpenseStatus) => {
        if (status === "ARCHIVED") return;

        statusMutation.mutate({ id, status: status === "ACTIVE" ? "PAUSED" : "ACTIVE" });
    };

    const handleArchive = () => {
        if (archivingExpenseId) {
            statusMutation.mutate({ id: archivingExpenseId, status: "ARCHIVED" });
            setArchivingExpenseId(null);
        }
    };

    const visibleExpenses = recurringExpenses.filter(expense => expense.status !== "ARCHIVED");


    const formattedCategories = categories.map(category => ({
        id: String(category.id),
        name: category.name
    }));

    if (isLoading) {
        return (
            <AppLayout>
                <div className="space-y-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <TooltipProvider delayDuration={0}>
            <div className="space-y-6 sm:space-y-8">
                <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Recurring Expenses</h1>
                        <p className="text-sm text-muted-foreground">Manage your recurring monthly expenses</p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) setEditingExpense(null);
                    }}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto" onClick={() => setIsDialogOpen(true)}>Add Recurring Expense</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingExpense ? 'Edit Recurring Expense' : 'Add New Recurring Expense'}</DialogTitle>
                            </DialogHeader>
                            <RecurringExpenseForm
                                onSubmit={handleSubmit}
                                categories={formattedCategories}
                                initialValues={editingExpense ? {
                                    name: editingExpense.name,
                                    amount: editingExpense.amount,
                                   categoryId: String(editingExpense.category?.id ?? ''),
                                    dueDay: editingExpense.dueDayOfMonth,
                                    description: editingExpense.description,
                                } : undefined}
                                buttonText={editingExpense ? "Update Expense" : "Add Expense"}
                            />
                        </DialogContent>
                    </Dialog>
                </header>

                {/* Mobile cards */}
                <div className="md:hidden space-y-2">
                    {visibleExpenses.map((expense) => (
                        <div key={expense.id} className="rounded-lg border border-border/40 bg-card/60 p-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="flex items-center gap-2 font-medium break-words">
                                        <Calendar className="h-4 w-4 shrink-0 text-purple-500" />
                                        {expense.name}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground break-words">
                                        {expense.description || 'No description'}
                                    </p>
                                </div>
                                <p className="shrink-0 font-semibold">{formatCurrency(expense.amount)}</p>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span className="rounded-full bg-secondary/60 px-2 py-0.5">
                                    {expense.category?.name ?? 'No Category'}
                                </span>
                                <span className="rounded-full bg-secondary/60 px-2 py-0.5">
                                    Day {expense.dueDayOfMonth}
                                </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Switch
                                        checked={expense.status === "ACTIVE"}
                                        disabled={statusMutation.isPending}
                                        onCheckedChange={() => expense.id && handleToggleStatus(expense.id, expense.status)}
                                    />
                                    <span>{expense.status === "ACTIVE" ? 'Active' : 'Paused'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10"
                                        aria-label="Edit recurring expense"
                                        onClick={() => handleEdit(expense)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10"
                                        aria-label="Archive recurring expense"
                                        disabled={statusMutation.isPending}
                                        onClick={() => expense.id && setArchivingExpenseId(expense.id)}
                                    >
                                        <Archive className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 text-destructive"
                                        aria-label="Delete recurring expense"
                                        onClick={() => expense.id && handleDeleteClick(expense.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden md:block rounded-lg border border-border/40 backdrop-blur-sm overflow-x-auto">

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Due Day</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-center">Active</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleExpenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell className="font-medium flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                                        {expense.name}
                                    </TableCell>
                                    <TableCell>{expense.description}</TableCell>
                                    <TableCell>
                                        {expense.category?.name ?? 'No Category'}
                                    </TableCell>
                                    <TableCell>{expense.dueDayOfMonth}<sup>th</sup> of each month</TableCell>
                                    <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                                    <TableCell className="text-center">
                                        <Switch
                                            checked={expense.status === "ACTIVE"}
                                            disabled={statusMutation.isPending}
                                            onCheckedChange={() => expense.id && handleToggleStatus(expense.id, expense.status)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleEdit(expense)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">Edit</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        title="Archive"
                                                        disabled={statusMutation.isPending}
                                                        onClick={() => expense.id && setArchivingExpenseId(expense.id)}
                                                    >
                                                        <Archive className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">Archive</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        onClick={() => expense.id && handleDeleteClick(expense.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">Delete</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={!!deletingExpenseId} onOpenChange={(open) => !open && setDeletingExpenseId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the recurring expense. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!archivingExpenseId} onOpenChange={(open) => !open && setArchivingExpenseId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Archive this recurring expense?</AlertDialogTitle>
                        <AlertDialogDescription>
                            It will be hidden from the list but not deleted. You can restore it later from the backend.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleArchive}>
                            Archive
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            </TooltipProvider>
        </AppLayout>
    );
};

export default RecurringExpenses;
