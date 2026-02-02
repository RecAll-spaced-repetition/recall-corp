import React from 'react';

import { Button, Variants } from '@/components/library';
import { useAppStore } from '@/state';
import clsx from 'clsx';
import { useCardTrain } from '@/query/mutationHooks';

export enum Mark {
  One = 1,
  Two,
  Three,
  Four,
  Five,
}
export const marks: Mark[] = Object.values(Mark).filter(
  (value) => typeof value === 'number'
) as Mark[];
const MarksBtnVariants: Record<Mark, Variants> = {
  '1': 'plate-red',
  '2': 'plate-orange',
  '3': 'plate-yellow',
  '4': 'plate-lime',
  '5': 'plate-green',
};

export interface DescreteTrainButtonProps {
  mark: Mark;
  recommended?: boolean;
}

export const DescreteTrainButton: React.FC<DescreteTrainButtonProps> = ({
  mark,
  recommended,
}) => {
  const cardId = useAppStore((state) => state.activeCardId);
  const executeTrainCard = useAppStore((state) => state.executeTrainCard);

  const setUIFlag = useAppStore((state) => state.setActiveCardUIFlag);

  const { trainCard } = useCardTrain(cardId, () => {
    executeTrainCard(cardId);
    setUIFlag('zoomed', () => false);
  });

  return (
    <Button
      className={clsx('px-2', recommended && 'border-4 border-o-black')}
      variant={MarksBtnVariants[mark]}
      onClick={() => trainCard(mark)}
      withShadow
      title={mark.toString()}
    >
      {mark}
    </Button>
  );
};
