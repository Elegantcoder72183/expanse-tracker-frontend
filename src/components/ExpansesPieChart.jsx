import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE", // Blue
  "#00C49F", // Green
  "#FFBB28", // Orange
  "#FF8042", // Red
  "#A28EFF", // Purple
  "#FF6699", // Pink
  "#33CCFF", // Sky Blue
  "#FF6666", // Light Red
];

const ExpansesPieChart = ({ expenses }) => {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] =
      (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  // Converting the grouped data into array for recharts
  const chartData = Object.entries(categoryTotals).map(([category, total]) => ({
    name: category,
    value: total,
  }));
  return (
    <div className="w-full h-96">
      <h3 className="text-xl font-semibold mb-4">Expense Distribution</h3>
      {chartData.length === 0 ? (
        <p>No expenses to show.</p>
      ) : (
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ExpansesPieChart;
