import React, { useMemo, type HTMLAttributes } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { DayStat } from '@/api';
import { useTranslation } from 'react-i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function getOptions(title?: string): ChartOptions {
  return {
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
  };
}

type DayStatsDataset = {
  dates: string[];
  cnt: number[];
  avgMark: number[];
  totalDuration: number[];
};

type DayStatsChartProps = HTMLAttributes<HTMLCanvasElement> & {
  dayStats: DayStat[];
  title: string;
  type: 'bar' | 'line';
  variant: 'mark' | 'high';
};

export const DayStatsChart: React.FC<DayStatsChartProps> = ({
  dayStats,
  title,
  type,
  variant,
  ...props
}) => {
  const { t } = useTranslation();

  const options = useMemo(() => getOptions(title), [title]);

  const dataset = useMemo<DayStatsDataset>(() => {
    const res: DayStatsDataset = {
      dates: [],
      cnt: [],
      avgMark: [],
      totalDuration: [],
    };
    dayStats.reverse().forEach((stat) => {
      res.dates.push(stat.trainDate);
      res.cnt.push(stat.cnt);
      res.avgMark.push(stat.avgMark);
      res.totalDuration.push(Math.round(stat.totalDuration / 1000));
    });
    return res;
  }, [dayStats]);

  const data: ChartData<typeof type> = {
    labels: dataset.dates,
    datasets:
      variant === 'high'
        ? [
            {
              label: t('stats.chart.cnt'),
              data: dataset.cnt,
              borderColor: '#7bf1a8ff',
              backgroundColor: '#7bf1a8aa',
            },
            {
              label: t('stats.chart.totalDuration'),
              data: dataset.totalDuration,
              borderColor: '#8ec5ffff',
              backgroundColor: '#8ec5ffaa',
            },
          ]
        : [
            {
              label: t('stats.chart.avgMark'),
              data: dataset.avgMark,
              borderColor: '#fff085ff',
              backgroundColor: '#fff085aa',
            },
          ],
  };

  return (
    <Chart type={type} title={title} data={data} options={options} {...props} />
  );
};
