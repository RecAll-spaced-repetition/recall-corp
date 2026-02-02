import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';

import {
  MarkdownEditorComponent,
  MarkdownRenderComponent,
} from '@/components/editor';

import { CardSide } from './CardSide';
import { useAppStore, backAtoms, frontAtoms } from '@/state';
import { useTranslation } from 'react-i18next';

type ActiveFlippingCardProps = HTMLAttributes<React.FC>;

export const ActiveFlippingCard: React.FC<ActiveFlippingCardProps> = ({
  className,
}) => {
  const { t } = useTranslation();

  const mode = useAppStore((state) => state.activeCardUI.mode);
  const frontSide = useAppStore((state) => state.activeCard.frontSide);
  const backSide = useAppStore((state) => state.activeCard.backSide);
  const setCardSide = useAppStore((state) => state.setActiveCardSide);
  const flipped = useAppStore((state) => state.activeCardUI.flipped);
  const setUIFlag = useAppStore((state) => state.setActiveCardUIFlag);

  return (
    <div
      className={clsx(
        'transition-all duration-500 flip-inner',
        flipped && 'animate-flip',
        className
      )}
    >
      <CardSide className="p-2 pb-8 bg-o-white rounded-xl" side="front">
        {mode === 'edit' ? (
          <MarkdownEditorComponent
            state={frontSide}
            setState={(s) => setCardSide('frontSide', s)}
            historyAtoms={frontAtoms}
            extended
            placeholder={t('card.frontSidePlaceholder')}
          />
        ) : (
          <MarkdownRenderComponent
            className={clsx(
              'p-1 font-sans',
              'overflow-y-auto overflow-x-hidden'
            )}
            rawText={frontSide}
            extended
          />
        )}
      </CardSide>
      <CardSide className="p-2 pb-8 bg-o-white rounded-xl" side="back">
        {mode === 'edit' ? (
          <MarkdownEditorComponent
            state={backSide}
            setState={(s) => setCardSide('backSide', s)}
            historyAtoms={backAtoms}
            extended
            placeholder={t('card.backSidePlaceholder')}
          />
        ) : (
          <MarkdownRenderComponent
            className={clsx(
              'px-1 font-sans',
              'overflow-y-auto overflow-x-hidden'
            )}
            rawText={backSide}
            extended
          />
        )}
      </CardSide>
      <div
        className={clsx(
          'absolute bottom-0',
          'w-full h-7 md:py-2',
          'center rounded-b-lg',
          'overflow-hidden transition-all duration-500',
          'hover:cursor-pointer hover:pl-10',
          'text-xl font-bold',
          'bg-blue-300 hover:bg-blue-300/75'
        )}
        onClick={() => setUIFlag('flipped', (f) => !f)}
      >
        {'> > >'}
      </div>
    </div>
  );
};
