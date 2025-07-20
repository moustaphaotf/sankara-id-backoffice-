import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { useLingo } from '@lingo-dev/react';

interface DocumentChartProps {
  data: Array<{
    date: string;
    documents: number;
    approvals: number;
    rejections: number;
  }>;
}

export const DocumentChart: React.FC<DocumentChartProps> = ({ data }) => {
  const { t } = useLingo();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const chartData = data.map(item => ({
    ...item,
    date: formatDate(item.date),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.documentsChart')}</CardTitle>
      </CardHeader>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="documents"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Total"
            />
            <Line
              type="monotone"
              dataKey="approvals"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Approuvés"
            />
            <Line
              type="monotone"
              dataKey="rejections"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              name="Rejetés"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};