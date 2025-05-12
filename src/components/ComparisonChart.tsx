import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ComparisonChartProps {
  title: string;
  data: Array<{
    name: string;
    [key: string]: any;
  }>;
  keys: string[];
  colors: string[];
  labels: string[];
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  title,
  data,
  keys,
  colors,
  labels
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((key, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                fill={colors[index]}
                name={labels[index]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  );
};