import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTrainStatsAll } from '@/query/queryHooks';
import {
  ControlledModal,
  LoadableComponent,
  Button,
  ProgressBar,
} from '@/components/library';
import { DayStatsChart } from './StatsChart';
import { isEqualByDate } from '@/utils/date';

export const Stats: React.FC = () => {
  const { t } = useTranslation();

  const { trainStats, error, isPending } = useTrainStatsAll();
  // const wasTrainToday = useMemo(() => {
  //   if (!trainStats) return false;
  //   const today = new Date();
  //   const lastTrainDate = new Date(trainStats.stats[0].trainDate);
  //   return isEqualByDate(today, lastTrainDate);
  // }, [trainStats]);

  const [activeChart, setActiveChart] = useState<'high' | 'mark'>();

  return (
    <LoadableComponent isPending={isPending} errorMessage={error?.message}>
      {trainStats && (
        <div className="w-full flex flex-col gap-2">
          <p>{t('stats.streaksBar')}</p>
          {/* TODO: Сама идея серии противоречит идеи интервальности повторений */}
          <ProgressBar
            value={trainStats.currStreak}
            minValue={0}
            maxValue={trainStats.maxStreak}
          />
          {/* TODO: Добавить мотивационнх сообщений */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-2">
            <Button
              variant="plate-blue"
              withShadow
              onClick={() => setActiveChart('high')}
            >
              {t('stats.chart.titleHigh')}
            </Button>
            <Button
              variant="plate-yellow"
              withShadow
              onClick={() => setActiveChart('mark')}
            >
              {t('stats.chart.titleMark')}
            </Button>
          </div>
          <ControlledModal
            isShown={!!activeChart}
            close={() => setActiveChart(undefined)}
            contentClassName="w-11/12 h-11/12 p-2 md:p-4 no-scrollbar bg-o-white rounded-xl border-2 border-black"
          >
            {activeChart === 'high' && (
              <>
                <h1 className="text-center">{t('stats.chart.titleHigh')}</h1>
                <DayStatsChart
                  id="chart-high"
                  dayStats={trainStats.stats}
                  type="bar"
                  variant="high"
                />
              </>
            )}
            {activeChart === 'mark' && (
              <>
                <h1 className="text-center">{t('stats.chart.titleMark')}</h1>
                <DayStatsChart
                  id="chart-mark"
                  dayStats={trainStats.stats}
                  type="bar"
                  variant="mark"
                />
              </>
            )}
          </ControlledModal>
        </div>
      )}
    </LoadableComponent>
  );
};
