import React from 'react';
import { LoadableComponent, ProgressBar } from '../library';
import clsx from 'clsx';
import { useTrainStatsCollection } from '@/query/queryHooks';
import { toLearnPercent } from '@/utils/percent';

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

  const progress = toLearnPercent(collectionStats?.avgAfterYearRetrievability);

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
