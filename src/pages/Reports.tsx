
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { expenseService } from '@/services/expenseService';
import { toast } from 'sonner';

const Reports = () => {
  const { year: yearParam } = useParams<{ year?: string }>();
  const [searchParams] = useSearchParams();
  const yearFromUrl = yearParam || searchParams.get('year') || new Date().getFullYear().toString();
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('monthly');
  const [monthlyData, setMonthlyData] = useState<Array<{ name: string; expenses: number }>>([]);
  const [categoryData, setCategoryData] = useState<Array<{ name: string; amount: number }>>([]);
  const [loading, setLoading] = useState(true);
  
  // Convert year to number for processing
  const selectedYear = parseInt(yearFromUrl);

  useEffect(() => {
    const fetchAllMonthsData = async () => {
      setLoading(true);
      try {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyExpenseData: Array<{ name: string; expenses: number }> = [];
        const categoryTotals: Record<string, number> = {};
        
        // Fetch data for each month and process it
        for (let month = 1; month <= 12; month++) {
          const monthString = month.toString().padStart(2, '0');
          const dateString = `${selectedYear}-${monthString}`;
          
          try {
            const expensesForMonth = await expenseService.getExpenses(dateString);
            
            // Calculate total expenses for this month
            const monthTotal = expensesForMonth.reduce((sum, expense) => sum + expense.amount, 0);
            monthlyExpenseData.push({
              name: monthNames[month - 1],
              expenses: monthTotal
            });
            
            // Aggregate by category
            expensesForMonth.forEach(expense => {
              const categoryName = expense.category?.name || 'Uncategorized';
              if (!categoryTotals[categoryName]) {
                categoryTotals[categoryName] = 0;
              }
              categoryTotals[categoryName] += expense.amount;
            });
          } catch (error) {
            console.error(`Error fetching data for ${dateString}:`, error);
            // Add zero value for months we couldn't fetch
            monthlyExpenseData.push({
              name: monthNames[month - 1],
              expenses: 0
            });
          }
        }
        
        // Transform category data for chart
        const categoryChartData = Object.entries(categoryTotals).map(([name, amount]) => ({
          name,
          amount
        }));
        
        // Sort category data by amount (descending)
        categoryChartData.sort((a, b) => b.amount - a.amount);
        
        setMonthlyData(monthlyExpenseData);
        setCategoryData(categoryChartData);
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast.error("Failed to load report data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllMonthsData();
  }, [selectedYear]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate(`/years`)}
              className="h-9 w-9"
            >
              <ChevronLeft size={18} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reports for {selectedYear}</h1>
              <p className="text-muted-foreground">View expense reports and trends</p>
            </div>
          </div>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly Trends</SelectItem>
              <SelectItem value="category">By Category</SelectItem>
            </SelectContent>
          </Select>
        </header>

        <Card className="bg-gradient-to-br from-card to-card/70 border-purple-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">
              {reportType === 'monthly' ? 'Monthly Expense Trends' : 'Expenses by Category'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {reportType === 'monthly' ? (
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))' 
                        }}
                        formatter={(value: any) => [formatCurrency(Number(value))]}
                      />
                      <Legend />
                      <Bar dataKey="expenses" name="Total Expenses" fill="hsl(var(--primary))" />
                    </BarChart>
                  ) : (
                    <BarChart
                      data={categoryData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))' 
                        }}
                        formatter={(value: any) => [formatCurrency(Number(value))]}
                      />
                      <Legend />
                      <Bar dataKey="amount" name="Annual Amount" fill="hsl(var(--primary))" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reports;
