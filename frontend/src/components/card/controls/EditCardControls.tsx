import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { MultiValue } from 'react-select';
import { useTranslation } from 'react-i18next';

import { useAppStore } from '@/state';
import { useCardCollections } from '@/query/queryHooks';
import { useCardDelete, useCardUpdate } from '@/query/mutationHooks';
import { Button, LoadableComponent } from '@/components/library';
import {
  collectionResponseToOptions,
  CollectionsSelect,
  Option,
} from './CollectionsSelect';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

export const EditCardControls: React.FC = () => {
  const { t } = useTranslation();
  const cardId = useAppStore((state) => state.activeCardId);
  const cardData = useAppStore((state) => state.activeCard);
  const setUIFlag = useAppStore((state) => state.setActiveCardUIFlag);

  const { cardCollections, isPending: cardCollectionsPending } =
    useCardCollections(cardId);
  const [selectedOptions, setSelectedOptions] = useState<
    MultiValue<Option<number>>
  >([]);

  useEffect(() => {
    setSelectedOptions(collectionResponseToOptions(cardCollections));
  }, [cardCollections]);

  const {
    updateCard,
    isPending: isUpdatePending,
    error: updateError,
  } = useCardUpdate(cardId, () => {
    setUIFlag('zoomed', () => false);
  });
  const {
    deleteCard,
    isPending: isDeletePending,
    error: deleteError,
  } = useCardDelete(cardId, () => {
    setUIFlag('zoomed', () => false);
  });

  const isAnyPending =
    cardCollectionsPending || isUpdatePending || isDeletePending;

  return (
    <div
      className={clsx(
        'w-full vstack',
        'px-1 py-2',
        'bg-o-white text-o-black rounded-xl',
        'border border-black',
        'shadow-md hover:shadow-gray-500'
      )}
    >
      <LoadableComponent isPending={cardCollectionsPending}>
        <CollectionsSelect
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
      </LoadableComponent>
      {(updateError || deleteError) && (
        <div className={clsx('center mb-2', 'text-red-200 font-bold')}>
          {updateError?.message || deleteError?.message}
        </div>
      )}
      <div className="mt-2 text-sm md:text-md gap-x-1 md:gap-x-3 center">
        <div
          className={clsx(
            'transition-all duration-300',
            cardData.frontSide &&
              cardData.backSide &&
              selectedOptions.length > 0
              ? 'opacity-100'
              : 'opacity-0 invisible absolute'
          )}
        >
          <Button
            variant="plate-green"
            className="text-xl p-2"
            onClick={() => {
              updateCard({
                new_card: { ...cardData },
                collections: selectedOptions.map((option) => option.value),
              });
            }}
            withShadow
            loading={isAnyPending}
            icon="save"
            title={t('common.saveChanges')}
          />
        </div>
        <span
          className={clsx(
            'text-center',
            'transition-all duration-300',
            cardData.frontSide &&
              cardData.backSide &&
              selectedOptions.length > 0
              ? 'opacity-0 invisible absolute'
              : 'opacity-100'
          )}
        >
          {t('card.requirements')}
        </span>
        <Menu>
          <MenuButton
            as={Button}
            className="text-xl p-2"
            variant="bordered"
            title={t('card.deleteCard')}
            loading={isAnyPending}
            disabled={isAnyPending}
            icon="trash"
          />
          <MenuItems anchor={{ to: 'bottom', gap: 2 }}>
            <MenuItem>
              <Button
                variant="plate-red"
                onClick={() => deleteCard()}
                title={t('common.confirmDeletion')}
              >
                {t('common.confirmDeletion')}
              </Button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};
