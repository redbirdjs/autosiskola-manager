'use client'

import { Chart as ChartJS, registerables, ChartData } from 'chart.js';
import { Pie, Bar, Radar } from 'react-chartjs-2'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'

ChartJS.register(...registerables);

export function PieChartCard({ title, data }: { title: React.ReactNode, data: ChartData<"pie", number[], unknown> }) {
  return (
    <Card className='w-[500px]'>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center'>{ title }</CardTitle>
      </CardHeader>
      <CardContent className='flex justify-center'>
        <Pie data={data} options={{
          plugins: {
            tooltip: {
              enabled: true
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          },
          responsive: true
        }} />
      </CardContent>
    </Card>
  );
}

export function BarChartCard({ title, data }: { title: React.ReactNode, data: ChartData<"bar", number[], unknown> }) {
  return (
    <Card className='w-[500px]'>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center'>{ title }</CardTitle>
      </CardHeader>
      <CardContent>
        <Bar data={data} height={300} options={{
          plugins: {
            legend: {
              display: false
            }
          }
        }} />
      </CardContent>
    </Card>
  );
}

export function RadarChartCard({ title, data }: { title: React.ReactNode, data: ChartData<"radar", number[], unknown> }) {
  return (
    <Card className='w-[500px]'>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center'>{ title }</CardTitle>
      </CardHeader>
      <CardContent>
        <Radar data={data} height={300} options={{
          plugins: {
            legend: { display: false }
          },
          scales: {
            r: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        }} />
      </CardContent>
    </Card>
  );
}