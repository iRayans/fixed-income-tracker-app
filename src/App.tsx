
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider"
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import RecurringExpenses from "./pages/RecurringExpenses";
import Categories from "./pages/Categories";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Years from "./pages/Years";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LanguageProvider } from './utils/translations';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/expenses",
    element: <Expenses />,
  },
  {
    path: "/recurring",
    element: <RecurringExpenses />,
  },
  {
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "/reports",
    element: <Reports />,
  },
   {
    path: "/years",
    element: <Years />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="salary-tracker-theme">
        <LanguageProvider>
          <RouterProvider router={router} />
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
