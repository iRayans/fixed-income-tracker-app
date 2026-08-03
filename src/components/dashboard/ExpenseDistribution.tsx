
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ExpenseCategory {
    name: string;
    value: number;
    color: string;
}

interface ExpenseDistributionProps {
    data: ExpenseCategory[];
    isLoading?: boolean;
}

const COLORS = [
    "#8b5cf6", // Purple
    "#3b82f6", // Blue
    "#f59e0b", // Amber
    "#10b981", // Emerald
    "#ef4444", // Red
    "#ec4899", // Pink
    "#6b7280", // Gray
];

export function ExpenseDistribution({ data, isLoading }: ExpenseDistributionProps) {
    const total = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);

    if (isLoading) {
        return (
            <Card className="bg-gradient-to-br from-card to-card/70 border-purple-900/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-muted-foreground">
                        Expense Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                        <div className="animate-pulse bg-muted h-64 w-64 rounded-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-gradient-to-br from-card to-card/70 border-purple-900/20">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-muted-foreground">
                    Expense Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    {data.length === 0 || total <= 0 ? (
                        <div className="h-full flex flex-col items-center justify-center gap-1 text-center">
                            <p className="text-muted-foreground">No expenses recorded for this month</p>
                            <p className="text-sm text-muted-foreground/70">
                                Add an expense to see the distribution here
                            </p>
                        </div>
                    ) : (
                        <div className="relative h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="45%"
                                        labelLine={false}
                                        innerRadius={65}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                        nameKey="name"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number, name: string) => [
                                            `${formatCurrency(Number(value))} (${((Number(value) / total) * 100).toFixed(1)}%)`,
                                            name,
                                        ]}
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderColor: 'hsl(var(--border))'
                                        }}
                                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Legend
                                        wrapperStyle={{ paddingTop: 8 }}
                                        iconSize={8}
                                        formatter={(value) => (
                                            <span className="text-xs text-foreground">{value}</span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="pointer-events-none absolute inset-x-0 top-[45%] -translate-y-1/2 flex flex-col items-center">
                                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Total Expenses
                                </span>
                                <span className="text-lg font-semibold text-foreground">
                                    {formatCurrency(total)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
