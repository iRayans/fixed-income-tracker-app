
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SalaryFormProps {
  onSubmit: (values: any) => void;
  initialValues?: any;
  buttonText?: string;
  isLoading?: boolean;
}

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Salary must be positive" }),
  effectiveDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date",
  }),
});

export function SalaryForm({
  onSubmit,
  initialValues,
  buttonText = "Update Salary",
  isLoading = false,
}: SalaryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      amount: undefined,
      effectiveDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Salary Amount</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  {...field} 
                  className="bg-secondary/50"
                  step="0.01"
                />
              </FormControl>
              <FormDescription>
                Enter your monthly take-home salary amount
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="effectiveDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Effective Date</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  className="bg-secondary/50"
                />
              </FormControl>
              <FormDescription>
                Date from which this salary amount is effective
              </FormDescription>
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
