
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { expenseService } from '@/services/expenseService';

const Years = () => {
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchAvailableYears = async () => {
      setLoading(true);
      try {
        const availableYears = await expenseService.getAvailableYears();
        if (!availableYears.includes(currentYear)) {
          availableYears.push(currentYear);
        }
        availableYears.sort((a, b) => b - a);
        setYears(availableYears);
      } catch (error) {
        console.error('Error fetching years data:', error);
        toast({
          title: "Error",
          description: "Failed to load years data. Please try again.",
          variant: "destructive",
        });
        setYears([currentYear]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableYears();
  }, [toast, currentYear]);

  const handleYearSelect = (year: number) => {
    // Changed to navigate to reports for the selected year
    navigate(`/reports/${year}`);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Select Year</h1>
          <p className="text-muted-foreground">View expenses and summary by year</p>
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
            years.map(year => (
              <Card 
                key={year}
                className="h-40 bg-gradient-to-br from-card to-card/70 border-purple-900/20 hover:bg-card/80 transition-colors cursor-pointer"
                onClick={() => handleYearSelect(year)}
              >
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
                    View annual report for {year}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Years;
