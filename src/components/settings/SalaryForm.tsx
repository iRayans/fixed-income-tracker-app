
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Salary must be positive" }),
  description: z.string().min(1, { message: "Description is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface SalaryFormProps {
  onSubmit: (values: FormValues) => void;
  initialValues?: Partial<FormValues>;
  buttonText?: string;
  isLoading?: boolean;
}

export function SalaryForm({
  onSubmit,
  initialValues,
  buttonText = "Save Salary",
  isLoading = false,
}: SalaryFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: initialValues?.amount || 0,
      description: initialValues?.description || "",
    },
  });

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
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  {...field} 
                  className="bg-secondary/50"
                />
              </FormControl>
              <FormDescription>
                Enter your monthly salary amount
              </FormDescription>
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
                <Input 
                  type="text" 
                  placeholder="Enter description" 
                  {...field} 
                  className="bg-secondary/50"
                />
              </FormControl>
              <FormDescription>
                Description for this salary (e.g., "Monthly Salary", "Base Salary")
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
