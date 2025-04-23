
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { CategoryForm } from '@/components/categories/CategoryForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockCategories = [
  { id: "1", name: "Housing", description: "Rent, mortgage, etc.", color: "#8b5cf6" },
  { id: "2", name: "Transportation", description: "Car payments, gas, etc.", color: "#ec4899" },
  { id: "3", name: "Utilities", description: "Electric, water, internet, etc.", color: "#10b981" },
  { id: "4", name: "Insurance", description: "Health, car, home insurance", color: "#3b82f6" },
  { id: "5", name: "Groceries", description: "Food and household items", color: "#f59e0b" },
  { id: "6", name: "Other", description: "Miscellaneous expenses", color: "#6b7280" },
];

const Categories = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddCategory = (values: any) => {
    const newCategory = {
      id: `${categories.length + 1}`,
      name: values.name,
      description: values.description || "",
      color: values.color,
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
                <TableHead>Color</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-4 w-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className="font-mono"
                      style={{ 
                        backgroundColor: `${category.color}20`, 
                        color: category.color,
                        borderColor: `${category.color}30`
                      }}
                    >
                      {category.color}
                    </Badge>
                  </TableCell>
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
