
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CategoryFormProps {
  onSubmit: (values: any) => void;
  initialValues?: any;
  buttonText?: string;
  isLoading?: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: "Please enter a valid hex color code" })
});

export function CategoryForm({
  onSubmit,
  initialValues,
  buttonText = "Save Category",
  isLoading = false,
}: CategoryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
      description: "",
      color: "#8b5cf6" // Default to purple
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Rent, Car Payment, etc." {...field} className="bg-secondary/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="grid grid-cols-[1fr_80px] gap-4">
              <div>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input placeholder="#8b5cf6" {...field} className="bg-secondary/50" />
                </FormControl>
                <FormMessage />
              </div>
              <div className="pt-8">
                <div 
                  className="h-10 w-20 rounded-md border" 
                  style={{ backgroundColor: field.value }}
                />
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="For tracking..." {...field} className="bg-secondary/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
