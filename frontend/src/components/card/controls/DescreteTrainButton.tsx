import React from 'react';

import { Button, Variants } from '@/components/library';
import { useAppStore } from '@/state';
import { useTrainCard } from '@/query/mutationHooks';

export enum Mark {
  One = 1,
  Two,
  Three,
  Four,
}
export const marks: Mark[] = Object.values(Mark).filter(
  (value) => typeof value === 'number'
) as Mark[];
const MarksBtnVariants: Record<Mark, Variants> = {
  '1': 'plate-red',
  '2': 'plate-orange',
  '3': 'plate-lime',
  '4': 'plate-green',
};

export interface DescreteTrainButtonProps {
  mark: Mark;
}

export const DescreteTrainButton: React.FC<DescreteTrainButtonProps> = ({
  mark,
}) => {
  const cardId = useAppStore((state) => state.activeCardId);
  const cardOpenedTimestamp = useAppStore((state) => state.cardOpenedTimestamp);
  const executeTrainCard = useAppStore((state) => state.executeTrainCard);

  const setUIFlag = useAppStore((state) => state.setActiveCardUIFlag);

  const { trainCard } = useTrainCard(cardId, () => {
    executeTrainCard(cardId);
    setUIFlag('zoomed', () => false);
  });

  return (
    <Button
      className="px-2"
      variant={MarksBtnVariants[mark]}
      onClick={() => {
        const dur = Number(Date.now()) - cardOpenedTimestamp;
        console.log(dur);
        trainCard({
          mark,
          durationMs: Number(Date.now()) - cardOpenedTimestamp,
        });
      }}
      withShadow
      title={mark.toString()}
    >
      {mark}
    </Button>
  );
};
