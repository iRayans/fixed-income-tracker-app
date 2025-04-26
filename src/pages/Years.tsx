
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authService } from '@/services/authService';

const Years = () => {
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const generateAvailableYears = async () => {
      setLoading(true);
      try {
        // Get user data which includes creation date
        const userData = await authService.getCurrentUser();
        
        if (!userData) {
          throw new Error('Could not fetch user data');
        }

        // Get the year from user's creation date
        const creationYear = new Date(userData.createdAt).getFullYear();
        
        // Generate array of years from creation year to current year
        const availableYears = [];
        for (let year = creationYear; year <= currentYear; year++) {
          availableYears.push(year);
        }
        
        // Sort years in descending order (newest first)
        availableYears.sort((a, b) => b - a);
        setYears(availableYears);
      } catch (error) {
        console.error('Error generating years:', error);
        toast.error("Failed to load years data. Please try again.");
        // Fallback to just showing current year
        setYears([currentYear]);
      } finally {
        setLoading(false);
      }
    };
    
    generateAvailableYears();
  }, [currentYear]);

  const handleYearSelect = (year: number) => {
    navigate(`/dashboard?year=${year}`);
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
