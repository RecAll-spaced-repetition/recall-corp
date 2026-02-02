import React from 'react';
import { Link, useParams } from 'wouter';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import {
  useCollection,
  useCollectionCards,
  useProfile,
} from '@/query/queryHooks';
import { CardsList } from '@/components/card';
import { Button, LoadableComponent, IsPublicIcon } from '@/components/library';
import { useAppStore } from '@/state';
import { routes } from '@/routes';

export interface ViewPageParams {
  id: number;
}

export const CollectionViewPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<ViewPageParams>();
  const { profile } = useProfile();
  const showAuthWindow = useAppStore((state) => state.showLoginWindow);
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

  return (
    <LoadableComponent
      isPending={isCollectionPending}
      errorMessage={collectionError?.message}
    >
      <div className="vstack">
        <h1
          className={clsx(
            'm-2 md:m-4 center gap-x-2',
            'text-center font-black',
            'text-lg md:text-xl lg:text-2xl xl:text-4xl'
          )}
        >
          <span>{collection?.title}</span>
          <IsPublicIcon
            objectType="collection"
            isPublic={collection?.isPublic}
          />
        </h1>
        {collection?.description && (
          <p
            className={clsx(
              'mt-2 md:mt-4 mb-4 md:mb-8',
              'text-center text-o-black font-medium',
              'text-base md:text-lg lg:text-xl xl:text-3xl'
            )}
          >
            {collection.description}
          </p>
        )}

        {collection && (
          <div
            className={clsx(
              'w-full center gap-x-2',
              'mt-2 md:mt-4 mb-4 md:mb-8'
            )}
          >
            {profile ? (
              <Link to={routes.train.getUrl(collection.id)}>
                <Button
                  variant="plate-green"
                  className="py-1 px-4"
                  withShadow
                  title={t('collection.trainButton')}
                >
                  {t('collection.trainButton')}
                </Button>
              </Link>
            ) : (
              <Button
                variant="plate-green"
                className="py-1 px-4"
                onClick={showAuthWindow}
                withShadow
                title={t('collection.trainButton')}
              >
                {t('collection.trainButton')}
              </Button>
            )}
            {collection?.ownerId === profile?.id && (
              <Link to={routes.collectionEdit.getUrl(collection.id)}>
                <Button
                  variant="plate-yellow"
                  className="py-1 px-4"
                  withShadow
                  title={t('common.edit')}
                >
                  {t('common.edit')}
                </Button>
              </Link>
            )}
          </div>
        )}

        <LoadableComponent
          isPending={collectionCardsPending}
          errorMessage={collectionCardsError?.message}
        >
          <CardsList cardsIds={collectionCardsIds ?? []} mode="view" />
        </LoadableComponent>
      </div>
    </LoadableComponent>
  );
};
