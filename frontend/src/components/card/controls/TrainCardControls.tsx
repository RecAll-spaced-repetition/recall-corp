import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppStore } from '@/state';
import { TrainContraolsBacksideContent } from './TrainControlsBacksideContent';

export const TrainCardControls: React.FC = () => {
  const { t } = useTranslation();
  const [flippedCount, setFlippedCount] = useState(0);
  const flipped = useAppStore((state) => state.activeCardUI.flipped);

  // const inc = () => setFlippedCount((val) => val + 1); // Можно поставить вместо тела эффекта, тогда ворнинг пропадёт
  useEffect(() => setFlippedCount((val) => val + 1), [flipped]);
  useEffect(() => setFlippedCount(0), []);

  // TODO: Вернуть анимацию в лучшие времена
  return flippedCount >= 1 ? (
    <div className="w-full vstack">
      <TrainContraolsBacksideContent />
    </div>
  ) : (
    <div
      className={clsx(
        'transition-all duration-500 flip-inner',
        flipped && 'animate-flip'
      )}
    >
      <div
        className={clsx(
          'flip-front w-full vstack',
          'px-1 py-2',
          'bg-o-white text-o-black rounded-xl',
          'border border-black',
          'shadow-md hover:shadow-gray-500'
        )}
      >
        <span className="text-center mx-1">{t('card.flipCard')}</span>
      </div>
      <div className="flip-back w-full vstack bg-o-white">
        <TrainContraolsBacksideContent />
      </div>
    </div>
  );
};
