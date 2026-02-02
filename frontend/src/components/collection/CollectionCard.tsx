import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';

import { routes } from '@/routes';
import {
  LoadableComponent,
  Button,
  Icon,
  IsPublicIcon,
} from '@/components/library';
import { useCollection, useProfile } from '@/query/queryHooks';
import { useAppStore } from '@/state';
import clsx from 'clsx';

interface CollectionCardProps {
  collectionId: number;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collectionId,
}) => {
  const { t } = useTranslation();

  const { collection, isPending, error } = useCollection(collectionId);
  const { profile } = useProfile();
  const showAuthWindow = useAppStore((state) => state.showLoginWindow);

  return (
    <LoadableComponent isPending={isPending} errorMessage={error?.message}>
      <div
        className={clsx(
          'bg-o-white-max text-o-black',
          'p-6 m-2 rounded-lg',
          'ring-1 ring-o-black'
        )}
      >
        {collection && (
          <>
            <div>
              <h2
                className={clsx(
                  'mb-2 gap-x-2',
                  'flex items-center justify-start',
                  'text-lg font-bold'
                )}
              >
                <span>{collection.title}</span>
                <IsPublicIcon
                  objectType="collection"
                  isPublic={collection.isPublic}
                />
              </h2>
              <p className="text-md mb-2">{collection.description}</p>
            </div>

            <div className="flex gap-x-2 mt-4">
              <Link to={routes.collectionView.getUrl(collectionId)}>
                <Button
                  variant="plate-blue"
                  className="p-2 md:p-3"
                  withShadow
                  title={t('common.view')}
                >
                  <Icon icon="eye" />
                </Button>
              </Link>
              {collection.ownerId === profile?.id && (
                <Link to={routes.collectionEdit.getUrl(collectionId)}>
                  <Button
                    variant="plate-yellow"
                    className="p-2 md:p-3"
                    withShadow
                    title={t('common.edit')}
                  >
                    <Icon icon="editor" />
                  </Button>
                </Link>
              )}
              {profile ? (
                <Link to={routes.train.getUrl(collectionId)}>
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
            </div>
          </>
        )}
      </div>
    </LoadableComponent>
  );
};
