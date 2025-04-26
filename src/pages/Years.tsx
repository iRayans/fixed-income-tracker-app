
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { expenseService } from '@/services/expenseService';

const Years = () => {
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchAvailableYears = async () => {
      setLoading(true);
      try {
        // Call the API to get all years with expenses
        const availableYears = await expenseService.getAvailableYears();
        
        // Make sure the current year is always included
        if (!availableYears.includes(currentYear)) {
          availableYears.push(currentYear);
        }
        
        // Sort years in descending order (most recent first)
        availableYears.sort((a, b) => b - a);
        
        setYears(availableYears);
      } catch (error) {
        console.error('Error fetching years data:', error);
        toast({
          title: "Error",
          description: "Failed to load years data. Please try again.",
          variant: "destructive",
        });
        
        // If we fail to fetch, at least show the current year
        setYears([currentYear]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableYears();
  }, [toast, currentYear]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Expense Years</h1>
          <p className="text-muted-foreground">Select a year to view expense reports</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="h-40 bg-gradient-to-br from-card to-card/70 border-purple-900/20 animate-pulse">
                <CardContent className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Loading...</p>
                </CardContent>
              </Card>
            ))
          ) : (
            years.length === 0 ? (
              <Card className="col-span-full bg-gradient-to-br from-card to-card/70 border-purple-900/20">
                <CardContent className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground">No expense data found for any year</p>
                </CardContent>
              </Card>
            ) : (
              years.map(year => (
                <Link to={`/reports/${year}`} key={year}>
                  <Card className="h-40 bg-gradient-to-br from-card to-card/70 border-purple-900/20 hover:bg-card/80 transition-colors cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-2xl font-bold">{year}</CardTitle>
                      {year === currentYear && (
                        <Button variant="outline" size="sm" disabled className="pointer-events-none">
                          Current
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        View expense reports for {year}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Years;
