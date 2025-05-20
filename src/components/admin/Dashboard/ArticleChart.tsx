'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface ArticleChartProps {
  years: number[];
  data: number[];
}

export default function ArticleChart({ years, data }: ArticleChartProps) {
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 80,
      },
    },
    maintainAspectRatio: false,
  };

  const chartData = {
    labels: years,
    datasets: [
      {
        fill: true,
        label: 'Articles',
        data: data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Total Article</h2>
      <div className="h-64">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}