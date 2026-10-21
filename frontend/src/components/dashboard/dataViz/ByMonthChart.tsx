import { defaults } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { SumByMonth } from '@/types';

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.legend.display = false;
defaults.plugins.title.display = false;

type Props = {
  loading: boolean;
  dataByMonth: SumByMonth[];
};
export default function ByMonthChart({ dataByMonth, loading }: Props) {
  const dataSetByMonth = {
    labels: dataByMonth.map((item) => item.month),
    datasets: [
      {
        data: dataByMonth.map((item) => item.sumKgCO2),
        borderColor: '#31a531',
        borderRadius: 5,
        pointRadius: 6,
        hoverRadius: 10,
      },
    ],
  };
  // Light axes for the dark themed background (scoped here, not on chart.js global defaults)
  const options = {
    scales: {
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
    plugins: {
      tooltip: {
        displayColors: false,
        callbacks: {
          label(ctx: any) {
            const value = ctx.raw || 0;
            return `${value} kgCO2`;
          },
        },
      },
    },
  };
  return (
    <div className='w-full h-full pt-3'>
      {loading ? (
        'chargement...'
      ) : (
        <>
          {dataSetByMonth?.datasets.length === 0 ? (
            'Aucune données'
          ) : (
            <Line data={dataSetByMonth} options={options} />
          )}
        </>
      )}
    </div>
  );
}
