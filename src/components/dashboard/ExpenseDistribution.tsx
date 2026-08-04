
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ExpenseCategory {
    name: string;
    value: number;
    color: string;
    breakdown?: { name: string; value: number }[];
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
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
    const active = activeIndex !== null ? data[activeIndex] : null;

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
                                        content={({ active, payload }) => {
                                            if (!active || !payload || payload.length === 0) return null;
                                            const item = payload[0].payload as ExpenseCategory;
                                            const value = Number(item.value) || 0;
                                            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                                            return (
                                                <div className="rounded-md border border-border bg-card px-3 py-2 shadow-md">
                                                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatCurrency(value)} ({pct}%)
                                                    </p>
                                                    {item.breakdown && item.breakdown.length > 0 && (
                                                        <ul className="mt-2 space-y-0.5 border-t border-border pt-2">
                                                            {item.breakdown.map((entry) => (
                                                                <li key={entry.name} className="flex gap-4 justify-between text-xs text-muted-foreground">
                                                                    <span>{entry.name}</span>
                                                                    <span>{formatCurrency(entry.value)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            );
                                        }}
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
                                    {Math.trunc(total).toLocaleString('ar-SA')} ر.س
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
