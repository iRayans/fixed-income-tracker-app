
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RegisterFormValues, registerSchema } from "@/types/auth";
import { Loader2 } from 'lucide-react';

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function RegisterForm({ onSubmit, isLoading = false }: RegisterFormProps) {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground/70">Username</FormLabel>
              <FormControl>
                <Input 
                  placeholder="johndoe" 
                  className="bg-black/20 border-purple-500/20 focus-visible:ring-purple-500/30 placeholder:text-muted-foreground/50" 
                  {...field} 
                  disabled={isLoading} 
                />
              </FormControl>
              <FormMessage className="text-destructive/70" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground/70">Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="hello@example.com" 
                  type="email" 
                  className="bg-black/20 border-purple-500/20 focus-visible:ring-purple-500/30 placeholder:text-muted-foreground/50" 
                  {...field} 
                  disabled={isLoading} 
                />
              </FormControl>
              <FormMessage className="text-destructive/70" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground/70">Password</FormLabel>
              <FormControl>
                <Input 
                  placeholder="••••••••" 
                  type="password" 
                  className="bg-black/20 border-purple-500/20 focus-visible:ring-purple-500/30 placeholder:text-muted-foreground/50" 
                  {...field} 
                  disabled={isLoading} 
                />
              </FormControl>
              <FormMessage className="text-destructive/70" />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
}
