
import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    amount: z.coerce.number().positive({ message: "Salary must be positive" }),
    description: z.string().min(1, { message: "Description is required" }),
    effectiveFrom: z.string().min(1, { message: "Effective from date is required" }),
    effectiveTo: z.string().optional(),
  })
  .refine(
    (values) => !values.effectiveTo || values.effectiveTo >= values.effectiveFrom,
    { message: "Effective to must be after effective from", path: ["effectiveTo"] }
  );

export type SalaryFormValues = z.infer<typeof formSchema>;

interface SalaryFormProps {
  onSubmit: (values: SalaryFormValues) => void;
  initialValues?: Partial<SalaryFormValues>;
  buttonText?: string;
  isLoading?: boolean;
}

export function SalaryForm({
  onSubmit,
  initialValues,
  buttonText = "Save Salary",
  isLoading = false,
}: SalaryFormProps) {
  const defaults: SalaryFormValues = {
    amount: initialValues?.amount ?? 0,
    description: initialValues?.description ?? "",
    effectiveFrom: initialValues?.effectiveFrom ?? new Date().toISOString().slice(0, 10),
    effectiveTo: initialValues?.effectiveTo ?? "",
  };

  const form = useForm<SalaryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    form.reset(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialValues?.amount,
    initialValues?.description,
    initialValues?.effectiveFrom,
    initialValues?.effectiveTo,
  ]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} className="bg-secondary/50" />
              </FormControl>
              <FormDescription>Enter your monthly salary amount</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter description" {...field} className="bg-secondary/50" />
              </FormControl>
              <FormDescription>
                Description for this salary (e.g., "Monthly Salary", "2026 Raise")
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="effectiveFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Effective From</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-secondary/50" />
                </FormControl>
                <FormDescription>First day this salary applies</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="effectiveTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Effective To (optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ""} className="bg-secondary/50" />
                </FormControl>
                <FormDescription>Leave empty if still active</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
