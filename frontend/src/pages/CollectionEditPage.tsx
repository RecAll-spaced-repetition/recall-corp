import React from 'react';
import { useParams } from 'wouter';
import {
  useCollection,
  useCollectionCards,
  useProfile,
  useProfileCards,
} from '@/query/queryHooks';
import { CollectionEditForm } from '@/components/collection';
import { ErrorPage } from '@/pages';
import { CardsList } from '@/components/card';
import { LoadableComponent } from '@/components/library';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export interface EditPageParams {
  id: number;
}

export const CollectionEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<EditPageParams>();
  const { profile } = useProfile();
  const {
    collection,
    error: collectionError,
    isPending: isCollectionPending,
  } = useCollection(id);
  const {
    cards: collectionCardsIds,
    error: collectionCardsError,
    isPending: collectionCardsPending,
  } = useCollectionCards(id);
  const {
    cards: profileCardsIds,
    error: profileCardsError,
    isPending: profileCardsPending,
  } = useProfileCards();

  if (!profile || collection?.ownerId !== profile?.id)
    return (
      <ErrorPage
        isPending={isCollectionPending}
        message={t('collection.notAllowedToEdit')}
      />
    );

  return (
    <LoadableComponent
      isPending={isCollectionPending}
      errorMessage={collectionError?.message}
    >
      <div className="vstack">
        <CollectionEditForm id={id} />

        <h2
          className={clsx(
            'mt-4 md:mt-8 mb-2 md:mb-4',
            'text-center font-medium',
            'text-base md:text-lg lg:text-xl xl:text-3xl'
          )}
        >
          {t('collection.pairedCards')}
        </h2>
        <LoadableComponent
          isPending={collectionCardsPending}
          errorMessage={collectionCardsError?.message}
        >
          <CardsList
            cardsIds={collectionCardsIds ?? []}
            mode="edit"
            addNewCard
          />
        </LoadableComponent>

        <h2
          className={clsx(
            'mt-4 md:mt-8 mb-2 md:mb-4',
            'text-center font-medium',
            'text-base md:text-lg lg:text-xl xl:text-3xl'
          )}
        >
          {t('collection.allCards')}
        </h2>
        <LoadableComponent
          isPending={profileCardsPending}
          errorMessage={profileCardsError?.message}
        >
          <CardsList cardsIds={profileCardsIds ?? []} mode="edit" />
        </LoadableComponent>
      </div>
    </LoadableComponent>
  );
};
