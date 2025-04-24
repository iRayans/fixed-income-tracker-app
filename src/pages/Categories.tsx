
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { CategoryForm } from '@/components/categories/CategoryForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data with the new structure
const mockCategories = [
  { id: "1", name: "🔒 Fixed Responsibilities", description: "Bank Loan, Visa Installment, Phone Bill, Internet Bill" },
  { id: "2", name: "🏠 Housing", description: "Rent, Utilities, Maintenance" },
  { id: "3", name: "🚗 Transportation", description: "Gas, Car Maintenance, Public Transit" },
];

const Categories = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddCategory = (values: any) => {
    const newCategory = {
      id: `${categories.length + 1}`,
      name: values.name,
      description: values.description,
    };

    setCategories([...categories, newCategory]);
    setIsDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Manage expense categories</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <CategoryForm onSubmit={handleAddCategory} />
            </DialogContent>
          </Dialog>
        </header>

        <div className="rounded-lg border border-border/40 backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {category.name}
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Categories;
