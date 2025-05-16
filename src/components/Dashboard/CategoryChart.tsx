'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Category } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CategoryChartProps {
  categories: Category[];
}

export default function CategoryChart({ categories }: CategoryChartProps) {
  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 60,
      },
    },
    maintainAspectRatio: false,
  };

  const data = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Current',
        data: categories.map(cat => cat.current),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
      {
        label: 'Previous',
        data: categories.map(cat => cat.previous),
        backgroundColor: 'rgba(173, 216, 230, 0.8)',
      },
    ],
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Categorie</h2>
      <div className="h-64">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}
