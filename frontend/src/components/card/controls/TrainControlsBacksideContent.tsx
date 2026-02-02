import React from 'react';
import { DescreteTrainButton, marks } from './DescreteTrainButton';
import clsx from 'clsx';
import { AIFeedback } from '@/api';
import { useTranslation } from 'react-i18next';

export type TrainContraolsBacksideProps = {
  aiFeedBack?: AIFeedback;
};

export const TrainContraolsBacksideContent: React.FC<
  TrainContraolsBacksideProps
> = ({ aiFeedBack }) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        'bg-o-white text-o-black rounded-xl',
        'w-full vstack',
        'border border-black',
        'px-1 py-2',
        'w-full vstack'
      )}
    >
      {aiFeedBack && (
        <div className="p-1 mb-1 font-mono text-center grid grid-cols-1 md:grid-cols-6">
          <span>
            {t('card.aiMark')}: {aiFeedBack.mark}
          </span>
          <span className="col-span-5">{aiFeedBack.comment}</span>
        </div>
      )}
      <div className="grid grid-cols-5 gap-x-2 m-1">
        {marks.map((mark) => (
          <DescreteTrainButton
            key={mark}
            mark={mark}
            recommended={mark === aiFeedBack?.mark}
          />
        ))}
      </div>
    </div>
  );
};
