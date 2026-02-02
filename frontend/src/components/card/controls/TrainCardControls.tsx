import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/library';
import { useAppStore } from '@/state';
import { useAiCompare } from '@/query/mutationHooks';
import { TrainContraolsBacksideContent } from './TrainControlsBacksideContent';
import { AIFeedback } from '@/api';

export const TrainCardControls: React.FC = () => {
  const { t } = useTranslation();
  const [flippedCount, setFlippedCount] = useState(0);
  const cardId = useAppStore((state) => state.activeCardId);
  const flipped = useAppStore((state) => state.activeCardUI.flipped);
  const setUIFlag = useAppStore((state) => state.setActiveCardUIFlag);

  useEffect(() => setFlippedCount((val) => val + 1), [flipped]);
  useEffect(() => setFlippedCount(0), []);

  const [userAnswer, setUserAnswer] = useState('');
  const [aiFeedBack, setAiFeedback] = useState<AIFeedback>();
  const { compareAnswers, isPending } = useAiCompare(cardId, (feedBack) => {
    setAiFeedback(feedBack);
    setUIFlag('flipped', () => true);
  });

  // TODO: Вернуть анимацию в лучшие времена
  return flippedCount >= 1 ? (
    <div className="w-full vstack">
      <TrainContraolsBacksideContent aiFeedBack={aiFeedBack} />
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
        <div className="grid grid-cols-4 gap-2 mt-2">
          <textarea
            className={clsx(
              'p-1 mx-1 col-span-4 md:col-span-3',
              'text-center text-o-black bg-transparent resize-none',
              'focus:outline-none',
              'transition-all duration-200',
              'hover:shadow-inner hover:shadow-neutral-400',
              'focus:shadow-inner hover:shadow-neutral-400'
            )}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={t('card.typeAnswer')}
          ></textarea>
          <div className="center col-span-4 md:col-span-1">
            <Button
              variant="plate-yellow"
              className="p-2"
              onClick={() => compareAnswers(userAnswer)}
              disabled={isPending}
              withShadow
              title={t('card.checkAnswer')}
            >
              {!isPending ? t('card.checkAnswer') : t('card.checkingAnswer')}
            </Button>
          </div>
        </div>
      </div>
      <div className="flip-back w-full vstack bg-o-white">
        <TrainContraolsBacksideContent aiFeedBack={aiFeedBack} />
      </div>
    </div>
  );
};
