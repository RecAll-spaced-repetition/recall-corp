import React from 'react';
import { DescreteTrainButton, marks } from './DescreteTrainButton';
import clsx from 'clsx';

export const TrainContraolsBacksideContent: React.FC = () => {
  return (
    <div
      className={clsx(
        'bg-o-white text-o-black rounded-xl',
        'w-full vstack',
        'border border-black',
        'px-1 py-2'
      )}
    >
      <div className="grid grid-cols-5 gap-x-2 m-1">
        {marks.map((mark) => (
          <DescreteTrainButton key={mark} mark={mark} />
        ))}
      </div>
    </div>
  );
};
