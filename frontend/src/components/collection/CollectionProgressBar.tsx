import React from 'react';
import { LoadableComponent, ProgressBar } from '../library';
import clsx from 'clsx';
import { useTrainStatsCollection } from '@/query/queryHooks';

type CollectionProgressBarProps = {
  collectionId: number;
  className?: string;
};

export const CollectionProgressBar: React.FC<CollectionProgressBarProps> = ({
  collectionId,
  className,
}) => {
  const { collectionStats, isPending, error } =
    useTrainStatsCollection(collectionId);

  const progress = collectionStats?.avgAfterYearRetrievability
    ? Math.round((collectionStats.avgAfterYearRetrievability / 0.9) * 100)
    : 0;

  return (
    <LoadableComponent isPending={isPending} errorMessage={error?.message}>
      <ProgressBar
        value={progress}
        minValue={0}
        valuePostfix="%"
        maxValue={100}
        hideMaxValue
        className={clsx('', className)}
      />
    </LoadableComponent>
  );
};
