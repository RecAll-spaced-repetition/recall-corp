import { useTrainStatsAll } from '@/query/queryHooks';
import React from 'react';
import { LoadableComponent } from '../library';
import { useTranslation } from 'react-i18next';
import { DayStatsChart } from './StatsChart';

export const Stats: React.FC = () => {
  const { t } = useTranslation();

  const { trainStats, error, isPending } = useTrainStatsAll();

  return (
    <LoadableComponent isPending={isPending} errorMessage={error?.message}>
      <div className="w-full flex flex-col gap-2">
        {/* TODO: Добавить мотивационнх сообщений и каких-нибудь цветов */}
        <p>{t('stats.currentStreak', { streak: trainStats?.currStreak })}</p> 
        <p>{t('stats.maxStreak', { streak: trainStats?.maxStreak })}</p>
        {trainStats && (
          // TODO: Перенести в модалки, чтобы было норм на мобилках
          <>
            <DayStatsChart
              title={t('stats.chart.titleHigh')}
              dayStats={trainStats.stats}
              type="bar"
              variant="high"
            />
            <DayStatsChart
              title={t('stats.chart.titleMark')}
              dayStats={trainStats.stats}
              type="line"
              variant="mark"
            />
          </>
        )}
      </div>
    </LoadableComponent>
  );
};
