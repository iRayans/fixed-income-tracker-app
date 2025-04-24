
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EuroIcon } from "lucide-react";

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
              <FormLabel className="text-base font-semibold">Salary Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <EuroIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    {...field} 
                    className="pl-10 bg-background border-border hover:border-primary/50 transition-colors"
                  />
                </div>
              </FormControl>
              <FormDescription className="text-sm text-muted-foreground">
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
              <FormLabel className="text-base font-semibold">Description</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="E.g., Monthly Base Salary" 
                  {...field} 
                  className="bg-background border-border hover:border-primary/50 transition-colors"
                />
              </FormControl>
              <FormDescription className="text-sm text-muted-foreground">
                Add a description for this salary entry
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full font-medium hover:bg-primary/90 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
