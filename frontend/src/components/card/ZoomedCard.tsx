import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';

import { ControlledModal } from '@/components/library';
import { ActiveFlippingCard } from './visuals';
import {
  CreateCardControls,
  EditCardControls,
  TrainCardControls,
} from './controls';
import { useAppStore, frontAtoms, backAtoms } from '@/state';
import { useTranslation } from 'react-i18next';
import { useSetAtom } from 'jotai';

type ZoomedCardProps = HTMLAttributes<React.FC>;

export const ZoomedCard: React.FC<ZoomedCardProps> = () => {
  const { t } = useTranslation();

  const zoomed = useAppStore((state) => state.activeCardUI.zoomed);
  const setCardUIFlag = useAppStore((state) => state.setActiveCardUIFlag);
  const mode = useAppStore((state) => state.activeCardUI.mode);
  const isNew = useAppStore((state) => state.isNewActiveCard);
  const isChanged = useAppStore((state) => state.isActiveCardChanged);
  const resetFront = useSetAtom(frontAtoms.resetAtom);
  const resetBack = useSetAtom(backAtoms.resetAtom);

  return (
    <ControlledModal
      isShown={zoomed}
      close={() => {
        if (mode === 'edit' && isChanged) {
          if (confirm(t('card.confirmClose'))) {
            setCardUIFlag('zoomed', () => false);
            resetFront();
            resetBack();
          }
        } else setCardUIFlag('zoomed', () => false);
      }}
      contentClassName={clsx(
        'w-11/12 p-2 md:p-4',
        mode !== 'view' ? 'h-11/12' : 'h-5/6',
        'bg-o-white/50 text-o-black rounded-xl',
        'border border-black'
      )}
    >
      <ActiveFlippingCard
        className={clsx(
          'mb-1 md:mb-2 w-full',
          mode !== 'view' ? 'h-5/6' : 'h-full',
          'bg-o-white text-o-black rounded-xl',
          'border border-gray-500',
          'shadow-md hover:shadow-gray-500'
        )}
      />
      {mode === 'edit' && isNew && <CreateCardControls />}
      {mode === 'edit' && !isNew && <EditCardControls />}
      {mode === 'train' && <TrainCardControls />}
    </ControlledModal>
  );
};
