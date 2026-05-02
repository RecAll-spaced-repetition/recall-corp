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
import { routes } from '@/routes';
import { CollectionTrainButton } from '@/components/collection/CollectionTrainButton';
import { CollectionSubscriptionButton } from '@/components/collection/CollectionSubscriptionButton';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { CollectionProgressBar } from '@/components/collection/CollectionProgressBar';

export interface ViewPageParams {
  id: number;
}

export const CollectionViewPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<ViewPageParams>();
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

  return (
    <LoadableComponent
      isPending={isCollectionPending}
      errorMessage={collectionError?.message}
    >
      <div className="vstack">
        {collection && (
          <>
            <h1
              className={clsx(
                'm-2 md:m-4 center gap-x-2',
                'text-center font-black',
                'text-lg md:text-xl lg:text-2xl xl:text-4xl'
              )}
            >
              <CollectionSubscriptionButton collectionId={collection.id} />
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

            <div
              className={clsx(
                'w-full center gap-x-2',
                'mt-2 md:mt-4 mb-4 md:mb-8'
              )}
            >
              <CollectionTrainButton collectionId={collection.id} />
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

            {profile && (
              <div className="mt-4 mb-8 flex flex-col gap-2">
                <div className="flex justify-start items-center gap-1">
                  <p>{t('collection.progress')}</p>
                  <Menu>
                    <MenuButton as={Button} variant="inline" icon="info" />
                    <MenuItems anchor={{ to: 'bottom', gap: 2 }}>
                      <MenuItem>
                        <p className="m-1 p-2 bg-o-white border border-o-black rounded-xl">
                          {t('collection.progressInfo')}
                        </p>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
                <CollectionProgressBar collectionId={collection.id} />
              </div>
            )}
          </>
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
