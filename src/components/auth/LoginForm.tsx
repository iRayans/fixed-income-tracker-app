
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoginFormValues, loginSchema } from "@/types/auth";
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Form>
  );
}
