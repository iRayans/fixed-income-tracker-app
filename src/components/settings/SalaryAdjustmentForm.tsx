import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  type: z.enum(["BONUS", "DEDUCTION", "OVERTIME","HOUSE_RENT_ALLOWANCE" ,"OTHER"]),
  amount: z.coerce.number().positive({ message: "Enter the amount as a positive number" }),
  date: z.string().min(1, { message: "Date is required" }),
  description: z.string().optional(),
});

export type SalaryAdjustmentFormValues = z.infer<typeof formSchema>;

interface SalaryAdjustmentFormProps {
  onSubmit: (values: SalaryAdjustmentFormValues) => void;
  initialValues?: Partial<SalaryAdjustmentFormValues>;
  buttonText?: string;
  isLoading?: boolean;
}

export function SalaryAdjustmentForm({
  onSubmit,
  initialValues,
  buttonText = "Save Adjustment",
  isLoading = false,
}: SalaryAdjustmentFormProps) {
  const defaults: SalaryAdjustmentFormValues = {
    type: initialValues?.type ?? "BONUS",
    amount: initialValues?.amount ?? 0,
    date: initialValues?.date ?? new Date().toISOString().slice(0, 10),
    description: initialValues?.description ?? "",
  };

  const form = useForm<SalaryAdjustmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    form.reset(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.type, initialValues?.amount, initialValues?.date, initialValues?.description]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="BONUS">Bonus</SelectItem>
                  <SelectItem value="DEDUCTION">Deduction</SelectItem>
                  <SelectItem value="OVERTIME">Overtime</SelectItem>
                  <SelectItem value="HOUSE_RENT_ALLOWANCE">House Rent Allowance Advance</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} className="bg-secondary/50" />
              </FormControl>
              <FormDescription>
                Always enter a positive number — deductions are stored negative automatically based on type
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="bg-secondary/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder='e.g. "Ramadan bonus", "Unpaid leave deduction"' {...field} className="bg-secondary/50" />
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